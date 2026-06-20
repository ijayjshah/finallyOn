import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Clock, Truck, Store, MessageCircle, Package } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PhotoUpload from "@/components/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { NAVSARI_AREAS, SERVICE_CATEGORIES, PRODUCT_MAX } from "@/types";

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

  // Count user's product listings
  const userProductListings = listings.filter((l) => l.userId === currentUser?.id && l.type === "product");
  const canAddProduct = isEdit || userProductListings.length < PRODUCT_MAX;

  const [form, setForm] = useState({
    title: "",
    type: "service" as "service" | "product",
    category: "",
    customCategory: "",
    subCategory: "",
    description: "",
    price: "",
    area: currentUser?.city ?? "Navsari City",
    photos: [] as string[],
    active: true,
    deliveryAvailable: false,
    pickupAvailable: false,
    whatsappNumber: currentUser?.whatsappNumber ?? "",
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
        subCategory: existing.subCategory ?? "",
        description: existing.description,
        price: existing.price,
        area: existing.area,
        photos: [...existing.photos],
        active: existing.active,
        deliveryAvailable: existing.deliveryAvailable ?? false,
        pickupAvailable: existing.pickupAvailable ?? false,
        whatsappNumber: existing.whatsappNumber ?? currentUser?.whatsappNumber ?? "",
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
    if (form.category === "__other__" && !form.customCategory.trim()) e.customCategory = "Please describe your category.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price.trim()) e.price = "Price is required.";
    if (!form.area.trim()) e.area = "Area is required.";
    if (form.type === "product" && form.photos.length === 0) e.photos = "Product listings require at least 1 photo.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !currentUser) return;
    if (form.type === "product" && !canAddProduct) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const data = {
      userId: currentUser.id,
      title: form.title.trim(),
      type: form.type,
      category: form.category === "__other__" ? form.customCategory.trim() : form.category,
      subCategory: form.subCategory.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      city: "Navsari",
      area: form.area.trim(),
      district: "Navsari",
      photos: form.photos,
      active: form.active,
      deliveryAvailable: form.deliveryAvailable,
      pickupAvailable: form.pickupAvailable,
      whatsappNumber: form.whatsappNumber.trim(),
      approvalStatus: (isEdit ? existing?.approvalStatus : "pending") as "pending" | "approved" | "rejected",
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
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-600 font-semibold">
              ✓ Saved — pending admin review
            </motion.span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          {isEdit ? "Edit Listing" : "Add New Listing"}
        </h1>
        <p className="text-sm text-muted-foreground mb-7">
          All new listings go to admin review before becoming visible to customers.
        </p>

        {/* Pending review notice */}
        {!isEdit && (
          <div className="mb-5 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-800 mb-0.5">Admin Approval Required</div>
              <p className="text-xs text-amber-700">Your listing will be visible to customers only after our team approves it. This takes up to 24 hours.</p>
            </div>
          </div>
        )}

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
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {t === "service" ? "🔧 Service" : "📦 Product"}
                </button>
              ))}
            </div>
            {form.type === "product" && !canAddProduct && (
              <div className="mt-2 p-3 rounded-xl border border-destructive/30 bg-destructive/8 text-xs text-destructive">
                <Package className="w-3.5 h-3.5 inline mr-1" />
                You've reached the maximum of {PRODUCT_MAX} products per account. Delete an existing product to add a new one.
              </div>
            )}
            {form.type === "product" && canAddProduct && (
              <p className="text-xs text-muted-foreground mt-1.5">
                You have {userProductListings.length}/{PRODUCT_MAX} product listings used.
              </p>
            )}
          </div>

          <Field label="Listing Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={form.type === "service" ? "e.g. Home Wiring & Electrical Repairs" : "e.g. 22K Gold Necklace Set"}
              className={inputCls(!!errors.title)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category || errors.customCategory}>
              <select value={form.category} onChange={(e) => { set("category", e.target.value); set("customCategory", ""); }} className={inputCls(!!errors.category)}>
                <option value="">Select category...</option>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__other__">Other (not listed)</option>
              </select>
              {form.category === "__other__" && (
                <input type="text" value={form.customCategory} onChange={(e) => set("customCategory", e.target.value)} placeholder="e.g. Flower Shop, Bike Mechanic..." className={`${inputCls(!!errors.customCategory)} mt-2`} />
              )}
            </Field>
            <Field label="Sub-category / Type" hint="e.g. Gold, Bridal, Veg, Kids">
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) => set("subCategory", e.target.value)}
                placeholder="e.g. Gold, Bridal, Veg"
                className={inputCls(false)}
              />
            </Field>
          </div>

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
            <Field label="Area in Navsari" error={errors.area}>
              <select value={form.area} onChange={(e) => set("area", e.target.value)} className={inputCls(!!errors.area)}>
                {NAVSARI_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>

          {/* WhatsApp */}
          <Field label="WhatsApp Number for Inquiries" hint="Customers will message you on WhatsApp for this listing.">
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25D366]" />
              <input
                type="tel"
                value={form.whatsappNumber}
                onChange={(e) => set("whatsappNumber", e.target.value)}
                placeholder="91XXXXXXXXXX"
                className={`${inputCls(false)} pl-9`}
              />
            </div>
          </Field>

          {/* Delivery / Pickup */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Delivery & Pickup Options</label>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <label htmlFor="delivery" className="text-sm font-medium text-foreground cursor-pointer">Home delivery available</label>
                  <div className="text-xs text-muted-foreground">I deliver to customers at their location</div>
                </div>
                <input type="checkbox" id="delivery" checked={form.deliveryAvailable} onChange={(e) => set("deliveryAvailable", e.target.checked)} className="w-4 h-4 accent-primary" />
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Store className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <label htmlFor="pickup" className="text-sm font-medium text-foreground cursor-pointer">Shop pickup available</label>
                  <div className="text-xs text-muted-foreground">Customers can visit my shop and pick up</div>
                </div>
                <input type="checkbox" id="pickup" checked={form.pickupAvailable} onChange={(e) => set("pickupAvailable", e.target.checked)} className="w-4 h-4 accent-primary" />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <PhotoUpload photos={form.photos} onChange={(p) => set("photos", p)} label={form.type === "product" ? "Product Photos (Required)" : "Listing Photos"} />
            {errors.photos && <p className="text-xs text-destructive mt-2">{errors.photos}</p>}
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
            <input type="checkbox" id="listing-active" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-primary" />
            <label htmlFor="listing-active" className="text-sm font-medium text-foreground cursor-pointer">
              Make this listing active (visible after approval)
            </label>
          </div>

          {/* Save */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              disabled={saving || (form.type === "product" && !canAddProduct)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Submit for Approval"}</>
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
