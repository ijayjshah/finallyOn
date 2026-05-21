import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const notThis = [
  "A classifieds board",
  "A freelancer marketplace",
  "A local e-commerce site",
  "A service aggregator",
  "Another booking app",
];

const thisInstead = [
  "Digital identity infrastructure for informal workers",
  "The economic participation layer for local India",
  "A trust and verification operating system",
  "The portfolio generation engine for 400M workers",
  "The local economy's commerce and growth platform",
];

export default function Positioning() {
  return (
    <section className="py-24 px-6 md:px-10 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-background/40 mb-4">Category Positioning</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-background leading-tight mb-6">
            Foundwork is not a marketplace.
          </h2>
          <p className="text-xl text-primary font-bold">
            It is digital infrastructure for local economic participation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* NOT */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl border border-background/10 bg-background/[0.04]"
          >
            <h3 className="font-bold text-lg text-background/50 mb-6 flex items-center gap-2">
              <span className="text-2xl">—</span> Not this
            </h3>
            <div className="space-y-3">
              {notThis.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-background/40"
                >
                  <div className="w-5 h-5 rounded-full border border-background/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-px bg-background/30" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* THIS */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl border border-primary/30 bg-primary/8"
          >
            <h3 className="font-bold text-lg text-background mb-6 flex items-center gap-2">
              <span className="text-primary text-2xl">+</span> This instead
            </h3>
            <div className="space-y-3">
              {thisInstead.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-background"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bold quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-4xl mx-auto"
        >
          <blockquote className="text-2xl md:text-3xl font-bold text-background/80 leading-snug mb-8 italic">
            "We are building the identity and operating layer for India's 400 million informal workers —
            turning invisible work into discoverable, trusted, structured digital business."
          </blockquote>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.querySelector("#waitlist");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
              data-testid="button-positioning-cta"
            >
              Request investor brief
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-background/30">Available for seed-round conversations</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
