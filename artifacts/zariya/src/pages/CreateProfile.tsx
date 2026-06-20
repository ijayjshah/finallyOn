import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2, MapPin, MessageCircle, Clock, Upload } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PhotoUpload from "@/components/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { NAVSARI_AREAS, SERVICE_CATEGORIES, ServiceItem } from "@/types";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${hasError ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/20"} bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
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

const STEPS = ["Basic Info", "Location & Contact", "Work Photos", "Services", "Review"];

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
    customCategory: "",
    area: currentUser?.city ?? "Navsari City",
    phone: currentUser?.phone ?? "",
    whatsappNumber: currentUser?.whatsappNumber ?? "",
    mapUrl: "",
    experience: "",
    description: "",
    tags: "",
    available: true,
    deliveryAvailable: false,
    pickupAvailable: false,
    photos: [] as string[],
    services: [] as ServiceItem[],
    resumeNote: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const addService = () => set("services", [...form.services, { id: uid(), name: "", price: "", description: "" }]);
  const updateService = (id: string, k: keyof ServiceItem, v: string) =>
    set("services", form.services.map((s) => s.id === id ? { ...s, [k]: v } : s));
  const removeService = (id: string) =>
    set("services", form.services.filter((s) => s.id !== id));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required.";
      if (!form.category) e.category = "Select a category.";
      if (form.category === "__other__" && !form.customCategory.trim()) e.customCategory = "Please describe your category.";
      if (!form.area) e.area = "Select your area.";
      if (!form.experience) e.experience = "Select experience level.";
      if (!form.description.trim()) e.description = "Write a short bio.";
    }
    if (step === 1) {
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.mapUrl.trim()) e.mapUrl = "Google Maps location is required — this is mandatory.";
      if (!form.whatsappNumber.trim()) e.whatsappNumber = "WhatsApp number is required.";
    }
    if (step === 2) {
      if (form.photos.length === 0) e.photos = "Upload at least 1 work photo.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!currentUser) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    createProfile({
      userId: currentUser.id,
      name: form.name.trim(),
      category: form.category === "__other__" ? form.customCategory.trim() : form.category,
      city: "Navsari",
      area: form.area,
      district: "Navsari",
      phone: form.phone.trim(),
      whatsappNumber: form.whatsappNumber.trim(),
      mapUrl: form.mapUrl.trim(),
      experience: form.experience,
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      available: form.available,
      deliveryAvailable: form.deliveryAvailable,
      pickupAvailable: form.pickupAvailable,
      photos: form.photos,
      services: form.services.filter((s) => s.name.trim()),
      rating: 0,
      reviewCount: 0,
      verified: false,
      approvalStatus: "pending",
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const expOptions = ["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "More than 10 years"];

  if (submitted) {
    return (
      <AppLayout hideFooter>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-3">Profile submitted for review</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our admin team will verify your Google Maps location, photos, and details.
              This usually takes within <strong>24 hours</strong>.
              You'll be able to see the status in your dashboard.
            </p>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-700 text-left mb-6">
              <strong>While pending:</strong> Your profile is not visible to customers. Once approved, it goes live instantly and appears in Navsari search results.
            </div>
            <button
              onClick={() => navigate("/app/dashboard")}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

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
              <span key={s} className={`text-[10px] font-semibold ${i === step ? "text-primary" : "text-muted-foreground"} hidden sm:block`}>
                {s}
              </span>
            ))}
          </div>
          <div className="sm:hidden mt-1 text-sm font-semibold text-primary">{STEPS[step]} ({step + 1}/{STEPS.length})</div>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Tell customers who you are and what you do.</p>
              </div>

              <Field label="Full Name" error={errors.name}>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inputCls(!!errors.name)} />
              </Field>

              <Field label="Service Category" error={errors.category || errors.customCategory}>
                <select value={form.category} onChange={(e) => { set("category", e.target.value); set("customCategory", ""); }} className={inputCls(!!errors.category)}>
                  <option value="">Select your category...</option>
                  {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="__other__">Other (not listed)</option>
                </select>
                {form.category === "__other__" && (
                  <input type="text" value={form.customCategory} onChange={(e) => set("customCategory", e.target.value)} placeholder="e.g. Flower Shop, Bike Mechanic, Dance Studio..." className={`${inputCls(!!errors.customCategory)} mt-2`} />
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Area in Navsari" error={errors.area}>
                  <select value={form.area} onChange={(e) => set("area", e.target.value)} className={inputCls(!!errors.area)}>
                    {NAVSARI_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
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

              <Field label="Tags (comma separated)" hint="Tags help customers find you. e.g. Wiring, Emergency, Residential">
                <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. Wiring, Panel Repair, Emergency" className={inputCls(false)} />
              </Field>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label htmlFor="available" className="text-sm font-medium text-foreground cursor-pointer">I am currently available for new work</label>
              </div>
            </div>
          )}

          {/* Step 1: Location & Contact */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Location & Contact</h2>
                <p className="text-sm text-muted-foreground">These are required for admin approval and customer contact.</p>
              </div>

              <Field label="Phone Number" error={errors.phone}>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
              </Field>

              <Field label="WhatsApp Number" error={errors.whatsappNumber} hint="Customers will use this to book or inquire via WhatsApp.">
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25D366]" />
                  <input
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={(e) => set("whatsappNumber", e.target.value)}
                    placeholder="91XXXXXXXXXX (with country code, no +)"
                    className={`${inputCls(!!errors.whatsappNumber)} pl-9`}
                  />
                </div>
              </Field>

              <div className="p-4 rounded-xl border-2 border-primary/25 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">Google Maps Location — Mandatory</span>
                </div>
                <Field label="Google Maps Shop URL" error={errors.mapUrl} hint="Paste the Google Maps link to your shop/work location. Required for admin approval.">
                  <input
                    type="url"
                    value={form.mapUrl}
                    onChange={(e) => set("mapUrl", e.target.value)}
                    placeholder="https://maps.google.com/?q=your+shop+name"
                    className={inputCls(!!errors.mapUrl)}
                  />
                </Field>
                <p className="text-xs text-primary/60 mt-2">
                  Don't have a Maps listing? Open Google Maps, find your location, and copy the share URL.
                  For online-only businesses, contact{" "}
                  <a href="https://attachtotech.xyz" target="_blank" rel="noopener noreferrer" className="underline">attachtotech.xyz</a>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-foreground">Resume (Required for Service/Job Providers)</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  If you're listing yourself for a service or job, a resume is mandatory for admin approval. Upload yours via email or contact us:
                </p>
                <Field label="Resume note / link" hint="Paste a Google Drive link, or note 'Will send via email to support@finallyon.in'">
                  <input
                    type="text"
                    value={form.resumeNote}
                    onChange={(e) => set("resumeNote", e.target.value)}
                    placeholder="Google Drive link or note"
                    className={inputCls(false)}
                  />
                </Field>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground block">Service Options</label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                  <input type="checkbox" id="delivery" checked={form.deliveryAvailable} onChange={(e) => set("deliveryAvailable", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="delivery" className="text-sm font-medium text-foreground cursor-pointer">I offer home delivery / on-site visits</label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                  <input type="checkbox" id="pickup" checked={form.pickupAvailable} onChange={(e) => set("pickupAvailable", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <label htmlFor="pickup" className="text-sm font-medium text-foreground cursor-pointer">Customers can visit my shop / pickup available</label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Work Photos</h2>
                <p className="text-sm text-muted-foreground">Upload real photos of your work. At least 1 required. Up to 5 photos.</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-700">
                ⚠️ Do not upload stock photos or images from the internet. Admin will reject listings with non-genuine photos.
              </div>
              <PhotoUpload photos={form.photos} onChange={(p) => set("photos", p)} label="Work Gallery" />
              {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
            </div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Your Services</h2>
                <p className="text-sm text-muted-foreground">List the services you offer with pricing. You can skip this and add later.</p>
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
                    <input type="text" value={service.name} onChange={(e) => updateService(service.id, "name", e.target.value)} placeholder="Service name (e.g. Home Wiring)" className={inputCls(false)} />
                    <input type="text" value={service.price} onChange={(e) => updateService(service.id, "price", e.target.value)} placeholder="Price (e.g. ₹500–₹800 or ₹150/hr)" className={inputCls(false)} />
                    <input type="text" value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)} placeholder="Short description" className={inputCls(false)} />
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
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">Review & Submit</h2>
                <p className="text-sm text-muted-foreground">Review your details. After submission, admin will verify and approve within 24 hours.</p>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                <Row label="Name" value={form.name} />
                <Row label="Category" value={form.category} />
                <Row label="Area" value={`${form.area}, Navsari`} />
                <Row label="Phone" value={form.phone} />
                <Row label="WhatsApp" value={form.whatsappNumber} />
                <Row label="Google Maps" value={form.mapUrl ? "✓ Added" : "⚠️ Missing"} />
                <Row label="Experience" value={form.experience} />
                <Row label="Photos" value={`${form.photos.length} uploaded`} />
                <Row label="Services" value={`${form.services.filter((s) => s.name).length} listed`} />
                <Row label="Delivery" value={form.deliveryAvailable ? "Yes" : "No"} />
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

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-700 font-semibold mb-1">Admin review before going live</p>
                    <p className="text-xs text-amber-600">
                      After submission, your profile goes to admin review. Only approved profiles are visible to customers.
                      We verify your Google Maps location, photos, and details within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {!form.mapUrl && (
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/8 text-sm text-destructive">
                  ⚠️ Google Maps location is missing. Go back to Step 2 and add it — your profile cannot be approved without it.
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Nav buttons */}
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
              disabled={submitting || !form.mapUrl}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>Submit for Review <CheckCircle2 className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
