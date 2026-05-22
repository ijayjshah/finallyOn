import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MapPin, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NAVSARI_AREAS, BRAND } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 } }),
};

const NAVSARI_INFO = {
  district: "Navsari",
  state: "Gujarat",
  country: "India",
  population: "~1.3 million",
  language: "Gujarati",
  majorTowns: [
    "Navsari City (HQ)",
    "Jalalpore",
    "Bilimora",
    "Gandevi",
    "Chikhli",
    "Vansda",
    "Vijalpore",
    "Dungri",
  ],
  categories: [
    "Electricians", "Plumbers", "Beauticians", "Tiffin Services",
    "Home Tutors", "Carpenters", "Mehendi Artists", "Catering",
  ],
};

const COMING_SOON = [
  {
    city: "Surat",
    desc: "Commercial capital of Gujarat. Textile, diamond, and chemical industries. Large urban workforce.",
    emoji: "🏙️",
    eta: "2025",
  },
  {
    city: "Valsad",
    desc: "Coastal district with thriving local trade, agriculture, and small business economy.",
    emoji: "🌊",
    eta: "2025",
  },
  {
    city: "Vapi",
    desc: "Major industrial town in Valsad district with GIDC industrial estate and growing services sector.",
    emoji: "🏭",
    eta: "2025–26",
  },
];

const HOW_DISTRICT_WORKS = [
  {
    step: "1",
    title: "User selects district",
    desc: "When browsing, customers first select their district. Navsari is the live option.",
  },
  {
    step: "2",
    title: "Local-first recommendations",
    desc: "All businesses and service providers shown are from within the selected district and nearby areas.",
  },
  {
    step: "3",
    title: "Area-level precision",
    desc: "Within Navsari, you can filter by area (Jalalpore, Bilimora, Gandevi, etc.) for hyper-local results.",
  },
  {
    step: "4",
    title: "Verified within the district",
    desc: "Only admin-approved businesses from that district appear. No listings from outside the active zone.",
  },
];

export default function DistrictsPage() {
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
                District-First Network
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight max-w-3xl">
                Starting in Navsari.<br />
                <span className="text-primary">Growing across Gujarat.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                {BRAND.name} launches district by district — intentionally local. Every recommendation reflects your actual district, not a generic city-level search.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate("/app/discover")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                  Browse Navsari Businesses <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border font-semibold hover:bg-muted transition-colors">
                  List Your Business
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live — Navsari */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl border-2 border-primary bg-primary/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                Live Now
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-extrabold text-foreground mb-1">{NAVSARI_INFO.district} District</h2>
                  <p className="text-muted-foreground text-sm mb-2">{NAVSARI_INFO.state}, {NAVSARI_INFO.country} · Population: {NAVSARI_INFO.population} · Language: {NAVSARI_INFO.language}</p>
                  <div className="grid md:grid-cols-2 gap-6 mt-5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Towns & Areas Covered</div>
                      <div className="flex flex-wrap gap-2">
                        {NAVSARI_AREAS.map((a) => (
                          <button
                            key={a}
                            onClick={() => navigate("/app/discover")}
                            className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Active Categories</div>
                      <div className="flex flex-wrap gap-2">
                        {NAVSARI_INFO.categories.map((c) => (
                          <span key={c} className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-medium text-muted-foreground">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How district-first works */}
        <section className="px-6 md:px-10 mb-20 bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">How district-first discovery works</h2>
              <p className="text-muted-foreground text-sm max-w-xl">
                Unlike generic city-wide platforms, FinallyOn keeps discovery local and precise.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              {HOW_DISTRICT_WORKS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex gap-4 p-5 rounded-2xl border border-border bg-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Expanding to South Gujarat</h2>
              <p className="text-muted-foreground text-sm">Businesses can register early — we notify you when your district goes live.</p>
            </motion.div>
            <div className="space-y-4">
              {COMING_SOON.map((c, i) => (
                <motion.div
                  key={c.city}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-border bg-card"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-base text-foreground">{c.city}</h3>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Coming {c.eta}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                  <button
                    onClick={() => navigate("/contact")}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline flex-shrink-0"
                  >
                    Pre-register <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why district-first */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Why district-first, not nationwide?</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Local trust is built through local relationships — not nationwide scale.",
                "Admin verification is only possible when we know the district deeply.",
                "Google Maps location makes sense when we verify the area ourselves.",
                "Service providers should appear to people who can actually reach them.",
                "District launch allows quality control before expanding.",
                "Local language and context matters. Navsari is Gujarati-first.",
              ].map((r) => (
                <div key={r} className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10">
          <div className="max-w-5xl mx-auto p-10 rounded-2xl bg-primary text-primary-foreground text-center">
            <h2 className="text-2xl font-extrabold mb-3">Join the Navsari network today</h2>
            <p className="text-primary-foreground/70 mb-6 text-sm">Free to list. Admin-verified. District-first discovery.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate("/register")} className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity">
                List Your Business
              </button>
              <button onClick={() => navigate("/app/discover")} className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore Navsari
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
