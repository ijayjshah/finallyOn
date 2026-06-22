import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle2, Lock, Zap, Star, MessageCircle, Users, BarChart3, Megaphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/types";
import { fadeUp } from "@/lib/motion";


const FREE_FEATURES = [
  "Verified business profile",
  "Google Maps location display",
  "WhatsApp booking button",
  "Product & service listings (up to 25)",
  "Photo gallery (up to 6 photos)",
  "Discovery in Navsari network",
  "Jobs board posting",
  "Verification badge request",
  "Direct customer inquiries",
];

const PREMIUM_FEATURES = [
  { icon: Zap, label: "Priority listing in search results" },
  { icon: BarChart3, label: "Business analytics dashboard" },
  { icon: Megaphone, label: "Promotional spotlight campaigns" },
  { icon: Star, label: "Featured business badge" },
  { icon: Users, label: "Customer inquiry tracking" },
  { icon: MessageCircle, label: "Bulk WhatsApp messaging tools" },
];

export default function PricingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Simple. Transparent. Free.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {BRAND.name} is completely free for every local business in Navsari.
              We believe every small business deserves a proper online presence.
            </p>
          </motion.div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">

            {/* Free plan */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="p-8 rounded-3xl border-2 border-primary bg-card relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                Current Plan
              </div>
              <div className="mb-6">
                <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Free Plan</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-extrabold text-foreground">₹0</span>
                  <span className="text-muted-foreground text-sm mb-2">/ month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Everything you need to get found locally. No credit card ever needed.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/register")}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Premium plan — coming soon */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="p-8 rounded-3xl border border-border bg-muted/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Premium Plan</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    Launching Soon
                  </span>
                </div>

                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-extrabold text-muted-foreground/40">₹—</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Advanced tools for growing businesses. Pricing announced at launch.
                </p>

                <div className="space-y-3 mb-8">
                  {PREMIUM_FEATURES.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700">Premium commerce plans under development</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Want early access? Contact us on WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent("Hi FinallyOn! I'm interested in early access to premium features.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                  <button
                    onClick={() => navigate("/contact")}
                    className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mb-16"
          >
            <h2 className="text-2xl font-extrabold text-foreground text-center mb-8">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  q: "Will it always be free?",
                  a: "The free plan will always exist. Premium features for advanced businesses will be optional and affordable.",
                },
                {
                  q: "Do I need a credit card?",
                  a: "No. Creating a free profile requires only your phone number and basic business details.",
                },
                {
                  q: "How long does approval take?",
                  a: "Our team reviews listings within 24 hours. You'll receive confirmation once your profile is live.",
                },
                {
                  q: "Can I upgrade later?",
                  a: "Yes. When premium launches, you can upgrade from your dashboard without losing your existing profile.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="font-bold text-sm text-foreground mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="text-center p-10 rounded-3xl bg-primary/5 border border-primary/15"
          >
            <h2 className="text-2xl font-extrabold text-foreground mb-3">Ready to get found?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join local businesses in Navsari already on {BRAND.name}. It takes less than 5 minutes.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              List Your Business Free
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
