import { ReactNode } from "react";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";
import OnboardingWalkthrough from "./OnboardingWalkthrough";

interface AppLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function AppLayout({ children, hideFooter }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppNavbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <OnboardingWalkthrough />
    </div>
  );
}
