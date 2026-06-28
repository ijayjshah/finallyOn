import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, MapPin, Shield, Phone, Clock, CheckCircle2, Edit, Share2,
  Briefcase, ChevronLeft, ChevronRight, MessageCircle, ExternalLink, Store, Wrench,
} from "lucide-react";
import type { ServiceProfile } from "@/types";
import { getPublicProfileUrl } from "@/lib/profile-url";
import TrustCardShare from "@/components/TrustCardShare";

interface ProfileViewContentProps {
  profile: ServiceProfile;
  isOwner: boolean;
  onEdit?: () => void;
  onShareCopied?: () => void;
  showShareLink?: boolean;
}

export default function ProfileViewContent({
  profile,
  isOwner,
  onEdit,
  onShareCopied,
  showShareLink = false,
}: ProfileViewContentProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const prevPhoto = () => setPhotoIdx((i) => (i - 1 + profile.photos.length) % profile.photos.length);
  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % profile.photos.length);

  const waNumber = profile.whatsappNumber?.replace(/\D/g, "") || profile.phone?.replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Hi ${profile.name.split(" ")[0]}, I found your profile on FinallyOn. I'd like to inquire about your ${profile.profileType === "business" ? "business" : "services"}.`,
  );

  const isBusinessProfile = profile.profileType === "business";
  const ProfileTypeIcon = isBusinessProfile ? Store : Wrench;

  const getMapEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const q = u.searchParams.get("q");
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
    } catch {}
    return null;
  };

  const mapEmbedUrl = profile.mapUrl ? getMapEmbedUrl(profile.mapUrl) : null;

  const copyShareLink = async () => {
    const url = getPublicProfileUrl(profile.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShareCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-7">
      <div className="grid lg:grid-cols-3 gap-7">
      <div className="lg:col-span-1 space-y-4">
        {profile.photos.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden border border-border aspect-square">
            <img
              src={profile.photos[photoIdx]}
              alt="Work photo"
              className="w-full h-full object-cover"
            />
            {profile.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {profile.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-square rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-7xl font-black text-primary/20">{profile.name.charAt(0)}</span>
          </div>
        )}

        {profile.photos.length > 1 && (
          <div className="flex gap-2">
            {profile.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === photoIdx ? "border-primary" : "border-border"}`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {isOwner && profile.approvalStatus === "approved" && profile.trustCardUrl && (
          <TrustCardShare
            trustCardUrl={profile.trustCardUrl}
            profileName={profile.name}
          />
        )}

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className={`flex items-center gap-1.5 mb-1.5 px-2.5 py-1 rounded-full w-fit text-[10px] font-bold ${
                isBusinessProfile ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}>
                <ProfileTypeIcon className="w-3 h-3" />
                {isBusinessProfile ? "Business" : "Service Provider"}
              </div>
              <h1 className="text-xl font-extrabold text-foreground">{profile.name}</h1>
              <p className="text-sm font-semibold text-primary">{profile.category}</p>
            </div>
            {profile.verified && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary">Verified</span>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {profile.area}, Navsari
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {profile.experience} of experience
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${profile.available ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              <span className={`font-medium text-sm ${profile.available ? "text-emerald-600" : "text-muted-foreground"}`}>
                {profile.available ? "Currently available" : "Currently unavailable"}
              </span>
            </div>
          </div>

          {profile.rating > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(profile.rating) ? "text-amber-400 fill-amber-400" : "text-amber-200"}`} />
                ))}
              </div>
              <span className="font-bold text-sm text-foreground">{profile.rating}</span>
              <span className="text-xs text-muted-foreground">({profile.reviewCount} reviews)</span>
            </div>
          )}

          {isOwner ? (
            <div className="space-y-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/8 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
              {showShareLink && profile.slug && (
                <button
                  onClick={() => void copyShareLink()}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? "Link copied!" : "Copy Instagram link"}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <a
                href={`https://wa.me/${waNumber}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp {profile.name.split(" ")[0]}
              </a>
              <a
                href={`tel:${profile.phone}`}
                className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call {profile.name.split(" ")[0]}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-2xl border border-border bg-card"
        >
          <h2 className="font-bold text-base text-foreground mb-3">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{profile.description}</p>
        </motion.div>

        {profile.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <h2 className="font-bold text-base text-foreground mb-3">
              {isBusinessProfile ? "Specialities" : "Specialisations"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold border border-primary/15">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {profile.services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <h2 className="font-bold text-base text-foreground mb-4">
              {isBusinessProfile ? "Products & Offerings" : "Services & Pricing"}
            </h2>
            <div className="space-y-3">
              {profile.services.map((service) => (
                <div key={service.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-foreground">{service.name}</div>
                      {service.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
                      )}
                    </div>
                  </div>
                  {service.price && (
                    <div className="text-sm font-bold text-primary flex-shrink-0 whitespace-nowrap">{service.price}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(profile.mapUrl || mapEmbedUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-foreground">Location</h2>
                  <p className="text-xs text-muted-foreground">{profile.area}, Navsari, Gujarat</p>
                </div>
              </div>
              {profile.verified && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Shield className="w-3 h-3" />
                  Admin verified
                </div>
              )}
            </div>
            {mapEmbedUrl && (
              <div className="h-56 bg-muted">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${profile.name} location map`}
                />
              </div>
            )}
            <div className="px-6 py-3 border-t border-border">
              <a
                href={profile.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="p-6 rounded-2xl border border-border bg-card"
        >
          <h2 className="font-bold text-base text-foreground mb-4">Contact Information</h2>
          <div className="space-y-3">
            {profile.phone && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="text-sm font-semibold text-foreground">{profile.phone}</div>
                </div>
                <div className="flex gap-2">
                  {profile.whatsappNumber && (
                    <a
                      href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`tel:${profile.phone}`}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Member since</div>
                <div className="text-sm font-semibold text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {!isOwner && (
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 rounded-2xl bg-[#25D366] text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-[#25D366]/25"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={`tel:${profile.phone}`}
              className="py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
