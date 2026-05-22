import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NAVSARI_AREAS, BRAND, UserType } from "@/types";

const Logo = () => (
  <div className="flex items-center gap-2 justify-center mb-2">
    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="5" cy="5" r="2.5" fill="white" />
        <circle cx="15" cy="5" r="2.5" fill="white" opacity="0.6" />
        <circle cx="5" cy="15" r="2.5" fill="white" opacity="0.6" />
        <circle cx="15" cy="15" r="2.5" fill="white" />
        <circle cx="10" cy="10" r="2" fill="white" opacity="0.85" />
      </svg>
    </div>
    <span className="font-extrabold text-xl text-foreground">{BRAND.name}</span>
  </div>
);

const USER_TYPES: { value: UserType; label: string; desc: string; icon: string }[] = [
  { value: "business", label: "Business / Service Provider", desc: "I want to list my shop or skills", icon: "🏪" },
  { value: "customer", label: "Customer / Explorer", desc: "I want to find local businesses", icon: "🔍" },
  { value: "worker", label: "Job Seeker", desc: "I'm looking for work opportunities", icon: "💼" },
];

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsappNumber: "",
    type: "business" as UserType,
    city: "Navsari",
    district: "Navsari",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      whatsappNumber: form.whatsappNumber.trim() || form.phone.trim().replace(/\D/g, ""),
      type: form.type,
      city: form.city,
      district: "Navsari",
    });
    setLoading(false);
    if (result.success) {
      navigate("/app/dashboard");
    } else {
      setErrors({ email: result.error ?? "Registration failed." });
    }
  };

  const inputCls = (k: string) =>
    `w-full px-4 py-3 rounded-xl border ${errors[k] ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"} bg-background text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {BRAND.name}
        </button>

        <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
          <Logo />
          <h1 className="text-xl font-extrabold text-foreground text-center mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Currently available in <span className="font-semibold text-primary">Navsari, Gujarat</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account type */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">I am a...</label>
              <div className="space-y-2">
                {USER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("type", t.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      form.type === t.value
                        ? "border-primary bg-primary/8"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${form.type === t.value ? "text-primary" : "text-foreground"}`}>{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </div>
                    {form.type === t.value && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Full name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inputCls("name")} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls("email")} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Phone number</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls("phone")} />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                WhatsApp number <span className="text-muted-foreground font-normal">(optional, for bookings)</span>
              </label>
              <input
                type="tel"
                value={form.whatsappNumber}
                onChange={(e) => set("whatsappNumber", e.target.value)}
                placeholder="Same as phone or different WhatsApp number"
                className={inputCls("whatsappNumber")}
              />
            </div>

            {/* District — locked to Navsari for now */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">District</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/40">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Navsari</span>
                <span className="text-xs text-muted-foreground ml-1">— Currently serving Navsari only</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Your area in Navsari</label>
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls("city")}>
                {NAVSARI_AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`${inputCls("password")} pr-11`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          Not a physical shop?{" "}
          <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Contact attachtotech.xyz
          </a>{" "}
          for digital setup and marketing support.
        </p>
      </motion.div>
    </div>
  );
}
