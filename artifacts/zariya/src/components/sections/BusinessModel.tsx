import { motion } from "framer-motion";
import { Zap, Rocket, Globe } from "lucide-react";

const phases = [
  {
    icon: Zap,
    phase: "Now",
    label: "Foundation",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    items: [
      { title: "Commerce tools", desc: "Mini-stores, product listings, order management" },
      { title: "Seller subscriptions", desc: "Tiered plans for enhanced visibility and features" },
      { title: "Promoted listings", desc: "City-level boosts for workers and sellers" },
      { title: "Transaction rails", desc: "Facilitated payments with platform commission" },
    ],
  },
  {
    icon: Rocket,
    phase: "Soon",
    label: "Scale",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    dot: "bg-violet-500",
    items: [
      { title: "Logistics network", desc: "Last-mile delivery coordination for sellers" },
      { title: "Local advertising", desc: "Hyper-targeted ads for businesses near customers" },
      { title: "Payments platform", desc: "In-platform wallet and payment collection" },
    ],
  },
  {
    icon: Globe,
    phase: "Later",
    label: "Infrastructure",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    items: [
      { title: "Microfinancing", desc: "Working capital access for verified workers" },
      { title: "Business insurance", desc: "Embedded insurance products for micro-businesses" },
      { title: "Supplier access", desc: "B2B supply chain for small sellers and artisans" },
      { title: "Growth tools", desc: "CRM, analytics, and business intelligence layer" },
    ],
  },
];

const metrics = [
  { value: "$600B+", label: "Local services market in India" },
  { value: "400M+", label: "Informal workers nationally" },
  { value: "12%", label: "Projected CAGR of gig economy" },
  { value: "3%", label: "Currently served by digital tools" },
];

export default function BusinessModel() {
  return (
    <section className="py-24 px-6 md:px-10 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            A platform built to
            <span className="text-primary"> compound over time.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Foundwork starts with identity and discovery — the two things every local worker needs first.
            The revenue model deepens as the worker grows.
          </p>
        </motion.div>

        {/* Market metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center p-6 rounded-2xl border border-border bg-card"
              data-testid={`metric-${i}`}
            >
              <div className="text-3xl font-black text-foreground mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Phase columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={`rounded-2xl border ${phase.border} bg-card p-7`}
              data-testid={`phase-${phase.phase.toLowerCase()}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${phase.bg} flex items-center justify-center`}>
                  <phase.icon className={`w-5 h-5 ${phase.color}`} />
                </div>
                <div>
                  <div className={`text-xs font-black uppercase tracking-widest ${phase.color}`}>{phase.phase}</div>
                  <div className="font-bold text-base text-foreground">{phase.label}</div>
                </div>
              </div>

              <div className="space-y-4">
                {phase.items.map((item, j) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 + j * 0.07, duration: 0.4 }}
                    className="flex gap-3"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${phase.dot} mt-1.5 flex-shrink-0`} />
                    <div>
                      <div className="text-sm font-bold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
