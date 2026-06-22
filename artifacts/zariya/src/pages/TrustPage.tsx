import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Shield, MapPin, CheckCircle2, ArrowRight, Upload, Clock, Star, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/types";
import { fadeUp } from "@/lib/motion";


const TRUST_STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Owner Submits Full Details",
    desc: "Business name, category, description, district, area, services or products. All fields required. Incomplete submissions are not accepted.",
    required: ["Business/skill name", "Category", "District & area (Navsari)", "Description"],
    color: "bg-primary/8 border-primary/25 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Google Maps Location Added",
    desc: "Every business must paste a valid Google Maps shop location link. This is non-negotiable. It confirms physical presence and gives customers real directions.",
    required: ["Valid Google Maps URL", "Location must match declared district", "Must be accessible on Google Maps"],
    highlight: true,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Shield,
    step: "03",
    title: "WhatsApp & Contact Verified",
    desc: "Owner's WhatsApp number is added and confirmed. This is the primary channel for customer contact and bookings.",
    required: ["Active WhatsApp number", "Phone number for calls"],
    color: "bg-primary/8 border-primary/25 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    icon: Upload,
    step: "04",
    title: "Resume (If Service/Job Provider)",
    desc: "Anyone listing themselves for a service, skill, or job must upload their resume. Without it, the listing stays in draft and cannot be submitted.",
    required: ["Resume upload mandatory", "Portfolio/work photos encouraged", "Experience years required"],
    highlight: true,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    icon: Star,
    step: "05",
    title: "Photos & Portfolio Added",
    desc: "Businesses should upload real work photos. For product sellers, every product must have at least one image. Placeholder or stock images are rejected.",
    required: ["Min. 1 real work photo", "Products: image per item required", "No stock photos or watermarked images"],
    color: "bg-primary/8 border-primary/25 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    icon: Clock,
    step: "06",
    title: "Admin Review (Within 24 Hours)",
    desc: "Our team manually checks every submission. We verify the Maps location, photo authenticity, resume (if applicable), and overall listing quality.",
    required: ["Map location check", "Photo authenticity check", "Service/product accuracy review"],
    highlight: true,
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconBg: "bg-violet-100",
  },
  {
    icon: CheckCircle2,
    step: "07",
    title: "Approved → Visible to Customers",
    desc: "Approved listings go live instantly. Rejected listings show the reason and can be corrected and resubmitted. Only approved listings appear in customer search.",
    required: ["Approval = immediate visibility", "Rejection includes reason", "Resubmission allowed after fix"],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
];

const REJECTION_REASONS = [
  "Google Maps URL doesn't resolve to a real business location",
  "Photos are stock images or do not match declared services",
  "Resume missing for a service/job listing",
  "Business location doesn't match declared district (Navsari)",
  "Product images missing or of very low quality",
  "Contact information (WhatsApp) is unreachable",
  "Description is vague or appears misleading",
  "Product count exceeds the 20-item limit",
];

export default function TrustPage() {
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
                Trust & Verification
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight max-w-3xl">
                Only real, verified businesses<br />
                <span className="text-primary">get to go live.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                {BRAND.name} uses a mandatory Google Maps check, resume requirement, and human admin review to ensure every listing is legitimate before any customer sees it.
              </p>
            </motion.div>

            {/* Trust highlights strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { icon: MapPin, label: "Google Maps Required", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Upload, label: "Resume Mandatory", color: "text-amber-600", bg: "bg-amber-50" },
                { icon: Shield, label: "Admin Reviewed", color: "text-primary", bg: "bg-primary/8" },
                { icon: CheckCircle2, label: "Approved Only", color: "text-violet-600", bg: "bg-violet-50" },
              ].map((h) => {
                const Icon = h.icon;
                return (
                  <div key={h.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border ${h.bg} text-center`}>
                    <Icon className={`w-5 h-5 ${h.color}`} />
                    <span className={`text-xs font-bold ${h.color}`}>{h.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Why this matters */}
        <section className="px-6 md:px-10 mb-20 bg-muted/20 border-y border-border py-12">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Why is Google Maps mandatory?</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: "Confirms physical presence",
                  desc: "A verified Maps location proves the business actually exists at that address. Reduces the risk of ghost or fake listings.",
                },
                {
                  title: "Gives customers confidence",
                  desc: "Customers can see exactly where you are, get directions, and visit your shop. Trust increases dramatically.",
                },
                {
                  title: "District verification",
                  desc: "The map location must match the declared district. We cross-check. A Surat address can't appear in Navsari listings.",
                },
              ].map((r, i) => (
                <motion.div key={r.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="p-5 rounded-2xl border border-border bg-card"
                >
                  <MapPin className="w-5 h-5 text-primary mb-3" />
                  <h3 className="font-bold text-sm text-foreground mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <strong>For online-only businesses without a physical shop:</strong> Contact{" "}
              <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                attachtotech.xyz
              </a>{" "}
              for digital setup and marketing support. FinallyOn is currently designed for physical-location businesses in Navsari district.
            </p>
          </div>
        </section>

        {/* Full workflow */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">The complete verification workflow</h2>
              <p className="text-muted-foreground text-sm">Every step is required. No shortcuts.</p>
            </motion.div>
            <div className="space-y-4">
              {TRUST_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                    className={`p-5 rounded-2xl border-2 ${s.highlight ? s.color.replace("text-", "border-").replace("bg-", "bg-") : "border-border bg-card"} ${s.highlight ? s.color.split(" ")[0] : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.highlight ? s.iconBg : "bg-muted"}`}>
                        <Icon className={`w-5 h-5 ${s.highlight ? s.color.split(" ").find((c: string) => c.startsWith("text-")) : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black tracking-wider text-muted-foreground">STEP {s.step}</span>
                          {s.highlight && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.highlight ? s.iconBg : "bg-muted"} ${s.color.split(" ").find((c: string) => c.startsWith("text-"))}`}>
                              Key requirement
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-foreground mb-1.5">{s.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.required.map((r) => (
                            <div key={r} className="flex items-center gap-1 text-xs text-muted-foreground bg-background border border-border px-2 py-1 rounded-lg">
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rejection reasons */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Common reasons listings get rejected</h2>
              <p className="text-muted-foreground text-sm">Rejection comes with a reason. Fix it and resubmit — we'll review again.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-3">
              {REJECTION_REASONS.map((r) => (
                <div key={r} className="flex items-start gap-2.5 p-3 rounded-xl border border-destructive/20 bg-destructive/5">
                  <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10">
          <div className="max-w-5xl mx-auto p-10 rounded-2xl bg-primary text-primary-foreground text-center">
            <Shield className="w-10 h-10 mx-auto mb-4 opacity-70" />
            <h2 className="text-2xl font-extrabold mb-3">Ready to build trust with Navsari customers?</h2>
            <p className="text-primary-foreground/70 mb-6 text-sm max-w-md mx-auto">
              List your verified business on FinallyOn. Free to list. Admin-approved. Google Maps linked.
            </p>
            <button onClick={() => navigate("/register")} className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity">
              Start Your Listing
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
