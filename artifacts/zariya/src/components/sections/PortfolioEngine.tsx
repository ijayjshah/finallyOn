import { motion } from "framer-motion";
import { MapPin, Star, Shield, Phone, Image, CheckCircle2 } from "lucide-react";

const profiles = [
  {
    name: "Priya Mehta",
    category: "Master Tailor",
    location: "Lajpat Nagar, Delhi",
    rating: 4.9,
    reviews: 214,
    jobs: "340+ orders",
    years: "9 yrs exp",
    tags: ["Bridal Wear", "Alterations", "Embroidery"],
    verified: true,
    color: "from-rose-500/10 to-pink-500/5",
    accent: "text-rose-600",
    accentBg: "bg-rose-500/10",
    gallery: ["bg-rose-100", "bg-pink-100", "bg-rose-50"],
  },
  {
    name: "Ravi Sharma",
    category: "Licensed Electrician",
    location: "Andheri West, Mumbai",
    rating: 4.8,
    reviews: 189,
    jobs: "200+ jobs",
    years: "12 yrs exp",
    tags: ["Wiring", "Panel Repair", "Emergency"],
    verified: true,
    color: "from-amber-500/10 to-yellow-500/5",
    accent: "text-amber-600",
    accentBg: "bg-amber-500/10",
    gallery: ["bg-amber-100", "bg-yellow-100", "bg-amber-50"],
  },
  {
    name: "Ananya Krishnan",
    category: "Mehendi Artist",
    location: "Koregaon Park, Pune",
    rating: 5.0,
    reviews: 312,
    jobs: "500+ designs",
    years: "7 yrs exp",
    tags: ["Bridal", "Arabic Style", "Indo-Fusion"],
    verified: true,
    color: "from-emerald-500/10 to-teal-500/5",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-500/10",
    gallery: ["bg-emerald-100", "bg-teal-100", "bg-emerald-50"],
  },
  {
    name: "Deepak Tiwari",
    category: "Home Tutor",
    location: "Indiranagar, Bengaluru",
    rating: 4.9,
    reviews: 98,
    jobs: "50+ students",
    years: "6 yrs exp",
    tags: ["Math", "Science", "JEE Prep"],
    verified: true,
    color: "from-violet-500/10 to-purple-500/5",
    accent: "text-violet-600",
    accentBg: "bg-violet-500/10",
    gallery: ["bg-violet-100", "bg-purple-100", "bg-violet-50"],
  },
];

const features = [
  "Beautiful ready-made profile layouts",
  "Image gallery for past work",
  "Ratings and verified reviews",
  "Trust & verification badges",
  "Service list with pricing",
  "Local service area display",
  "One-tap contact and booking",
  "Mobile-first public profile",
  "No coding or design needed",
];

function ProfileCard({ p, i }: { p: typeof profiles[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.55 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      data-testid={`portfolio-card-${i}`}
    >
      {/* Card Header */}
      <div className={`bg-gradient-to-br ${p.color} p-5 border-b border-border`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${p.accentBg} border-2 border-white flex items-center justify-center font-bold text-lg ${p.accent}`}>
              {p.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">{p.name}</div>
              <div className={`text-xs font-semibold ${p.accent}`}>{p.category}</div>
            </div>
          </div>
          {p.verified && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 border border-border">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-foreground">{p.rating}</span>
          <span className="text-xs text-muted-foreground">({p.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {p.location}
        </div>
      </div>

      {/* Gallery strip */}
      <div className="flex gap-1.5 p-3 border-b border-border">
        {p.gallery.map((bg, gi) => (
          <div key={gi} className={`flex-1 h-16 rounded-lg ${bg} border border-border/50 flex items-center justify-center`}>
            <Image className="w-4 h-4 text-muted-foreground/40" />
          </div>
        ))}
        <div className="flex-1 h-16 rounded-lg bg-muted border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground font-medium">
          +{Math.floor(Math.random() * 30) + 20}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-border">
        {p.tags.map((tag) => (
          <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.accentBg} ${p.accent}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stats + CTA */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{p.jobs}</span>
          <span>{p.years}</span>
        </div>
        <button className={`w-full py-2 rounded-lg border ${p.accentBg} ${p.accent} text-xs font-bold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity`}>
          <Phone className="w-3.5 h-3.5" />
          Contact &amp; Book
        </button>
      </div>
    </motion.div>
  );
}

export default function PortfolioEngine() {
  return (
    <section id="portfolio" className="py-24 px-6 md:px-10 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-6"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Portfolio Engine</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Foundwork designs your portfolio.
            <span className="text-primary"> You just do the work.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            No website builder. No coding. No design skills. Every worker on Foundwork gets a beautiful,
            professional portfolio page — automatically generated and maintained by the platform.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2.5 justify-center mb-14"
        >
          {features.map((f) => (
            <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {f}
            </div>
          ))}
        </motion.div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {profiles.map((p, i) => (
            <ProfileCard key={p.name} p={p} i={i} />
          ))}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 rounded-2xl bg-primary text-primary-foreground"
        >
          <p className="text-xl font-bold mb-2">These are real portfolio layouts generated by Foundwork.</p>
          <p className="text-primary-foreground/75 text-sm">
            Every worker gets this automatically — no setup, no design work, no cost to start.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
