import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, Package, Wrench, Search } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { useEnsureData } from "@/hooks/useEnsureData";
import { Listing } from "@/types";

function ListingCard({
  listing,
  onEdit,
  onDelete,
  onToggle,
}: {
  listing: Listing;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border bg-card overflow-hidden transition-all ${listing.active ? "border-border" : "border-border/50 opacity-70"}`}
      data-testid={`listing-card-${listing.id}`}
    >
      <div className="flex gap-0">
        {/* Photo */}
        <div className="w-24 sm:w-32 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 relative">
          {listing.photos.length > 0 ? (
            <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {listing.type === "product" ? (
                <Package className="w-7 h-7 text-primary/30" />
              ) : (
                <Wrench className="w-7 h-7 text-primary/30" />
              )}
            </div>
          )}
          <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${listing.type === "product" ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"}`}>
            {listing.type === "product" ? "Product" : "Service"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm text-foreground truncate">{listing.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${listing.active ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              {listing.active ? "Active" : "Paused"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">{listing.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="font-semibold text-primary">{listing.price}</span>
            <span>·</span>
            <span>{listing.category}</span>
            <span>·</span>
            <span>{listing.city}</span>
          </div>

          {/* Actions */}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive font-medium">Delete this listing?</span>
              <button
                onClick={onDelete}
                className="px-3 py-1 rounded-lg bg-destructive text-white text-xs font-bold hover:opacity-80 transition-opacity"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {listing.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {listing.active ? "Pause" : "Activate"}
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-xs font-semibold text-destructive hover:bg-destructive/8 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MyListings() {
  const [, navigate] = useLocation();
  const { currentUser, getListingsByUserId, deleteListing, updateListing, ensureMyData } = useApp();
  const pageLoading = useEnsureData(() => ensureMyData(), [ensureMyData]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "service" | "product">("all");

  if (!currentUser) return null;

  if (pageLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center text-sm text-muted-foreground">Loading listings…</div>
      </AppLayout>
    );
  }

  const allListings = getListingsByUserId(currentUser.id);
  const filtered = allListings.filter((l) => {
    const matchType = filter === "all" || l.type === filter;
    const matchSearch = !search.trim() || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">My Listings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{allListings.length} listing{allListings.length !== 1 ? "s" : ""} · {allListings.filter((l) => l.active).length} active</p>
          </div>
          <button
            onClick={() => navigate("/app/listings/add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            Add Listing
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your listings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-1.5 p-1 rounded-xl bg-muted border border-border">
            {(["all", "service", "product"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f === "service" ? "Services" : "Products"}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {allListings.length === 0 ? "No listings yet" : "No matches"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {allListings.length === 0
                ? "Create your first service or product listing to get started."
                : "Try adjusting your search or filters."}
            </p>
            {allListings.length === 0 && (
              <button
                onClick={() => navigate("/app/listings/add")}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Add First Listing
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={() => navigate(`/app/listings/edit/${listing.id}`)}
                  onDelete={() => deleteListing(listing.id)}
                  onToggle={() => updateListing(listing.id, { active: !listing.active })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
