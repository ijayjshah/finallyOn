import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Package, Briefcase, BarChart3, CheckCircle2, XCircle,
  Clock, LogOut, User, Building2, Edit2, Save, X, MapPin,
  Phone, Mail, Star, Wrench, Store, Trash2, Search, ExternalLink,
  Eye, FileText, RefreshCw, List, ChevronDown, ChevronRight, Map,
  ImageIcon, AlertTriangle, MessageCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { BRAND, SERVICE_CATEGORIES, UserType } from "@/types";

type AdminTab = "overview" | "users" | "profiles" | "listings" | "jobs" | "waitlist";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

function Badge({ status }: { status: string }) {
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

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number; sub?: string; icon: React.ElementType; color: string }) {
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

function ActionBtns({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
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

const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

function getMapEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  } catch {}
  return null;
}

export default function AdminPage() {
  const { currentUser, loading, users, profiles, listings, jobs, logout, updateUser, updateProfile, updateListing, updateJob, deleteUser, deleteProfile, deleteListing, deleteJob } = useApp();

  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [waitlist, setWaitlist] = useState<Array<Record<string, string>>>([]);

  // User editing
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<{ name: string; phone: string; type: UserType }>({ name: "", phone: "", type: "user" });

  // Profile detail panel
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editProfileData, setEditProfileData] = useState<{ category: string; customCategory: string; description: string; tags: string }>({ category: "", customCategory: "", description: "", tags: "" });

  // Listing detail panel
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Job detail panel
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.role !== "admin") return;
    void api.admin.getWaitlist().then((res) => {
      if (res.data) setWaitlist(res.data.leads as Array<Record<string, string>>);
    });
  }, [currentUser?.role]);

  const handleLogout = () => { void logout(); };

  const pendingProfiles = profiles.filter((p) => p.approvalStatus === "pending");
  const pendingListings = listings.filter((l) => l.approvalStatus === "pending");
  const pendingJobs = jobs.filter((j) => j.approvalStatus === "pending");

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const selectedListing = listings.find((l) => l.id === selectedListingId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const openProfileEdit = (p: typeof selectedProfile) => {
    if (!p) return;
    setEditProfileMode(true);
    setEditProfileData({ category: p.category, customCategory: "", description: p.description, tags: p.tags.join(", ") });
  };

  const saveProfileEdit = () => {
    if (!selectedProfileId) return;
    const category = editProfileData.category === "__other__" ? editProfileData.customCategory : editProfileData.category;
    updateProfile(selectedProfileId, {
      category,
      description: editProfileData.description,
      tags: editProfileData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setEditProfileMode(false);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchStatus = statusFilter === "all" || p.approvalStatus === statusFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredListings = listings.filter((l) => {
    const matchStatus = statusFilter === "all" || l.approvalStatus === statusFilter;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredJobs = jobs.filter((j) => {
    const matchStatus = statusFilter === "all" || (j.approvalStatus ?? "approved") === statusFilter;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.posterName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const TABS: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users, badge: users.length },
    { id: "profiles", label: "Profiles", icon: User, badge: pendingProfiles.length || undefined },
    { id: "listings", label: "Listings", icon: Package, badge: pendingListings.length || undefined },
    { id: "jobs", label: "Jobs", icon: Briefcase, badge: pendingJobs.length || undefined },
    { id: "waitlist", label: "Waitlist", icon: FileText, badge: waitlist.length || undefined },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Shield className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-lg font-extrabold text-foreground">Admin Login Required</h1>
          <p className="text-sm text-muted-foreground">Sign in with an admin account to access this panel.</p>
          <a href="/login" className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Shield className="w-10 h-10 text-destructive mx-auto" />
          <h1 className="text-lg font-extrabold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">Your account does not have admin privileges.</p>
          <a href="/app/dashboard" className="inline-block px-5 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-muted">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-foreground text-sm">{BRAND.name}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {pendingProfiles.length + pendingListings.length + pendingJobs.length} pending reviews
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-53px)]">
        {/* Sidebar */}
        <div className="w-52 border-r border-border bg-card hidden md:flex flex-col py-5 px-2 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => { setTab(id); setSearch(""); setStatusFilter("all"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" /> {label}
                </div>
                {badge ? <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold min-w-[18px] text-center">{badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className="mt-auto mx-2 p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1">Live</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">Navsari</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Coming: Surat, Valsad, Vapi</p>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-border overflow-x-auto px-3 gap-1 py-2 bg-card w-full absolute z-10" style={{ top: 53 }}>
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => { setTab(id); setSearch(""); setStatusFilter("all"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors relative ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
              {badge ? <span className="ml-1 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold">{badge}</span> : null}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto mt-[44px] md:mt-0">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="p-6 md:p-8">
              <h1 className="text-xl font-extrabold text-foreground mb-6">Platform Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <StatCard label="Users" value={users.length} icon={Users} color="bg-primary/10 text-primary" />
                <StatCard label="Profiles" value={profiles.length} sub={pendingProfiles.length ? `${pendingProfiles.length} pending` : undefined} icon={User} color="bg-violet-50 text-violet-600" />
                <StatCard label="Listings" value={listings.length} sub={pendingListings.length ? `${pendingListings.length} pending` : undefined} icon={Package} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Jobs" value={jobs.length} sub={pendingJobs.length ? `${pendingJobs.length} pending` : undefined} icon={Briefcase} color="bg-amber-50 text-amber-600" />
                <StatCard label="Waitlist" value={waitlist.length} icon={FileText} color="bg-pink-50 text-pink-600" />
                <StatCard label="Pending" value={pendingProfiles.length + pendingListings.length + pendingJobs.length} icon={Clock} color="bg-orange-50 text-orange-600" />
              </div>

              <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Pending Approvals
              </h2>

              {pendingProfiles.length === 0 && pendingListings.length === 0 && pendingJobs.length === 0 ? (
                <div className="p-10 rounded-2xl border border-dashed border-border text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProfiles.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${p.profileType === "business" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                          {p.profileType === "business" ? <Store className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category} · {p.area} · {p.mapUrl ? "Has map" : "No map"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setTab("profiles"); setSelectedProfileId(p.id); }} className="text-xs text-primary hover:underline font-semibold">View</button>
                        <ActionBtns onApprove={() => updateProfile(p.id, { approvalStatus: "approved", verified: true })} onReject={() => updateProfile(p.id, { approvalStatus: "rejected" })} />
                      </div>
                    </div>
                  ))}
                  {pendingListings.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">{l.title}</div>
                          <div className="text-xs text-muted-foreground">{l.type} · {l.category} · {l.price}</div>
                        </div>
                      </div>
                      <ActionBtns onApprove={() => updateListing(l.id, { approvalStatus: "approved" })} onReject={() => updateListing(l.id, { approvalStatus: "rejected" })} />
                    </div>
                  ))}
                  {pendingJobs.map((j) => (
                    <div key={j.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 text-violet-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.listingType} · {j.posterName}</div>
                        </div>
                      </div>
                      <ActionBtns onApprove={() => updateJob(j.id, { approvalStatus: "approved" })} onReject={() => updateJob(j.id, { approvalStatus: "rejected" })} />
                    </div>
                  ))}
                </div>
              )}

              {/* Platform stats */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="font-bold text-sm text-foreground">Navsari</div>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">Live · {profiles.filter((p) => p.approvalStatus === "approved").length} approved profiles</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="text-xs font-bold text-muted-foreground mb-2">Approval Rate</div>
                  <div className="text-xl font-extrabold text-foreground">
                    {profiles.length > 0 ? Math.round((profiles.filter((p) => p.approvalStatus === "approved").length / profiles.length) * 100) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">of profiles approved</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="text-xs font-bold text-muted-foreground mb-2">Verification Rate</div>
                  <div className="text-xl font-extrabold text-foreground">
                    {profiles.length > 0 ? Math.round((profiles.filter((p) => p.verified).length / profiles.length) * 100) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">of profiles verified</div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-extrabold text-foreground">Users ({users.length})</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary w-56" />
                </div>
              </div>

              <div className="space-y-2">
                {filteredUsers.map((u) => {
                  const isEditing = editingUserId === u.id;
                  return (
                    <div key={u.id} className="rounded-xl border border-border bg-card overflow-hidden">
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge status={u.type} />
                          {u.serviceCategory && <span className="text-xs text-muted-foreground hidden sm:inline">· {u.serviceCategory}</span>}
                          <button
                            onClick={() => {
                              if (isEditing) { setEditingUserId(null); return; }
                              setEditingUserId(u.id);
                              setEditUserData({ name: u.name, phone: u.phone, type: u.type });
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                          >
                            {isEditing ? <ChevronDown className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline edit */}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30 space-y-3">
                              <p className="text-xs font-bold text-muted-foreground pt-3 uppercase tracking-wide">Edit User</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                                  <input value={editUserData.name} onChange={(e) => setEditUserData((d) => ({ ...d, name: e.target.value }))} className={inputCls} />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-foreground mb-1 block">Phone</label>
                                  <input value={editUserData.phone} onChange={(e) => setEditUserData((d) => ({ ...d, phone: e.target.value }))} className={inputCls} />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground mb-1 block">Role / Type</label>
                                <select value={editUserData.type} onChange={(e) => setEditUserData((d) => ({ ...d, type: e.target.value as UserType }))} className={inputCls}>
                                  <option value="user">user — Just Browsing</option>
                                  <option value="service_provider">service_provider — Service Provider</option>
                                  <option value="business_owner">business_owner — Business Owner</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <div className="text-xs text-muted-foreground">Email: <span className="text-foreground font-medium">{u.email}</span> · District: <span className="text-foreground font-medium">{u.district}</span> · Joined: <span className="text-foreground font-medium">{new Date(u.createdAt).toLocaleDateString("en-IN")}</span></div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    updateUser(u.id, editUserData);
                                    setEditingUserId(null);
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                                >
                                  <Save className="w-3.5 h-3.5" /> Save Changes
                                </button>
                                <button onClick={() => setEditingUserId(null)} className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">No users found.</div>}
              </div>
            </div>
          )}

          {/* ── PROFILES (two-pane) ── */}
          {tab === "profiles" && (
            <div className="flex h-full">
              {/* List pane */}
              <div className={`${selectedProfileId ? "hidden lg:flex" : "flex"} flex-col flex-shrink-0 w-full lg:w-80 border-r border-border bg-card`}>
                <div className="p-4 border-b border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <h1 className="font-extrabold text-base text-foreground">Profiles ({profiles.length})</h1>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary w-full" />
                  </div>
                  <div className="flex gap-1">
                    {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((s) => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors capitalize ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-auto divide-y divide-border">
                  {filteredProfiles.map((p) => (
                    <button key={p.id} onClick={() => { setSelectedProfileId(p.id); setEditProfileMode(false); }}
                      className={`w-full flex items-start gap-3 p-4 text-left hover:bg-muted/60 transition-colors ${selectedProfileId === p.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${p.profileType === "business" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{p.category} · {p.area}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge status={p.approvalStatus} />
                          {p.verified && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">Verified</span>}
                          {p.mapUrl && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">Map</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-1" />
                    </button>
                  ))}
                  {filteredProfiles.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No profiles found.</div>}
                </div>
              </div>

              {/* Detail pane */}
              {selectedProfile ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-5 border-b border-border bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedProfileId(null)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                        <X className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="font-extrabold text-foreground">{selectedProfile.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedProfile.category} · {selectedProfile.area}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={selectedProfile.approvalStatus} />
                      {selectedProfile.verified && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Verified</span>}
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Action bar */}
                    <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/40 border border-border">
                      {selectedProfile.approvalStatus !== "approved" && (
                        <button onClick={() => updateProfile(selectedProfile.id, { approvalStatus: "approved", verified: true })}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {selectedProfile.approvalStatus !== "rejected" && (
                        <button onClick={() => updateProfile(selectedProfile.id, { approvalStatus: "rejected" })}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                      <button onClick={() => updateProfile(selectedProfile.id, { verified: !selectedProfile.verified })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${selectedProfile.verified ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}>
                        <Shield className="w-3.5 h-3.5" />
                        {selectedProfile.verified ? "Unverify" : "Verify"}
                      </button>
                      <button onClick={() => updateProfile(selectedProfile.id, { available: !selectedProfile.available })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 border border-border">
                        <RefreshCw className="w-3.5 h-3.5" />
                        {selectedProfile.available ? "Mark Unavailable" : "Mark Available"}
                      </button>
                      <button onClick={() => openProfileEdit(selectedProfile)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/15 border border-primary/20">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Details
                      </button>
                      <button onClick={() => { deleteProfile(selectedProfile.id); setSelectedProfileId(null); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    {/* Edit form */}
                    <AnimatePresence>
                      {editProfileMode && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Edit Profile Fields</h3>
                            <div>
                              <label className="text-xs font-semibold text-foreground mb-1 block">Category</label>
                              <select value={editProfileData.category} onChange={(e) => setEditProfileData((d) => ({ ...d, category: e.target.value }))} className={inputCls}>
                                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                <option value="__other__">Other (custom)</option>
                              </select>
                              {editProfileData.category === "__other__" && (
                                <input value={editProfileData.customCategory} onChange={(e) => setEditProfileData((d) => ({ ...d, customCategory: e.target.value }))} placeholder="Type category name..." className={`${inputCls} mt-2`} />
                              )}
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground mb-1 block">Description</label>
                              <textarea value={editProfileData.description} onChange={(e) => setEditProfileData((d) => ({ ...d, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground mb-1 block">Tags (comma-separated)</label>
                              <input value={editProfileData.tags} onChange={(e) => setEditProfileData((d) => ({ ...d, tags: e.target.value }))} className={inputCls} />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={saveProfileEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                                <Save className="w-3.5 h-3.5" /> Save
                              </button>
                              <button onClick={() => setEditProfileMode(false)} className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Photos */}
                    {selectedProfile.photos.length > 0 && (
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-sm text-foreground">Photos ({selectedProfile.photos.length})</h3>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedProfile.photos.map((photo, i) => (
                            <img key={i} src={photo} alt="Work photo" className="w-28 h-28 rounded-xl object-cover flex-shrink-0 border border-border" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Map Verification */}
                    {selectedProfile.mapUrl && (
                      <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-border">
                          <div className="flex items-center gap-2">
                            <Map className="w-4 h-4 text-blue-600" />
                            <h3 className="font-bold text-sm text-foreground">Google Maps Location</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedProfile.verified
                              ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Map Verified</span>
                              : <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Not Verified</span>
                            }
                            <a href={selectedProfile.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        {getMapEmbedUrl(selectedProfile.mapUrl) ? (
                          <div className="h-52">
                            <iframe src={getMapEmbedUrl(selectedProfile.mapUrl)!} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
                          </div>
                        ) : (
                          <div className="p-4 text-xs text-muted-foreground">
                            Map URL: <a href={selectedProfile.mapUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{selectedProfile.mapUrl}</a>
                          </div>
                        )}
                        <div className="p-3 border-t border-border flex gap-2">
                          <button onClick={() => updateProfile(selectedProfile.id, { verified: true })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verify Map
                          </button>
                          <button onClick={() => updateProfile(selectedProfile.id, { verified: false })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Reject Map
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Profile info */}
                    <div className="p-4 rounded-xl border border-border bg-card grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Phone</div>
                        <div className="text-sm font-semibold text-foreground">{selectedProfile.phone || "—"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">WhatsApp</div>
                        <div className="text-sm font-semibold text-foreground">{selectedProfile.whatsappNumber || "—"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Experience</div>
                        <div className="text-sm font-semibold text-foreground">{selectedProfile.experience || "—"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Profile Type</div>
                        <div className="text-sm font-semibold text-foreground capitalize">{selectedProfile.profileType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Rating</div>
                        <div className="text-sm font-semibold text-foreground">{selectedProfile.rating} ({selectedProfile.reviewCount} reviews)</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Joined</div>
                        <div className="text-sm font-semibold text-foreground">{new Date(selectedProfile.createdAt).toLocaleDateString("en-IN")}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <h3 className="font-bold text-sm text-foreground mb-2">Description</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedProfile.description || "—"}</p>
                    </div>

                    {/* Tags */}
                    {selectedProfile.tags.length > 0 && (
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="font-bold text-sm text-foreground mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProfile.tags.map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold">{t}</span>)}
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {selectedProfile.services.length > 0 && (
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="font-bold text-sm text-foreground mb-3">Services ({selectedProfile.services.length})</h3>
                        <div className="space-y-2">
                          {selectedProfile.services.map((s) => (
                            <div key={s.id} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-muted/40 border border-border">
                              <div>
                                <div className="text-xs font-semibold text-foreground">{s.name}</div>
                                {s.description && <div className="text-[10px] text-muted-foreground mt-0.5">{s.description}</div>}
                              </div>
                              {s.price && <div className="text-xs font-bold text-primary flex-shrink-0">{s.price}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex flex-1 items-center justify-center text-center p-10">
                  <div>
                    <User className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-muted-foreground">Select a profile to review</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{pendingProfiles.length} pending approval</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── LISTINGS (two-pane) ── */}
          {tab === "listings" && (
            <div className="flex h-full">
              <div className={`${selectedListingId ? "hidden lg:flex" : "flex"} flex-col flex-shrink-0 w-full lg:w-80 border-r border-border bg-card`}>
                <div className="p-4 border-b border-border space-y-2">
                  <h1 className="font-extrabold text-base text-foreground">Listings ({listings.length})</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary w-full" />
                  </div>
                  <div className="flex gap-1">
                    {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((s) => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors capitalize ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-auto divide-y divide-border">
                  {filteredListings.map((l) => (
                    <button key={l.id} onClick={() => setSelectedListingId(l.id)}
                      className={`w-full flex items-start gap-3 p-4 text-left hover:bg-muted/60 transition-colors ${selectedListingId === l.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${l.type === "product" ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}>
                        {l.type === "product" ? <Package className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">{l.title}</div>
                        <div className="text-[10px] text-muted-foreground">{l.category} · {l.price}</div>
                        <Badge status={l.approvalStatus} />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-1" />
                    </button>
                  ))}
                  {filteredListings.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No listings found.</div>}
                </div>
              </div>

              {selectedListing ? (
                <div className="flex-1 overflow-auto p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedListingId(null)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>
                      <div>
                        <div className="font-extrabold text-foreground">{selectedListing.title}</div>
                        <div className="text-xs text-muted-foreground">{selectedListing.type} · {selectedListing.category}</div>
                      </div>
                    </div>
                    <Badge status={selectedListing.approvalStatus} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.approvalStatus !== "approved" && (
                      <button onClick={() => updateListing(selectedListing.id, { approvalStatus: "approved" })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                    )}
                    {selectedListing.approvalStatus !== "rejected" && (
                      <button onClick={() => updateListing(selectedListing.id, { approvalStatus: "rejected" })} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                    )}
                    <button onClick={() => { deleteListing(selectedListing.id); setSelectedListingId(null); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                  </div>
                  {selectedListing.photos.length > 0 && (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 mb-3"><ImageIcon className="w-4 h-4 text-primary" /><h3 className="font-bold text-sm">Photos</h3></div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedListing.photos.map((p, i) => <img key={i} src={p} alt="" className="w-28 h-28 rounded-xl object-cover flex-shrink-0 border border-border" />)}
                      </div>
                    </div>
                  )}
                  <div className="p-4 rounded-xl border border-border bg-card grid grid-cols-2 gap-3">
                    {[["Price", selectedListing.price], ["Area", selectedListing.area], ["WhatsApp", selectedListing.whatsappNumber], ["Delivery", selectedListing.deliveryAvailable ? "Yes" : "No"]].map(([k, v]) => (
                      <div key={k as string}><div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">{k}</div><div className="text-sm font-semibold text-foreground">{v || "—"}</div></div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card"><h3 className="font-bold text-sm mb-2">Description</h3><p className="text-xs text-muted-foreground leading-relaxed">{selectedListing.description}</p></div>
                </div>
              ) : (
                <div className="hidden lg:flex flex-1 items-center justify-center text-center p-10">
                  <div><Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm font-semibold text-muted-foreground">Select a listing to review</p></div>
                </div>
              )}
            </div>
          )}

          {/* ── JOBS ── */}
          {tab === "jobs" && (
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
          )}

          {/* ── WAITLIST ── */}
          {tab === "waitlist" && (
            <div className="p-6 md:p-8">
              <h1 className="text-xl font-extrabold text-foreground mb-2">Waitlist Signups ({waitlist.length})</h1>
              <p className="text-sm text-muted-foreground mb-6">People who signed up for early access from other cities.</p>
              {waitlist.length === 0 ? (
                <div className="p-10 rounded-2xl border border-dashed border-border text-center">
                  <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No waitlist signups yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {["Name", "Phone", "Email", "City / District", "Category", "Joined"].map((h) => (
                          <th key={h} className="text-left px-3 py-2.5 font-bold text-muted-foreground text-[10px] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {waitlist.map((entry, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-3 font-semibold text-foreground">{entry.name}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.phone}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.email}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.district}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.category}</td>
                          <td className="px-3 py-3 text-muted-foreground">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
