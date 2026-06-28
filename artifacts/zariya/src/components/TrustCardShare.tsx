import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Check, ImageIcon } from "lucide-react";
import { BRAND } from "@/types";

interface TrustCardPreviewProps {
  trustCardUrl: string;
  profileName: string;
  className?: string;
  /** sidebar = fill column on profile · banner = fixed size in horizontal layout */
  layout?: "sidebar" | "banner";
}

export function TrustCardPreview({
  trustCardUrl,
  profileName,
  className = "",
  layout = "banner",
}: TrustCardPreviewProps) {
  const sizeClass =
    layout === "sidebar"
      ? "w-full max-w-[280px] mx-auto"
      : "w-[min(100%,280px)] lg:w-[200px]";

  return (
    <div className={`relative flex justify-center ${className}`}>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[1122/1402] bg-primary/30 blur-3xl rounded-full pointer-events-none ${
          layout === "sidebar" ? "w-[70%] max-w-[220px]" : "w-[75%] max-w-[240px] lg:max-w-[180px]"
        }`}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`relative shrink-0 ${sizeClass}`}
      >
        <div className="rounded-[1.35rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/15 lg:rounded-2xl">
          <img
            src={trustCardUrl}
            alt={`${profileName} digital business card`}
            className="block w-full h-auto"
            style={{ aspectRatio: "1122 / 1402" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

interface TrustCardShareProps {
  trustCardUrl: string;
  profileName: string;
  /** sidebar = profile column · banner = dashboard / wide pages */
  layout?: "sidebar" | "banner";
}

export default function TrustCardShare({
  trustCardUrl,
  profileName,
  layout = "banner",
}: TrustCardShareProps) {
  const [copied, setCopied] = useState(false);
  const isSidebar = layout === "sidebar";

  const downloadCard = async () => {
    try {
      const res = await fetch(trustCardUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profileName.replace(/\s+/g, "-").toLowerCase()}-finallyon-card.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(trustCardUrl, "_blank", "noopener,noreferrer");
    }
  };

  const shareCard = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profileName} on ${BRAND.name}`,
          text: `Check out ${profileName}'s verified profile on ${BRAND.name}`,
          url: trustCardUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(trustCardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const buttons = (
    <>
      <button
        onClick={() => void downloadCard()}
        className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download card
      </button>
      <button
        onClick={() => void shareCard()}
        className="flex-1 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-bold hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {copied ? "Link copied!" : "Share card"}
      </button>
    </>
  );

  const header = (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
        <ImageIcon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h2 className="font-bold text-base text-foreground leading-tight">Your Digital Business Card</h2>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          Share on Instagram, WhatsApp Status, or anywhere — your verified {BRAND.name} profile in one image.
        </p>
      </div>
    </div>
  );

  const cardStage = (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0a0a0a] via-[#070707] to-[#030303] py-8 px-5 overflow-hidden lg:py-5 lg:px-5">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(24,72,199,0.18),transparent)] pointer-events-none"
        aria-hidden
      />
      <div className="relative flex flex-col items-center">
        <TrustCardPreview
          trustCardUrl={trustCardUrl}
          profileName={profileName}
          layout={layout}
        />
        {!isSidebar && (
          <p className="text-center text-[10px] text-white/40 mt-5 tracking-wide uppercase lg:hidden">
            Tap download for full resolution
          </p>
        )}
      </div>
    </div>
  );

  if (isSidebar) {
    return (
      <div className="w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/4 overflow-hidden">
        <div className="p-5 space-y-4">
          {header}
          {cardStage}
          <div className="flex flex-col sm:flex-row gap-2">{buttons}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/4 overflow-hidden">
      <div className="p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          <div className="lg:flex-1 lg:min-w-0 space-y-4 lg:space-y-5">
            {header}
            <div className="hidden lg:flex gap-2">{buttons}</div>
          </div>

          <div className="w-full lg:w-auto lg:shrink-0 mt-1 lg:mt-0">
            <div className="lg:rounded-2xl lg:ring-1 lg:ring-black/10">{cardStage}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 lg:hidden mt-4">{buttons}</div>
        </div>
      </div>
    </div>
  );
}
