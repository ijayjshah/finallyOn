import { motion } from "framer-motion";
import { Wrench, ShoppingCart, Bookmark, Home, Search } from "lucide-react";

const segments = [
  {
    icon: Wrench,
    title: "Service Workers",
    subtitle: "Electricians, plumbers, tutors & more",
    desc: "Any skilled professional who offers services in or around a home, office, or neighbourhood. Get discovered, trusted, and booked — consistently.",
    examples: ["Electricians", "Plumbers", "Beauticians", "Photographers", "Carpenters", "Tutors"],
    cta: "Build your profile",
    color: "border-blue-200 hover:border-blue-300",
    badge: "bg-blue-50 text-blue-700",
    icon_bg: "bg-blue-50",
    icon_color: "text-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "Micro Sellers",
    subtitle: "Home-based and informal sellers",
    desc: "Turn your home-based business into a proper storefront. List your products, accept orders, and reach customers who are already nearby.",
    examples: ["Home Chefs", "Artisans", "Clothing Sellers", "Bakers", "Handicraft Makers"],
    cta: "Open your store",
    color: "border-emerald-200 hover:border-emerald-300",
    badge: "bg-emerald-50 text-emerald-700",
    icon_bg: "bg-emerald-50",
    icon_color: "text-emerald-600",
  },
  {
    icon: Bookmark,
    title: "Local Brands",
    subtitle: "Small brands seeking structured presence",
    desc: "You have a product and a customer base. Foundwork gives you the digital infrastructure to grow it — catalogues, orders, reviews, and visibility.",
    examples: ["Food Brands", "Fashion Labels", "Wellness Products", "Rural Goods"],
    cta: "List your brand",
    color: "border-violet-200 hover:border-violet-300",
    badge: "bg-violet-50 text-violet-700",
    icon_bg: "bg-violet-50",
    icon_color: "text-violet-600",
  },
  {
    icon: Home,
    title: "Home Businesses",
    subtitle: "Working from home, selling to the world",
    desc: "Tiffin services, tailoring from home, yoga instruction, online tutoring — if your business runs from home, Foundwork makes it professionally visible.",
    examples: ["Tiffin Services", "Home Tutors", "Online Instructors", "Home Bakers"],
    cta: "Start for free",
    color: "border-amber-200 hover:border-amber-300",
    badge: "bg-amber-50 text-amber-700",
    icon_bg: "bg-amber-50",
    icon_color: "text-amber-600",
  },
  {
    icon: Search,
    title: "Customers",
    subtitle: "Looking for trusted local help",
    desc: "Find verified, rated service providers and sellers in your exact neighbourhood. Real reviews, real work galleries, real people — not anonymous listings.",
    examples: ["Homeowners", "Renters", "Families", "Small Offices"],
    cta: "Find near me",
    color: "border-rose-200 hover:border-rose-300",
    badge: "bg-rose-50 text-rose-700",
    icon_bg: "bg-rose-50",
    icon_color: "text-rose-600",
  },
];

export default function WhoItsFor() {
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
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Who It's For</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Built for India's
            <span className="text-primary"> local economy.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {segments.slice(0, 3).map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className={`p-7 rounded-2xl border-2 bg-card transition-all duration-300 hover:shadow-lg ${seg.color}`}
              data-testid={`who-card-${i}`}
            >
              <div className={`w-11 h-11 rounded-xl ${seg.icon_bg} flex items-center justify-center mb-5`}>
                <seg.icon className={`w-5 h-5 ${seg.icon_color}`} />
              </div>
              <h3 className="font-extrabold text-lg text-foreground mb-1">{seg.title}</h3>
              <p className="text-xs font-semibold text-muted-foreground mb-3">{seg.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{seg.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {seg.examples.map((ex) => (
                  <span key={ex} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${seg.badge}`}>
                    {ex}
                  </span>
                ))}
              </div>
              <button className={`w-full py-2.5 rounded-xl border-2 ${seg.color} text-sm font-bold text-foreground hover:opacity-80 transition-opacity`}>
                {seg.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {segments.slice(3).map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 3) * 0.1, duration: 0.55 }}
              className={`p-7 rounded-2xl border-2 bg-card transition-all duration-300 hover:shadow-lg ${seg.color}`}
              data-testid={`who-card-${i + 3}`}
            >
              <div className={`w-11 h-11 rounded-xl ${seg.icon_bg} flex items-center justify-center mb-5`}>
                <seg.icon className={`w-5 h-5 ${seg.icon_color}`} />
              </div>
              <h3 className="font-extrabold text-lg text-foreground mb-1">{seg.title}</h3>
              <p className="text-xs font-semibold text-muted-foreground mb-3">{seg.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{seg.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {seg.examples.map((ex) => (
                  <span key={ex} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${seg.badge}`}>
                    {ex}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
