import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Shield, Filter, X, MessageCircle, Phone, Wrench, Store } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { NAVSARI_AREAS, SERVICE_PROVIDER_CATEGORIES, BUSINESS_CATEGORIES } from "@/types";

type TabType = "services" | "businesses";

export default function Discover() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { profiles } = useApp();

  const initialTab: TabType = search.includes("tab=businesses") ? "businesses" : "services";
  const [tab, setTab] = useState<TabType>(initialTab);
  const [searchText, setSearchText] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const approvedProfiles = profiles.filter((p) => p.approvalStatus === "approved");
  const categoryList = tab === "services" ? SERVICE_PROVIDER_CATEGORIES : BUSINESS_CATEGORIES;

  const filtered = useMemo(() => {
    return approvedProfiles.filter((p) => {
      const matchTab = tab === "services" ? p.profileType !== "business" : p.profileType === "business";
      const matchArea = selectedArea === "All Areas" || p.area === selectedArea;
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        !searchText.trim() ||
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase()) ||
        p.area.toLowerCase().includes(searchText.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()));
      const matchVerified = !verifiedOnly || p.verified;
      const matchAvailable = !availableOnly || p.available;
      return matchTab && matchArea && matchCat && matchSearch && matchVerified && matchAvailable;
    });
  }, [approvedProfiles, tab, searchText, selectedArea, selectedCategory, verifiedOnly, availableOnly]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedArea("All Areas");
    setSelectedCategory("All");
    setVerifiedOnly(false);
    setAvailableOnly(false);
  };

  const switchTab = (t: TabType) => {
    setTab(t);
    setSelectedCategory("All");
    clearFilters();
  };

  const hasActiveFilters =
    searchText ||
    selectedArea !== "All Areas" ||
    selectedCategory !== "All" ||
    verifiedOnly ||
    availableOnly;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Navsari District</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">Discover Local</h1>

          {/* Tab switcher */}
          <div className="flex gap-2 p-1 bg-muted/60 rounded-2xl w-fit">
            <button
              onClick={() => switchTab("services")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === "services"
                  ? "bg-card text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Services
            </button>
            <button
              onClick={() => switchTab("businesses")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === "businesses"
                  ? "bg-card text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="w-4 h-4" />
              Businesses
            </button>
          </div>

          <p className="text-muted-foreground text-sm mt-3">
            {tab === "services"
              ? "Find skilled workers — electricians, tutors, beauticians and more"
              : "Browse local shops, restaurants, clinics and stores near you"}
          </p>
        </motion.div>

        {/* Search & filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mb-6 space-y-3"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={tab === "services" ? "Search by name, skill, area..." : "Search by name, shop type, area..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${showFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary transition-all"
                >
                  <option>All Areas</option>
                  {NAVSARI_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary transition-all"
                >
                  <option value="All">All {tab === "services" ? "Services" : "Business Types"}</option>
                  {categoryList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm font-medium text-foreground">Verified only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm font-medium text-foreground">Available now</span>
                </label>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === "All" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {categoryList.slice(0, 8).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Area chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedArea("All Areas")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedArea === "All Areas" ? "bg-foreground text-background border-foreground" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
            >
              All Areas
            </button>
            {NAVSARI_AREAS.slice(0, 6).map((a) => (
              <button
                key={a}
                onClick={() => setSelectedArea(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedArea === a ? "bg-foreground text-background border-foreground" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-5">
          {filtered.length} {tab === "services" ? "service provider" : "business"}{filtered.length !== 1 ? "s" : ""} found in Navsari
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-2 text-primary font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              {tab === "services" ? <Wrench className="w-7 h-7 text-muted-foreground" /> : <Store className="w-7 h-7 text-muted-foreground" />}
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground text-sm">
              {hasActiveFilters ? "Try adjusting your filters." : `No ${tab} listed in this area yet.`}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <button
                    onClick={() => navigate(`/app/profile/${profile.id}`)}
                    className="w-full text-left"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                      {profile.photos.length > 0 ? (
                        <img
                          src={profile.photos[0]}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-black text-primary/20">{profile.name.charAt(0)}</span>
                        </div>
                      )}
                      {/* Profile type badge */}
                      <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full shadow-sm text-[10px] font-bold ${
                        profile.profileType === "business"
                          ? "bg-amber-500 text-white"
                          : "bg-indigo-500 text-white"
                      }`}>
                        {profile.profileType === "business" ? <Store className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                        {profile.profileType === "business" ? "Business" : "Service"}
                      </div>
                      {profile.verified && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur border border-border shadow-sm">
                          <Shield className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-bold text-primary">Verified</span>
                        </div>
                      )}
                      {profile.available && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          <span className="text-[10px] font-bold text-white">Available</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-sm text-foreground">{profile.name}</div>
                          <div className="text-xs font-semibold text-primary mt-0.5">{profile.category}</div>
                        </div>
                        {profile.rating > 0 && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-foreground">{profile.rating}</span>
                            <span className="text-xs text-muted-foreground">({profile.reviewCount})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {profile.area}, Navsari
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {profile.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  <div className="px-4 pb-4 flex gap-2">
                    {profile.whatsappNumber ? (
                      <a
                        href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${profile.name.split(" ")[0]}, I found you on FinallyOn. I'd like to inquire about your ${profile.profileType === "business" ? "business" : "services"}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    ) : null}
                    <a
                      href={`tel:${profile.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-muted transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
