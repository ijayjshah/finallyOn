import { useState } from "react";
import { Download, Share2, Check, ImageIcon } from "lucide-react";
import { BRAND } from "@/types";

interface TrustCardShareProps {
  trustCardUrl: string;
  profileName: string;
}

export default function TrustCardShare({ trustCardUrl, profileName }: TrustCardShareProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-[#0a0a0a] to-[#111] text-white overflow-hidden">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-base">Your Digital Business Card</h2>
          <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
            Share this card on Instagram, WhatsApp Status, or anywhere — your verified {BRAND.name} profile in one image.
          </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10 mb-4 bg-black">
        <img
          src={trustCardUrl}
          alt={`${profileName} digital business card`}
          className="w-full h-auto block"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => void downloadCard()}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download card
        </button>
        <button
          onClick={() => void shareCard()}
          className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-sm font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Link copied!" : "Share card"}
        </button>
      </div>
    </div>
  );
}
