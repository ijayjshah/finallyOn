import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileViewContent from "@/components/ProfileViewContent";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { BRAND } from "@/types";
import type { ServiceProfile } from "@/types";

export default function PublicProfile() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { currentUser } = useApp();
  const [profile, setProfile] = useState<ServiceProfile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void api.getProfileBySlug(params.slug).then((res) => {
      if (cancelled) return;
      setProfile(res.data?.profile ?? null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [params.slug]);

  useEffect(() => {
    if (!profile) return;
    document.title = `${profile.name} — ${BRAND.name}`;
    return () => { document.title = BRAND.name; };
  }, [profile]);

  const isOwner = currentUser?.id === profile?.userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-16">
        {loading && (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground text-sm">
            Loading profile…
          </div>
        )}

        {!loading && !profile && (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This profile may have been removed or is not yet approved.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
            >
              Go to {BRAND.name}
            </button>
          </div>
        )}

        {profile && (
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <ProfileViewContent
              profile={profile}
              isOwner={isOwner}
              onEdit={isOwner ? () => navigate("/app/profile/edit") : undefined}
              showShareLink={isOwner && profile.approvalStatus === "approved"}
            />

            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="mt-10 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/4"
              >
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary mb-2">
                    Discover more in Navsari
                  </p>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">
                    Want to find more local services & businesses?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {BRAND.name} is Navsari&apos;s local platform — verified providers, businesses,
                    and jobs. Create a free account to browse, post jobs, and connect with your neighbourhood.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create free account
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Log in
                    </button>
                    <button
                      onClick={() => navigate("/how-it-works")}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-primary font-semibold text-sm flex items-center justify-center gap-1 hover:underline"
                    >
                      How it works <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
