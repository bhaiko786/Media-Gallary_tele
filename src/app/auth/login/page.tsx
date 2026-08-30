"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleGoogleLogin = () => {
    // Mock Google OAuth flow
    login(
      {
        name: "Demo User",
        email: email || "user@example.com",
        picture: "https://ui-avatars.com/api/?name=Demo+User",
      },
      `google_token_${Date.now()}`
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <Card className="w-full max-w-md bg-slate-900/60 border-slate-700 backdrop-blur-xl shadow-2xl shadow-black/40">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            MediaVault
          </CardTitle>
          <p className="text-sm text-slate-400">
            Telegram-backed media manager with smart compression
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter email to simulate Google Login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-slate-800/60 border-slate-600 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-900/30 text-white rounded-xl transition-all duration-300 hover:shadow-blue-900/60"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c0-.8-.03-2.18.2-3.12.22-.85 1.45-1.7 2.4-2.33a.05.05 0 0 1 .02-.01C12.6 10.6 15.2 8.4 15.2 5.6c0-2.18-1.56-3.88-3.5-3.88-.84 0-1.48.36-1.89.8a10.9 10.9 0 0 0-.42-1.72 10.1 10.1 0 0 0-3.09-4.88 10.08 10.08 0 0 0-7.07-2.6c-5.55 0-10 4.45-10 10s4.45 10 10 10 10-4.45 10-10c0-.88-.15-1.72-.4-2.52A10.1 10.1 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
            </svg>
            Continue with Google
          </Button>

          <div className="text-xs text-center text-slate-500">
            <p>Requires <code className="text-slate-400 bg-slate-800 px-1 rounded">TELEGRAM_BOT_TOKEN</code> and <code className="text-slate-400 bg-slate-800 px-1 rounded">TELEGRAM_CHAT_ID</code> for real storage.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
