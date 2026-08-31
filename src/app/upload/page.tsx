"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TelegramStorage } from "@/lib/telegram";
import { CompressionEngine } from "@/lib/compression";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadResult {
  originalName?: string;
  originalSize?: number;
  compressedSize?: number;
  ratio?: number;
  telegramFileId?: string;
  telegramMessageId?: number;
  type?: "video" | "photo" | "file";
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !session) return;
    const file = files[0];
    setUploading(true);
    setProgress(10);

    try {
      const telegram = new TelegramStorage();
      const compression = new CompressionEngine();

      setProgress(30);
      const type = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("image/")
        ? "photo"
        : "file";
      const { compressedBlob, meta } = await compression.compress(file, type, 70);

      setProgress(60);
      const uploadResult = await telegram.uploadFile(compressedBlob, file.name);

      setProgress(100);
      setResult({
        originalName: file.name,
        originalSize: meta.originalSize,
        compressedSize: meta.compressedSize,
        ratio: Math.round((1 - meta.compressionRatio) * 100),
        telegramFileId: uploadResult.fileId,
        telegramMessageId: uploadResult.messageId,
        type,
      });
    } catch (e) {
      console.error("Upload failed:", e);
      const message = e instanceof Error ? e.message : "Upload failed";
      setResult({ error: message });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [session]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-6">
        <Card className="w-full max-w-md bg-slate-900/60 border-slate-700 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Not Authenticated</h2>
            <Button onClick={() => router.push("/auth/login")}>Sign In with Google</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Upload</h1>
        <p className="text-slate-400 text-sm">Files are compressed automatically. Original quality is preserved for restoration.</p>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
          <CardContent className="p-0">
            <div
              className={`relative p-10 sm:p-14 text-center transition-colors duration-300 ${
                dragActive ? "bg-blue-900/20" : ""
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 transition-all duration-300 ${dragActive ? "border-blue-400 scale-[1.01] shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]" : "border-slate-600 hover:border-blue-500"}`}>
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-900/30">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Drag and drop files here</h3>
                <p className="text-slate-400 text-sm mb-6">Or click to browse — videos, photos, or any file type</p>
                <Button
                  onClick={() => inputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-full px-6 shadow-lg shadow-blue-900/30 text-white font-semibold"
                >
                  Select File
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {uploading && (
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">Uploading & compressing...</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-800" />
            </CardContent>
          </Card>
        )}

        {result && !uploading && (
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg text-white">Upload Complete</CardTitle>
                <Badge className="bg-emerald-900/40 text-emerald-300 border-emerald-700/30">Success</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.error ? (
                <p className="text-red-400">{result.error}</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="text-xs text-slate-500 mb-1">File Name</div>
                    <div className="text-white font-medium truncate">{result.originalName}</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="text-xs text-slate-500 mb-1">Type</div>
                    <div className="text-white font-medium capitalize">{result.type}</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="text-xs text-slate-500 mb-1">Original Size</div>
                    <div className="text-white font-medium">{((result.originalSize ?? 0) / (1024 * 1024)).toFixed(1)} MB</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="text-xs text-slate-500 mb-1">Compressed Size</div>
                    <div className="text-emerald-400 font-medium">{((result.compressedSize ?? 0) / (1024 * 1024)).toFixed(1)} MB</div>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60 col-span-2">
                    <div className="text-xs text-slate-500 mb-1">Storage Backend</div>
                    <div className="text-white font-medium">Telegram Bot API</div>
                    <div className="text-[10px] text-slate-500 mt-1">File ID: {result.telegramFileId}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}