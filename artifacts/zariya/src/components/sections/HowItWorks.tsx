import { motion } from "framer-motion";
import { UserPlus, Upload, MapPin, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create your profile",
    desc: "Enter your name, service category, and city. Foundwork builds your professional profile in under 3 minutes — no form overload, no technical setup.",
    detail: "Works on any smartphone. No app download required to start.",
  },
  {
    num: "02",
    icon: Upload,
    title: "Upload your work",
    desc: "Add photos of your past work, list your services and pricing, and describe your experience. Your portfolio assembles automatically.",
    detail: "Add products to your mini-store in the same step.",
  },
  {
    num: "03",
    icon: MapPin,
    title: "Get discovered locally",
    desc: "Your profile goes live in Foundwork's local search. Nearby customers searching for your service category find you by area, rating, and availability.",
    detail: "Completely organic. No ads needed to start being found.",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Manage and grow",
    desc: "Receive inquiries, confirm bookings, track your work history, collect reviews, and build a trusted local reputation — month after month.",
    detail: "Your profile grows stronger with every completed job.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-10 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Four steps to your
            <span className="text-primary"> digital business.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-border z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className="relative z-10 flex flex-col"
              data-testid={`step-${step.num}`}
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/25 flex-shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-125 animate-ping" style={{ animationDuration: `${2.5 + i * 0.4}s` }} />
                </div>
                <span className="text-4xl font-black text-border">{step.num}</span>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card flex-1 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-bold text-base text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                <p className="text-xs text-primary font-semibold">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
