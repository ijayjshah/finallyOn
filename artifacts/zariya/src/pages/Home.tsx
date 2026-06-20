import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  MapPin, CheckCircle2, MessageCircle, Shield, ArrowRight,
  Star, Zap, Users, Building2, Package, Briefcase,
  Wrench, Scissors, BookOpen, Camera, Paintbrush, Sparkles,
  UtensilsCrossed, Flower2, Gem, ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import BrandPopup from "@/components/BrandPopup";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";
import { BRAND, NAVSARI_AREAS, SERVICE_CATEGORIES } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } }),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
      {children}
    </span>
  );
}

const FEATURED_CATEGORIES = [
  { icon: Zap, label: "Electrician", color: "text-yellow-500 bg-yellow-50" },
  { icon: Wrench, label: "Plumber", color: "text-blue-500 bg-blue-50" },
  { icon: Sparkles, label: "Beautician", color: "text-pink-500 bg-pink-50" },
  { icon: UtensilsCrossed, label: "Tiffin Service", color: "text-orange-500 bg-orange-50" },
  { icon: BookOpen, label: "Home Tutor", color: "text-violet-500 bg-violet-50" },
  { icon: Paintbrush, label: "Painter", color: "text-emerald-500 bg-emerald-50" },
  { icon: Scissors, label: "Tailor", color: "text-indigo-500 bg-indigo-50" },
  { icon: Camera, label: "Photographer", color: "text-rose-500 bg-rose-50" },
  { icon: Shield, label: "Cleaning Service", color: "text-cyan-500 bg-cyan-50" },
  { icon: Gem, label: "Jewellery Shop", color: "text-amber-500 bg-amber-50" },
  { icon: ShoppingBag, label: "Clothing", color: "text-fuchsia-500 bg-fuchsia-50" },
  { icon: Flower2, label: "Gardener", color: "text-green-500 bg-green-50" },
];

const TRUST_ITEMS = [
  {
    icon: MapPin,
    title: "Google Maps Verified",
    desc: "Every business provides a verified Maps location before going live. Real shops. Real addresses.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Shield,
    title: "Admin Approved",
    desc: "Our team reviews every listing before it becomes visible to customers. No unverified businesses.",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Booking",
    desc: "Book or inquire via WhatsApp in one tap. No middlemen, no apps. Just direct contact.",
    color: "text-[#25D366]",
    bg: "bg-[#25D366]/10",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Submit Your Business",
    desc: "Fill in your business details, Google Maps location, WhatsApp number, and service info.",
  },
  {
    num: "02",
    title: "Admin Verification",
    desc: "Our team reviews your listing for accuracy and legitimacy. Usually within 24 hours.",
  },
  {
    num: "03",
    title: "Go Live & Get Found",
    desc: "Your profile is published. Customers in Navsari can find, browse, and contact you instantly.",
  },
];

const DEMO_PROFILES = [
  { name: "Ramesh Patel", cat: "Electrician", area: "Navsari City", rating: 4.8, verified: true, color: "#4f46e5" },
  { name: "Kavita Ben Desai", cat: "Tiffin Service", area: "Gandevi", rating: 5.0, verified: true, color: "#16a34a" },
  { name: "Hina Trivedi", cat: "Mehendi Artist", area: "Navsari City", rating: 4.9, verified: true, color: "#b45309" },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnnouncementMarquee />
      <Navbar />
      <main>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
          {/* bg glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <motion.div variants={fadeUp} custom={0}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary">Now Live in Navsari, Gujarat</span>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-6"
                >
                  Finally, your local<br />
                  <span className="text-primary">business is properly</span><br />
                  online.
                </motion.h1>

                <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                  {BRAND.name} puts local shops, services, and sellers on the map with verified profiles, WhatsApp booking, and district-first discovery — no technical skills needed.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                  >
                    List Your Business Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/app/discover")}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                  >
                    Explore Navsari Businesses
                  </button>
                </motion.div>

                <motion.div variants={fadeUp} custom={4} className="mt-8 flex items-center gap-4 flex-wrap">
                  {["Google Maps verified", "Admin approved", "WhatsApp booking"].map((t) => (
                    <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Floating profile cards */}
              <div className="hidden lg:flex flex-col gap-4 relative">
                {DEMO_PROFILES.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-4 rounded-2xl border border-border bg-card shadow-md ${i === 1 ? "ml-10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: p.color }}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{p.name}</span>
                          {p.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.cat} · {p.area}, Navsari</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-foreground">{p.rating}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-semibold text-center flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </div>
                      <div className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold text-center flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        View Map
                      </div>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-3 py-2 rounded-xl shadow-lg text-xs font-bold"
                >
                  ✓ Approved by FinallyOn
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/30 py-8 px-6 md:px-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: MapPin, label: "Map-verified", desc: "Businesses", color: "text-primary bg-primary/10" },
              { icon: CheckCircle2, label: "Admin-approved", desc: "Before going live", color: "text-emerald-600 bg-emerald-50" },
              { icon: MessageCircle, label: "WhatsApp-first", desc: "Booking flow", color: "text-[#25D366] bg-[#25D366]/10" },
              { icon: Building2, label: "District-first", desc: "Navsari launch", color: "text-violet-600 bg-violet-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center text-center gap-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── DISTRICT FIRST ───────────────────────────────────── */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-12"
            >
              <SectionLabel>District-First</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
                Starting where it matters most.
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                FinallyOn launches district by district. Navsari is our first. Every recommendation is local-first — your neighbourhood, your district.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Live now */}
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="p-6 rounded-2xl border-2 border-primary/30 bg-primary/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold text-primary uppercase tracking-wide">Live Now</span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-3">Navsari District</h3>
                <div className="flex flex-wrap gap-2">
                  {NAVSARI_AREAS.slice(0, 10).map((area) => (
                    <button
                      key={area}
                      onClick={() => navigate("/app/discover")}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/districts")}
                  className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  See the full Navsari network <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Coming soon */}
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1}
                className="space-y-3"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Coming Soon</div>
                {["Surat", "Valsad", "Vapi"].map((city) => (
                  <div key={city} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">{city}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Coming soon</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pl-1">Registrations open ahead of each district launch.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="py-20 px-6 md:px-10 bg-muted/20 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
                Three steps. Verified listing.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {HOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="p-6 rounded-2xl border border-border bg-card relative"
                >
                  <div className="text-4xl font-black text-primary/15 mb-4">{step.num}</div>
                  <h3 className="font-bold text-base text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/how-it-works")}
                className="flex items-center gap-2 mx-auto text-sm font-semibold text-primary hover:underline"
              >
                See the full workflow <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────────────── */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <SectionLabel>Categories</SectionLabel>
                <h2 className="text-3xl font-extrabold text-foreground mt-4">What's available in Navsari</h2>
              </div>
              <button
                onClick={() => navigate("/app/discover")}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Browse all <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {FEATURED_CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.label}
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
                    onClick={() => navigate("/app/discover")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary text-center leading-tight transition-colors">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST SECTION ────────────────────────────────────── */}
        <section className="py-20 px-6 md:px-10 bg-muted/20 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <SectionLabel>Trust & Verification</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
                Only real, verified businesses.
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We require Google Maps location, admin review, and direct WhatsApp contact before any listing goes live.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {TRUST_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/trust")}
                className="flex items-center gap-2 mx-auto text-sm font-semibold text-primary hover:underline"
              >
                How our verification works <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── FOR WHOM ─────────────────────────────────────────── */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <SectionLabel>Who It's For</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4">
                Built for every kind of local business
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Users,
                  title: "Service Providers",
                  desc: "Electricians, beauticians, tutors, tailors, caterers — build a verified profile and get WhatsApp bookings.",
                  cta: "Learn more",
                  href: "/services",
                  color: "text-primary",
                  bg: "bg-primary/8",
                },
                {
                  icon: Package,
                  title: "Product Sellers",
                  desc: "Jewellers, clothing shops, grocery stores — list products with images, delivery options, and WhatsApp orders.",
                  cta: "Learn more",
                  href: "/products",
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                },
                {
                  icon: Briefcase,
                  title: "Job Seekers & Employers",
                  desc: "Post job openings or mark yourself as available for work. Direct contact, no agencies.",
                  cta: "See Jobs Board",
                  href: "/app/jobs",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.desc}</p>
                  <button
                    onClick={() => navigate(card.href)}
                    className={`flex items-center gap-1 text-sm font-semibold ${card.color} hover:underline`}
                  >
                    {card.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-10 bg-primary text-primary-foreground">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold mb-6">
              <Zap className="w-3.5 h-3.5" />
              Free to list · Admin verified · WhatsApp-first
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
              Ready to get your<br />business online?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-md mx-auto">
              Join the first verified local business platform in Navsari. No technical skills needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity"
              >
                List Your Business Free
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="px-8 py-4 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                How It Works
              </button>
            </div>
            <p className="text-primary-foreground/50 text-xs mt-6">
              Not a shop owner? Need digital help?{" "}
              <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground transition-colors">
                Contact attachtotech.xyz
              </a>
            </p>
          </motion.div>
        </section>

      </main>
      <Footer />
      <BrandPopup />
      <OnboardingWalkthrough />
    </div>
  );
}
