import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Users, User, Package, Briefcase, FileText, Clock, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useEnsureData } from "@/hooks/useEnsureData";
import { StatCard, type AdminStats } from "@/pages/admin/shared";

export default function AdminOverview() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<AdminStats | null>(null);

  const loading = useEnsureData(async () => {
    const res = await api.admin.getStats();
    if (res.data) setStats(res.data);
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading overview…</div>
    );
  }

  const pendingTotal = stats.pendingProfiles + stats.pendingListings + stats.pendingJobs;

  const quickLinks = [
    { label: "Review profiles", count: stats.pendingProfiles, path: "/app/admin/profiles?status=pending", icon: User },
    { label: "Review listings", count: stats.pendingListings, path: "/app/admin/listings?status=pending", icon: Package },
    { label: "Review jobs", count: stats.pendingJobs, path: "/app/admin/jobs?status=pending", icon: Briefcase },
  ].filter((l) => l.count > 0);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-xl font-extrabold text-foreground mb-6">Platform Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Users" value={stats.users} icon={Users} color="bg-primary/10 text-primary" />
        <StatCard label="Profiles" value={stats.profiles} sub={stats.pendingProfiles ? `${stats.pendingProfiles} pending` : undefined} icon={User} color="bg-violet-50 text-violet-600" />
        <StatCard label="Listings" value={stats.listings} sub={stats.pendingListings ? `${stats.pendingListings} pending` : undefined} icon={Package} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Jobs" value={stats.jobs} sub={stats.pendingJobs ? `${stats.pendingJobs} pending` : undefined} icon={Briefcase} color="bg-amber-50 text-amber-600" />
        <StatCard label="Waitlist" value={stats.waitlist} icon={FileText} color="bg-pink-50 text-pink-600" />
        <StatCard label="Pending" value={pendingTotal} icon={Clock} color="bg-orange-50 text-orange-600" />
      </div>

      {quickLinks.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Pending approvals
          </h2>
          {quickLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-sm text-foreground">{link.label}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                {link.count}
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
          All caught up — no pending approvals.
        </div>
      )}
    </div>
  );
}
