import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, ListChecks, Search, PlusCircle, ArrowRight, Star, MapPin, CheckCircle2, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { currentUser, getProfileByUserId, getListingsByUserId, profiles } = useApp();

  if (!currentUser) return null;

  const myProfile = getProfileByUserId(currentUser.id);
  const myListings = getListingsByUserId(currentUser.id);
  const activeListings = myListings.filter((l) => l.active);
  const recentProfiles = profiles.slice(0, 3);

  const stats = [
    {
      label: "Profile Status",
      value: myProfile ? "Live" : "Not Created",
      sub: myProfile ? myProfile.category : "Set up your profile",
      icon: User,
      color: myProfile ? "text-emerald-600" : "text-amber-600",
      bg: myProfile ? "bg-emerald-50" : "bg-amber-50",
      action: myProfile ? `/app/profile/${myProfile.id}` : "/app/profile/create",
      actionLabel: myProfile ? "View" : "Create",
    },
    {
      label: "Active Listings",
      value: String(activeListings.length),
      sub: `${myListings.length} total listings`,
      icon: ListChecks,
      color: "text-primary",
      bg: "bg-primary/10",
      action: "/app/listings",
      actionLabel: "Manage",
    },
    {
      label: "City",
      value: currentUser.city,
      sub: "Gujarat · Foundwork Active",
      icon: MapPin,
      color: "text-violet-600",
      bg: "bg-violet-50",
      action: "/app/discover",
      actionLabel: "Discover",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Welcome back, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentUser.type === "worker"
              ? "Manage your profile, listings, and discover the local network."
              : "Discover service providers and manage your activity."}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <button
                  onClick={() => navigate(stat.action)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  {stat.actionLabel} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className={`text-xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h2 className="font-bold text-base text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {currentUser.type === "worker" && !myProfile && (
                  <button
                    onClick={() => navigate("/app/profile/create")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Zap className="w-4 h-4" />
                    Create Your Profile
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>
                )}
                {myProfile && (
                  <button
                    onClick={() => navigate(`/app/profile/${myProfile.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    View My Profile
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>
                )}
                {myProfile && (
                  <button
                    onClick={() => navigate("/app/profile/edit")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Edit Profile
                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>
                )}
                <button
                  onClick={() => navigate("/app/listings/add")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-muted-foreground" />
                  Add New Listing
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
                <button
                  onClick={() => navigate("/app/discover")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Discover Services
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
                <button
                  onClick={() => navigate("/app/listings")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                >
                  <ListChecks className="w-4 h-4 text-muted-foreground" />
                  My Listings
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
              </div>
            </motion.div>

            {/* Profile completeness (if worker) */}
            {currentUser.type === "worker" && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="mt-4 p-5 rounded-2xl border border-border bg-card"
              >
                <h2 className="font-bold text-base text-foreground mb-3">Setup Checklist</h2>
                <div className="space-y-2.5">
                  {[
                    { label: "Account created", done: true },
                    { label: "Profile created", done: !!myProfile },
                    { label: "Photos uploaded", done: !!myProfile && myProfile.photos.length > 0 },
                    { label: "Services added", done: !!myProfile && myProfile.services.length > 0 },
                    { label: "First listing added", done: myListings.length > 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${item.done ? "text-emerald-500" : "text-muted-foreground/30"}`}
                      />
                      <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Recent Profiles in your city */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base text-foreground">Nearby Service Providers</h2>
                <button
                  onClick={() => navigate("/app/discover")}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {recentProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => navigate(`/app/profile/${profile.id}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/3 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary flex-shrink-0">
                      {profile.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-foreground">{profile.name}</div>
                      <div className="text-xs text-muted-foreground">{profile.category}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-foreground">{profile.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{profile.city}</span>
                      </div>
                    </div>
                    {profile.verified && (
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex-shrink-0">
                        Verified
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* My recent listings */}
            {myListings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="mt-4 p-5 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base text-foreground">My Recent Listings</h2>
                  <button onClick={() => navigate("/app/listings")} className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                    Manage <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {myListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{listing.title}</div>
                        <div className="text-xs text-muted-foreground">{listing.category} · {listing.city} · {listing.price}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${listing.active ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        {listing.active ? "Active" : "Paused"}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
