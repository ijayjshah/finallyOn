import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Briefcase, UserSearch } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, SERVICE_CATEGORIES, EMPLOYMENT_TYPES } from "@/types";

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

export default function AddEditJob() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { currentUser, addJob, updateJob, jobs } = useApp();

  const editId = params.id;
  const existing = editId ? jobs.find((j) => j.id === editId) : undefined;
  const isEdit = !!existing;

  const [form, setForm] = useState({
    listingType: "opening" as "opening" | "seeker",
    title: "",
    category: "",
    city: currentUser?.city ?? "Surat",
    area: "",
    description: "",
    salary: "",
    employmentType: "Full-time",
    experience: "",
    contact: currentUser?.phone ?? "",
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        listingType: existing.listingType,
        title: existing.title,
        category: existing.category,
        city: existing.city,
        area: existing.area,
        description: existing.description,
        salary: existing.salary,
        employmentType: existing.employmentType,
        experience: existing.experience,
        contact: existing.contact,
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
    if (!form.area.trim()) e.area = "Area is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.salary.trim()) e.salary = "Salary / expected pay is required.";
    if (!form.contact.trim()) e.contact = "Contact number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !currentUser) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const data = {
      userId: currentUser.id,
      posterName: currentUser.name,
      listingType: form.listingType,
      title: form.title.trim(),
      category: form.category,
      city: form.city,
      area: form.area.trim(),
      description: form.description.trim(),
      salary: form.salary.trim(),
      employmentType: form.employmentType,
      experience: form.experience.trim(),
      contact: form.contact.trim(),
      active: form.active,
    };

    if (isEdit && editId) {
      updateJob(editId, data);
    } else {
      addJob(data);
    }

    setSaving(false);
    setDone(true);
    setTimeout(() => navigate("/app/jobs"), 600);
  };

  const isOpening = form.listingType === "opening";

  return (
    <AppLayout hideFooter>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/app/jobs")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Jobs Board
          </button>
          {done && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-600 font-semibold">
              ✓ Posted
            </motion.span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          {isEdit ? "Edit Job Post" : "Post to Jobs Board"}
        </h1>
        <p className="text-sm text-muted-foreground mb-7">Free to post — visible to everyone on Foundwork.</p>

        <div className="space-y-5">
          {/* Listing type */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => set("listingType", "opening")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  form.listingType === "opening"
                    ? "border-primary bg-primary/8 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold text-sm">Employer / Business</div>
                  <div className="text-xs opacity-70 mt-0.5">I want to hire someone</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => set("listingType", "seeker")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  form.listingType === "seeker"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                }`}
              >
                <UserSearch className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-bold text-sm">Worker / Job Seeker</div>
                  <div className="text-xs opacity-70 mt-0.5">I'm looking for work</div>
                </div>
              </button>
            </div>
          </div>

          <Field
            label={isOpening ? "Job Title" : "Role You're Looking For"}
            error={errors.title}
            hint={isOpening ? "e.g. Electrician Required for Residential Work" : "e.g. Experienced Plumber – Looking for Full-time Work"}
          >
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={isOpening ? "e.g. Electrician Required" : "e.g. Experienced Plumber — Open to Work"}
              className={inputCls(!!errors.title)}
            />
          </Field>

          <Field label="Category / Trade" error={errors.category}>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls(!!errors.category)}>
              <option value="">Select category...</option>
              {SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="City">
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls()}>
                {GUJARAT_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Area / Locality" error={errors.area}>
              <input
                type="text"
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
                placeholder="e.g. Adajan"
                className={inputCls(!!errors.area)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Employment Type">
              <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputCls()}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field
              label={isOpening ? "Experience Required" : "Your Experience"}
              hint="e.g. 2+ years, 5 years, Fresher OK"
            >
              <input
                type="text"
                value={form.experience}
                onChange={(e) => set("experience", e.target.value)}
                placeholder="e.g. 3+ years"
                className={inputCls()}
              />
            </Field>
          </div>

          <Field
            label={isOpening ? "Salary Offered" : "Expected Salary"}
            error={errors.salary}
            hint="e.g. ₹15,000–₹22,000/month or ₹800/day"
          >
            <input
              type="text"
              value={form.salary}
              onChange={(e) => set("salary", e.target.value)}
              placeholder="₹ Salary range"
              className={inputCls(!!errors.salary)}
            />
          </Field>

          <Field
            label={isOpening ? "Job Description" : "About You"}
            error={errors.description}
          >
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={
                isOpening
                  ? "Describe the role, responsibilities, working hours, and what you expect from candidates..."
                  : "Describe your skills, experience, what kind of work you're looking for, and your availability..."
              }
              rows={5}
              className={`${inputCls(!!errors.description)} resize-none`}
            />
          </Field>

          <Field label="Contact Number" error={errors.contact} hint="This will be shown to interested parties.">
            <input
              type="tel"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
              placeholder="+91 98765 43210"
              className={inputCls(!!errors.contact)}
            />
          </Field>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
            <input
              type="checkbox"
              id="job-active"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="job-active" className="text-sm font-medium text-foreground cursor-pointer">
              Make this post active and visible on the Jobs Board
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Post to Jobs Board"}</>
              )}
            </button>
            <button
              onClick={() => navigate("/app/jobs")}
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
