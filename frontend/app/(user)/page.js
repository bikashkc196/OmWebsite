import Link from "next/link";
import StatsCounter from "../../components/ui/StatsCounter";
import TestimonialCarousel from "../../components/ui/TestimonialCarousel";
import FAQAccordion from "../../components/ui/FAQAccordion";
// ── SEO Metadata ───────────────────────────────────────────
export const metadata = {
  title: "OM Mobile Repair Center — Expert Phone & Device Repair",
  description:
    "Book professional mobile, tablet, and laptop repairs at OM Mobile Repair Center. Fast turnaround, genuine parts, certified technicians, and 3 month upto 1-year warranty on all repairs.",
  keywords: [
    "mobile repair near me",
    "phone repair",
    "screen replacement",
    "battery replacement",
    "laptop repair",
    "tablet repair",
    "OM Mobile Repair Center",
    "device repair booking",
  ],
  openGraph: {
    title: "OM Mobile Repair Center",
    description:
      "Expert device repairs — Fast, reliable & affordable. Book online in 2 minutes.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
// ── Data ───────────────────────────────────────────────────
const SERVICES = [
  {
    icon: "📱",
    title: "Screen Replacement",
    desc: "Cracked or shattered screen? We restore it to factory-perfect condition using genuine display panels.",
    time: "30–60 min",
    price: "From Rs. 800",
    popular: true,
    color: "blue",
  },
  {
    icon: "🔋",
    title: "Battery Replacement",
    desc: "Restore your device's battery health with genuine OEM batteries. Full day battery life guaranteed.",
    time: "20–45 min",
    price: "From Rs. 500",
    popular: false,
    color: "emerald",
  },
  {
    icon: "💧",
    title: "Water Damage Repair",
    desc: "Don't panic! Our advanced ultrasonic cleaning and drying process can save your water-damaged device.",
    time: "1–2 hrs",
    price: "From Rs. 1,000",
    popular: false,
    color: "cyan",
  },
  {
    icon: "⚡",
    title: "Charging Port Repair",
    desc: "Loose, broken, or blocked charging port repaired precisely with micro-soldering expertise.",
    time: "30–60 min",
    price: "From Rs. 300",
    popular: false,
    color: "amber",
  },
  {
    icon: "📷",
    title: "Camera Repair",
    desc: "Blurry photos, broken lens, or camera not working? We restore your photography experience.",
    time: "45–90 min",
    price: "From Rs. 500",
    popular: false,
    color: "purple",
  },
  {
    icon: "💻",
    title: "Software Issues",
    desc: "Bootloops, factory resets, virus removal, data recovery — all software issues handled professionally.",
    time: "1–3 hrs",
    price: "From Rs. 200",
    popular: false,
    color: "indigo",
  },
  {
    icon: "🔊",
    title: "Speaker & Mic Repair",
    desc: "Muffled sound, no audio, or mic not working? Our acoustic repair gets your device sounding great.",
    time: "30–60 min",
    price: "From Rs. 300",
    popular: false,
    color: "rose",
  },
  {
    icon: "🔩",
    title: "Motherboard Repair",
    desc: "Advanced motherboard repair and micro-soldering for component-level fixes that others can't handle.",
    time: "2–4 hrs",
    price: "From Rs. 2,000",
    popular: false,
    color: "gray",
  },
];
const SERVICE_COLORS = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100",
    text: "text-blue-700",
    border: "hover:border-blue-300",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100",
    text: "text-emerald-700",
    border: "hover:border-emerald-300",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "bg-cyan-100",
    text: "text-cyan-700",
    border: "hover:border-cyan-300",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100",
    text: "text-amber-700",
    border: "hover:border-amber-300",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100",
    text: "text-purple-700",
    border: "hover:border-purple-300",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "bg-indigo-100",
    text: "text-indigo-700",
    border: "hover:border-indigo-300",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100",
    text: "text-rose-700",
    border: "hover:border-rose-300",
  },
  gray: {
    bg: "bg-gray-50",
    icon: "bg-gray-100",
    text: "text-gray-700",
    border: "hover:border-gray-300",
  },
};
const STEPS = [
  {
    step: "01",
    icon: "📱",
    title: "Choose Your Device",
    desc: "Select your device type, brand, and describe the issue you're facing.",
    color: "blue",
  },
  {
    step: "02",
    icon: "📅",
    title: "Pick a Time Slot",
    desc: "Browse available dates and time slots that fit your schedule perfectly.",
    color: "indigo",
  },
  {
    step: "03",
    icon: "🚗",
    title: "Drop It Off",
    desc: "Visit our center at your scheduled time. No waiting in long queues.",
    color: "purple",
  },
  {
    step: "04",
    icon: "🔧",
    title: "Expert Repair",
    desc: "Our certified technicians diagnose and fix your device with genuine parts.",
    color: "emerald",
  },
  {
    step: "05",
    icon: "🎉",
    title: "Pick It Up",
    desc: "Collect your perfectly repaired device. Pay only after you're satisfied.",
    color: "amber",
  },
];
const WHY_US = [
  {
    icon: "🏆",
    title: "Certified Technicians",
    desc: "All our technicians are manufacturer-certified with 5+ years of experience and undergo regular training.",
  },
  {
    icon: "✅",
    title: "Genuine Parts Only",
    desc: "We never use counterfeit parts. Every component is OEM or certified aftermarket with traceability.",
  },
  {
    icon: "🛡️",
    title: "1-Year Warranty",
    desc: "All repairs come with a comprehensive warranty on parts and labor. If it fails, we fix it free.",
  },
  {
    icon: "💰",
    title: "Price Match Guarantee",
    desc: "Found a lower price? Show us and we'll match it. We believe quality repair shouldn't cost a fortune.",
  },
  {
    icon: "⚡",
    title: "Same-Day Service",
    desc: "Most common repairs are completed on the same day. We value your time as much as you do.",
  },
  {
    icon: "📱",
    title: "Online Tracking",
    desc: "Real-time repair status updates via your account dashboard. Always know where your device is.",
  },
];
const BRANDS = [
  { name: "Apple", icon: "🍎" },
  { name: "Samsung", icon: "📱" },
  { name: "OnePlus", icon: "1️⃣" },
  { name: "Xiaomi", icon: "🔲" },
  { name: "Oppo", icon: "⭕" },
  { name: "Vivo", icon: "🎵" },
  { name: "Realme", icon: "⚡" },
  { name: "Google", icon: "🔍" },
  { name: "Motorola", icon: "Ⓜ️" },
  { name: "Nokia", icon: "📡" },
  { name: "Sony", icon: "🎮" },
  { name: "LG", icon: "🌀" },
];
// ── Main Component ─────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* ════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-screen bg-gradient-to-br
          from-blue-950 via-blue-900 to-indigo-900
          flex items-center overflow-hidden"
      >
        {/* Animated background blobs */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden
          pointer-events-none"
        >
          <div
            className="absolute top-20 left-10 w-96 h-96
            bg-blue-500/15 rounded-full blur-3xl animate-blob"
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96
            bg-indigo-500/15 rounded-full blur-3xl animate-blob
            animation-delay-2000"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2
            -translate-y-1/2 w-[600px] h-[600px]
            bg-purple-500/10 rounded-full blur-3xl animate-blob
            animation-delay-4000"
          />
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Hero Content */}
        <div
          className="relative max-w-7xl mx-auto px-6 py-24
          grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full"
        >
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2
              bg-blue-500/20 border border-blue-400/30
              text-blue-200 text-sm font-medium
              px-4 py-2 rounded-full mb-6 animate-fade-up"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Open Today · Sun–Friday 8 AM – 9 PM
            </div>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold
                text-white leading-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Your Device,{" "}
              <span
                className="bg-gradient-to-r from-blue-300 via-cyan-300
                  to-indigo-300 bg-clip-text text-transparent"
              >
                Repaired Right
              </span>
            </h1>
            <p
              className="text-blue-100 text-lg md:text-xl leading-relaxed
                mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Professional repair services for all devices — smartphones,
              tablets & laptops. Genuine parts, certified technicians, and a{" "}
              <span className="text-cyan-300 font-semibold">
                3 month upto1-year warranty
              </span>{" "}
              on every repair.
            </p>
            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center
                lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-2
                  px-8 py-4 bg-white text-blue-700 font-bold text-base
                  rounded-2xl shadow-2xl shadow-blue-900/40
                  hover:shadow-white/20 hover:scale-105
                  active:scale-100 transition-all duration-200"
              >
                📅 Book a Repair
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
              <Link
                href="/my-repairs"
                className="inline-flex items-center justify-center gap-2
                  px-8 py-4 bg-white/10 border border-white/30
                  text-white font-semibold text-base rounded-2xl
                  hover:bg-white/20 hover:border-white/50
                  transition-all duration-200"
              >
                🔍 Track My Repair
              </Link>
            </div>
            {/* Trust indicators */}
            <div
              className="flex flex-wrap items-center gap-4 mt-8
                justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                "✅ No Fix, No Fee",
                "🛡️ 3 month upto 1-Year Warranty",
                "⚡ Same Day Service",
              ].map((item) => (
                <span
                  key={item}
                  className="text-blue-200 text-sm font-medium
                    flex items-center gap-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          {/* Right — Floating Device Mockup */}
          <div
            className="hidden lg:flex items-center justify-center
              animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              {/* Main card */}
              <div
                className="w-80 bg-white/10 backdrop-blur-xl
                  border border-white/20 rounded-3xl p-6 shadow-2xl"
              >
                {/* Booking reference preview */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-blue-400
                      to-indigo-400 rounded-xl flex items-center justify-center
                      text-2xl shadow-lg"
                  >
                    📱
                  </div>
                  <div>
                    <p className="text-white font-bold">Samsung Galaxy S24</p>
                    <p className="text-blue-300 text-sm">Screen Replacement</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    {
                      label: "Status",
                      value: "In Progress 🔧",
                      color: "text-purple-300",
                    },
                    {
                      label: "Tech",
                      value: "Ravi Sharma",
                      color: "text-white",
                    },
                    {
                      label: "Est. Cost",
                      value: "Rs. 2,500",
                      color: "text-emerald-300",
                    },
                    {
                      label: "Ready By",
                      value: "Today, 4:00 PM",
                      color: "text-cyan-300",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center
                        bg-white/5 rounded-xl px-4 py-2.5"
                    >
                      <span className="text-blue-300 text-xs font-medium">
                        {label}
                      </span>
                      <span className={`text-sm font-semibold ${color}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div>
                  <div
                    className="flex justify-between text-xs
                    text-blue-300 mb-2"
                  >
                    <span>Repair Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-400
                        h-2 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div
                className="absolute -top-4 -right-4 bg-emerald-500
                  text-white text-xs font-bold px-3 py-1.5
                  rounded-full shadow-lg animate-bounce"
              >
                ✅ 98% Success Rate
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-white
                  text-gray-800 text-xs font-bold px-3 py-2
                  rounded-xl shadow-xl flex items-center gap-1.5"
              >
                ⭐⭐⭐⭐⭐
                <span className="text-gray-500 font-normal">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2
            flex flex-col items-center gap-2 text-blue-300
            animate-bounce"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <div
            className="w-6 h-9 border-2 border-blue-400/50 rounded-full
              flex justify-center pt-1.5"
          >
            <div
              className="w-1.5 h-1.5 bg-blue-300 rounded-full
                animate-bounce"
            />
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 2 — STATS COUNTER
      ════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-blue-500 to-gray-600 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <StatsCounter />
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 3 — SERVICES
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white" id="services">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span
              className="inline-block text-blue-600 font-semibold text-sm
                uppercase tracking-widest bg-blue-50 px-4 py-1.5
                rounded-full mb-4"
            >
              What We Fix
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Repair Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              From cracked screens to complex motherboard repairs — our
              certified technicians handle every issue with precision, care, and
              genuine parts.
            </p>
          </div>
          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => {
              const colors = SERVICE_COLORS[service.color];
              return (
                <Link
                  key={service.title}
                  href="/book"
                  className={`group relative p-6 rounded-2xl border-2 border-gray-100
                    ${colors.border} bg-white
                    hover:shadow-xl transition-all duration-300
                    hover:-translate-y-1 cursor-pointer`}
                >
                  {/* Popular badge */}
                  {service.popular && (
                    <div
                      className="absolute -top-3 left-4 bg-gradient-to-r
                        from-blue-600 to-indigo-600 text-white text-[10px]
                        font-bold px-3 py-1 rounded-full shadow-md"
                    >
                      🔥 Most Popular
                    </div>
                  )}
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${colors.icon} rounded-2xl
                      flex items-center justify-center text-3xl mb-5
                      group-hover:scale-110 transition-transform duration-300`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {service.desc}
                  </p>
                  {/* Meta row */}
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`text-xs font-semibold ${colors.text}
                        ${colors.bg} px-2.5 py-1 rounded-full`}
                    >
                      🕐 {service.time}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {service.price}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`absolute right-0 text-sm font-bold ${colors.text}
        opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    >
                      Book →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-3
                bg-gray-900 text-white font-semibold rounded-xl
                hover:bg-blue-700 transition-all shadow-lg text-sm"
            >
              Book Any Repair Online →
            </Link>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ════════════════════════════════════════ */}
      <section
        className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50"
        id="how-it-works"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block text-blue-600 font-semibold text-sm
                uppercase tracking-widest bg-blue-50 px-4 py-1.5
                rounded-full mb-4"
            >
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Getting your device repaired has never been this easy. Five simple
              steps to a perfectly working device.
            </p>
          </div>
          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="hidden lg:block absolute top-10 left-[10%]
                right-[10%] h-0.5 border-t-2 border-dashed border-blue-200
                z-0"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {STEPS.map((step) => (
                <div
                  key={step.step}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div
                    className="relative w-20 h-20 bg-white border-2
                      border-blue-100 rounded-2xl shadow-lg flex items-center
                      justify-center text-4xl mb-5 hover:scale-110
                      hover:border-blue-400 hover:shadow-blue-100
                      transition-all duration-300"
                  >
                    {step.icon}
                    <div
                      className="absolute -top-3 -right-3 w-7 h-7
                        bg-gradient-to-br from-blue-600 to-indigo-600
                        text-white text-xs font-bold rounded-full
                        flex items-center justify-center shadow-md"
                    >
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-10 py-4
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                font-bold text-base rounded-2xl shadow-xl
                shadow-blue-200 hover:shadow-blue-300
                hover:scale-105 transition-all"
            >
              📅 Start Your Repair Booking
            </Link>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 5 — WHY CHOOSE US
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white" id="why-us">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div>
              <span
                className="inline-block text-blue-600 font-semibold text-sm
                  uppercase tracking-widest bg-blue-50 px-4 py-1.5
                  rounded-full mb-5"
              >
                Why OM Mobile?
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-gray-900
                  mb-6 leading-tight"
              >
                Repair Experience{" "}
                <span
                  className="bg-gradient-to-r from-blue-600 to-indigo-600
                    bg-clip-text text-transparent"
                >
                  You Can Trust
                </span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                With 4+ years in the device repair industry, we've built a
                reputation on quality, transparency, and customer satisfaction.
                Here's why thousands choose us.
              </p>
              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHY_US.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-2xl
                      hover:bg-blue-50 transition-colors group"
                  >
                    <div
                      className="w-11 h-11 bg-blue-100 rounded-xl
                        flex items-center justify-center text-2xl
                        flex-shrink-0 group-hover:scale-110
                        transition-transform"
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — Visual */}
            <div className="relative">
              <div
                className="bg-gradient-to-br from-blue-500 to-indigo-800
                  rounded-3xl p-8 text-white shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-6">Our Repair Promise</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: "🔧",
                      label: "Diagnosis is Always Free",
                      desc: "We check your device at no charge before starting any repair.",
                    },
                    {
                      icon: "💯",
                      label: "No Fix = No Fee",
                      desc: "If we can't fix it, you don't pay. Simple as that.",
                    },
                    {
                      icon: "🔒",
                      label: "Data Privacy Guaranteed",
                      desc: "Your personal data is never accessed without consent.",
                    },
                    {
                      icon: "📞",
                      label: "Post-Repair Support",
                      desc: "Free support for 30 days after your repair is completed.",
                    },
                  ].map((promise) => (
                    <div
                      key={promise.label}
                      className="flex items-start gap-4 bg-white/10
                        backdrop-blur-sm rounded-2xl p-4
                        border border-white/20"
                    >
                      <span className="text-2xl flex-shrink-0">
                        {promise.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{promise.label}</p>
                        <p className="text-blue-200 text-xs mt-0.5">
                          {promise.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative blob */}
              <div
                className="absolute -top-4 -right-4 -z-10 w-72 h-72
                  bg-blue-100 rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 6 — SUPPORTED BRANDS
      ════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-center text-gray-500 text-sm font-semibold
            uppercase tracking-widest mb-10"
          >
            We Repair All Major Brands
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <div
                  className="w-12 h-12 bg-white rounded-xl border border-gray-200
                    flex items-center justify-center text-2xl shadow-sm
                    group-hover:border-blue-300 group-hover:shadow-md
                    group-hover:scale-110 transition-all duration-200"
                >
                  {brand.icon}
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 7 — TESTIMONIALS
      ════════════════════════════════════════ */}
      <section
        className="py-24 px-6 bg-gradient-to-br from-blue-50 to-indigo-50"
        id="reviews"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-blue-600 font-semibold text-sm
                uppercase tracking-widest bg-blue-100 px-4 py-1.5
                rounded-full mb-4"
            >
              Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex text-amber-400 text-2xl">{"★★★★★"}</div>
              <span className="text-gray-700 font-bold text-lg">4.9/5</span>
            </div>
            <p className="text-gray-500">
              Based on{" "}
              <span className="font-semibold text-gray-700">5,000+</span>{" "}
              verified customer reviews
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 8 — FAQ
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-blue-600 font-semibold text-sm
                uppercase tracking-widest bg-blue-50 px-4 py-1.5
                rounded-full mb-4"
            >
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg">
              Everything you need to know about our repair services. Can't find
              an answer?{" "}
              <a
                href="tel:+9779800000000"
                className="text-blue-600 font-medium hover:underline"
              >
                Call us directly.
              </a>
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 9 — FINAL CTA BANNER
      ════════════════════════════════════════ */}
      <section
        className="py-24 px-6 bg-gradient-to-br from-blue-900
          via-blue-800 to-indigo-900 relative overflow-hidden"
      >
        {/* Background elements */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96
            bg-blue-500/20 rounded-full blur-3xl animate-blob"
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80
            bg-indigo-500/20 rounded-full blur-3xl animate-blob
            animation-delay-2000"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-6 block animate-bounce">🔧</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold
              text-white mb-6 leading-tight"
          >
            Ready to Fix Your{" "}
            <span
              className="bg-gradient-to-r from-blue-300 to-cyan-300
                bg-clip-text text-transparent"
            >
              Device?
            </span>
          </h2>
          <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Book your repair in under 2 minutes. No queues, no hassle. Just drop
            it off and we'll handle the rest.
          </p>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2
                px-10 py-5 bg-white text-blue-700 font-extrabold
                text-lg rounded-2xl shadow-2xl
                hover:shadow-white/20 hover:scale-105
                active:scale-100 transition-all duration-200"
            >
              📅 Book a Repair Now
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
            <a
              href="tel:+9779800000000"
              className="inline-flex items-center justify-center gap-2
                px-10 py-5 bg-white/10 border border-white/30
                text-white font-bold text-lg rounded-2xl
                hover:bg-white/20 hover:border-white/50
                transition-all duration-200"
            >
              📞 Call Us Now
            </a>
          </div>
          {/* Quick info chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "📍 Shreenagar, Salyan Opposite NIC Asia & Laxmi Bank",
              "🕐 Sun–Fri: 8 AM – 9 PM",
              "📞 +977 98-0000-0000",
              "📧 support@ommobile.com",
            ].map((info) => (
              <span
                key={info}
                className="bg-white/10 border border-white/20
                  text-blue-200 text-sm font-medium
                  px-4 py-2 rounded-full"
              >
                {info}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* ── JSON-LD Structured Data for SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "OM Mobile Repair Center",
            description:
              "Professional mobile, tablet, and laptop repair services with genuine parts and 1-year warranty.",
            url: "https://www.ommobilerepair.com",
            telephone: "+977-98-0000-0000",
            email: "support@ommobile.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Shreenagar Salyan",
              addressLocality: "Salyan",
              addressCountry: "NP",
            },
            openingHours: "Sun-Fri 08:00-19:00",
            priceRange: "Rs. 200 - Rs. 2,500",
            priceCurrency: "NPR",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "5000",
            },
            sameAs: [
              "https://www.facebook.com/ommobilerepair",
              "https://www.instagram.com/ommobilerepair",
            ],
          }),
        }}
      />
    </main>
  );
}
