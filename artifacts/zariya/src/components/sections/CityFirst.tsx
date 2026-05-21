import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const cities = [
  { name: "Surat", status: "live", top: "52%", left: "32%", workers: "1,400+" },
  { name: "Ahmedabad", status: "live", top: "30%", left: "28%", workers: "1,800+" },
  { name: "Vadodara", status: "live", top: "42%", left: "38%", workers: "960+" },
  { name: "Navsari", status: "live", top: "62%", left: "28%", workers: "520+" },
  { name: "Rajkot", status: "coming", top: "28%", left: "14%", workers: "" },
  { name: "Gandhinagar", status: "coming", top: "26%", left: "30%", workers: "" },
  { name: "Bhavnagar", status: "coming", top: "48%", left: "20%", workers: "" },
];

const reasons = [
  {
    title: "Denser supply = better experience",
    desc: "When enough workers are in one city, customers always find someone nearby. The platform works better for everyone.",
  },
  {
    title: "Trust built through proximity",
    desc: "Local reviews, known areas, and shared neighbourhoods in Gujarat create a trust signal no national platform can replicate.",
  },
  {
    title: "Quality control city by city",
    desc: "Launching in Surat, Ahmedabad, Vadodara, and Navsari first lets us verify workers, respond to issues, and maintain standards.",
  },
  {
    title: "Repeat demand compounds",
    desc: "Happy local customers come back. A dense city network creates a flywheel — more workers, more customers, more reviews.",
  },
];

export default function CityFirst() {
  return (
    <section id="cities" className="py-24 px-6 md:px-10 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold text-background/40 mb-4">Launching in Gujarat</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-background leading-tight mb-3">
              Starting in Gujarat.
              <span className="text-primary"> Growing with intent.</span>
            </h2>
            <p className="text-base text-background/50 font-medium mb-2">
              Navsari · Surat · Ahmedabad · Vadodara — and expanding.
            </p>
            <p className="text-lg text-background/60 leading-relaxed mb-10">
              Foundwork doesn't try to be everywhere at once. We go deep in Gujarat first —
              building real density, real trust, and real utility before we scale to the rest of India.
            </p>

            <div className="space-y-6">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-background mb-1">{r.title}</div>
                    <div className="text-sm text-background/55 leading-relaxed">{r.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Gujarat map visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border border-background/10 bg-background/5 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* City dots */}
              {cities.map((city, i) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                  className="absolute flex flex-col items-center"
                  style={{ top: city.top, left: city.left, transform: "translate(-50%, -50%)" }}
                >
                  {city.status === "live" ? (
                    <>
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                        <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                      </div>
                      <div className="text-center mt-1">
                        <div className="text-[9px] font-bold text-background whitespace-nowrap">{city.name}</div>
                        {city.workers && (
                          <div className="text-[8px] text-primary whitespace-nowrap">{city.workers}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-background/20 border border-background/30" />
                      <span className="text-[9px] text-background/30 mt-1 whitespace-nowrap">{city.name}</span>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[10px] text-background/60 font-medium">Live in Gujarat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-background/20 border border-background/30" />
                  <span className="text-[10px] text-background/40 font-medium">Expanding soon</span>
                </div>
              </div>

              <div className="absolute top-4 right-4 text-[10px] text-background/20 font-semibold tracking-widest uppercase">Gujarat</div>
            </div>

            {/* City cards below */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {cities.filter((c) => c.status === "live").map((city) => (
                <div key={city.name} className="flex items-center gap-3 p-3 rounded-xl bg-background/5 border border-background/10">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-background">{city.name}</div>
                    <div className="text-[10px] text-primary">{city.workers} workers</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
