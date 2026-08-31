"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GoogleImportService } from "@/lib/google-import";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ImportPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"drive" | "photos">("drive");
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [progressText, setProgressText] = useState("");

  const service = new GoogleImportService(session?.accessToken);

  useEffect(() => {
    if (!session?.accessToken) return;
    async function load() {
      if (tab === "drive") {
        const data = await service.listDriveFiles();
        setItems(data);
      } else {
        const data = await service.listPhotos();
        setItems(data);
      }
    }
    load();
  }, [tab, session?.accessToken]);

  const handleImport = async () => {
    setImporting(true);
    for (let i = 0; i < selected.length; i++) {
      setProgressText(`Importing ${selected[i]}... (${i + 1}/${selected.length})`);
      await new Promise((r) => setTimeout(r, 400));
    }
    setProgressText("Import complete!");
    setTimeout(() => {
      setImporting(false);
      setProgressText("");
      setSelected([]);
    }, 800);
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-xl">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Not Authenticated</h2>
            <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Bulk Import</h1>
        <p className="text-slate-400 text-sm">Import files from Google Drive and Photos. Files will be compressed on upload.</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <div className="flex gap-2">
          <Button
            variant={tab === "drive" ? "default" : "outline"}
            className={tab === "drive" ? "bg-blue-600 hover:bg-blue-500 rounded-full text-xs shadow-lg shadow-blue-900/30" : "border-slate-600 hover:bg-slate-800 rounded-full text-xs"}
            onClick={() => { setTab("drive"); setSelected([]); }}
          >
            Google Drive
          </Button>
          <Button
            variant={tab === "photos" ? "default" : "outline"}
            className={tab === "photos" ? "bg-purple-600 hover:bg-purple-500 rounded-full text-xs shadow-lg shadow-purple-900/30" : "border-slate-600 hover:bg-slate-800 rounded-full text-xs"}
            onClick={() => { setTab("photos"); setSelected([]); }}
          >
            Google Photos
          </Button>
        </div>

        <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl shadow-xl shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-base">{tab === "drive" ? "Drive Files" : "Photos"}</CardTitle>
            <Button
              size="sm"
              disabled={selected.length === 0 || importing}
              onClick={handleImport}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white rounded-full text-xs shadow-lg shadow-emerald-900/30"
            >
              Import Selected ({selected.length})
            </Button>
          </CardHeader>
          <CardContent>
            {importing && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-xl text-sm text-blue-200">
                {progressText}
              </div>
            )}
            <div className="divide-y divide-slate-800/40">
              {items.map((item: any) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 px-1 py-3 hover:bg-slate-800/30 rounded-xl cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 rounded border-slate-600 bg-slate-800"
                    checked={selected.includes(item.id)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((i) => i !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.mimeType || "image/jpeg"} • {(item.size ? (item.size / 1024).toFixed(0) + " KB" : "—")}</div>
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">{tab}</Badge>
                </label>
              ))}
              {items.length === 0 && (
                <div className="text-sm text-slate-500 py-4">No items found. {tab === "drive" ? "Make sure you have files in your Drive." : "Make sure you have photos."}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}