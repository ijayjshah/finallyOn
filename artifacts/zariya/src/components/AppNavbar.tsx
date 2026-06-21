import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LayoutDashboard, Search, User, ListChecks, LogOut,
  PlusCircle, ChevronDown, Briefcase, Home, Store, Wrench, Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BRAND, UserType } from "@/types";

type NavLink = { label: string; href: string; icon: React.ElementType };

function getNavLinks(type: UserType, hasProfile: boolean): NavLink[] {
  const base: NavLink[] = [
    { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { label: "Discover Services", href: "/app/discover?tab=services", icon: Wrench },
    { label: "Discover Businesses", href: "/app/discover?tab=businesses", icon: Store },
    { label: "Jobs", href: "/app/jobs", icon: Briefcase },
  ];

  if (type === "user") {
    return base;
  }

  if (type === "service_provider") {
    return [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { label: "Discover", href: "/app/discover", icon: Search },
      { label: "My Services", href: "/app/listings", icon: ListChecks },
      { label: "Jobs", href: "/app/jobs", icon: Briefcase },
    ];
  }

  // business_owner
  return [
    { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { label: "Discover", href: "/app/discover", icon: Search },
    { label: "My Business", href: "/app/listings", icon: Store },
    { label: "Jobs", href: "/app/jobs", icon: Briefcase },
  ];
}

function getRoleLabel(type: UserType) {
  if (type === "service_provider") return { label: "Service Provider", Icon: Wrench, color: "text-indigo-600" };
  if (type === "business_owner") return { label: "Business Owner", Icon: Store, color: "text-amber-600" };
  return { label: "Explorer", Icon: Users, color: "text-violet-600" };
}

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
        <circle cx="5" cy="5" r="2.5" fill="white" />
        <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
        <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
        <circle cx="15" cy="15" r="2.5" fill="white" />
        <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
      </svg>
    </div>
    <span className="font-bold text-base tracking-tight text-foreground">{BRAND.name}</span>
  </div>
);

export default function AppNavbar() {
  const [, navigate] = useLocation();
  const { currentUser, logout, getProfileByUserId } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();

  const profile = currentUser ? getProfileByUserId(currentUser.id) : undefined;
  const userType: UserType = currentUser?.type ?? "user";
  const navLinks = getNavLinks(userType, !!profile);
  const roleInfo = getRoleLabel(userType);
  const RoleIcon = roleInfo.Icon;

  const handleNav = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    void logout();
    navigate("/");
  };

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return location === base || location.startsWith(base + "/");
  };

  const showListingCTA = userType === "service_provider" || userType === "business_owner";
  const ctaLabel =
    userType === "business_owner"
      ? profile ? "Add Listing" : "Create Business Profile"
      : profile ? "Add Listing" : "Create Service Profile";
  const ctaHref = profile ? "/app/listings/add" : "/app/profile/create";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4" style={{ height: 60 }}>
        <button onClick={() => handleNav("/app/dashboard")} className="flex items-center">
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleNav("/")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden lg:inline">Home</span>
          </button>

          {showListingCTA && (
            <button
              onClick={() => handleNav(ctaHref)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/8 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              {ctaLabel}
            </button>
          )}

          {/* User menu */}
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
                  className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-border">
                    <div className="text-sm font-bold text-foreground">{currentUser?.name}</div>
                    <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
                    <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${roleInfo.color}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </div>
                    {currentUser?.serviceCategory && (
                      <div className="text-xs text-muted-foreground mt-0.5">{currentUser.serviceCategory}</div>
                    )}
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => handleNav("/")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors">
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
                    {showListingCTA && (
                      <button
                        onClick={() => handleNav("/app/jobs/post")}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        Post a Job
                      </button>
                    )}
                    <div className="my-1 border-t border-border" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive text-left transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
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
              {/* Role badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-2 text-xs font-semibold ${roleInfo.color} bg-muted`}>
                <RoleIcon className="w-3.5 h-3.5" />
                {roleInfo.label}
                {currentUser?.serviceCategory && <span className="font-normal text-muted-foreground">· {currentUser.serviceCategory}</span>}
              </div>
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
              <button onClick={() => handleNav("/")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Home className="w-4 h-4 text-muted-foreground" />
                Go to Homepage
              </button>
              {showListingCTA && (
                <button
                  onClick={() => handleNav(ctaHref)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/8 transition-colors mt-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  {ctaLabel}
                </button>
              )}
              <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
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
