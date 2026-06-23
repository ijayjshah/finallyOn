import { ReactNode } from "react";
import { useLocation } from "wouter";
import {
  Shield, LogOut, LayoutDashboard, BarChart3, Users, User, Package, Briefcase, FileText,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/types";
import { ADMIN_SECTIONS, type AdminSectionId } from "@/pages/admin/shared";

const SECTION_ICONS: Record<AdminSectionId, React.ElementType> = {
  overview: BarChart3,
  users: Users,
  profiles: User,
  listings: Package,
  jobs: Briefcase,
  waitlist: FileText,
};

export default function AdminLayout({
  section,
  children,
}: {
  section: AdminSectionId;
  children: ReactNode;
}) {
  const [, navigate] = useLocation();
  const { logout } = useApp();

  const handleLogout = () => {
    void logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-foreground text-sm">{BRAND.name}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/app/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Web View</span>
          </button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-53px)]">
        <div className="w-52 border-r border-border bg-card hidden md:flex flex-col py-5 px-2 flex-shrink-0">
          <nav className="space-y-0.5">
            {ADMIN_SECTIONS.map(({ id, label, path }) => {
              const Icon = SECTION_ICONS[id];
              const active = section === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto mx-2 p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1">Live</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">Navsari</span>
            </div>
          </div>
        </div>

        <div className="md:hidden flex border-b border-border overflow-x-auto px-3 gap-1 py-2 bg-card w-full sticky top-[53px] z-30">
          {ADMIN_SECTIONS.map(({ id, label, path }) => {
            const Icon = SECTION_ICONS[id];
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-auto md:mt-0 mt-0 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
