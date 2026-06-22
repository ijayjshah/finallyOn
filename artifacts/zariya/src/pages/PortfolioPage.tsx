import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Star, MapPin, MessageCircle, CheckCircle2, Shield, ArrowRight, Image, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeUp } from "@/lib/motion";

const SAMPLE_PROFILES = [
  {
    name: "Ramesh Patel",
    cat: "Electrician",
    area: "Navsari City",
    rating: 4.8,
    reviews: 156,
    exp: "14 years",
    services: ["Home Wiring", "Panel Upgrade", "Emergency Repair"],
    tags: ["Residential", "Emergency", "Licensed"],
    color: "#4f46e5",
    emoji: "⚡",
    delivery: "On-site service",
  },
  {
    name: "Hina Trivedi",
    cat: "Mehendi Artist",
    area: "Jalalpore",
    rating: 4.9,
    reviews: 287,
    exp: "9 years",
    services: ["Bridal Full Set", "Arabic Design", "Party Mehendi"],
    tags: ["Bridal", "Arabic", "Home Visits"],
    color: "#b45309",
    emoji: "🎨",
    delivery: "Home visits available",
  },
  {
    name: "Kavita Ben Desai",
    cat: "Tiffin Service",
    area: "Gandevi",
    rating: 5.0,
    reviews: 74,
    exp: "5 years",
    services: ["Daily Tiffin", "Monthly Plan", "Weekend Thali"],
    tags: ["Pure Veg", "Home Cooked", "Delivery"],
    color: "#16a34a",
    emoji: "🍱",
    delivery: "Home delivery available",
  },
];

function ProfileShowcase({ p }: { p: typeof SAMPLE_PROFILES[0] }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Cover */}
      <div className="h-24 flex items-center justify-center text-5xl" style={{ background: `${p.color}15`, borderBottom: `2px solid ${p.color}20` }}>
        {p.emoji}
      </div>
      {/* Profile head */}
      <div className="px-5 pb-4">
        <div className="flex items-end justify-between -mt-5 mb-3">
          <div className="w-12 h-12 rounded-xl border-2 border-background flex items-center justify-center text-white font-black text-lg shadow-sm" style={{ background: p.color }}>
            {p.name.charAt(0)}
          </div>
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            FinallyOn Verified
          </div>
        </div>
        <h3 className="font-extrabold text-base text-foreground">{p.name}</h3>
        <div className="text-xs text-primary font-semibold">{p.cat}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <MapPin className="w-3 h-3" />
          {p.area}, Navsari
        </div>
        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.floor(p.rating) ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-foreground">{p.rating}</span>
          <span className="text-xs text-muted-foreground">({p.reviews} reviews)</span>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">{t}</span>
          ))}
        </div>
        {/* Services */}
        <div className="mt-3 space-y-1">
          {p.services.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>
        {/* Delivery */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="w-3 h-3" />
          {p.delivery}
        </div>
        {/* CTAs */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25D366]/15 text-[#25D366] text-xs font-bold">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            Map
          </button>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Image, title: "Photo Gallery", desc: "Multiple work photos showcasing your real work" },
  { icon: MapPin, title: "Google Maps Location", desc: "Verified shop location linked directly" },
  { icon: MessageCircle, title: "WhatsApp CTA", desc: "One-tap booking button with pre-filled message" },
  { icon: Star, title: "Ratings & Reviews", desc: "Customer reviews and star ratings" },
  { icon: Shield, title: "Trust Badge", desc: "FinallyOn verified badge after admin approval" },
  { icon: Phone, title: "Contact Info", desc: "Phone and WhatsApp clearly displayed" },
];

export default function PortfolioPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-5">
                Portfolio & Profiles
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight max-w-3xl">
                Your free profile page,<br />
                <span className="text-primary">built by FinallyOn.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Every approved business gets a professional public portfolio page — with gallery, map, services, reviews, and a WhatsApp contact button. No website knowledge needed.
              </p>
              <button onClick={() => navigate("/register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                Create Your Profile Free <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Sample profiles */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Sample profile pages</h2>
              <p className="text-muted-foreground text-sm">These are examples of what your profile looks like after approval.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {SAMPLE_PROFILES.map((p, i) => (
                <motion.div key={p.name} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <ProfileShowcase p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Profile features */}
        <section className="px-6 md:px-10 mb-20 bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">What every profile includes</h2>
              <p className="text-muted-foreground text-sm">Automatically generated. No technical skills required.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                    className="p-4 rounded-xl border border-border bg-card flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground mb-0.5">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Business type breakdown */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Profiles for every business type</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  emoji: "🔨", title: "Skilled Workers", examples: "Electrician, Plumber, Carpenter, Painter, AC Repair",
                  extras: ["Resume displayed", "Work area map", "Availability status"],
                },
                {
                  emoji: "💄", title: "Beauty & Personal Care", examples: "Beautician, Mehendi Artist, Yoga Trainer, Massage Therapist",
                  extras: ["Home visit info", "Booking via WhatsApp", "Bridal packages"],
                },
                {
                  emoji: "🍱", title: "Food & Catering", examples: "Tiffin Service, Home Chef, Baker, Catering Service",
                  extras: ["Menu gallery", "Delivery area", "Subscription plans"],
                },
                {
                  emoji: "💍", title: "Shops & Retailers", examples: "Jewellery, Clothing, Grocery, Electronics, Hardware",
                  extras: ["Product catalogue (max 20)", "Delivery/pickup options", "Sub-category filters"],
                },
              ].map((t, i) => (
                <motion.div key={t.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <h3 className="font-bold text-base text-foreground">{t.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{t.examples}</p>
                  <div className="space-y-1.5">
                    {t.extras.map((e) => (
                      <div key={e} className="flex items-center gap-1.5 text-xs text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* No website needed note */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto p-6 rounded-2xl bg-primary text-primary-foreground">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="font-extrabold text-xl mb-2">No website. No app. No technical skills.</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  FinallyOn builds and hosts your profile page automatically. You fill in details — we handle the rest. Your page works on every phone and device.
                </p>
              </div>
              <button onClick={() => navigate("/register")} className="px-6 py-3 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity flex-shrink-0">
                Create Profile Free
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
