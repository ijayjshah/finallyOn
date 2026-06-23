import { ReactNode } from "react";
import { Redirect } from "wouter";
import { Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Shield className="w-10 h-10 text-destructive mx-auto" />
          <h1 className="text-lg font-extrabold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">Your account does not have admin privileges.</p>
          <a href="/app/dashboard" className="inline-block px-5 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-muted">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
