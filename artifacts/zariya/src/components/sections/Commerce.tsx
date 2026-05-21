import { motion } from "framer-motion";
import { Package, ClipboardList, TruckIcon, BarChart2, Megaphone, CreditCard } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Product Catalogue",
    desc: "List your handmade goods, packaged food, or curated products with photos, prices, and descriptions in minutes.",
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    desc: "Receive inquiries, confirm orders, and track fulfilment — all through a simple mobile-first interface.",
  },
  {
    icon: TruckIcon,
    title: "Local Delivery",
    desc: "Connect with local delivery partners or coordinate self-delivery within your area, integrated into the order flow.",
  },
  {
    icon: BarChart2,
    title: "Sales Analytics",
    desc: "See which products perform, track revenue, understand your customers — simple insights without the complexity.",
  },
  {
    icon: Megaphone,
    title: "Promoted Listings",
    desc: "Boost visibility within your city and category with affordable, targeted promotions. Pay only for real reach.",
  },
  {
    icon: CreditCard,
    title: "Flexible Subscriptions",
    desc: "Start free. Upgrade when your business grows — no locked-in contracts, no hidden fees, just tools you need.",
  },
];

const sellerTypes = [
  { label: "Home Chefs & Bakers", count: "420+" },
  { label: "Artisans & Craft Sellers", count: "310+" },
  { label: "Clothing Resellers", count: "280+" },
  { label: "Rural Product Sellers", count: "190+" },
  { label: "Local Brands", count: "150+" },
];

export default function Commerce() {
  return (
    <section id="commerce" className="py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">For Sellers</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              Sell what you make.
              <br />
              <span className="text-primary">Manage what you sell.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Foundwork gives small sellers and micro-businesses a complete commerce layer —
              from product listing to order delivery — without the overhead of building a separate website.
            </p>

            <div className="space-y-3">
              {sellerTypes.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card"
                  data-testid={`seller-type-${i}`}
                >
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-sm font-bold text-primary">{s.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
                data-testid={`commerce-feature-${i}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
