import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Search, User, ListChecks, LogOut, PlusCircle, ChevronDown, Briefcase, Home } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Discover", href: "/app/discover", icon: Search },
  { label: "Jobs", href: "/app/jobs", icon: Briefcase },
  { label: "My Listings", href: "/app/listings", icon: ListChecks },
];

export default function AppNavbar() {
  const [, navigate] = useLocation();
  const { currentUser, logout, getProfileByUserId } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();

  const profile = currentUser ? getProfileByUserId(currentUser.id) : undefined;

  const handleNav = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (href: string) => location === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4" style={{ height: 60 }}>
        {/* Logo */}
        <button
          onClick={() => handleNav("/app/dashboard")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <circle cx="4" cy="4" r="2" fill="white" />
              <circle cx="14" cy="4" r="2" fill="white" opacity="0.65" />
              <circle cx="4" cy="14" r="2" fill="white" opacity="0.65" />
              <circle cx="14" cy="14" r="2" fill="white" />
              <circle cx="9" cy="9" r="1.5" fill="white" opacity="0.85" />
              <line x1="4" y1="4" x2="9" y2="9" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="14" y1="4" x2="9" y2="9" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="4" y1="14" x2="9" y2="9" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="14" y1="14" x2="9" y2="9" stroke="white" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">Foundwork</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          {/* Home link */}
          <button
            onClick={() => handleNav("/")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Go to homepage"
          >
            <Home className="w-4 h-4" />
            <span className="hidden lg:inline">Home</span>
          </button>

          <button
            onClick={() => handleNav(profile ? "/app/listings/add" : "/app/profile/create")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/8 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {profile ? "Add Listing" : "Create Profile"}
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{currentUser?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-border">
                    <div className="text-sm font-bold text-foreground">{currentUser?.name}</div>
                    <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
                    <div className="text-xs text-primary font-semibold mt-0.5">{currentUser?.city}</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => handleNav("/")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                    >
                      <Home className="w-4 h-4 text-muted-foreground" />
                      Homepage
                    </button>
                    <button
                      onClick={() => handleNav(profile ? `/app/profile/${profile.id}` : "/app/profile/create")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      {profile ? "View Profile" : "Create Profile"}
                    </button>
                    <button
                      onClick={() => handleNav("/app/jobs/post")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      Post a Job
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}

              <div className="my-2 border-t border-border" />

              {/* Home */}
              <button
                onClick={() => handleNav("/")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Home className="w-4 h-4 text-muted-foreground" />
                Go to Homepage
              </button>

              <button
                onClick={() => handleNav(profile ? "/app/listings/add" : "/app/profile/create")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/8 transition-colors mt-1"
              >
                <PlusCircle className="w-4 h-4" />
                {profile ? "Add Listing" : "Create Profile"}
              </button>

              <button
                onClick={() => handleNav("/app/jobs/post")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Post a Job
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
