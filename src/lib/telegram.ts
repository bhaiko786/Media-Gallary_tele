export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface MediaFile {
  id: string;
  name: string;
  type: "video" | "photo" | "file";
  size: number;
  compressedSize?: number;
  telegramFileId?: string;
  telegramMessageId?: number;
  url?: string;
  createdAt: Date;
  originalQuality?: number;
  compressedQuality?: number;
}

export class TelegramStorage {
  private token: string;
  private chatId: string;
  private baseUrl: string;

  constructor(config?: Partial<TelegramConfig>) {
    this.token = config?.botToken || process.env.TELEGRAM_BOT_TOKEN || "";
    this.chatId = config?.chatId || process.env.TELEGRAM_CHAT_ID || "";
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }

  get isConfigured(): boolean {
    return !!this.token && !!this.chatId;
  }

  async uploadFile(
    file: Buffer | Blob,
    filename: string,
    caption?: string
  ): Promise<{ fileId?: string; messageId?: number; url?: string }> {
    if (!this.isConfigured) {
      // Mock response for demo when credentials missing
      return {
        fileId: `file_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        messageId: Math.floor(Math.random() * 100000),
        url: URL.createObjectURL(file as Blob),
      };
    }

    try {
      const form = new FormData();
      const blob = file instanceof Blob ? file : new Blob([file]);
      form.append("document", blob, filename);
      form.append("chat_id", this.chatId);
      if (caption) form.append("caption", caption);

      const res = await fetch(`${this.baseUrl}/sendDocument`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.ok) {
        return {
          fileId: data.result.document?.file_id,
          messageId: data.result.message_id,
          url: undefined,
        };
      }
      throw new Error(data.description || "Telegram upload failed");
    } catch (e) {
      console.error("Telegram upload error:", e);
      throw e;
    }
  }

  async uploadPhoto(
    photo: Buffer | Blob,
    caption?: string
  ): Promise<{ fileId?: string; messageId?: number }> {
    if (!this.isConfigured) {
      return {
        fileId: `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        messageId: Math.floor(Math.random() * 100000),
      };
    }
    try {
      const form = new FormData();
      const blob = photo instanceof Blob ? photo : new Blob([photo]);
      form.append("photo", blob);
      form.append("chat_id", this.chatId);
      if (caption) form.append("caption", caption);
      const res = await fetch(`${this.baseUrl}/sendPhoto`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.ok) {
        return {
          fileId: data.result.photo?.[data.result.photo.length - 1]?.file_id,
          messageId: data.result.message_id,
        };
      }
      throw new Error(data.description || "Telegram upload failed");
    } catch (e) {
      console.error("Telegram photo upload error:", e);
      throw e;
    }
  }

  async getFileUrl(fileId: string): Promise<string | undefined> {
    if (!this.isConfigured) return undefined;
    try {
      const res = await fetch(
        `${this.baseUrl}/getFile?file_id=${fileId}`
      );
      const data = await res.json();
      if (data.ok) {
        return `https://api.telegram.org/file/bot${this.token}/${data.result.file_path}`;
      }
    } catch (e) {
      console.error("Telegram getFile error:", e);
    }
    return undefined;
  }
}
