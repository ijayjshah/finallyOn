import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PhotoUpload from "@/components/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, SERVICE_CATEGORIES, ServiceItem } from "@/types";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const STEPS = ["Basic Info", "Work Photos", "Services", "Review"];

export default function CreateProfile() {
  const [, navigate] = useLocation();
  const { currentUser, createProfile, getProfileByUserId } = useApp();

  const existingProfile = currentUser ? getProfileByUserId(currentUser.id) : undefined;
  if (existingProfile) {
    navigate(`/app/profile/${existingProfile.id}`);
    return null;
  }

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    category: "",
    city: currentUser?.city ?? "Surat",
    area: "",
    phone: currentUser?.phone ?? "",
    experience: "",
    description: "",
    tags: "",
    available: true,
    photos: [] as string[],
    services: [] as ServiceItem[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const addService = () => {
    set("services", [...form.services, { id: uid(), name: "", price: "", description: "" }]);
  };

  const updateService = (id: string, k: keyof ServiceItem, v: string) => {
    set("services", form.services.map((s) => s.id === id ? { ...s, [k]: v } : s));
  };

  const removeService = (id: string) => {
    set("services", form.services.filter((s) => s.id !== id));
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required.";
      if (!form.category) e.category = "Select a category.";
      if (!form.city) e.city = "Select your city.";
      if (!form.area.trim()) e.area = "Area/locality is required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.experience) e.experience = "Experience is required.";
      if (!form.description.trim()) e.description = "Write a short bio.";
    }
    if (step === 1) {
      if (form.photos.length === 0) e.photos = "Upload at least 1 photo.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const profile = createProfile({
      userId: currentUser.id,
      name: form.name.trim(),
      category: form.category,
      city: form.city,
      area: form.area.trim(),
      phone: form.phone.trim(),
      experience: form.experience,
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      available: form.available,
      photos: form.photos,
      services: form.services.filter((s) => s.name.trim()),
      rating: 0,
      reviewCount: 0,
      verified: false,
    });
    setSubmitting(false);
    navigate(`/app/profile/${profile.id}`);
  };

  const expOptions = ["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "More than 10 years"];

  return (
    <AppLayout hideFooter>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/app/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-[10px] font-semibold ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Tell customers who you are and what you do.</p>
              </div>

              <Field label="Full Name" error={errors.name}>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name" className={inputCls(!!errors.name)} />
              </Field>

              <Field label="Service Category" error={errors.category}>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls(!!errors.category)}>
                  <option value="">Select your category...</option>
                  {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={errors.city}>
                  <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls(!!errors.city)}>
                    {GUJARAT_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Area / Locality" error={errors.area}>
                  <input type="text" value={form.area} onChange={(e) => set("area", e.target.value)}
                    placeholder="e.g. Athwa Lines" className={inputCls(!!errors.area)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number" error={errors.phone}>
                  <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
                </Field>
                <Field label="Years of Experience" error={errors.experience}>
                  <select value={form.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls(!!errors.experience)}>
                    <option value="">Select...</option>
                    {expOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="About Yourself" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Write 2–3 sentences about your work, specialisations, and experience..."
                  rows={4}
                  className={`${inputCls(!!errors.description)} resize-none`}
                />
              </Field>

              <Field label="Tags (comma separated)" error={errors.tags}>
                <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)}
                  placeholder="e.g. Wiring, Panel Repair, Emergency, Residential"
                  className={inputCls(false)} />
                <p className="text-xs text-muted-foreground mt-1">Tags help customers find you in search.</p>
              </Field>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) => set("available", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="available" className="text-sm font-medium text-foreground cursor-pointer">
                  I am currently available for new work
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Photos */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Work Photos</h2>
                <p className="text-sm text-muted-foreground">Upload photos of your best work. Up to 5 photos. The first photo will be your cover image.</p>
              </div>
              <PhotoUpload photos={form.photos} onChange={(p) => set("photos", p)} label="Work Gallery" />
              {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Your Services</h2>
                <p className="text-sm text-muted-foreground">List the services you offer with pricing. You can always add more later.</p>
              </div>
              <div className="space-y-3">
                {form.services.map((service, i) => (
                  <div key={service.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service {i + 1}</span>
                      <button type="button" onClick={() => removeService(service.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input type="text" value={service.name} onChange={(e) => updateService(service.id, "name", e.target.value)}
                      placeholder="Service name (e.g. Home Wiring)" className={inputCls(false)} />
                    <input type="text" value={service.price} onChange={(e) => updateService(service.id, "price", e.target.value)}
                      placeholder="Price (e.g. ₹500–₹800 or ₹150/hr)" className={inputCls(false)} />
                    <input type="text" value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)}
                      placeholder="Short description" className={inputCls(false)} />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm font-semibold text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>
              <p className="text-xs text-muted-foreground">You can skip this step and add services later from your profile.</p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Review & Publish</h2>
                <p className="text-sm text-muted-foreground">Check everything looks good, then publish your profile.</p>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <Row label="Name" value={form.name} />
                <Row label="Category" value={form.category} />
                <Row label="Location" value={`${form.area}, ${form.city}`} />
                <Row label="Phone" value={form.phone} />
                <Row label="Experience" value={form.experience} />
                <Row label="Photos" value={`${form.photos.length} uploaded`} />
                <Row label="Services" value={`${form.services.filter((s) => s.name).length} listed`} />
                <Row label="Available" value={form.available ? "Yes" : "No"} />
              </div>

              {form.photos.length > 0 && (
                <div className="flex gap-2">
                  {form.photos.map((p, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-sm text-emerald-700 font-medium">
                  ✓ Your profile will go live immediately in {form.city}. Customers searching for {form.category} nearby will find you.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>Publish Profile <CheckCircle2 className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-foreground text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border ${hasError ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/20"} bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;
}
