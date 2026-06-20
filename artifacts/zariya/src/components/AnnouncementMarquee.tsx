export default function AnnouncementMarquee({ fixed = false }: { fixed?: boolean }) {
  const items = [
    "FinallyOn App Coming Soon",
    "Now Live in Navsari, Gujarat",
    "Verified Local Businesses",
    "Free to List · Free to Find",
    "WhatsApp Booking in One Tap",
    "District-First Discovery",
  ];

  const repeated = [...items, ...items];

  return (
    <div className={`w-full bg-foreground overflow-hidden py-2.5 relative z-[60] ${fixed ? "fixed top-0 left-0 right-0" : ""}`}>
      <div className="flex items-center gap-0 animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-xs font-semibold text-background/70 px-6">
            <span className="w-1 h-1 rounded-full bg-primary inline-block flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </div>
  );
}
