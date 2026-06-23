import { useState } from "react";
import { Search, CheckCircle2, XCircle, Trash2, Building2, User } from "lucide-react";
import { useSearch } from "wouter";
import { useApp } from "@/context/AppContext";
import { useEnsureData } from "@/hooks/useEnsureData";
import { Badge, type StatusFilter } from "@/pages/admin/shared";

export default function AdminJobs() {
  const searchParams = useSearch();
  const initialStatus = (new URLSearchParams(searchParams).get("status") as StatusFilter) || "all";
  const { jobs, ensureAdminJobs, updateJob, deleteJob } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    ["all", "pending", "approved", "rejected"].includes(initialStatus) ? initialStatus : "all",
  );
  const loading = useEnsureData(() => ensureAdminJobs(), [ensureAdminJobs]);
  const filteredJobs = jobs.filter((j) => {
    const matchStatus = statusFilter === "all" || (j.approvalStatus ?? "approved") === statusFilter;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.posterName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  if (loading) return <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading jobs…</div>;
  return (
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-extrabold text-foreground">Jobs ({jobs.length})</h1>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary" />
                  </div>
                  <div className="flex gap-1">
                    {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((s) => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors capitalize ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {filteredJobs.map((j) => (
                  <div key={j.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${j.listingType === "opening" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}>
                          {j.listingType === "opening" ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.listingType} · {j.posterName} · {j.area} · {j.salary}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{j.description.slice(0, 100)}...</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <Badge status={j.approvalStatus ?? "approved"} />
                        <div className="flex gap-1.5">
                          {(j.approvalStatus ?? "approved") !== "approved" && (
                            <button onClick={() => updateJob(j.id, { approvalStatus: "approved" })} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 inline mr-0.5" />Approve</button>
                          )}
                          {(j.approvalStatus ?? "approved") !== "rejected" && (
                            <button onClick={() => updateJob(j.id, { approvalStatus: "rejected" })} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 hover:bg-red-100"><XCircle className="w-3 h-3 inline mr-0.5" />Reject</button>
                          )}
                          <button onClick={() => deleteJob(j.id)} className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold hover:bg-red-50 hover:text-red-700 border border-border"><Trash2 className="w-3 h-3 inline" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredJobs.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">No jobs found.</div>}
              </div>
            </div>
          
  );
}
