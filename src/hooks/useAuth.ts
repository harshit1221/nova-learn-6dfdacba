import { useEffect, useState, useCallback } from "react";

const KEY = "lovable_mock_user";

export type StoredUser = {
  id: string;
  name: string;
  phone: string;
  classId?: number;
  paid?: boolean;
};

function read(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(read());
    setReady(true);
    const onStorage = () => setUser(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((u: StoredUser) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const update = useCallback((patch: Partial<StoredUser>) => {
    setUser((prev) => {
      const next = { ...(prev ?? ({} as StoredUser)), ...patch } as StoredUser;
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
  }, []);

  return { user, ready, login, update, logout, isAuthed: !!user };
}
