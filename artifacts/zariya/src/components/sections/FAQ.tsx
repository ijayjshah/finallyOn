import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is it free for service providers?",
    a: "Yes. Your basic Foundwork profile — including your auto-generated portfolio page, local discovery listing, and inquiry inbox — is completely free, and always will be. We charge only when you want premium tools like promoted listings, advanced analytics, or enhanced booking features.",
  },
  {
    q: "Do I need a website or technical knowledge?",
    a: "No. Foundwork builds everything for you — your profile page, portfolio layout, gallery, and local search listing — all automatically. You need a smartphone and a few minutes. No website building, no design skills, no code.",
  },
  {
    q: "Can I sell products too?",
    a: "Yes. Foundwork supports both service providers and product sellers on the same profile. Add a mini-store to your profile and list your products — handmade goods, packaged food, clothing, crafts — and receive orders directly through the platform.",
  },
  {
    q: "How do customers find me?",
    a: "Customers search Foundwork by service category, area, ratings, and availability. If you're a verified tailor in Lajpat Nagar, customers searching for tailors in that area will find you. No ads needed. The more complete your profile and reviews, the higher you appear in local search.",
  },
  {
    q: "Can I use it in my city right now?",
    a: "Foundwork launches city by city to ensure quality and density. We're currently live in Delhi NCR, Mumbai, Bengaluru, and Pune. If your city isn't listed, join the waitlist — we'll notify you as soon as we expand. Priority access goes to early waitlist signups.",
  },
  {
    q: "How does booking and payment work?",
    a: "Customers send inquiries through your Foundwork profile. You confirm, negotiate terms, and mark the job complete — all through the app. Payment support (with digital collection) is coming soon. Right now the platform handles inquiry management and job tracking; direct payment happens off-platform.",
  },
  {
    q: "What if I don't have photos of my work?",
    a: "You can start without a gallery and add photos later. A profile with just your category, location, and a description still gets you into local search. We recommend adding at least 3 photos of your work — it significantly increases the number of inquiries you receive.",
  },
  {
    q: "Is my profile visible to everyone?",
    a: "Your public Foundwork profile is visible to anyone searching in your city. This is intentional — visibility is the core value. You control what's on your profile (photos, services, pricing) and can update it any time through the app.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 md:px-10 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Common questions,
            <span className="text-primary"> straight answers.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`rounded-2xl border transition-all duration-200 ${
                open === i ? "border-primary/30 bg-card shadow-sm" : "border-border bg-card"
              }`}
              data-testid={`faq-item-${i}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                data-testid={`faq-toggle-${i}`}
              >
                <span className={`font-bold text-sm leading-snug ${open === i ? "text-foreground" : "text-foreground"}`}>
                  {faq.q}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  open === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {open === i ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
