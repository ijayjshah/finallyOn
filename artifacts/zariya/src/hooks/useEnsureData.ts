import { useEffect, useState } from "react";

/** Runs a data loader once on mount; use for page-scoped API fetches. */
export function useEnsureData(loader: () => Promise<void>, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void loader().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}
