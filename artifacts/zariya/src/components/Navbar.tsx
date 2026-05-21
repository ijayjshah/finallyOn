import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Workers", href: "#portfolio" },
  { label: "For Sellers", href: "#commerce" },
  { label: "Cities", href: "#cities" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2.5"
          data-testid="logo-link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
          <span className="font-bold text-lg tracking-tight text-foreground">Foundwork</span>
        </a>

        <nav className="hidden md:flex items-center gap-7" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer bg-transparent border-none outline-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-foreground text-left hover:text-primary transition-colors py-1 bg-transparent border-none outline-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                  className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMobileOpen(false); navigate("/register"); }}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
