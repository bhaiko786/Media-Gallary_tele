"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TelegramStorage } from "@/lib/telegram";
import { CompressionEngine } from "@/lib/compression";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ViewPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [enhanced, setEnhanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState<any>(null);

  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      router.push("/dashboard");
      return;
    }
    // Mock file info
    setFileInfo({
      id,
      name: id === "1" ? "demo_video.mp4" : id === "2" ? "photo_1.jpg" : "document.pdf",
      type: id === "1" ? "video" : id === "2" ? "photo" : "file",
      originalSize: id === "1" ? 15400000 : id === "2" ? 3200000 : 2048000,
      compressedSize: id === "1" ? 9240000 : id === "2" ? 960000 : 1433600,
    });
    setLoading(false);
  }, [params, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Not Authenticated</h2>
          <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading || !fileInfo) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">Loading...</div>;
  }

  const ratio = Math.round((1 - fileInfo.compressedSize / fileInfo.originalSize) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <header className="max-w-5xl mx-auto mb-6 flex items-center gap-4">
        <Button variant="outline" className="border-slate-600 hover:bg-slate-800 rounded-full text-xs" onClick={() => router.back()}>
          Back
        </Button>
        <h1 className="text-xl font-extrabold tracking-tight truncate">{fileInfo.name}</h1>
        <Badge className="capitalize bg-blue-900/40 text-blue-300 border-blue-700/30">{fileInfo.type}</Badge>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viewer */}
        <section className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="relative p-6 sm:p-10 flex items-center justify-center bg-gradient-to-b from-slate-950/80 to-slate-950 min-h-[320px] sm:min-h-[420px]">
            {fileInfo.type === "photo" ? (
              <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={enhanced ? `https://picsum.photos/seed/${fileInfo.id}/1200/675` : `https://picsum.photos/seed/${fileInfo.id}/640/360`}
                  alt={fileInfo.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${enhanced ? "scale-105 filter brightness-110 contrast-110" : ""}`}
                />
                {enhanced && (
                  <div className="absolute top-3 left-3 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-sm">
                    ENHANCED QUALITY
                  </div>
                )}
              </div>
            ) : fileInfo.type === "video" ? (
              <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                <video
                  src={enhanced ? `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4` : `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`}
                  controls
                  className="w-full h-full object-cover"
                  poster={enhanced ? `https://picsum.photos/seed/${fileInfo.id + "h"}/1200/675` : `https://picsum.photos/seed/${fileInfo.id}/640/360`}
                />
                {enhanced && (
                  <div className="absolute top-3 left-3 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-sm">
                    ENHANCED QUALITY
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-900/30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3 className="text-white font-bold">File Preview</h3>
                <p className="text-slate-400 text-sm">{fileInfo.name}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 flex items-center gap-4">
            <Button
              onClick={() => setEnhanced(!enhanced)}
              className={`rounded-full px-6 font-semibold transition-all duration-300 shadow-lg ${
                enhanced
                  ? "bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-amber-900/40 hover:shadow-amber-900/60"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-900/30 hover:shadow-blue-900/50"
              }`}
            >
              {enhanced ? "Restore Original" : "Enhance Quality"}
            </Button>
            <p className="text-xs text-slate-500">Note: Enhanced mode serves original/high-quality source when available.</p>
          </div>
        </section>

        {/* Info Sidebar */}
        <section className="space-y-4">
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-white">File Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/40">
                  <div className="text-slate-500 mb-1">Original</div>
                  <div className="text-white font-semibold">{(fileInfo.originalSize / (1024 * 1024)).toFixed(1)} MB</div>
                </div>
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/40">
                  <div className="text-slate-500 mb-1">Compressed</div>
                  <div className="text-emerald-400 font-semibold">{(fileInfo.compressedSize / (1024 * 1024)).toFixed(1)} MB</div>
                </div>
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/40 col-span-2">
                  <div className="text-slate-500 mb-1">Compression Ratio</div>
                  <div className="text-blue-400 font-bold text-lg">{ratio}% saved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-white">Storage</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Backend</span><span className="text-blue-300">Telegram Bot API</span></div>
                <div className="flex justify-between"><span>File ID</span><span className="text-slate-400 font-mono text-xs">{fileInfo.id}</span></div>
                <div className="flex justify-between"><span>Compression</span><span className="text-emerald-300">Active</span></div>
                <div className="flex justify-between"><span>Restoration</span><span className={enhanced ? "text-amber-300" : "text-slate-500"}>{enhanced ? "Enabled" : "Disabled"}</span></div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
