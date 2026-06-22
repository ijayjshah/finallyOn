import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Package, Truck, Store, MessageCircle, Filter, CheckCircle2, Image, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/types";
import { fadeUp } from "@/lib/motion";


const FILTER_EXAMPLES = [
  {
    category: "Jewellery",
    emoji: "💍",
    filters: ["Gold", "Silver", "Rose Gold", "Diamond", "Antique"],
    color: "border-amber-200 bg-amber-50",
    activeColor: "bg-amber-600 text-white",
    inactiveColor: "bg-white border border-amber-200 text-amber-700",
  },
  {
    category: "Clothing & Garments",
    emoji: "👗",
    filters: ["Men", "Women", "Kids", "Sarees", "Suits"],
    color: "border-violet-200 bg-violet-50",
    activeColor: "bg-violet-600 text-white",
    inactiveColor: "bg-white border border-violet-200 text-violet-700",
  },
  {
    category: "Home Food",
    emoji: "🍱",
    filters: ["Veg", "Non-veg", "Jain", "Homemade", "Ready-to-order"],
    color: "border-emerald-200 bg-emerald-50",
    activeColor: "bg-emerald-600 text-white",
    inactiveColor: "bg-white border border-emerald-200 text-emerald-700",
  },
];

const SAMPLE_PRODUCTS = [
  { name: "22K Gold Necklace Set", price: "₹45,000", cat: "Jewellery", sub: "Gold", delivery: true, shop: "Suresh Jewellers", color: "#f59e0b" },
  { name: "Handwoven Kanjivaram Saree", price: "₹8,500", cat: "Clothing", sub: "Sarees", delivery: true, shop: "Priya Textiles", color: "#7c3aed" },
  { name: "Gujarati Thali (Daily)", price: "₹80/meal", cat: "Food", sub: "Veg", delivery: true, shop: "Kavita Tiffin", color: "#16a34a" },
  { name: "Silver Anklet Pair", price: "₹1,200", cat: "Jewellery", sub: "Silver", delivery: false, shop: "Suresh Jewellers", color: "#6b7280" },
  { name: "Cotton Kurti Set", price: "₹650", cat: "Clothing", sub: "Women", delivery: true, shop: "Priya Textiles", color: "#db2777" },
  { name: "Homemade Khakhra Box", price: "₹120", cat: "Food", sub: "Jain", delivery: true, shop: "Meena Namkeen", color: "#d97706" },
];

function DemoProductCard({ p }: { p: typeof SAMPLE_PRODUCTS[0] }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="h-36 flex items-center justify-center text-3xl" style={{ background: `${p.color}18` }}>
        {p.cat === "Jewellery" ? "💍" : p.cat === "Clothing" ? "👗" : "🍱"}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-muted-foreground">{p.cat} · {p.sub}</span>
          {p.delivery && (
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <Truck className="w-3 h-3" /> Delivery
            </span>
          )}
        </div>
        <h4 className="font-bold text-sm text-foreground mb-0.5 leading-snug">{p.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{p.shop}, Navsari</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-primary">{p.price}</span>
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#25D366]/15 text-[#25D366] text-[10px] font-bold">
            <MessageCircle className="w-3 h-3" /> Order
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoFilterUI({ ex }: { ex: typeof FILTER_EXAMPLES[0] }) {
  const [active, setActive] = useState<string | null>(ex.filters[0]);
  return (
    <div className={`p-5 rounded-2xl border-2 ${ex.color}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{ex.emoji}</span>
        <span className="font-bold text-sm text-foreground">{ex.category}</span>
        <Filter className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
      </div>
      <div className="flex flex-wrap gap-2">
        {ex.filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f === active ? null : f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${f === active ? ex.activeColor : ex.inactiveColor}`}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3 opacity-70">Interactive demo — click to filter</p>
    </div>
  );
}

export default function ProductsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-5">
                For Product Sellers
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight max-w-3xl">
                Your local shop,<br />
                <span className="text-primary">online and ready.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                List up to 20 products with images, custom categories, delivery preferences, and WhatsApp ordering — completely free for Navsari businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate("/register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                  List Your Products Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/how-it-works")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border font-semibold hover:bg-muted transition-colors">
                  How Approval Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key rules callout */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
            {[
              { icon: Package, title: "Max 20 Products", desc: "Each business can list up to 20 product items. Keep your catalogue focused and curated.", color: "text-primary", bg: "bg-primary/8" },
              { icon: Image, title: "Image Required", desc: "Every product must have at least one photo. No image = no product listing.", color: "text-violet-600", bg: "bg-violet-50" },
              { icon: MapPin, title: "Map Location Required", desc: "Your shop's Google Maps location must be added before products go live.", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-5 rounded-2xl border border-border bg-card flex gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.bg}`}>
                    <Icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground mb-1">{f.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sample products */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">What product listings look like</h2>
              <p className="text-muted-foreground text-sm">Clean cards with image, price, delivery info, and a direct WhatsApp order button.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SAMPLE_PRODUCTS.map((p, i) => (
                <motion.div key={p.name} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <DemoProductCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter UI demo */}
        <section className="px-6 md:px-10 mb-20 bg-muted/20 border-y border-border py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10">
              <h2 className="text-2xl font-extrabold text-foreground mb-3">Custom category filters</h2>
              <p className="text-muted-foreground max-w-xl">
                Sellers define their own sub-categories. Customers filter products by those exact attributes. 
                Works for jewellery, clothing, food, electronics, and any other product type.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {FILTER_EXAMPLES.map((ex, i) => (
                <motion.div key={ex.category} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <DemoFilterUI ex={ex} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className="px-6 md:px-10 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Delivery & pickup options</h2>
              <p className="text-muted-foreground text-sm">Sellers declare their delivery preference per product. Customers see it clearly before ordering.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Home Delivery</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Mark your product as "delivery available" and customers will see a delivery badge. Delivery terms and area are communicated directly via WhatsApp.</p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Shop Pickup</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Enable "pickup available" and customers see your shop location on Google Maps. They visit directly after confirming via WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp ordering */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto p-6 rounded-2xl border-2 border-[#25D366]/30 bg-[#25D366]/5">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground mb-2">WhatsApp ordering — built in</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Every product has an "Order on WhatsApp" button. When a customer taps it, they're taken straight to your WhatsApp with a pre-filled message:
                </p>
                <div className="mt-3 p-3 rounded-xl bg-white border border-[#25D366]/20 text-sm text-foreground font-mono">
                  "Hi, I found [Product Name] on FinallyOn and would like to order. Is it available?"
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features list */}
        <section className="px-6 md:px-10 mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-extrabold text-foreground mb-6">What product sellers get on FinallyOn</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Free business profile and portfolio page",
                "List up to 20 products with photos",
                "Custom product sub-categories and labels",
                "Filter UI for customer browsing",
                "Delivery available / pickup available toggles",
                "WhatsApp order button on every product",
                "Google Maps shop location (required)",
                "Admin-verified before going live",
                "District-first visibility in Navsari",
                "No commission — you keep 100%",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10">
          <div className="max-w-5xl mx-auto p-10 rounded-2xl bg-primary text-primary-foreground text-center">
            <h2 className="text-2xl font-extrabold mb-3">Start selling in Navsari today</h2>
            <p className="text-primary-foreground/70 mb-6 text-sm max-w-md mx-auto">Free to list. No commission. WhatsApp orders. Admin-verified before going live.</p>
            <button onClick={() => navigate("/register")} className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:opacity-90 transition-opacity">
              List Your Products Free
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
