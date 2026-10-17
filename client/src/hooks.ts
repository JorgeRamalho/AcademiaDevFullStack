import { useEffect, useState } from "react";
import { api } from "./api";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}

export function useApi<T>(path: string): {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
} {
  const [nonce, setNonce] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api<T>(path).then(
      (value) => {
        if (!active) {
          return;
        }
        setData(value);
        setLoading(false);
      },
      (reason: unknown) => {
        if (!active) {
          return;
        }
        setError(reason instanceof Error ? reason.message : "Falha ao carregar.");
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [path, nonce]);

  return { data, error, loading, reload: () => setNonce((value) => value + 1) };
}
