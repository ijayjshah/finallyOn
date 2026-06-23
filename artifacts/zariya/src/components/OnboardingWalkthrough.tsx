import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Briefcase, Package, MessageCircle, Shield, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/types";
import { hasCompletedTour, markTourCompleted } from "@/lib/popup-storage";

const STEPS = [
  {
    icon: Search,
    color: "bg-primary/10 text-primary",
    title: "Discover Local Businesses",
    desc: "Browse verified service providers, shops, and sellers right in your area. Use filters to find exactly what you need — by area, category, or availability.",
  },
  {
    icon: Briefcase,
    color: "bg-violet-100 text-violet-600",
    title: "Jobs Board",
    desc: "Find local job openings or post yourself as a job seeker. Businesses and workers connect directly — no middlemen involved.",
  },
  {
    icon: Package,
    color: "bg-emerald-100 text-emerald-600",
    title: "Products & Services",
    desc: "Local sellers list their products with clear pricing. Browse items and reach sellers directly via WhatsApp with one tap.",
  },
  {
    icon: MessageCircle,
    color: "bg-[#25D366]/10 text-[#25D366]",
    title: "WhatsApp Booking",
    desc: "No forms, no wait time. Every business profile has a WhatsApp button so you can book or inquire instantly.",
  },
  {
    icon: Shield,
    color: "bg-primary/10 text-primary",
    title: "Verified & Approved",
    desc: "Every listing goes through manual review by our team. Look for the verified badge — it means we've confirmed the business is real and legitimate.",
  },
  {
    icon: Star,
    color: "bg-amber-100 text-amber-600",
    title: "Your Profile",
    desc: "Create your own business profile in minutes. Add photos, services, pricing, and your Google Maps location. It's completely free.",
  },
];

export default function OnboardingWalkthrough() {
  const [location] = useLocation();
  const { currentUser, completeOnboarding } = useApp();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  const shouldSkipRoute =
    location === "/login" ||
    location === "/register" ||
    location.startsWith("/app/admin") ||
    location.startsWith("/app/profile/create");

  useEffect(() => {
    if (!currentUser || shouldSkipRoute || currentUser.role === "admin") {
      setVisible(false);
      return;
    }

    const done =
      currentUser.onboardingCompleted === true ||
      hasCompletedTour(currentUser.id);

    if (done) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [currentUser?.id, currentUser?.onboardingCompleted, shouldSkipRoute]);

  const finish = () => {
    if (!currentUser) return;
    markTourCompleted(currentUser.id);
    setVisible(false);
    void completeOnboarding();
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else finish();
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-foreground/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full sm:max-w-sm bg-card sm:rounded-3xl rounded-t-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <circle cx="5" cy="5" r="2.5" fill="white" />
                    <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
                    <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
                    <circle cx="15" cy="15" r="2.5" fill="white" />
                    <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-foreground">{BRAND.name} — Quick Tour</span>
              </div>
              <button onClick={finish} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 pt-4 flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <div className={`w-14 h-14 rounded-2xl ${current.color} flex items-center justify-center mb-5`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-extrabold text-foreground mb-2">{current.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{current.desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={next}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isLast ? (
                  <><CheckCircle2 className="w-4 h-4" /> Finish</>
                ) : (
                  <>Next <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <button
                onClick={finish}
                className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Skip
              </button>
            </div>

            <div className="px-6 pb-4 text-center text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
