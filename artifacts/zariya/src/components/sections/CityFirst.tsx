import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const cities = [
  { name: "Delhi NCR", status: "live", top: "18%", left: "32%" },
  { name: "Mumbai", status: "live", top: "52%", left: "22%" },
  { name: "Bengaluru", status: "live", top: "68%", left: "34%" },
  { name: "Pune", status: "live", top: "58%", left: "26%" },
  { name: "Hyderabad", status: "coming", top: "60%", left: "42%" },
  { name: "Chennai", status: "coming", top: "74%", left: "40%" },
  { name: "Kolkata", status: "coming", top: "38%", left: "68%" },
  { name: "Ahmedabad", status: "coming", top: "42%", left: "22%" },
  { name: "Jaipur", status: "coming", top: "30%", left: "28%" },
];

const reasons = [
  {
    title: "Denser supply = better experience",
    desc: "When enough workers are in one city, customers always find someone nearby. The platform works better for everyone.",
  },
  {
    title: "Trust built through proximity",
    desc: "Local reviews, known areas, and shared neighbourhoods create a trust signal that national platforms can't replicate.",
  },
  {
    title: "Operational quality control",
    desc: "Launching city by city lets us verify workers, respond to issues, and maintain service standards before expanding.",
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
            <p className="text-xs uppercase tracking-widest font-semibold text-background/40 mb-4">City-First Model</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-background leading-tight mb-6">
              We launch city by city.
              <span className="text-primary"> Intentionally.</span>
            </h2>
            <p className="text-lg text-background/60 leading-relaxed mb-10">
              Foundwork doesn't try to be everywhere at once. We go deep in one city before moving to the next —
              building real density, real trust, and real utility before we scale.
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
                  data-testid={`city-reason-${i}`}
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

          {/* Right — abstract city map */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border border-background/10 bg-background/5 overflow-hidden">
              {/* Grid lines */}
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
                  data-testid={`map-city-${city.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {city.status === "live" ? (
                    <>
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                        <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                      </div>
                      <span className="text-[9px] font-bold text-background mt-1 whitespace-nowrap">{city.name}</span>
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
                  <span className="text-[10px] text-background/60 font-medium">Live now</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-background/20 border border-background/30" />
                  <span className="text-[10px] text-background/40 font-medium">Coming soon</span>
                </div>
              </div>

              {/* India label */}
              <div className="absolute top-4 right-4 text-[10px] text-background/20 font-semibold tracking-widest uppercase">India</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
