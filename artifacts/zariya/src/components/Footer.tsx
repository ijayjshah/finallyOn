export default function Footer() {
  const links = {
    Product: ["How It Works", "For Workers", "For Sellers", "Portfolio Engine", "Mini Store"],
    Company: ["About", "Blog", "Press", "Careers", "Contact"],
    Cities: ["Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad"],
    Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
  };

  return (
    <footer className="bg-foreground text-background/80 py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/30 border border-primary/20 flex items-center justify-center">
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
              <span className="font-bold text-lg text-background">Foundwork</span>
            </div>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs">
              Digital infrastructure for local workers and micro-businesses across India.
              Building the identity and operating layer for the informal economy.
            </p>
            <p className="text-xs text-background/40 mt-6">
              Made in India with intent.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-background/60 hover:text-background transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            &copy; 2025 Foundwork Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-background/30">
            CIN: U72900MH2025PTC000001
          </p>
        </div>
      </div>
    </footer>
  );
}
