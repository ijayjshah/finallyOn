import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PhotoUpload from "@/components/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, SERVICE_CATEGORIES } from "@/types";

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${hasError ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"} bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 transition-all`;
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function AddEditListing() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { currentUser, addListing, updateListing, listings } = useApp();

  const editId = params.id;
  const existing = editId ? listings.find((l) => l.id === editId) : undefined;
  const isEdit = !!existing;

  const [form, setForm] = useState({
    title: "",
    type: "service" as "service" | "product",
    category: "",
    description: "",
    price: "",
    city: currentUser?.city ?? "Surat",
    area: "",
    photos: [] as string[],
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        type: existing.type,
        category: existing.category,
        description: existing.description,
        price: existing.price,
        city: existing.city,
        area: existing.area,
        photos: [...existing.photos],
        active: existing.active,
      });
    }
  }, [editId]);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.category) e.category = "Category is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price.trim()) e.price = "Price is required.";
    if (!form.area.trim()) e.area = "Area is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !currentUser) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const data = {
      userId: currentUser.id,
      title: form.title.trim(),
      type: form.type,
      category: form.category,
      description: form.description.trim(),
      price: form.price.trim(),
      city: form.city,
      area: form.area.trim(),
      photos: form.photos,
      active: form.active,
    };

    if (isEdit && editId) {
      updateListing(editId, data);
    } else {
      addListing(data);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate("/app/listings"), 600);
  };

  return (
    <AppLayout hideFooter>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/app/listings")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            My Listings
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-emerald-600 font-semibold"
            >
              ✓ Saved
            </motion.span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-7">
          {isEdit ? "Edit Listing" : "Add New Listing"}
        </h1>

        <div className="space-y-5">
          {/* Type toggle */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Listing Type</label>
            <div className="flex gap-2">
              {(["service", "product"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("type", t)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-border"}`}
                >
                  {t === "service" ? "🔧 Service" : "📦 Product"}
                </button>
              ))}
            </div>
          </div>

          <Field label="Listing Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={form.type === "service" ? "e.g. Home Wiring & Electrical Repairs" : "e.g. Handmade Gujarati Pickles"}
              className={inputCls(!!errors.title)}
            />
          </Field>

          <Field label="Category" error={errors.category}>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls(!!errors.category)}>
              <option value="">Select a category...</option>
              {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe what you offer, what's included, and why customers should choose you..."
              rows={4}
              className={`${inputCls(!!errors.description)} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" error={errors.price} hint="e.g. ₹500, ₹200/hr, ₹1,000–₹5,000">
              <input
                type="text"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="₹ Price or range"
                className={inputCls(!!errors.price)}
              />
            </Field>
            <Field label="City">
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls()}>
                {GUJARAT_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Area / Locality" error={errors.area}>
            <input
              type="text"
              value={form.area}
              onChange={(e) => set("area", e.target.value)}
              placeholder="e.g. Athwa Lines, Surat"
              className={inputCls(!!errors.area)}
            />
          </Field>

          {/* Photos */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <PhotoUpload
              photos={form.photos}
              onChange={(p) => set("photos", p)}
              label="Listing Photos"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
            <input
              type="checkbox"
              id="listing-active"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="listing-active" className="text-sm font-medium text-foreground cursor-pointer">
              Make this listing active and visible to customers
            </label>
          </div>

          {/* Save */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Publish Listing"}</>
              )}
            </button>
            <button
              onClick={() => navigate("/app/listings")}
              className="px-5 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
