import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Building2, Users, Shield, ArrowRight, CheckCircle2,
  MapPin, MessageCircle, FileText, Image, Clock, Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 } }),
};

type Tab = "business" | "customer" | "admin";

const BUSINESS_STEPS = [
  {
    num: "01", icon: FileText,
    title: "Create Your Account",
    desc: "Sign up with your name, email, phone, and WhatsApp number. Select your district (Navsari).",
  },
  {
    num: "02", icon: Building2,
    title: "Build Your Profile",
    desc: "Add your business name, category, description, experience, and work photos.",
  },
  {
    num: "03", icon: MapPin,
    title: "Add Google Maps Location",
    desc: "Paste your Google Maps shop link. This is mandatory — it verifies your physical presence and builds customer trust.",
    highlight: true,
  },
  {
    num: "04", icon: MessageCircle,
    title: "Set Your WhatsApp",
    desc: "Add your WhatsApp number so customers can reach you directly for bookings and inquiries.",
  },
  {
    num: "05", icon: Image,
    title: "Add Services & Pricing",
    desc: "List your services with prices. For product sellers, add up to 20 product items with images, category, and delivery preferences.",
  },
  {
    num: "06", icon: Clock,
    title: "Submit for Admin Review",
    desc: "Your listing goes to our team for verification. We check for accuracy and legitimacy. Usually done within 24 hours.",
    highlight: true,
  },
  {
    num: "07", icon: Star,
    title: "Go Live & Get Found",
    desc: "Once approved, your profile becomes visible to customers across Navsari. They can find, browse, and contact you instantly.",
  },
];

const CUSTOMER_STEPS = [
  {
    num: "01", icon: MapPin,
    title: "Select Your District",
    desc: "Choose Navsari (currently live). All recommendations are district-first — what's near you shows first.",
  },
  {
    num: "02", icon: Users,
    title: "Browse Verified Businesses",
    desc: "Every business visible on FinallyOn is admin-approved and map-verified. No unverified or fake listings.",
  },
  {
    num: "03", icon: Building2,
    title: "View Portfolio Profile",
    desc: "See the business's full profile: gallery, services/products, location map, ratings, and reviews.",
  },
  {
    num: "04", icon: MessageCircle,
    title: "Book via WhatsApp",
    desc: "Tap the WhatsApp button to open a chat with a pre-filled message. Direct contact — no middlemen, no app.",
    highlight: true,
  },
];

const ADMIN_STEPS = [
  {
    num: "01", icon: FileText,
    title: "Business Submits Listing",
    desc: "Owner fills in all required details: name, category, location, Google Maps URL, WhatsApp number, services/products.",
  },
  {
    num: "02", icon: MapPin,
    title: "Map Location Verified",
    desc: "Admin checks that the Google Maps URL points to a real, legitimate business address in the declared district.",
    highlight: true,
  },
  {
    num: "03", icon: Shield,
    title: "Identity & Content Review",
    desc: "Admin checks photos, services, and pricing for accuracy and legitimacy. Fake or misleading listings are rejected.",
  },
  {
    num: "04", icon: CheckCircle2,
    title: "Approved or Rejected",
    desc: "Approved listings go live immediately. Rejected listings get a reason and can be resubmitted after correction.",
    highlight: true,
  },
  {
    num: "05", icon: Star,
    title: "Live & Discoverable",
    desc: "Only approved listings appear in customer search results. Customers always see verified, legitimate businesses.",
  },
];

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "business", label: "For Business Owners", icon: Building2 },
  { id: "customer", label: "For Customers", icon: Users },
  { id: "admin", label: "Admin Approval", icon: Shield },
];

function StepCard({ step, index }: { step: typeof BUSINESS_STEPS[0]; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      className={`flex gap-5 p-5 rounded-2xl border ${step.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`w-px flex-1 rounded-full ${step.highlight ? "bg-primary/20" : "bg-border"} min-h-4`} />
      </div>
      <div className="pb-4">
        <div className="text-[10px] font-black tracking-wider text-muted-foreground mb-1">{step.num}</div>
        <h3 className={`font-bold text-base mb-1.5 ${step.highlight ? "text-primary" : "text-foreground"}`}>{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
        {step.highlight && (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Required step
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  const [tab, setTab] = useState<Tab>("business");
  const [, navigate] = useLocation();

  const steps = tab === "business" ? BUSINESS_STEPS : tab === "customer" ? CUSTOMER_STEPS : ADMIN_STEPS;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-28 pb-20">

        {/* Header */}
        <section className="px-6 md:px-10 mb-14">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-5">
                How It Works
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                Clear workflows. No surprises.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Whether you're listing a business or finding one, every step on {BRAND.name} is transparent, verified, and hyperlocal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs */}
        <div className="px-6 md:px-10 mb-10">
          <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border transition-all ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <section className="px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {steps.map((step, i) => (
                  <StepCard key={step.num} step={step} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Important rules box */}
        <section className="px-6 md:px-10 mt-14">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <h3 className="font-bold text-base text-amber-800 mb-3 flex items-center gap-2">
                ⚠️ Important Rules for Business Owners
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-amber-700">
                {[
                  "Google Maps location is mandatory — no exceptions.",
                  "Your WhatsApp number must be active and reachable.",
                  "Service/job providers must upload a resume.",
                  "Product sellers can add a maximum of 20 items.",
                  "Listings are invisible until admin approval.",
                  "Delivery and pickup preferences must be declared clearly.",
                ].map((rule) => (
                  <div key={rule} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10 mt-14">
          <div className="max-w-4xl mx-auto">
            <div className="p-10 rounded-2xl bg-primary text-primary-foreground text-center">
              <h2 className="text-2xl font-extrabold mb-3">Ready to list your business?</h2>
              <p className="text-primary-foreground/70 mb-6 text-sm max-w-md mx-auto">
                Join the first verified local business platform in Navsari, Gujarat. Free to list, admin-verified.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-3 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity"
                >
                  List Your Business Free
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
