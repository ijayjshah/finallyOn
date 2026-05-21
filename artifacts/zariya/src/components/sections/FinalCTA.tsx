import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Free profile, always",
  "Go live in under 3 minutes",
  "No design or coding skills needed",
  "Local discovery from day one",
];

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-28 px-6 md:px-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
            Get Early Access
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
            Bring your local business
            <span className="text-primary"> online with Foundwork.</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of service providers and sellers who are building their digital presence before the waitlist closes in your city.
          </p>

          {/* Benefit list */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>

          {/* Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-primary/20 bg-primary/6"
              data-testid="cta-success"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <div className="font-bold text-lg text-foreground">You're on the list.</div>
              <p className="text-sm text-muted-foreground">We'll reach out as soon as your city opens up.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              data-testid="cta-form"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 w-full px-5 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                data-testid="input-cta-email"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/25"
                data-testid="button-cta-submit"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-5">
            No spam. No payments required. Your data stays private.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
