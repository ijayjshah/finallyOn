import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND } from "@/types";

const navGroups = [
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "For Businesses",
    children: [
      { label: "Service Providers", href: "/services", desc: "List your skills & get booked" },
      { label: "Product Sellers", href: "/products", desc: "Sell locally with WhatsApp orders" },
      { label: "Portfolio Showcase", href: "/portfolio", desc: "Your free profile page" },
    ],
  },
  { label: "Districts", href: "/districts" },
  { label: "Trust & Verification", href: "/trust" },
  { label: "Contact", href: "/contact" },
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
  const [, navigate] = useLocation();

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

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        <button onClick={() => go("/")} className="flex items-center">
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
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
              <div className="pt-3 flex flex-col gap-2 border-t border-border">
                <button onClick={() => go("/login")} className="py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Log In
                </button>
                <button onClick={() => go("/register")} className="py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  List Your Business Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
