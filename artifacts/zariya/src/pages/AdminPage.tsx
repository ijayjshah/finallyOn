import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Package, Briefcase, BarChart3, CheckCircle2, XCircle,
  Clock, Eye, LogOut, User, Building2, Layers, MessageCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/types";

const ADMIN_EMAIL = "admin@finallyon.in";
const ADMIN_PASSWORD = "admin123";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-extrabold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

type Tab = "overview" | "users" | "profiles" | "listings" | "jobs";

export default function AdminPage() {
  const { users, profiles, listings, jobs, updateProfile, updateListing, updateJob } = useApp();

  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem("fo_admin_auth") === "1"; } catch { return false; }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [viewItem, setViewItem] = useState<string | null>(null);

  const handleLogin = () => {
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("fo_admin_auth", "1");
      setAuthed(true);
    } else {
      setLoginError("Invalid admin credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fo_admin_auth");
    setAuthed(false);
  };

  const pendingProfiles = profiles.filter((p) => p.approvalStatus === "pending");
  const pendingListings = listings.filter((l) => l.approvalStatus === "pending");
  const pendingJobs = jobs.filter((j) => j.approvalStatus === "pending");

  const approveProfile = (id: string) => updateProfile(id, { approvalStatus: "approved", verified: true });
  const rejectProfile = (id: string) => updateProfile(id, { approvalStatus: "rejected" });
  const approveListing = (id: string) => updateListing(id, { approvalStatus: "approved" });
  const rejectListing = (id: string) => updateListing(id, { approvalStatus: "rejected" });
  const approveJob = (id: string) => updateJob(id, { approvalStatus: "approved" });
  const rejectJob = (id: string) => updateJob(id, { approvalStatus: "rejected" });

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-extrabold text-foreground">{BRAND.name} Admin</div>
              <div className="text-xs text-muted-foreground">Restricted Access</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <h1 className="text-lg font-extrabold text-foreground">Admin Login</h1>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                placeholder="admin@finallyon.in"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            {loginError && <p className="text-xs text-destructive">{loginError}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Demo: admin@finallyon.in / admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users, badge: users.length },
    { id: "profiles", label: "Profiles", icon: User, badge: pendingProfiles.length || undefined },
    { id: "listings", label: "Listings", icon: Package, badge: pendingListings.length || undefined },
    { id: "jobs", label: "Jobs", icon: Briefcase, badge: pendingJobs.length || undefined },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      rejected: "bg-red-50 text-red-700",
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] ?? "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    );
  };

  const ApproveReject = ({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) => (
    <div className="flex gap-2">
      <button onClick={onApprove} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors">
        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
      </button>
      <button onClick={onReject} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors">
        <XCircle className="w-3.5 h-3.5" /> Reject
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-extrabold text-foreground text-sm">{BRAND.name}</span>
            <span className="text-xs text-muted-foreground ml-2">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <div className="w-56 border-r border-border bg-card hidden md:block py-6 px-3 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                {badge ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold min-w-[18px] text-center">
                    {badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="mt-6 mx-3 p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">Districts Live</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-foreground">Navsari</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Coming soon: Surat, Valsad, Vapi</p>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-border overflow-x-auto px-4 gap-1 py-2 bg-card w-full absolute z-10" style={{top: 65}}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto mt-[44px] md:mt-0">
          {tab === "overview" && (
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-6">Platform Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Users" value={users.length} icon={Users} color="bg-primary/10 text-primary" />
                <StatCard label="Profiles" value={profiles.length} icon={User} color="bg-violet-50 text-violet-600" />
                <StatCard label="Listings" value={listings.length} icon={Package} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Jobs Posted" value={jobs.length} icon={Briefcase} color="bg-amber-50 text-amber-600" />
              </div>

              {/* Pending approvals */}
              <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Pending Approvals
              </h2>
              {pendingProfiles.length === 0 && pendingListings.length === 0 && pendingJobs.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-border text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No pending items to review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProfiles.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category} · {p.area}</div>
                        </div>
                      </div>
                      <ApproveReject onApprove={() => approveProfile(p.id)} onReject={() => rejectProfile(p.id)} />
                    </div>
                  ))}
                  {pendingListings.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{l.title}</div>
                          <div className="text-xs text-muted-foreground">{l.type} · {l.category}</div>
                        </div>
                      </div>
                      <ApproveReject onApprove={() => approveListing(l.id)} onReject={() => rejectListing(l.id)} />
                    </div>
                  ))}
                  {pendingJobs.map((j) => (
                    <div key={j.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.listingType} · {j.posterName}</div>
                        </div>
                      </div>
                      <ApproveReject onApprove={() => approveJob(j.id)} onReject={() => rejectJob(j.id)} />
                    </div>
                  ))}
                </div>
              )}

              {/* District Management */}
              <h2 className="text-base font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                District Management
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2" />
                  <div className="font-bold text-sm text-foreground">Navsari</div>
                  <div className="text-xs text-emerald-600 font-semibold">Live</div>
                </div>
                {["Surat", "Valsad", "Vapi"].map((d) => (
                  <div key={d} className="p-4 rounded-xl border border-dashed border-border bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mb-2" />
                    <div className="font-bold text-sm text-muted-foreground/60">{d}</div>
                    <div className="text-xs text-muted-foreground/50 font-semibold">Coming Soon</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "users" && (
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-6">All Users ({users.length})</h1>
              <div className="space-y-2">
                {users.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No users yet.</div>
                ) : (
                  users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email} · {u.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{u.type}</span>
                        <span className="text-xs text-muted-foreground">{u.district}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "profiles" && (
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-6">
                Service Profiles ({profiles.length})
                {pendingProfiles.length > 0 && (
                  <span className="ml-2 text-sm font-semibold text-amber-600">· {pendingProfiles.length} pending</span>
                )}
              </h1>
              <div className="space-y-2">
                {profiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.category} · {p.area}, Navsari</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusBadge(p.approvalStatus)}
                      {p.approvalStatus === "pending" && (
                        <ApproveReject onApprove={() => approveProfile(p.id)} onReject={() => rejectProfile(p.id)} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "listings" && (
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-6">
                Listings ({listings.length})
                {pendingListings.length > 0 && (
                  <span className="ml-2 text-sm font-semibold text-amber-600">· {pendingListings.length} pending</span>
                )}
              </h1>
              <div className="space-y-2">
                {listings.map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${l.type === "product" ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                        {l.type === "product" ? <Package className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{l.title}</div>
                        <div className="text-xs text-muted-foreground">{l.type} · {l.category} · {l.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusBadge(l.approvalStatus)}
                      {l.approvalStatus === "pending" && (
                        <ApproveReject onApprove={() => approveListing(l.id)} onReject={() => rejectListing(l.id)} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "jobs" && (
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-6">
                Jobs Board ({jobs.length})
                {pendingJobs.length > 0 && (
                  <span className="ml-2 text-sm font-semibold text-amber-600">· {pendingJobs.length} pending</span>
                )}
              </h1>
              <div className="space-y-2">
                {jobs.map((j) => (
                  <div key={j.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${j.listingType === "opening" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}>
                        {j.listingType === "opening" ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{j.title}</div>
                        <div className="text-xs text-muted-foreground">{j.listingType} · {j.posterName} · {j.area}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusBadge(j.approvalStatus ?? "approved")}
                      {j.approvalStatus === "pending" && (
                        <ApproveReject onApprove={() => approveJob(j.id)} onReject={() => rejectJob(j.id)} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
