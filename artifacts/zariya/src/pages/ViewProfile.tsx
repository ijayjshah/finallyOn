import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import ProfileViewContent from "@/components/ProfileViewContent";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import type { ServiceProfile } from "@/types";

export default function ViewProfile() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { getProfileById, currentUser } = useApp();
  const [profile, setProfile] = useState<ServiceProfile | null | undefined>(
    () => getProfileById(params.id) ?? undefined,
  );
  const [loading, setLoading] = useState(!getProfileById(params.id));

  useEffect(() => {
    const cached = getProfileById(params.id);
    if (cached) {
      setProfile(cached);
      setLoading(false);
      return;
    }
    let cancelled = false;
    void api.getProfile(params.id).then((res) => {
      if (cancelled) return;
      setProfile(res.data?.profile ?? null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [params.id, getProfileById]);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground text-sm">Loading profile…</div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">This profile may have been removed.</p>
          <button onClick={() => navigate("/app/discover")} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
            Browse Profiles
          </button>
        </div>
      </AppLayout>
    );
  }

  const isOwner = currentUser?.id === profile.userId;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <button
          onClick={() => navigate("/app/discover")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </button>

        <ProfileViewContent
          profile={profile}
          isOwner={isOwner}
          onEdit={isOwner ? () => navigate("/app/profile/edit") : undefined}
          showShareLink={isOwner && profile.approvalStatus === "approved"}
        />
      </div>
    </AppLayout>
  );
}
