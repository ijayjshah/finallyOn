import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2,
  Users, Wrench, Store, ChevronDown, Instagram, Globe,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NAVSARI_AREAS, BRAND, UserType, SERVICE_PROVIDER_CATEGORIES, BUSINESS_CATEGORIES } from "@/types";

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

const ROLES: {
  value: UserType;
  label: string;
  sublabel: string;
  desc: string;
  icon: typeof Wrench;
  color: string;
  bg: string;
}[] = [
  {
    value: "user",
    label: "Just Browsing",
    sublabel: "User / Explorer",
    desc: "I want to find local services, businesses, or jobs — no listing needed.",
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    sublabel: "Electrician · Tutor · Beautician · etc.",
    desc: "I offer a skill or service and want to get found by local customers.",
    icon: Wrench,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
  },
  {
    value: "business_owner",
    label: "Business Owner",
    sublabel: "Shop · Restaurant · Clinic · Store · etc.",
    desc: "I own a physical shop or business and want to be listed on the platform.",
    icon: Store,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
];

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    type: "user" as UserType,
    serviceCategory: "",
    customCategory: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsappNumber: "",
    instagramUrl: "",
    websiteUrl: "",
    city: "Navsari City",
    district: "Navsari",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const categoryList =
    form.type === "service_provider"
      ? SERVICE_PROVIDER_CATEGORIES
      : form.type === "business_owner"
      ? BUSINESS_CATEGORIES
      : [];

  const selectedRole = ROLES.find((r) => r.value === form.type)!;

  const validateStep1 = () => form.type !== undefined;

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if ((form.type === "service_provider" || form.type === "business_owner") && !form.serviceCategory)
      e.serviceCategory = "Please select your category.";
    if (form.serviceCategory === "__other__" && !form.customCategory.trim())
      e.customCategory = "Please describe your service / business type.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    const finalCategory =
      form.serviceCategory === "__other__" ? form.customCategory.trim() : form.serviceCategory;
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      whatsappNumber: form.whatsappNumber.trim() || form.phone.trim().replace(/\D/g, ""),
      type: form.type,
      serviceCategory: finalCategory || undefined,
      city: form.city,
      district: "Navsari",
      instagramUrl: form.instagramUrl.trim() || undefined,
      websiteUrl: form.websiteUrl.trim() || undefined,
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
          onClick={() => (step === 2 ? setStep(1) : navigate("/"))}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 2 ? "Back to role selection" : `Back to ${BRAND.name}`}
        </button>

        <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
          <Logo />

          {/* Step indicator */}
          <div className="flex items-center gap-2 justify-center mb-5">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-xl font-extrabold text-foreground text-center mb-1">Who are you?</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  This helps us personalise your experience on {BRAND.name}
                </p>

                <div className="space-y-3">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const active = form.type === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => set("type", role.value)}
                        className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all text-left ${
                          active
                            ? `border-primary bg-primary/5`
                            : "border-border hover:border-muted-foreground/40 bg-background"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-primary/10" : "bg-muted"}`}>
                          <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-extrabold leading-tight ${active ? "text-primary" : "text-foreground"}`}>
                            {role.label}
                          </div>
                          <div className="text-[11px] font-semibold text-muted-foreground mt-0.5 mb-1">{role.sublabel}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">{role.desc}</div>
                        </div>
                        {active && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-xl font-extrabold text-foreground text-center mb-1">Create your account</h1>
                  <p className="text-sm text-muted-foreground text-center mb-1">
                    Joining as <span className="font-bold text-primary">{selectedRole.label}</span>
                  </p>
                  <p className="text-xs text-muted-foreground text-center mb-4">
                    Currently available in <span className="font-semibold text-primary">Navsari, Gujarat</span>
                  </p>
                </div>

                {/* Category picker — only for service_provider and business_owner */}
                {(form.type === "service_provider" || form.type === "business_owner") && (
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">
                      {form.type === "service_provider" ? "Your main service" : "Type of business"}
                    </label>
                    <div className="relative">
                      <select
                        value={form.serviceCategory}
                        onChange={(e) => {
                          set("serviceCategory", e.target.value);
                          set("customCategory", "");
                        }}
                        className={`${inputCls("serviceCategory")} appearance-none pr-10`}
                      >
                        <option value="">
                          — Select {form.type === "service_provider" ? "your service" : "business type"} —
                        </option>
                        {categoryList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="__other__">Other (not in the list)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.serviceCategory && <p className="text-xs text-destructive mt-1">{errors.serviceCategory}</p>}

                    {form.serviceCategory === "__other__" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={form.customCategory}
                          onChange={(e) => set("customCategory", e.target.value)}
                          placeholder={form.type === "service_provider" ? "e.g. Bike Mechanic, Astrologer..." : "e.g. Flower Shop, Photo Studio..."}
                          className={inputCls("customCategory")}
                        />
                        {errors.customCategory && <p className="text-xs text-destructive mt-1">{errors.customCategory}</p>}
                      </div>
                    )}
                  </div>
                )}

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

                {(form.type === "service_provider" || form.type === "business_owner") && (
                  <>
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

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5" />
                        Instagram profile
                      </span>{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.instagramUrl}
                      onChange={(e) => set("instagramUrl", e.target.value)}
                      placeholder="@yourpage or instagram.com/yourpage"
                      className={inputCls("instagramUrl")}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        Website link
                      </span>{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={form.websiteUrl}
                      onChange={(e) => set("websiteUrl", e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className={inputCls("websiteUrl")}
                    />
                  </div>
                  </>
                )}

                {/* District — locked */}
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
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          Powered by{" "}
          <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            AttachToTech
          </a>
        </p>
      </motion.div>
    </div>
  );
}
