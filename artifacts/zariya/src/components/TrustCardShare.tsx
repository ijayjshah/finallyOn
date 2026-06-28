import { useState } from "react";
import { Download, ImageIcon, Loader2 } from "lucide-react";
import { BRAND } from "@/types";

interface TrustCardShareProps {
  trustCardUrl: string;
  profileName: string;
}

export async function downloadTrustCard(trustCardUrl: string, profileName: string) {
  const res = await fetch(trustCardUrl);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${profileName.replace(/\s+/g, "-").toLowerCase()}-finallyon-card.png`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function TrustCardShare({ trustCardUrl, profileName }: TrustCardShareProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadTrustCard(trustCardUrl, profileName);
    } catch {
      window.open(trustCardUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-base text-foreground leading-tight">Your Digital Business Card</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Download your verified {BRAND.name} card and share it on Instagram, WhatsApp Status, or anywhere.
          </p>
        </div>
      </div>

      <button
        onClick={() => void handleDownload()}
        disabled={downloading}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {downloading ? "Downloading…" : "Download business card"}
      </button>
    </div>
  );
}
