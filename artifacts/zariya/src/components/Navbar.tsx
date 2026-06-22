import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Wrench, Store, Briefcase, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND } from "@/types";
import { useApp } from "@/context/AppContext";
import LoginPromptModal from "@/components/LoginPromptModal";
import UserAccountButton from "@/components/UserAccountButton";
import { hasDismissedWelcomeLogin, markWelcomeLoginDismissed } from "@/lib/popup-storage";

type BrowseKey = "services" | "businesses" | "jobs";

type NavItem =
  | { label: string; href: string; browse?: never; children?: never }
  | { label: string; href?: never; browse?: never; children: { label: string; href: string; desc: string; icon?: never }[] }
  | { label: string; href?: never; browse: true; children: { label: string; href: BrowseKey; desc: string; icon: React.ElementType }[] };

const navGroups: NavItem[] = [
  {
    label: "View",
    browse: true,
    children: [
      { label: "Services", href: "services", desc: "Electricians, tutors, beauticians & more", icon: Wrench },
      { label: "Businesses", href: "businesses", desc: "Shops, clinics, restaurants & stores", icon: Store },
      { label: "Jobs & Work", href: "jobs", desc: "Local job openings & job seekers", icon: Briefcase },
    ],
  },
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "For Businesses",
    children: [
      { label: "Service Providers", href: "/services", desc: "List your skills & get booked" },
      { label: "Product Sellers", href: "/products", desc: "Sell locally with WhatsApp orders" },
      { label: "Portfolio Showcase", href: "/portfolio", desc: "Your free profile page" },
      { label: "Pricing", href: "/pricing", desc: "Free forever — see what's included" },
    ],
  },
  { label: "Districts", href: "/districts" },
  { label: "Trust & Verification", href: "/trust" },
  { label: "Waitlist", href: "/waitlist" },
  { label: "Contact", href: "/contact" },
];

const ICON_COLORS: Record<string, string> = {
  services: "text-indigo-500 bg-indigo-50",
  businesses: "text-amber-500 bg-amber-50",
  jobs: "text-emerald-500 bg-emerald-50",
};

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="5" cy="5" r="2.5" fill="white" />
        <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
        <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
        <circle cx="15" cy="15" r="2.5" fill="white" />
        <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
        <line x1="5" y1="5" x2="10" y2="10" stroke="white" strokeWidth="1.2" opacity="0.4" />
        <line x1="15" y1="5" x2="10" y2="10" stroke="white" strokeWidth="1.2" opacity="0.4" />
        <line x1="5" y1="15" x2="10" y2="10" stroke="white" strokeWidth="1.2" opacity="0.4" />
        <line x1="15" y1="15" x2="10" y2="10" stroke="white" strokeWidth="1.2" opacity="0.4" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-extrabold text-base tracking-tight text-foreground">{BRAND.name}</span>
      <span className="text-[9px] text-muted-foreground font-medium tracking-wide hidden sm:block">Navsari, Gujarat</span>
    </div>
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loginPrompt, setLoginPrompt] = useState<BrowseKey | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { currentUser, loading } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (loading || currentUser) return;
    if (hasDismissedWelcomeLogin()) return;
    if (location === "/login" || location === "/register") return;

    const t = setTimeout(() => setWelcomeOpen(true), 2500);
    return () => clearTimeout(t);
  }, [loading, currentUser, location]);

  const closeWelcome = () => {
    markWelcomeLoginDismissed();
    setWelcomeOpen(false);
  };

  const go = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const handleBrowse = (key: BrowseKey) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    if (currentUser) {
      if (key === "jobs") {
        navigate("/app/jobs");
      } else {
        navigate(`/app/discover?tab=${key}`);
      }
    } else {
      setLoginPrompt(key);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
            : "top-9 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => go("/")} className="flex items-center">
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((item) => {
              if (item.children && item.browse) {
                /* ── "View" browse dropdown ── */
                return (
                  <div key={item.label} className="relative">
                    <button
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setOpenDropdown(item.label)}
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="p-1.5">
                            {item.children.map((child) => {
                              const Icon = child.icon;
                              const colorCls = ICON_COLORS[child.href as string] ?? "text-primary bg-primary/10";
                              return (
                                <button
                                  key={child.href}
                                  onClick={() => handleBrowse(child.href as BrowseKey)}
                                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-foreground">{child.label}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{child.desc}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (item.children) {
                /* ── Regular dropdown (For Businesses etc.) ── */
                return (
                  <div key={item.label} className="relative">
                    <button
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setOpenDropdown(item.label)}
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                        >
                          {item.children.map((child) => (
                            <button
                              key={child.href}
                              onClick={() => go(child.href)}
                              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                            >
                              <div className="text-sm font-semibold text-foreground">{child.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{child.desc}</div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              /* ── Plain link ── */
              return (
                <button
                  key={item.href}
                  onClick={() => go(item.href!)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <UserAccountButton variant="marketing" />
            {!currentUser && (
              <button
                onClick={() => go("/register")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                List Your Business
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <UserAccountButton variant="marketing" />
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-5 py-5 space-y-1">
                {navGroups.map((item) => {
                  if (item.children && item.browse) {
                    return (
                      <div key={item.label}>
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          View
                        </div>
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          const colorCls = ICON_COLORS[child.href as string] ?? "text-primary bg-primary/10";
                          return (
                            <button
                              key={child.href}
                              onClick={() => handleBrowse(child.href as BrowseKey)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  }

                  if (item.children) {
                    return (
                      <div key={item.label}>
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {item.label}
                        </div>
                        {item.children.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => go(child.href)}
                            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors pl-6"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.href}
                      onClick={() => go(item.href!)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="pt-3 flex flex-col gap-2 border-t border-border">
                  {currentUser ? (
                    <button
                      onClick={() => go("/app/dashboard")}
                      className="py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Go to App <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => go("/login")}
                        className="py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => go("/register")}
                        className="py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        List Your Business Free
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <LoginPromptModal
        open={loginPrompt !== null}
        onClose={() => setLoginPrompt(null)}
        context={loginPrompt ?? "services"}
      />
      <LoginPromptModal
        open={welcomeOpen}
        onClose={closeWelcome}
        context="welcome"
      />
    </>
  );
}
