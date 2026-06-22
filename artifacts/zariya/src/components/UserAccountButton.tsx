import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  User, LogIn, UserPlus, LayoutDashboard, LogOut, Home, Briefcase, ChevronDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserType } from "@/types";

type Variant = "marketing" | "app";

interface UserAccountButtonProps {
  variant?: Variant;
  className?: string;
}

function getRoleLabel(type: UserType) {
  if (type === "service_provider") return "Service Provider";
  if (type === "business_owner") return "Business Owner";
  return "Explorer";
}

export default function UserAccountButton({ variant = "marketing", className = "" }: UserAccountButtonProps) {
  const [, navigate] = useLocation();
  const { currentUser, logout, getProfileByUserId } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const profile = currentUser ? getProfileByUserId(currentUser.id) : undefined;
  const userType: UserType = currentUser?.type ?? "user";
  const showListingCTA = userType === "service_provider" || userType === "business_owner";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    void logout();
    navigate("/");
  };

  const isLoggedIn = !!currentUser;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={isLoggedIn ? "Account menu" : "Sign in"}
        className={`relative flex items-center gap-1 p-2 rounded-lg transition-colors ${
          isLoggedIn
            ? "hover:bg-muted"
            : "bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/20"
        }`}
      >
        {isLoggedIn ? (
          <>
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            {variant === "app" && (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            )}
          </>
        ) : (
          <>
            <User className="w-5 h-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[60]"
          >
            {isLoggedIn ? (
              <>
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-bold text-foreground truncate">{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                  <div className="text-xs font-semibold text-primary mt-1">{getRoleLabel(userType)}</div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => go("/app/dashboard")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                    Dashboard
                  </button>
                  {variant === "app" && (
                    <>
                      <button
                        onClick={() => go("/")}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                      >
                        <Home className="w-4 h-4 text-muted-foreground" />
                        Homepage
                      </button>
                      <button
                        onClick={() => go(profile ? `/app/profile/${profile.id}` : "/app/profile/create")}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        {profile ? "View Profile" : "Create Profile"}
                      </button>
                      {showListingCTA && (
                        <button
                          onClick={() => go("/app/jobs/post")}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          Post a Job
                        </button>
                      )}
                    </>
                  )}
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Sign in to browse services, businesses & jobs
                </div>
                <button
                  onClick={() => go("/login")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </button>
                <button
                  onClick={() => go("/register")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg mt-1 border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Free Account
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
