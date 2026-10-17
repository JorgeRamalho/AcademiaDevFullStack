import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import type { AuthResponse, Level, Pillar, Student } from "./types";

const TOKEN_KEY = "academia_devfullstack_token";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  level: Level;
  pillar: Pillar;
  goal: string;
  aceite: boolean;
};

type AuthContextValue = {
  student: Student | null;
  token: string | null;
  ready: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setReady(true);
      return;
    }
    api<{ student: Student }>("/api/auth/me", {}, stored).then(
      (result) => {
        setToken(stored);
        setStudent(result.student);
        setReady(true);
      },
      () => {
        localStorage.removeItem(TOKEN_KEY);
        setReady(true);
      },
    );
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      student,
      token,
      ready,
      async register(input) {
        const result = await api<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(input),
        });
        localStorage.setItem(TOKEN_KEY, result.token);
        setToken(result.token);
        setStudent(result.student);
      },
      async login(email, password) {
        const result = await api<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(TOKEN_KEY, result.token);
        setToken(result.token);
        setStudent(result.student);
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setStudent(null);
      },
    }),
    [ready, student, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth precisa ficar dentro do AuthProvider.");
  }
  return value;
}
