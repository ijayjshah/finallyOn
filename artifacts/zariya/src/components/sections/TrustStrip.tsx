import { motion } from "framer-motion";

const categories = [
  "Electricians", "Plumbers", "Tailors", "Beauticians", "Mehendi Artists",
  "Carpenters", "Home Chefs", "Tutors", "AC Technicians", "Photographers",
  "Painters", "Bakers", "Event Planners", "Yoga Trainers", "Mobile Repair",
  "Catering", "Interior Designers", "Security Guards", "Gardeners", "Drivers",
  "Electricians", "Plumbers", "Tailors", "Beauticians", "Mehendi Artists",
  "Carpenters", "Home Chefs", "Tutors", "AC Technicians", "Photographers",
];

const cities = [
  { city: "Surat", count: "1,400+ workers", status: "live" },
  { city: "Ahmedabad", count: "1,800+ workers", status: "live" },
  { city: "Vadodara", count: "960+ workers", status: "live" },
  { city: "Navsari", count: "520+ workers", status: "live" },
  { city: "Rajkot", count: "Coming soon", status: "coming" },
  { city: "Gandhinagar", count: "Coming soon", status: "coming" },
];

export default function TrustStrip() {
  return (
    <section id="trust" className="py-16 border-y border-border overflow-hidden bg-muted/30">
      {/* Marquee */}
      <div className="relative mb-10">
        <div className="flex gap-3 animate-marquee whitespace-nowrap select-none">
          {categories.map((cat, i) => (
            <span
              key={`${cat}-${i}`}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground flex-shrink-0"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Gujarat cities */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6"
        >
          Foundwork is live across Gujarat
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {cities.map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={`text-center p-4 rounded-xl border bg-card ${c.status === "live" ? "border-primary/20 bg-primary/3" : "border-border opacity-60"}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${c.status === "live" ? "bg-primary" : "bg-muted-foreground"}`} />
                <div className="font-bold text-sm text-foreground">{c.city}</div>
              </div>
              <div className={`text-xs ${c.status === "live" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {c.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
