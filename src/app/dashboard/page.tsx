"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [files] = useState([
    { id: "1", name: "demo_video.mp4", type: "video", size: 15400000, compressedSize: 9240000, createdAt: "2025-08-30T10:00:00Z" },
    { id: "2", name: "photo_1.jpg", type: "photo", size: 3200000, compressedSize: 960000, createdAt: "2025-08-30T09:30:00Z" },
    { id: "3", name: "document.pdf", type: "file", size: 2048000, compressedSize: 1433600, createdAt: "2025-08-29T16:00:00Z" },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-xl">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Not Authenticated</h2>
            <Link href="/auth/login">
              <Button>Sign In with Google</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/50 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">MediaVault</h1>
              <p className="text-[10px] text-slate-400">Telegram-backed manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/upload">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 rounded-full text-xs shadow-lg shadow-blue-900/30">Upload</Button>
            </Link>
            <Link href="/import">
              <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-800 rounded-full text-xs">Import</Button>
            </Link>
            <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-800 rounded-full text-xs" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-blue-800/30 p-6 sm:p-8 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Welcome back, {user?.name || "User"}</h2>
          <p className="text-slate-400 max-w-lg">Your files are stored via the Telegram Bot API, compressed on upload, and can be restored to original quality when viewed.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-3xl font-extrabold text-white">{files.length}</div>
              <div className="text-xs text-slate-400 mt-1">Files managed</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-3xl font-extrabold text-emerald-400">48 MB</div>
              <div className="text-xs text-slate-400 mt-1">Compressed (saved 35%)</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-3xl font-extrabold text-amber-400">3</div>
              <div className="text-xs text-slate-400 mt-1">Categories</div>
            </CardContent>
          </Card>
        </section>

        {/* Files Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold tracking-tight">Your Media</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-slate-600 text-slate-300 text-[10px]">Videos</Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 text-[10px]">Photos</Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300 text-[10px]">Files</Badge>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/40 backdrop-blur-sm shadow-xl shadow-black/20">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-right px-4 py-3">Original</th>
                  <th className="text-right px-4 py-3">Compressed</th>
                  <th className="text-right px-4 py-3">Ratio</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {files.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-white">{f.name}</td>
                    <td className="px-4 py-4">
                      <Badge className={`text-[10px] ${
                        f.type === "video" ? "bg-blue-900/40 text-blue-300 border-blue-700/30" :
                        f.type === "photo" ? "bg-purple-900/40 text-purple-300 border-purple-700/30" :
                        "bg-slate-800 text-slate-300 border-slate-600"
                      }`}>
                        {f.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right text-slate-300">{(f.size / (1024 * 1024)).toFixed(1)} MB</td>
                    <td className="px-4 py-4 text-right text-slate-400">{f.compressedSize ? (f.compressedSize / (1024 * 1024)).toFixed(1) + " MB" : "—"}</td>
                    <td className="px-4 py-4 text-right text-emerald-400 font-semibold">
                      {f.compressedSize ? `${Math.round((1 - f.compressedSize / f.size) * 100)}%` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/view?id=${f.id}`}>
                        <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-800 text-xs rounded-full">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
