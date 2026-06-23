import { useState } from "react";
import { Search, ChevronRight, X, CheckCircle2, XCircle, Trash2, Package, Wrench, ImageIcon } from "lucide-react";
import { useSearch } from "wouter";
import { useApp } from "@/context/AppContext";
import { useEnsureData } from "@/hooks/useEnsureData";
import { Badge, type StatusFilter } from "@/pages/admin/shared";

export default function AdminListings() {
  const searchParams = useSearch();
  const initialStatus = (new URLSearchParams(searchParams).get("status") as StatusFilter) || "all";
  const { listings, ensureAdminListings, updateListing, deleteListing } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    ["all", "pending", "approved", "rejected"].includes(initialStatus) ? initialStatus : "all",
  );
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const loading = useEnsureData(() => ensureAdminListings(), [ensureAdminListings]);
  const selectedListing = listings.find((l) => l.id === selectedListingId);
  const filteredListings = listings.filter((l) => {
    const matchStatus = statusFilter === "all" || l.approvalStatus === statusFilter;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  if (loading) return <div className="p-6 md:p-8 text-sm text-muted-foreground">Loading listings…</div>;
  return (
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
          
  );
}
