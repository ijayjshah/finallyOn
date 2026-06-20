import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Wrench, Store, Briefcase, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND } from "@/types";
import { useApp } from "@/context/AppContext";
import LoginPromptModal from "@/components/LoginPromptModal";

const navGroups = [
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

const BROWSE_TABS = [
  { key: "services" as const, label: "Services", icon: Wrench, color: "text-indigo-600 bg-indigo-50 border-indigo-200", desc: "Electricians, tutors, artists…" },
  { key: "businesses" as const, label: "Businesses", icon: Store, color: "text-amber-600 bg-amber-50 border-amber-200", desc: "Shops, clinics, restaurants…" },
  { key: "jobs" as const, label: "Jobs & Work", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 border-emerald-200", desc: "Local openings & job seekers" },
];

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
  const [loginPrompt, setLoginPrompt] = useState<"services" | "businesses" | "jobs" | null>(null);
  const [, navigate] = useLocation();
  const { currentUser } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const handleBrowse = (key: "services" | "businesses" | "jobs") => {
    if (currentUser) {
      if (key === "jobs") {
        go("/app/jobs");
      } else {
        go(`/app/discover?tab=${key}`);
      }
    } else {
      setLoginPrompt(key);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "top-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" : "top-9 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => go("/")} className="flex items-center">
            <Logo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Browse public sections */}
            {BROWSE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleBrowse(tab.key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}

            <span className="w-px h-5 bg-border mx-1" />

            {/* Info nav groups */}
            {navGroups.map((item) =>
              item.children ? (
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
              ) : (
                <button
                  key={item.href}
                  onClick={() => go(item.href!)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => go("/app/dashboard")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Go to App <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => go("/login")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => go("/register")}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  List Your Business
                </button>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
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
              className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-5 py-5 space-y-1">
                {/* Browse section */}
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Browse Navsari</div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {BROWSE_TABS.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => handleBrowse(tab.key)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-colors ${tab.color} hover:opacity-80`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-bold leading-tight">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border pt-2">
                  {navGroups.map((item) =>
                    item.children ? (
                      <div key={item.label}>
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</div>
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
                    ) : (
                      <button
                        key={item.href}
                        onClick={() => go(item.href!)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>

                <div className="pt-3 flex flex-col gap-2 border-t border-border">
                  {currentUser ? (
                    <button onClick={() => go("/app/dashboard")} className="py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Go to App <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => go("/login")} className="py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                        Log In
                      </button>
                      <button onClick={() => go("/register")} className="py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
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
    </>
  );
}
