import { useState, useCallback } from "react";

interface AuthState {
  user: { name: string; email: string; picture?: string } | null;
  token: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const login = useCallback((user: AuthState["user"], token?: string) => {
    setState({
      user,
      token: token || `mock_token_${Date.now()}`,
      isAuthenticated: true,
    });
    document.cookie = `media_auth_token=${token || `mock_token_${Date.now()}`}; path=/; max-age=86400; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null, isAuthenticated: false });
    document.cookie = "media_auth_token=; path=/; max-age=0; SameSite=Lax";
  }, []);

  return { ...state, login, logout };
}
