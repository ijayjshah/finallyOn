import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, UserSearch, Search, MapPin, Clock, IndianRupee,
  Filter, X, PlusCircle, Building2, User,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { GUJARAT_CITIES, SERVICE_CATEGORIES, EMPLOYMENT_TYPES, Job } from "@/types";

type Tab = "openings" | "seekers";

const EMPLOYMENT_COLORS: Record<string, string> = {
  "Full-time": "bg-primary/10 text-primary",
  "Part-time": "bg-violet-50 text-violet-600",
  "Contract": "bg-amber-50 text-amber-600",
  "Daily Wage": "bg-emerald-50 text-emerald-600",
  "Seasonal": "bg-rose-50 text-rose-600",
};

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="w-full text-left p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-250 group"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${job.listingType === "opening" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}>
          {job.listingType === "opening"
            ? <Building2 className="w-5 h-5" />
            : <User className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${EMPLOYMENT_COLORS[job.employmentType] ?? "bg-muted text-muted-foreground"}`}>
              {job.employmentType}
            </span>
          </div>

          <p className="text-xs font-semibold text-muted-foreground mb-2">{job.posterName}</p>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {job.area}, {job.city}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <IndianRupee className="w-3 h-3 flex-shrink-0" />
              {job.salary}
            </span>
            {job.experience && job.experience !== "Any" && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {job.experience}
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium">
              {job.category}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 ${job.listingType === "opening" ? "bg-primary/8 border-b border-primary/15" : "bg-emerald-50 border-b border-emerald-100"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${job.listingType === "opening" ? "bg-primary/15 text-primary" : "bg-emerald-100 text-emerald-600"}`}>
                {job.listingType === "opening" ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${job.listingType === "opening" ? "text-primary" : "text-emerald-600"}`}>
                  {job.listingType === "opening" ? "Hiring Now" : "Open to Work"}
                </span>
                <h2 className="font-extrabold text-base text-foreground mt-0.5 leading-snug">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.posterName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Location", value: `${job.area}, ${job.city}`, icon: MapPin },
              { label: "Salary", value: job.salary, icon: IndianRupee },
              { label: "Employment", value: job.employmentType, icon: Briefcase },
              { label: "Experience", value: job.experience || "Not specified", icon: Clock },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
                <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
                  <div className="text-xs font-semibold text-foreground">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              {job.listingType === "opening" ? "About This Role" : "About Me"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex gap-3">
          <a
            href={`tel:${job.contact}`}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center hover:opacity-90 transition-opacity"
          >
            📞 Call {job.contact}
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Jobs() {
  const [, navigate] = useLocation();
  const { jobs, currentUser } = useApp();

  const [tab, setTab] = useState<Tab>("openings");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (!j.active) return false;
      if (j.listingType !== (tab === "openings" ? "opening" : "seeker")) return false;
      const matchCity = selectedCity === "All Cities" || j.city === selectedCity;
      const matchCat = selectedCategory === "All Categories" || j.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.posterName.toLowerCase().includes(search.toLowerCase()) ||
        j.category.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchCat && matchSearch;
    });
  }, [jobs, tab, search, selectedCity, selectedCategory]);

  const hasFilters = search || selectedCity !== "All Cities" || selectedCategory !== "All Categories";

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("All Cities");
    setSelectedCategory("All Categories");
  };

  const openingCount = jobs.filter((j) => j.active && j.listingType === "opening").length;
  const seekerCount = jobs.filter((j) => j.active && j.listingType === "seeker").length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">Jobs Board</h1>
            <p className="text-muted-foreground text-sm">Find work or hire workers across Gujarat</p>
          </div>
          <button
            onClick={() => navigate("/app/jobs/post")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Post
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("openings")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
              tab === "openings"
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Openings
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab === "openings" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {openingCount}
            </span>
          </button>
          <button
            onClick={() => setTab("seekers")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
              tab === "seekers"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <UserSearch className="w-4 h-4" />
            Looking for Work
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab === "seekers" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
              {seekerCount}
            </span>
          </button>
        </div>

        {/* Tab description */}
        <div className={`mb-5 px-4 py-3 rounded-xl border text-sm ${tab === "openings" ? "bg-primary/5 border-primary/15 text-primary" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
          {tab === "openings"
            ? "🏢 These are job openings posted by businesses and employers looking to hire workers."
            : "👋 These are workers actively looking for employment — contact them directly to hire."}
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 mb-5">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === "openings" ? "Search job titles, categories..." : "Search by name, skill, category..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${showFilters || hasFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"}`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          </div>

          <AnimatePresence>
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
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary"
                >
                  <option>All Cities</option>
                  {GUJARAT_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary"
                >
                  <option>All Categories</option>
                  {SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* City chips */}
          <div className="flex gap-2 flex-wrap">
            {["All Cities", ...GUJARAT_CITIES].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCity === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} {tab === "openings" ? "job opening" : "job seeker"}{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              {tab === "openings" ? <Briefcase className="w-7 h-7 text-muted-foreground" /> : <UserSearch className="w-7 h-7 text-muted-foreground" />}
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">No {tab === "openings" ? "job openings" : "job seekers"} found</h3>
            <p className="text-muted-foreground text-sm mb-5">
              {hasFilters ? "Try adjusting your search or filters." : "Be the first to post here!"}
            </p>
            <button
              onClick={() => navigate("/app/jobs/post")}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Post a {tab === "openings" ? "Job Opening" : "Job Seeker Listing"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* My posts CTA */}
        {currentUser && (
          <div className="mt-8 p-5 rounded-2xl border border-border bg-muted/30 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-foreground">Have a job opening or looking for work?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Post it for free — reach workers and employers across Gujarat.</p>
            </div>
            <button
              onClick={() => navigate("/app/jobs/post")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Post Free
            </button>
          </div>
        )}
      </div>

      {/* Job detail modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
