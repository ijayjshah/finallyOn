import { useLocation } from "wouter";
import { BRAND } from "@/types";

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="5" cy="5" r="2.5" fill="white" />
        <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
        <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
        <circle cx="15" cy="15" r="2.5" fill="white" />
        <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
      </svg>
    </div>
    <span className="font-extrabold text-base text-foreground">{BRAND.name}</span>
  </div>
);

const cols = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Navsari Network", href: "/districts" },
      { label: "Trust & Verification", href: "/trust" },
      { label: "Browse Businesses", href: "/app/discover" },
      { label: "Jobs Board", href: "/app/jobs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "List Your Business", href: "/register" },
      { label: "Digital Support", href: "https://attachtotech.xyz", external: true },
    ],
  },
];

export default function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="bg-foreground text-background py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <button onClick={() => navigate("/")} className="text-left">
              <Logo />
            </button>
            <p className="text-sm text-background/50 mt-4 leading-relaxed max-w-xs">
              {BRAND.tagline}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-background/60 font-medium">Live in Navsari, Gujarat</span>
            </div>
            <div className="mt-2 text-xs text-background/40">
              Coming soon: Surat · Valsad · Vapi
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-background/40 mb-4">{col.title}</h3>
              <div className="space-y-2.5">
                {col.links.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-background/55 hover:text-background transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <button
                      key={link.label}
                      onClick={() => navigate(link.href)}
                      className="block text-sm text-background/55 hover:text-background transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30">
            © 2025 {BRAND.name}. All rights reserved. Navsari, Gujarat, India.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href={`mailto:${BRAND.email}`} className="text-xs text-background/40 hover:text-background/70 transition-colors">
              {BRAND.email}
            </a>
            <span className="text-background/20">·</span>
            <a
              href="https://attachtotech.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-background/40 hover:text-background/70 transition-colors"
            >
              Digital support: attachtotech.xyz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
