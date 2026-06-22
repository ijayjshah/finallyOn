import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Users, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND, SERVICE_CATEGORIES, COMING_SOON_DISTRICTS } from "@/types";
import { api } from "@/lib/api";
import { fadeUp } from "@/lib/motion";

function inputCls(err = false) {
  return `w-full px-4 py-3 rounded-xl border ${err ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"} bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;
}

export default function WaitlistPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", district: "", category: "", customCategory: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.district.trim()) e.district = "Please enter your city or district";
    if (!form.category) e.category = "Select your category";
    if (form.category === "__other__" && !form.customCategory.trim()) e.customCategory = "Please describe your business / service";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const finalCategory = form.category === "__other__" ? form.customCategory.trim() : form.category;
    const res = await api.submitWaitlist({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      district: form.district.trim(),
      category: finalCategory,
      customCategory: form.category === "__other__" ? form.customCategory.trim() : undefined,
    });
    setSubmitting(false);
    if (!res.error) setSubmitted(true);
  };

  const benefits = [
    { icon: Zap, label: "Early Access", desc: "Be first when your district goes live" },
    { icon: Users, label: "Founding Member", desc: "Priority listing visibility" },
    { icon: MessageCircle, label: "Direct Support", desc: "Onboarding help via WhatsApp" },
  ];

  const finalCategory = form.category === "__other__" ? form.customCategory : form.category;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4">
                Coming to Your City
              </span>
              <h1 className="text-4xl font-extrabold text-foreground mb-4 leading-tight">
                Be first when<br />
                <span className="text-primary">{BRAND.name} arrives</span><br />
                in your area.
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Register your interest now. When your city goes live, you'll be among the first to get a verified business profile — free, always.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Expansion Roadmap</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">Navsari</span>
                    <span className="text-xs text-emerald-600 font-bold ml-auto">Live Now</span>
                  </div>
                  {COMING_SOON_DISTRICTS.map((d) => (
                    <div key={d} className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{d}</span>
                      <span className="text-xs text-amber-600 font-semibold ml-auto">Coming Soon</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 pt-1 border-t border-border mt-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Your city</span>
                    <span className="text-xs text-muted-foreground font-semibold ml-auto">Register below</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
              {submitted ? (
                <div className="p-10 rounded-3xl border border-border bg-card text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground mb-2">You're on the list!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We'll notify you as soon as {BRAND.name} launches in your city. Keep an eye on your phone and email.
                  </p>
                  <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-left">
                    <p className="text-xs text-muted-foreground mb-1">Registered as</p>
                    <p className="font-semibold text-sm text-foreground">{form.name}</p>
                    <p className="text-xs text-muted-foreground">{form.district} · {finalCategory}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl border border-border bg-card space-y-5">
                  <h2 className="text-xl font-extrabold text-foreground">Register Your Interest</h2>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Your Name</label>
                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" className={inputCls(!!errors.name)} />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls(!!errors.email)} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Your City / District
                      <span className="text-muted-foreground font-normal ml-1 text-xs">(can be anywhere in India)</span>
                    </label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      placeholder="e.g. Vapi, Surat, Bharuch, Ahmedabad..."
                      className={inputCls(!!errors.district)}
                    />
                    {errors.district && <p className="text-xs text-destructive mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Business / Service Category</label>
                    <select value={form.category} onChange={(e) => { set("category", e.target.value); set("customCategory", ""); }} className={inputCls(!!errors.category)}>
                      <option value="">Select category...</option>
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__other__">Other (not in the list)</option>
                    </select>
                    {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                    {form.category === "__other__" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={form.customCategory}
                          onChange={(e) => set("customCategory", e.target.value)}
                          placeholder="e.g. Flower Shop, Bike Mechanic, Photography Studio..."
                          className={inputCls(!!errors.customCategory)}
                        />
                        {errors.customCategory && <p className="text-xs text-destructive mt-1">{errors.customCategory}</p>}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    ) : "Join the Waitlist"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    No spam. We only contact you when your city goes live.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
