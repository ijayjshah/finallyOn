import { CheckCircle2, XCircle } from "lucide-react";

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
