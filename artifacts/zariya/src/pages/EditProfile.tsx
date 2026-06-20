import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PhotoUpload from "@/components/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, SERVICE_CATEGORIES, ServiceItem } from "@/types";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${hasError ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"} bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function EditProfile() {
  const [, navigate] = useLocation();
  const { currentUser, getProfileByUserId, updateProfile } = useApp();
  const profile = currentUser ? getProfileByUserId(currentUser.id) : undefined;

  const [form, setForm] = useState({
    name: "",
    category: "",
    customCategory: "",
    city: "Surat",
    area: "",
    phone: "",
    experience: "",
    description: "",
    tags: "",
    available: true,
    photos: [] as string[],
    services: [] as ServiceItem[],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        category: profile.category,
        city: profile.city,
        area: profile.area,
        phone: profile.phone,
        experience: profile.experience,
        description: profile.description,
        tags: profile.tags.join(", "),
        available: profile.available,
        photos: [...profile.photos],
        services: profile.services.map((s) => ({ ...s })),
      });
    }
  }, [profile?.id]);

  if (!profile) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">You haven't created a profile yet.</p>
          <button onClick={() => navigate("/app/profile/create")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
            Create Profile
          </button>
        </div>
      </AppLayout>
    );
  }

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const addService = () => set("services", [...form.services, { id: uid(), name: "", price: "", description: "" }]);
  const updateService = (id: string, k: keyof ServiceItem, v: string) =>
    set("services", form.services.map((s) => s.id === id ? { ...s, [k]: v } : s));
  const removeService = (id: string) => set("services", form.services.filter((s) => s.id !== id));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.category) e.category = "Category is required.";
    if (form.category === "__other__" && !form.customCategory.trim()) e.customCategory = "Please describe your category.";
    if (!form.area.trim()) e.area = "Area is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateProfile(profile.id, {
      name: form.name.trim(),
      category: form.category === "__other__" ? form.customCategory.trim() : form.category,
      city: form.city,
      area: form.area.trim(),
      phone: form.phone.trim(),
      experience: form.experience,
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      available: form.available,
      photos: form.photos,
      services: form.services.filter((s) => s.name.trim()),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const expOptions = ["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "More than 10 years"];

  return (
    <AppLayout hideFooter>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/app/profile/${profile.id}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-emerald-600 font-semibold"
            >
              ✓ Saved
            </motion.span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-7">Edit Profile</h1>

        <div className="space-y-6">
          {/* Basic */}
          <section className="p-6 rounded-2xl border border-border bg-card space-y-5">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Basic Information</h2>

            <Field label="Full Name" error={errors.name}>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Your name" className={inputCls(!!errors.name)} />
            </Field>

            <Field label="Service Category" error={errors.category || errors.customCategory}>
              <select value={form.category} onChange={(e) => { set("category", e.target.value); set("customCategory", ""); }} className={inputCls(!!errors.category)}>
                <option value="">Select category...</option>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__other__">Other (not listed)</option>
              </select>
              {form.category === "__other__" && (
                <input type="text" value={form.customCategory} onChange={(e) => set("customCategory", e.target.value)} placeholder="e.g. Flower Shop, Bike Mechanic..." className={`${inputCls(!!errors.customCategory)} mt-2`} />
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City" error={errors.city}>
                <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls()}>
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
              <Field label="Years of Experience">
                <select value={form.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls()}>
                  <option value="">Select...</option>
                  {expOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="About Yourself" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your work and specialisations..."
                rows={4}
                className={`${inputCls(!!errors.description)} resize-none`}
              />
            </Field>

            <Field label="Tags (comma separated)">
              <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)}
                placeholder="e.g. Wiring, Panel Repair, Emergency" className={inputCls()} />
            </Field>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
              <input
                type="checkbox"
                id="available-edit"
                checked={form.available}
                onChange={(e) => set("available", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="available-edit" className="text-sm font-medium text-foreground cursor-pointer">
                Available for new work
              </label>
            </div>
          </section>

          {/* Photos */}
          <section className="p-6 rounded-2xl border border-border bg-card">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-5">Work Photos</h2>
            <PhotoUpload photos={form.photos} onChange={(p) => set("photos", p)} label="Gallery" />
          </section>

          {/* Services */}
          <section className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Services & Pricing</h2>
              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/8 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Service
              </button>
            </div>
            <div className="space-y-3">
              {form.services.map((service, i) => (
                <div key={service.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Service {i + 1}</span>
                    <button type="button" onClick={() => removeService(service.id)}
                      className="p-1 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input type="text" value={service.name} onChange={(e) => updateService(service.id, "name", e.target.value)}
                    placeholder="Service name" className={inputCls()} />
                  <input type="text" value={service.price} onChange={(e) => updateService(service.id, "price", e.target.value)}
                    placeholder="Price (e.g. ₹500–₹800)" className={inputCls()} />
                  <input type="text" value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)}
                    placeholder="Short description" className={inputCls()} />
                </div>
              ))}
              {form.services.length === 0 && (
                <button
                  type="button"
                  onClick={addService}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm font-medium text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add your first service
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Save */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
          <button
            onClick={() => navigate(`/app/profile/${profile.id}`)}
            className="px-5 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
