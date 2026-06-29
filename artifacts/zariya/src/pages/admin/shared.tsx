import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export type StatusFilter = "all" | "pending" | "approved" | "rejected";

export type AdminStats = {
  users: number;
  profiles: number;
  listings: number;
  jobs: number;
  waitlist: number;
  pendingProfiles: number;
  pendingListings: number;
  pendingJobs: number;
};

export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    active: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-extrabold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-amber-600 font-semibold mt-1">{sub}</div>}
    </div>
  );
}

export function ActionBtns({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
  return (
    <div className="flex gap-1.5">
      <button onClick={onApprove} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200 transition-colors">
        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
      </button>
      <button onClick={onReject} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200 transition-colors">
        <XCircle className="w-3.5 h-3.5" /> Reject
      </button>
    </div>
  );
}

type ProfileActionBannerProps = {
  variant: "approving" | "rejecting" | "card-generating" | "card-ready";
  profileName?: string;
};

export function ProfileActionBanner({ variant, profileName }: ProfileActionBannerProps) {
  if (variant === "approving") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
        <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-foreground">Approving profile…</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please wait — do not click Approve again.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "rejecting") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50/80">
        <Loader2 className="w-5 h-5 text-red-600 animate-spin flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-foreground">Rejecting profile…</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait — do not click again.</p>
        </div>
      </div>
    );
  }

  if (variant === "card-generating") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/90">
        <Loader2 className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-foreground">
            {profileName ? `${profileName} is approved` : "Profile approved"}
          </p>
          <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
            Generating the digital business card now. This usually takes 30–60 seconds.
            You can review other profiles — the download link will appear here when ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50/90">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-foreground">Business card ready</p>
        <p className="text-xs text-muted-foreground mt-1">
          The trust card was generated successfully. Use Download card below.
        </p>
      </div>
    </div>
  );
}

export const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

export function getMapEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  } catch {}
  return null;
}

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Overview", path: "/app/admin/overview" },
  { id: "users", label: "Users", path: "/app/admin/users" },
  { id: "profiles", label: "Profiles", path: "/app/admin/profiles" },
  { id: "listings", label: "Listings", path: "/app/admin/listings" },
  { id: "jobs", label: "Jobs", path: "/app/admin/jobs" },
  { id: "waitlist", label: "Waitlist", path: "/app/admin/waitlist" },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];
