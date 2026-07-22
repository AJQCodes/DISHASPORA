import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { login as apiLogin } from "./api/admin";
import { clearSession, getStoredUser, getToken, setSession } from "./api/client";
import type { User } from "./api/types";

interface AuthCtx {
  user: User | null;
  /** Logs in; throws Error("NOT_ADMIN") if the account is not an ADMIN. */
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getToken() ? getStoredUser<User>() : null,
  );

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res.user.role !== "ADMIN") {
      throw new Error("NOT_ADMIN");
    }
    setSession(res.token, res.user);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
