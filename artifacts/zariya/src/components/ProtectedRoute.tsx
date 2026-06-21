import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useApp } from "@/context/AppContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!currentUser) return <Redirect to="/login" />;
  return <>{children}</>;
}
