import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { getPublicProfileUrl } from "@/lib/profile-url";
import { BRAND } from "@/types";

interface ShareProfileCardProps {
  slug: string;
  profileName: string;
}

export default function ShareProfileCard({ slug, profileName }: ShareProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getPublicProfileUrl(slug);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Share2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-base text-foreground">Share on Instagram</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Your profile is live. Put this link in your Instagram bio so anyone can view {profileName.split(" ")[0]}&apos;s services — no login needed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-background/80 border border-border mb-3">
        <code className="flex-1 text-xs text-foreground truncate font-medium">{shareUrl}</code>
        <button
          onClick={() => void copyLink()}
          className="flex-shrink-0 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={() => void copyLink()}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        {copied ? "Link copied!" : "Copy profile link"}
      </button>

      <p className="text-[10px] text-muted-foreground text-center mt-2.5">
        Powered by {BRAND.name} · Navsari&apos;s local platform
      </p>
    </div>
  );
}
