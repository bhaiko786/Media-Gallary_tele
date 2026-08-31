export interface GoogleImportItem {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink?: string;
  thumbnailLink?: string;
}

export class GoogleImportService {
  constructor(private accessToken?: string) {}

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async listDriveFiles(
    folderId?: string
  ): Promise<GoogleImportItem[]> {
    if (!this.accessToken) {
      return this.mockDriveFiles();
    }
    try {
      const url = new URL("https://www.googleapis.com/drive/v3/files");
      url.searchParams.set("q", `mimeType!='application/vnd.google-apps.folder'`);
      url.searchParams.set("fields", "files(id,name,mimeType,size,webViewLink,thumbnailLink)");
      if (folderId) url.searchParams.set("q", `('${folderId}' in parents)`);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      });
      interface DriveFile {
        id: string;
        name: string;
        mimeType: string;
        size?: string | number;
        webViewLink?: string;
        thumbnailLink?: string;
      }
      const data: { files?: DriveFile[] } = await res.json();
      return (data.files || []).map((f) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        size: f.size ? parseInt(String(f.size), 10) : 0,
        webViewLink: f.webViewLink,
        thumbnailLink: f.thumbnailLink,
      }));
    } catch (e) {
      console.error("Google Drive import error:", e);
      return this.mockDriveFiles();
    }
  }

  async listPhotos(): Promise<GoogleImportItem[]> {
    if (!this.accessToken) {
      return this.mockPhotos();
    }
    try {
      const url = new URL("https://www.googleapis.com/photoslibrary/v1/mediaItems");
      url.searchParams.set("pageSize", "25");
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const data: { mediaItems?: Array<{ id: string; filename?: string; baseUrl?: string }> } = await res.json();
      return (data.mediaItems || []).map((m) => ({
        id: m.id,
        name: m.filename || `Photo ${m.id}`,
        mimeType: "image/jpeg",
        size: 0,
        webViewLink: m.baseUrl,
        thumbnailLink: m.baseUrl,
      }));
    } catch (e) {
      console.error("Google Photos import error:", e);
      return this.mockPhotos();
    }
  }

  private mockDriveFiles(): GoogleImportItem[] {
    return [
      { id: "drive_1", name: "presentation.pdf", mimeType: "application/pdf", size: 2048000, webViewLink: "#" },
      { id: "drive_2", name: "video_clip.mp4", mimeType: "video/mp4", size: 15400000, webViewLink: "#" },
      { id: "drive_3", name: "archive.zip", mimeType: "application/zip", size: 10240000, webViewLink: "#" },
      { id: "drive_4", name: "spreadsheet.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 512000, webViewLink: "#" },
    ];
  }

  private mockPhotos(): GoogleImportItem[] {
    return [
      { id: "photo_1", name: "vacation.jpg", mimeType: "image/jpeg", size: 3200000, webViewLink: "#", thumbnailLink: "#" },
      { id: "photo_2", name: "portrait.png", mimeType: "image/png", size: 8540000, webViewLink: "#", thumbnailLink: "#" },
      { id: "photo_3", name: "sunset.jpg", mimeType: "image/jpeg", size: 4100000, webViewLink: "#", thumbnailLink: "#" },
    ];
  }
}
