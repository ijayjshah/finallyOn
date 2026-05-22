import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  User, ListChecks, Search, PlusCircle, ArrowRight, Star,
  MapPin, CheckCircle2, Zap, Clock, Shield, MessageCircle, Briefcase,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/types";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { currentUser, getProfileByUserId, getListingsByUserId, profiles } = useApp();

  if (!currentUser) return null;

  const myProfile = getProfileByUserId(currentUser.id);
  const myListings = getListingsByUserId(currentUser.id);
  const activeListings = myListings.filter((l) => l.active);
  const pendingListings = myListings.filter((l) => l.approvalStatus === "pending");
  const recentProfiles = profiles.filter((p) => p.approvalStatus === "approved").slice(0, 3);

  const profileApproval = myProfile?.approvalStatus ?? null;

  const stats = [
    {
      label: "Profile Status",
      value: myProfile
        ? profileApproval === "approved" ? "Live ✓" : profileApproval === "pending" ? "Under Review" : "Rejected"
        : "Not Created",
      sub: myProfile ? myProfile.category : "Set up your profile",
      icon: User,
      color: myProfile
        ? profileApproval === "approved" ? "text-emerald-600" : profileApproval === "pending" ? "text-amber-600" : "text-destructive"
        : "text-amber-600",
      bg: myProfile
        ? profileApproval === "approved" ? "bg-emerald-50" : profileApproval === "pending" ? "bg-amber-50" : "bg-destructive/10"
        : "bg-amber-50",
      action: myProfile ? `/app/profile/${myProfile.id}` : "/app/profile/create",
      actionLabel: myProfile ? "View" : "Create",
    },
    {
      label: "Active Listings",
      value: String(activeListings.length),
      sub: `${myListings.length} total · ${pendingListings.length} pending review`,
      icon: ListChecks,
      color: "text-primary",
      bg: "bg-primary/10",
      action: "/app/listings",
      actionLabel: "Manage",
    },
    {
      label: "District",
      value: currentUser.district || currentUser.city || "Navsari",
      sub: `Gujarat · ${BRAND.name} Active`,
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
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Welcome back, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {currentUser.district || "Navsari"}, Gujarat · {BRAND.name} Dashboard
          </p>
        </motion.div>

        {/* Approval alert */}
        {profileApproval === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3"
          >
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-amber-800">Your profile is under admin review</div>
              <p className="text-xs text-amber-700 mt-0.5">
                We're verifying your Google Maps location, photos, and details. This usually takes within 24 hours.
                Your profile is not yet visible to customers.
              </p>
            </div>
          </motion.div>
        )}

        {profileApproval === "rejected" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/8 flex items-start gap-3"
          >
            <Shield className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-destructive">Your profile was not approved</div>
              <p className="text-xs text-destructive/80 mt-0.5">
                Check your profile for the reason and make corrections. Then resubmit for review.
              </p>
              <button
                onClick={() => navigate("/app/profile/edit")}
                className="mt-2 text-xs font-bold text-destructive underline"
              >
                Edit & Resubmit →
              </button>
            </div>
          </motion.div>
        )}

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
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h2 className="font-bold text-base text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {!myProfile && (
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
                  onClick={() => navigate("/app/jobs")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  Jobs Board
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
              </div>
            </motion.div>

            {/* Setup checklist */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h2 className="font-bold text-base text-foreground mb-3">Setup Checklist</h2>
              <div className="space-y-2.5">
                {[
                  { label: "Account created", done: true },
                  { label: "Profile created", done: !!myProfile },
                  { label: "WhatsApp number added", done: !!myProfile?.whatsappNumber || !!currentUser.whatsappNumber },
                  { label: "Google Maps location added", done: !!myProfile?.mapUrl },
                  { label: "Photos uploaded", done: !!myProfile && myProfile.photos.length > 0 },
                  { label: "Services/products added", done: !!myProfile && myProfile.services.length > 0 },
                  { label: "Admin approved", done: profileApproval === "approved" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${item.done ? "text-emerald-500" : "text-muted-foreground/30"}`} />
                    <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              {!myProfile?.mapUrl && myProfile && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <strong>Required:</strong> Add your Google Maps location to complete your profile.
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Nearby approved providers */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base text-foreground">Verified Providers in Navsari</h2>
                <button
                  onClick={() => navigate("/app/discover")}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {recentProfiles.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No approved profiles yet.</p>
                )}
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
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-foreground">{profile.name}</span>
                        {profile.mapUrl && <MapPin className="w-3 h-3 text-emerald-500" />}
                        {profile.whatsappNumber && <MessageCircle className="w-3 h-3 text-[#25D366]" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{profile.category} · {profile.area}, Navsari</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-foreground">{profile.rating}</span>
                        </div>
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

            {/* My listings */}
            {myListings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="p-5 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base text-foreground">My Listings</h2>
                  <button onClick={() => navigate("/app/listings")} className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                    Manage <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {myListings.slice(0, 4).map((listing) => (
                    <div key={listing.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{listing.title}</div>
                        <div className="text-xs text-muted-foreground">{listing.category} · {listing.area}, Navsari · {listing.price}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {listing.approvalStatus === "pending" && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {listing.approvalStatus === "approved" && listing.active && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                            Live
                          </span>
                        )}
                        {listing.approvalStatus === "rejected" && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                            Rejected
                          </span>
                        )}
                      </div>
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
