import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/types";
import { fadeUp } from "@/lib/motion";


const HELP_CATEGORIES = [
  {
    emoji: "🏪",
    title: "Business Onboarding",
    desc: "Trouble setting up your listing? Need help adding your Google Maps location or WhatsApp number?",
    email: BRAND.support,
    subject: "Business Onboarding Help",
  },
  {
    emoji: "✅",
    title: "Listing Approval",
    desc: "Your listing was rejected and you need clarification? Want to know why or how to fix it?",
    email: BRAND.support,
    subject: "Listing Approval Query",
  },
  {
    emoji: "📋",
    title: "Verification Support",
    desc: "Questions about Google Maps verification, resume requirement, or admin review process?",
    email: BRAND.support,
    subject: "Verification Support",
  },
  {
    emoji: "🤝",
    title: "Partnerships",
    desc: "Looking to partner with FinallyOn? District expansion, merchant onboarding, or B2B queries?",
    email: BRAND.email,
    subject: "Partnership Inquiry",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Business Onboarding",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSent(true);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-5">
                Contact Us
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                We're here to help.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Whether you're listing a business, need approval support, or want to partner with us — reach out. We respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company intro strip */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="font-bold text-sm text-foreground mb-1">What is {BRAND.name}?</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  FinallyOn helps local businesses in Navsari, Gujarat get properly online — with verified profiles, WhatsApp booking, and admin-approved listings.
                </p>
              </div>
              <div>
                <div className="font-bold text-sm text-foreground mb-1">Currently serving</div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">Navsari District, Gujarat</span>
                </div>
                <p className="text-xs text-muted-foreground">Expanding to Surat, Valsad, and Vapi in 2026.</p>
              </div>
              <div>
                <div className="font-bold text-sm text-foreground mb-1">Digital Partner</div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Official</span>
                  <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-primary hover:underline">
                    AttachToTech
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Websites, branding &amp; digital marketing for local businesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Help categories */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-xl font-extrabold text-foreground mb-2">What do you need help with?</h2>
              <p className="text-sm text-muted-foreground">Click a category to email us directly with a pre-filled subject.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {HELP_CATEGORIES.map((c, i) => (
                <motion.a
                  key={c.title}
                  href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject)}`}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="text-2xl flex-shrink-0 mt-0.5">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{c.desc}</p>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Mail className="w-3 h-3" />
                      {c.email}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact form + info */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">

              {/* Form */}
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                <h2 className="text-xl font-extrabold text-foreground mb-6">Send us a message</h2>
                {sent ? (
                  <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-emerald-800 mb-2">Message sent!</h3>
                    <p className="text-sm text-emerald-700">We'll respond within 24 hours. Thank you for reaching out.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", category: "Business Onboarding", message: "" }); }}
                      className="mt-4 text-sm text-emerald-700 underline">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Your name</label>
                      <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Full name" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Email address</label>
                      <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Phone / WhatsApp <span className="font-normal text-muted-foreground">(optional)</span></label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Topic</label>
                      <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
                        {HELP_CATEGORIES.map((c) => <option key={c.title}>{c.title}</option>)}
                        <option>General Enquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Your message</label>
                      <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required placeholder="Describe your query or issue..." rows={5} className={`${inputCls} resize-none`} />
                    </div>
                    <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-60">
                      {sending ? <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <><Mail className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Contact info */}
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
                <h2 className="text-xl font-extrabold text-foreground mb-6">Direct contact</h2>

                <div className="p-5 rounded-2xl border border-border bg-card">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground mb-0.5">General Enquiries</div>
                      <a href={`mailto:${BRAND.email}`} className="text-sm text-primary hover:underline">{BRAND.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground mb-0.5">Support & Listing Help</div>
                      <a href={`mailto:${BRAND.support}`} className="text-sm text-primary hover:underline">{BRAND.support}</a>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground mb-1">Operational Area</div>
                      <div className="text-sm text-foreground font-semibold">Navsari District, Gujarat, India</div>
                      <div className="text-xs text-muted-foreground mt-1">Expanding to Surat, Valsad, and Vapi in 2026.</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="none">
                        <circle cx="5" cy="5" r="2" fill="currentColor" />
                        <circle cx="15" cy="5" r="2" fill="currentColor" opacity="0.5" />
                        <circle cx="5" cy="15" r="2" fill="currentColor" opacity="0.5" />
                        <circle cx="15" cy="15" r="2" fill="currentColor" />
                        <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.8" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-sm text-foreground">AttachToTech</div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Digital Partner</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        Need a website, social media presence, or full digital marketing? FinallyOn's official digital partner handles it all.
                      </p>
                      <a
                        href="https://attachtotech.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        attachtotech.xyz <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Response time:</strong> We aim to respond to all messages within 24 hours on working days (Mon–Sat).
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
