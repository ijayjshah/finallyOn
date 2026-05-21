import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useCurrentUser } from "@/context/AppContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useCurrentUser();
  if (!currentUser) return <Redirect to="/login" />;
  return <>{children}</>;
}
