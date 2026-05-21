import { motion } from "framer-motion";
import { WifiOff, FileX, MessageSquare, ShieldOff, MapPinOff, Users } from "lucide-react";

const problems = [
  {
    icon: WifiOff,
    title: "No digital identity",
    desc: "Most local workers exist only on WhatsApp. There's no professional page, no portfolio, no way for strangers to trust them.",
  },
  {
    icon: FileX,
    title: "No structured portfolio",
    desc: "Years of skilled work sits in photo albums and memory. Customers can't see proof of quality before they hire.",
  },
  {
    icon: MessageSquare,
    title: "Scattered inquiries",
    desc: "Leads come from WhatsApp, calls, and word of mouth. No history, no tracking, no way to follow up properly.",
  },
  {
    icon: ShieldOff,
    title: "No trust layer",
    desc: "A customer searching for a plumber in a new city has no reliable signal for quality, verification, or safety.",
  },
  {
    icon: MapPinOff,
    title: "Invisible locally",
    desc: "Someone 500 metres away is looking for exactly what you offer — but they'll never find you. You're not on the map.",
  },
  {
    icon: Users,
    title: "No repeat customer system",
    desc: "Every customer interaction starts from scratch. No history, no reminders, no loyalty — just the hope they call again.",
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-6 md:px-10 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-background/40 mb-4">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-background leading-tight">
            Most local workers are{" "}
            <span className="text-primary">invisible online.</span>
          </h2>
          <p className="mt-5 text-lg text-background/60 leading-relaxed">
            India has 400 million informal workers. The systems that exist were built for corporations,
            not for the tailor in Lajpat Nagar or the tutor in Koregaon Park.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10 rounded-2xl overflow-hidden border border-background/10">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="p-8 bg-foreground hover:bg-background/[0.04] transition-colors"
              data-testid={`problem-card-${i}`}
            >
              <div className="w-10 h-10 rounded-xl bg-background/8 border border-background/10 flex items-center justify-center mb-5">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-base text-background mb-2">{p.title}</h3>
              <p className="text-sm text-background/55 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
