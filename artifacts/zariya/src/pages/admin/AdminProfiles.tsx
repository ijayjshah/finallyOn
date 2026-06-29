import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronRight, X, CheckCircle2, XCircle, Shield, RefreshCw, Edit2, Save, Trash2,
  User, Map, ExternalLink, ImageIcon, Loader2,
} from "lucide-react";
import { useSearch } from "wouter";
import { useApp } from "@/context/AppContext";
import { useEnsureData } from "@/hooks/useEnsureData";
import { toast } from "@/hooks/use-toast";
import { SERVICE_CATEGORIES } from "@/types";
import { Badge, inputCls, getMapEmbedUrl, ProfileActionBanner, type StatusFilter } from "@/pages/admin/shared";
import { downloadTrustCard } from "@/components/TrustCardShare";

type ProfileActionState = { profileId: string; action: "approving" | "rejecting" } | null;

export default function AdminProfiles() {
  const searchParams = useSearch();
  const initialStatus = (new URLSearchParams(searchParams).get("status") as StatusFilter) || "all";
  const {
    profiles, ensureAdminProfiles, updateProfile, deleteProfile,
  } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    ["all", "pending", "approved", "rejected"].includes(initialStatus) ? initialStatus : "all",
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ category: "", customCategory: "", description: "", tags: "" });
  const [actionState, setActionState] = useState<ProfileActionState>(null);
  const [generatingCardIds, setGeneratingCardIds] = useState<Set<string>>(() => new Set());

  const loading = useEnsureData(() => ensureAdminProfiles(), [ensureAdminProfiles]);

  const isActionBusy = actionState !== null;

  useEffect(() => {
    if (loading) return;
    setGeneratingCardIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const p of profiles) {
        if (p.approvalStatus === "approved" && !p.trustCardUrl && !next.has(p.id)) {
          next.add(p.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [loading, profiles]);

  useEffect(() => {
    if (generatingCardIds.size === 0) return;
    const interval = setInterval(() => {
      void ensureAdminProfiles();
    }, 5000);
    return () => clearInterval(interval);
  }, [generatingCardIds.size, ensureAdminProfiles]);

  useEffect(() => {
    setGeneratingCardIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      let changed = false;
      for (const id of prev) {
        const profile = profiles.find((p) => p.id === id);
        if (profile?.trustCardUrl) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [profiles]);

  const handleApprove = useCallback(async (profileId: string, profileName: string) => {
    if (actionState) return;
    setActionState({ profileId, action: "approving" });
    try {
      await updateProfile(profileId, { approvalStatus: "approved", verified: true });
      setGeneratingCardIds((prev) => new Set(prev).add(profileId));
      toast({
        title: "Profile approved",
        description: `${profileName} is live. The digital business card is being generated (about 30–60 seconds).`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: "Something went wrong. Please wait a moment and try again once.",
      });
    } finally {
      setActionState(null);
    }
  }, [actionState, updateProfile]);

  const handleReject = useCallback(async (profileId: string) => {
    if (actionState) return;
    setActionState({ profileId, action: "rejecting" });
    try {
      await updateProfile(profileId, { approvalStatus: "rejected" });
      toast({ title: "Profile rejected" });
    } catch {
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: "Please wait a moment and try again once.",
      });
    } finally {
      setActionState(null);
    }
  }, [actionState, updateProfile]);

  const pendingProfiles = profiles.filter((p) => p.approvalStatus === "pending");
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const selectedAction = actionState?.profileId === selectedProfileId ? actionState.action : null;
  const isGeneratingCard = selectedProfileId ? generatingCardIds.has(selectedProfileId) && !selectedProfile?.trustCardUrl : false;

  const openProfileEdit = (p: NonNullable<typeof selectedProfile>) => {
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

  if (loading) {
    return <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading profiles…</div>;
  }

  return (
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
                          {generatingCardIds.has(p.id) && !p.trustCardUrl && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-0.5">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Card…
                            </span>
                          )}
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
                    {selectedAction === "approving" && <ProfileActionBanner variant="approving" />}
                    {selectedAction === "rejecting" && <ProfileActionBanner variant="rejecting" />}
                    {!selectedAction && isGeneratingCard && (
                      <ProfileActionBanner variant="card-generating" profileName={selectedProfile.name} />
                    )}

                    {/* Action bar */}
                    <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/40 border border-border">
                      {selectedProfile.approvalStatus !== "approved" && (
                        <button
                          type="button"
                          disabled={isActionBusy}
                          onClick={() => void handleApprove(selectedProfile.id, selectedProfile.name)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 ${
                            isActionBusy ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-100"
                          }`}
                        >
                          {selectedAction === "approving" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {selectedAction === "approving" ? "Approving…" : "Approve"}
                        </button>
                      )}
                      {selectedProfile.approvalStatus !== "rejected" && (
                        <button
                          type="button"
                          disabled={isActionBusy}
                          onClick={() => void handleReject(selectedProfile.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200 ${
                            isActionBusy ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100"
                          }`}
                        >
                          {selectedAction === "rejecting" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {selectedAction === "rejecting" ? "Rejecting…" : "Reject"}
                        </button>
                      )}
                      <button type="button" disabled={isActionBusy} onClick={() => updateProfile(selectedProfile.id, { verified: !selectedProfile.verified })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${selectedProfile.verified ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"} ${isActionBusy ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <Shield className="w-3.5 h-3.5" />
                        {selectedProfile.verified ? "Unverify" : "Verify"}
                      </button>
                      <button type="button" disabled={isActionBusy} onClick={() => updateProfile(selectedProfile.id, { available: !selectedProfile.available })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-bold border border-border ${isActionBusy ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/80"}`}>
                        <RefreshCw className="w-3.5 h-3.5" />
                        {selectedProfile.available ? "Mark Unavailable" : "Mark Available"}
                      </button>
                      <button type="button" disabled={isActionBusy} onClick={() => openProfileEdit(selectedProfile)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20 ${isActionBusy ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/15"}`}>
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

                    {/* Trust card */}
                    {isGeneratingCard && (
                      <div className="p-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/40">
                        <div className="flex items-center gap-2 text-xs text-amber-900/80">
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          Preparing download link for the business card…
                        </div>
                      </div>
                    )}
                    {selectedProfile.trustCardUrl && (
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="font-bold text-sm text-foreground mb-2">Digital Business Card</h3>
                        <p className="text-xs text-muted-foreground mb-3">Generated trust card for this profile.</p>
                        <button
                          type="button"
                          onClick={() =>
                            void downloadTrustCard(selectedProfile.trustCardUrl!, selectedProfile.name).catch(() => {
                              window.open(selectedProfile.trustCardUrl!, "_blank", "noopener,noreferrer");
                            })
                          }
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Download card
                        </button>
                      </div>
                    )}

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
  );
}
