import { motion } from "framer-motion";
import { IdCard, Layers, Search, CalendarCheck, ShoppingBag, Star } from "lucide-react";

const solutions = [
  {
    icon: IdCard,
    title: "Digital Identity",
    desc: "Every worker gets a permanent, professional profile page — their digital business card on the internet.",
    tag: "Free Forever",
  },
  {
    icon: Layers,
    title: "Auto-Generated Portfolio",
    desc: "Foundwork designs a beautiful, structured portfolio page for every service provider. No tools required.",
    tag: "Signature Feature",
  },
  {
    icon: Search,
    title: "Local Discovery",
    desc: "Customers searching by area, service type, and ratings find you organically — no paid ads needed to start.",
    tag: "Hyperlocal",
  },
  {
    icon: CalendarCheck,
    title: "Bookings & Inquiries",
    desc: "Accept inquiries, schedule jobs, and track your work history — all in one clean, mobile-first interface.",
    tag: "Structured Flow",
  },
  {
    icon: ShoppingBag,
    title: "Mini Storefront",
    desc: "Sell products alongside your services. Home bakers, artisans, and resellers get a catalogue out of the box.",
    tag: "Commerce Ready",
  },
  {
    icon: Star,
    title: "Trust & Reviews",
    desc: "Build credibility through ratings, verification badges, and a public record of work done — customers trust proven workers.",
    tag: "Trust Layer",
  },
];

export default function Solution() {
  return (
    <section className="py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">The Solution</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            A complete digital business presence,
            <span className="text-primary"> built for you.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Foundwork gives every local worker the tools that were only available to large businesses — structured,
            beautiful, and ready in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              className="group p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              data-testid={`solution-card-${i}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {s.tag}
                </span>
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
