import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  CheckCircle2, ArrowRight, MessageCircle, MapPin, FileText,
  Star, Shield, Users, Clock, Upload,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND, SERVICE_CATEGORIES } from "@/types";
import { fadeUp } from "@/lib/motion";


const FEATURES = [
  {
    icon: FileText,
    title: "Resume Required",
    desc: "Service providers and job seekers must upload a resume before their listing can go live. This builds credibility and helps customers make informed decisions.",
    tag: "Mandatory",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: MapPin,
    title: "Google Maps Location",
    desc: "Your shop or work area must have a verified Google Maps location. This confirms your physical presence and gives customers directions.",
    tag: "Mandatory",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: Shield,
    title: "Admin Verified Before Going Live",
    desc: "Every service provider listing is reviewed by our team. Only verified providers appear in customer search results. No unreviewed listings.",
    tag: "Trust Feature",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Booking",
    desc: "Customers can book or inquire via WhatsApp in one tap. A pre-filled message goes to your number. No app required — just direct contact.",
    tag: "Built-in",
    tagColor: "bg-[#25D366]/10 text-[#25D366]",
  },
  {
    icon: Star,
    title: "Portfolio Page — Auto-Generated",
    desc: "FinallyOn creates a professional public profile for every approved provider: gallery, services, map, reviews, and a WhatsApp booking button.",
    tag: "Free",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "District-First Discovery",
    desc: "Your profile appears first to customers searching in your district. Navsari-local first, then expanding to nearby districts.",
    tag: "Hyperlocal",
    tagColor: "bg-violet-50 text-violet-600",
  },
];

const WORKFLOW_STEPS = [
  { step: "1", desc: "Create account and fill basic profile info" },
  { step: "2", desc: "Add your Google Maps shop/work location (required)" },
  { step: "3", desc: "Add your active WhatsApp number" },
  { step: "4", desc: "Upload your resume (required for service/job providers)" },
  { step: "5", desc: "Add work photos and portfolio samples" },
  { step: "6", desc: "List your services with descriptions and pricing" },
  { step: "7", desc: "Submit for admin review → Go live after approval" },
];

const SAMPLE_CATEGORIES = [
  { icon: "⚡", name: "Electrician" },
  { icon: "🔧", name: "Plumber" },
  { icon: "💄", name: "Beautician" },
  { icon: "🍱", name: "Tiffin Service" },
  { icon: "📚", name: "Home Tutor" },
  { icon: "🎨", name: "Painter" },
  { icon: "🧵", name: "Tailor" },
  { icon: "📸", name: "Photographer" },
  { icon: "🌿", name: "Gardener" },
  { icon: "🛠️", name: "Carpenter" },
  { icon: "🧹", name: "Cleaning" },
  { icon: "🎉", name: "Event Planner" },
];

export default function ServicesPage() {
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
                For Service Providers
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight max-w-3xl">
                Get booked. Build trust.<br />
                <span className="text-primary">Grow in Navsari.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                {BRAND.name} gives skilled service providers a verified public profile, a WhatsApp booking button, and district-first visibility — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate("/register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                  List Your Service Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/how-it-works")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border font-semibold hover:bg-muted transition-colors">
                  How the Approval Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key requirements callout */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-sm text-amber-800 mb-1">Resume is Mandatory</div>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    All service providers and job seekers must upload a resume. Without it, your listing cannot be published.
                  </p>
                </div>
              </div>
              <div className="p-5 rounded-2xl border-2 border-primary/25 bg-primary/5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary mb-1">Google Maps Location Required</div>
                  <p className="text-sm text-primary/70 leading-relaxed">
                    Add your shop or service area on Google Maps. This is mandatory for all listings to go live.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 pl-1">
              For online-only or non-shop businesses: contact{" "}
              <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                attachtotech.xyz
              </a>{" "}
              for digital setup support.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-3xl font-extrabold text-foreground mb-3">Everything a local service provider needs</h2>
              <p className="text-muted-foreground">Built for real local skill workers — not freelance platforms, not gig apps.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                    className="p-6 rounded-2xl border border-border bg-card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.tagColor}`}>{f.tag}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="px-6 md:px-10 mb-20 bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">How to list your service</h2>
              <p className="text-muted-foreground text-sm">Seven steps to a live, verified profile.</p>
            </motion.div>
            <div className="space-y-3">
              {WORKFLOW_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-black flex-shrink-0">
                    {s.step}
                  </div>
                  <span className="text-sm font-medium text-foreground">{s.desc}</span>
                  <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0 opacity-40" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Available service categories</h2>
              <p className="text-muted-foreground text-sm">All verified locally in Navsari district.</p>
            </motion.div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SAMPLE_CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground text-center">{c.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              +{SERVICE_CATEGORIES.length - 12} more categories available
            </p>
          </div>
        </section>

        {/* Review/approval note */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto p-6 rounded-2xl border border-border bg-card flex gap-5 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground mb-1">What happens after you submit?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your listing status shows as <strong>Pending</strong> in your dashboard. Our admin team will review within 24 hours. 
                If approved, your profile goes live instantly. If there's an issue, you'll see the reason and can resubmit.
                Only approved listings are visible to customers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10">
          <div className="max-w-5xl mx-auto p-10 rounded-2xl bg-primary text-primary-foreground text-center">
            <h2 className="text-2xl font-extrabold mb-3">Ready to list your service in Navsari?</h2>
            <p className="text-primary-foreground/70 mb-6 text-sm max-w-md mx-auto">
              Free to list. Admin-verified. WhatsApp booking built in. Your portfolio page included.
            </p>
            <button onClick={() => navigate("/register")} className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity">
              Get Started Free
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
