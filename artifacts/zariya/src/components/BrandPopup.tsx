import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, MapPin, Shield, MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import { BRAND } from "@/types";

const DELAY_MS = 15000;

export default function BrandPopup() {
  const [visible, setVisible] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => setVisible(false);

  const handleLearnMore = () => {
    dismiss();
    navigate("/how-it-works");
  };

  const features = [
    { icon: MapPin, label: "Local discovery", desc: "Find businesses in your area" },
    { icon: Shield, label: "Verified listings", desc: "Every business is reviewed" },
    { icon: MessageCircle, label: "WhatsApp booking", desc: "Contact directly in one tap" },
    { icon: Briefcase, label: "Jobs board", desc: "Find work or hire locally" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-foreground/40 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-card sm:rounded-3xl rounded-t-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="relative px-6 pt-7 pb-5 bg-gradient-to-br from-primary/8 to-transparent border-b border-border">
              <button onClick={dismiss} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="5" cy="5" r="2.5" fill="white" />
                    <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
                    <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
                    <circle cx="15" cy="15" r="2.5" fill="white" />
                    <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
                  </svg>
                </div>
                <div>
                  <div className="font-extrabold text-foreground">{BRAND.name}</div>
                  <div className="text-xs text-muted-foreground">{BRAND.tagline}</div>
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-foreground leading-snug">
                Finally, your local<br />businesses are properly online.
              </h2>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Now live in Navsari, Gujarat</span>
              </div>
            </div>

            <div className="px-6 py-5 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={handleLearnMore} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={dismiss} className="px-5 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                Dismiss
              </button>
            </div>

            <div className="px-6 pb-4 text-center text-[10px] text-muted-foreground">
              Digital partner:{" "}
              <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                AttachToTech
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
