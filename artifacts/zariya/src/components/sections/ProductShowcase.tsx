import { motion } from "framer-motion";
import { Star, MapPin, Shield, Phone, Package, Search, Bell, CheckCircle2 } from "lucide-react";

function OnboardingScreen() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full">
      <div className="bg-primary px-5 pt-8 pb-6 text-white">
        <div className="text-xs font-semibold opacity-70 mb-2">Step 1 of 3</div>
        <h3 className="text-lg font-bold mb-1">Tell us about yourself</h3>
        <p className="text-xs opacity-70">We'll build your profile from here</p>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Your full name</label>
          <div className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 bg-gray-50">Priya Mehta</div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Service category</label>
          <div className="px-3 py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-sm text-primary font-medium flex items-center justify-between">
            Tailor & Fashion Designer
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Your neighbourhood</label>
          <div className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 flex items-center gap-2 bg-gray-50">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Lajpat Nagar, New Delhi
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Years of experience</label>
          <div className="flex gap-2">
            {["1-2", "3-5", "6-10", "10+"].map((y) => (
              <div key={y} className={`flex-1 py-2 rounded-lg border text-xs font-semibold text-center ${y === "6-10" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500"}`}>
                {y}
              </div>
            ))}
          </div>
        </div>
        <button className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold mt-2">
          Build my profile
        </button>
        <p className="text-center text-xs text-gray-400">Free to start. Always.</p>
      </div>
    </div>
  );
}

function PortfolioScreen() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full">
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 border-2 border-white shadow flex items-center justify-center font-bold text-rose-600 text-lg">P</div>
            <div>
              <div className="font-bold text-sm text-gray-900">Priya Mehta</div>
              <div className="text-xs text-rose-600 font-semibold">Master Tailor</div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-100 shadow-sm">
            <Shield className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-bold text-primary">Verified</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-1.5">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
          <span className="text-xs font-bold text-gray-700 ml-1">4.9</span>
          <span className="text-xs text-gray-400">(214 reviews)</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" /> Lajpat Nagar, Delhi · 340+ orders
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">Work Gallery</div>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {[
            "bg-rose-100", "bg-pink-100", "bg-rose-50",
            "bg-fuchsia-100", "bg-rose-200", "bg-pink-50"
          ].map((bg, i) => (
            <div key={i} className={`aspect-square rounded-lg ${bg} border border-white`} />
          ))}
        </div>
        <div className="space-y-1.5 mb-4">
          {["Bridal Wear", "Alterations & Repairs", "Custom Embroidery"].map((s) => (
            <div key={s} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-xs font-medium text-gray-700">{s}</span>
              <span className="text-xs text-primary font-semibold">Inquire</span>
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5" /> Contact &amp; Book
        </button>
      </div>
    </div>
  );
}

function DashboardScreen() {
  const inquiries = [
    { name: "Rahul S.", service: "Blouse alteration", time: "2h ago", status: "New" },
    { name: "Meera K.", service: "Bridal lehenga", time: "Yesterday", status: "Confirmed" },
    { name: "Anjali T.", service: "Kurta stitching", time: "2d ago", status: "Done" },
  ];
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="font-bold text-sm text-gray-900">Dashboard</div>
          <div className="text-xs text-gray-400">June 2026</div>
        </div> 
        <Bell className="w-5 h-5 text-gray-400" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Inquiries", value: "12", color: "text-primary" },
            { label: "Confirmed", value: "8", color: "text-emerald-600" },
            { label: "Revenue", value: "₹24k", color: "text-amber-600" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div className={`font-black text-lg ${m.color}`}>{m.value}</div>
              <div className="text-[10px] text-gray-400">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="text-xs font-semibold text-gray-500 mb-3">Recent Inquiries</div>
        <div className="space-y-2">
          {inquiries.map((inq) => (
            <div key={inq.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
                {inq.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-800">{inq.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{inq.service}</div>
              </div>
              <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                inq.status === "New" ? "bg-primary/10 text-primary" :
                inq.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" :
                "bg-gray-100 text-gray-400"
              }`}>
                {inq.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscoveryScreen() {
  const results = [
    { name: "Ravi Sharma", cat: "Electrician", area: "Andheri W", rating: 4.8, dist: "0.8 km" },
    { name: "Sunil Kumar", cat: "Plumber", area: "Bandra E", rating: 4.7, dist: "1.2 km" },
    { name: "Asha Nair", cat: "Beautician", area: "Juhu", rating: 5.0, dist: "1.8 km" },
  ];
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 mb-3">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Electrician near Andheri...</span>
        </div>
        <div className="flex gap-2">
          {["All", "Electrician", "Plumber", "Tutor"].map((f) => (
            <span key={f} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${f === "Electrician" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500">3 results near you</span>
          <span className="text-[10px] text-primary font-bold">Sort: Rating</span>
        </div>
        {results.map((r) => (
          <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
              {r.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900">{r.name}</div>
              <div className="text-xs text-gray-500">{r.cat} · {r.area}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-gray-700">{r.rating}</span>
                </div>
                <span className="text-[10px] text-gray-400">{r.dist}</span>
                <Package className="w-3 h-3 text-primary" />
              </div>
            </div>
            <button className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const screens = [
  { title: "Worker Onboarding", desc: "3-minute setup, no friction", component: OnboardingScreen },
  { title: "Auto Portfolio", desc: "Generated by Foundwork", component: PortfolioScreen },
  { title: "Booking Dashboard", desc: "Manage all your work", component: DashboardScreen },
  { title: "Local Discovery", desc: "How customers find you", component: DiscoveryScreen },
];

export default function ProductShowcase() {
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
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Product</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Built for mobile.
            <span className="text-primary"> Designed for trust.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Every screen in Foundwork is designed for the worker first — simple enough for first-time smartphone users, powerful enough to run a real business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {screens.map((screen, i) => (
            <motion.div
              key={screen.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className="flex flex-col"
              data-testid={`product-screen-${i}`}
            >
              <div className="mb-4 flex-1">
                <screen.component />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm text-foreground">{screen.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{screen.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
