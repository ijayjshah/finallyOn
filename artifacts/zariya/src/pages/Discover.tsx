import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Shield, Filter, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, EXPANDING_CITIES, SERVICE_CATEGORIES } from "@/types";

const ALL_CITIES_FULL = [
  ...GUJARAT_CITIES.map((c) => ({ name: c, status: "live" as const })),
  ...EXPANDING_CITIES.map((c) => ({ name: c, status: "coming" as const })),
];

export default function Discover() {
  const [, navigate] = useLocation();
  const { profiles } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
      const matchCat = selectedCategory === "All Categories" || p.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.area.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCity && matchCat && matchSearch;
    });
  }, [profiles, search, selectedCity, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("All Cities");
    setSelectedCategory("All Categories");
  };

  const hasActiveFilters = search || selectedCity !== "All Cities" || selectedCategory !== "All Categories";

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
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">Discover Local Services</h1>
          <p className="text-muted-foreground text-sm">Find verified workers and sellers across Gujarat</p>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, service, area..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${showFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col sm:flex-row gap-3 overflow-hidden"
            >
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary transition-all"
              >
                <option>All Cities</option>
                {ALL_CITIES_FULL.map((c) => (
                  <option key={c.name} value={c.name} disabled={c.status === "coming"}>
                    {c.name}{c.status === "coming" ? " (Coming Soon)" : ""}
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary transition-all"
              >
                <option>All Categories</option>
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </motion.div>
          )}

          {/* City chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCity("All Cities")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCity === "All Cities" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
            >
              All Cities
            </button>
            {GUJARAT_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCity === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
            {EXPANDING_CITIES.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border/50 text-muted-foreground/50 bg-muted/30">
                {c} (Soon)
              </span>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-5">
          {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-2 text-primary font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Profile cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Clear Filters
            </button>
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
                <button
                  onClick={() => navigate(`/app/profile/${profile.id}`)}
                  className="w-full text-left rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  data-testid={`discover-card-${profile.id}`}
                >
                  {/* Photo strip */}
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
                    {profile.verified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur border border-border shadow-sm">
                        <Shield className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary">Verified</span>
                      </div>
                    )}
                    {profile.available && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span className="text-[10px] font-bold text-white">Available</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-bold text-sm text-foreground">{profile.name}</div>
                        <div className="text-xs font-semibold text-primary mt-0.5">{profile.category}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-foreground">{profile.rating}</span>
                        <span className="text-xs text-muted-foreground">({profile.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {profile.area}, {profile.city}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {profile.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                      <span>{profile.experience} experience</span>
                      <span className="font-semibold text-primary">View Profile →</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
