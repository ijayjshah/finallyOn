import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Store, Wrench, Users } from "lucide-react";
import { useLocation } from "wouter";
import { BRAND } from "@/types";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  context?: "services" | "businesses" | "jobs";
}

const contextMeta = {
  services: {
    icon: Wrench,
    color: "text-indigo-600 bg-indigo-50",
    title: "Discover Local Services",
    desc: "See electricians, tutors, beauticians and more in Navsari — verified and ready to book.",
  },
  businesses: {
    icon: Store,
    color: "text-amber-600 bg-amber-50",
    title: "Explore Local Businesses",
    desc: "Browse verified shops, restaurants, clinics and stores right in your neighbourhood.",
  },
  jobs: {
    icon: Users,
    color: "text-emerald-600 bg-emerald-50",
    title: "Jobs & Work Board",
    desc: "Find local job openings or let businesses find you — no agents, direct WhatsApp contact.",
  },
};

export default function LoginPromptModal({ open, onClose, context = "services" }: LoginPromptModalProps) {
  const [, navigate] = useLocation();
  const meta = contextMeta[context];
  const Icon = meta.icon;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-sm bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 pb-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${meta.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground mb-1">{meta.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{meta.desc}</p>

              <div className="space-y-2.5">
                <button
                  onClick={() => go("/login")}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <LogIn className="w-4 h-4" />
                  Log in to continue
                </button>
                <button
                  onClick={() => go("/register")}
                  className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create free account
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground px-6 py-4">
              Free forever · No credit card · Navsari district only
            </p>

            <div className="bg-muted/40 border-t border-border px-6 py-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                  <circle cx="5" cy="5" r="2.5" fill="white" />
                  <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="15" cy="15" r="2.5" fill="white" />
                  <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{BRAND.name} — Navsari's local platform</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
