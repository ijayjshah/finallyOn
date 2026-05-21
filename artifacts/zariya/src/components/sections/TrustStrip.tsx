import { motion } from "framer-motion";

const categories = [
  "Electricians", "Plumbers", "Tutors", "Beauticians", "Mehendi Artists",
  "Tailors", "Carpenters", "Repair Workers", "Photographers", "Home Chefs",
  "Artisans", "Freelancers", "Fitness Trainers", "AC Technicians", "Painters",
  "Interior Designers", "Event Planners", "Caterers", "Musicians", "Yoga Instructors",
  "Electricians", "Plumbers", "Tutors", "Beauticians", "Mehendi Artists",
  "Tailors", "Carpenters", "Repair Workers", "Photographers", "Home Chefs",
];

const cities = [
  { city: "Delhi NCR", count: "1,200+ workers" },
  { city: "Mumbai", count: "980+ workers" },
  { city: "Bengaluru", count: "850+ workers" },
  { city: "Pune", count: "620+ workers" },
  { city: "Hyderabad", count: "540+ workers" },
  { city: "Chennai", count: "480+ workers" },
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

      {/* Cities grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6"
        >
          Early adopters across India
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {cities.map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="text-center p-4 rounded-xl border border-border bg-card"
              data-testid={`city-card-${c.city.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="font-bold text-sm text-foreground">{c.city}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
