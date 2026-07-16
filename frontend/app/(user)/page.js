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
    color: "sky",
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
    color: "orange",
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
  sky: {
    icon: "bg-sky-500/15",
    text: "text-sky-300",
    border: "hover:border-sky-500/40",
  },
  emerald: {
    icon: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "hover:border-emerald-500/40",
  },
  cyan: {
    icon: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "hover:border-cyan-500/40",
  },
  orange: {
    icon: "bg-brand-orange/15",
    text: "text-brand-orange",
    border: "hover:border-brand-orange/40",
  },
  purple: {
    icon: "bg-brand-purple/15",
    text: "text-brand-purple",
    border: "hover:border-brand-purple/40",
  },
  indigo: {
    icon: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "hover:border-indigo-500/40",
  },
  rose: {
    icon: "bg-rose-500/15",
    text: "text-rose-300",
    border: "hover:border-rose-500/40",
  },
  gray: {
    icon: "bg-ink-soft/15",
    text: "text-ink-soft",
    border: "hover:border-ink-soft/40",
  },
};
const STEPS = [
  {
    step: "01",
    icon: "📱",
    title: "Choose Your Device",
    desc: "Select your device type, brand, and describe the issue you're facing.",
  },
  {
    step: "02",
    icon: "📅",
    title: "Pick a Time Slot",
    desc: "Browse available dates and time slots that fit your schedule perfectly.",
  },
  {
    step: "03",
    icon: "🚗",
    title: "Drop It Off",
    desc: "Visit our center at your scheduled time. No waiting in long queues.",
  },
  {
    step: "04",
    icon: "🔧",
    title: "Expert Repair",
    desc: "Our certified technicians diagnose and fix your device with genuine parts.",
  },
  {
    step: "05",
    icon: "🎉",
    title: "Pick It Up",
    desc: "Collect your perfectly repaired device. Pay only after you're satisfied.",
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
    <main className="overflow-x-hidden bg-bg">
      {/* ════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-screen bg-bg
          flex items-center overflow-hidden"
      >
        {/* Animated background blobs */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden
          pointer-events-none"
        >
          <div
            className="absolute top-20 left-10 w-96 h-96
            bg-brand-purple/20 rounded-full blur-3xl animate-blob"
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96
            bg-brand-orange/15 rounded-full blur-3xl animate-blob
            animation-delay-2000"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2
            -translate-y-1/2 w-[600px] h-[600px]
            bg-brand-purple/10 rounded-full blur-3xl animate-blob
            animation-delay-4000"
          />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay" />
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
              bg-brand-purple/15 border border-brand-purple/30
              text-brand-purple text-sm font-medium
              px-4 py-2 rounded-full mb-6 animate-fade-up"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Open Today · Sun–Friday 8 AM – 9 PM
            </div>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-display
                text-ink leading-[1.05] tracking-wide mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Your Device,{" "}
              <span className="gradient-text">Repaired Right</span>
            </h1>
            <p
              className="text-ink-soft text-lg md:text-xl leading-relaxed
                mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Professional repair services for all devices — smartphones,
              tablets & laptops. Genuine parts, certified technicians, and a{" "}
              <span className="text-brand-orange font-semibold">
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
                  px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-orange
                  text-white font-bold text-base
                  rounded-2xl shadow-2xl shadow-brand-purple/30
                  hover:shadow-brand-orange/30 hover:scale-105
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
                  px-8 py-4 bg-white/5 border border-white/15
                  text-ink font-semibold text-base rounded-2xl
                  hover:bg-white/10 hover:border-white/25
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
                  className="text-ink-soft text-sm font-medium
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
              <div className="w-80 glass-card p-6">
                {/* Booking reference preview */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-brand-purple
                      to-brand-orange rounded-xl flex items-center justify-center
                      text-2xl shadow-lg"
                  >
                    📱
                  </div>
                  <div>
                    <p className="text-ink font-bold">Samsung Galaxy S24</p>
                    <p className="text-brand-purple text-sm">Screen Replacement</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    {
                      label: "Status",
                      value: "In Progress 🔧",
                      color: "text-brand-purple",
                    },
                    {
                      label: "Tech",
                      value: "Ravi Sharma",
                      color: "text-ink",
                    },
                    {
                      label: "Est. Cost",
                      value: "Rs. 2,500",
                      color: "text-emerald-300",
                    },
                    {
                      label: "Ready By",
                      value: "Today, 4:00 PM",
                      color: "text-brand-orange",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center
                        bg-white/5 rounded-xl px-4 py-2.5"
                    >
                      <span className="text-ink-soft text-xs font-medium">
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
                    text-ink-soft mb-2"
                  >
                    <span>Repair Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-brand-purple to-brand-orange
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
                className="absolute -bottom-4 -left-4 bg-surface
                  text-ink text-xs font-bold px-3 py-2
                  rounded-xl shadow-xl flex items-center gap-1.5 border border-line"
              >
                ⭐⭐⭐⭐⭐
                <span className="text-ink-soft font-normal">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2
            flex flex-col items-center gap-2 text-ink-soft
            animate-bounce"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <div
            className="w-6 h-9 border-2 border-brand-purple/50 rounded-full
              flex justify-center pt-1.5"
          >
            <div
              className="w-1.5 h-1.5 bg-brand-purple rounded-full
                animate-bounce"
            />
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 2 — STATS COUNTER
      ════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-purple to-brand-orange py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <StatsCounter />
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 3 — SERVICES
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-bg" id="services">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span
              className="inline-block text-brand-purple font-semibold text-sm
                uppercase tracking-widest bg-brand-purple/10 px-4 py-1.5
                rounded-full mb-4"
            >
              What We Fix
            </span>
            <h2 className="text-4xl md:text-5xl text-ink mb-4 tracking-wide">
              Our Repair Services
            </h2>
            <p className="text-ink-soft max-w-2xl mx-auto text-lg leading-relaxed">
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
                  className={`group relative p-6 rounded-2xl border-2 border-line
                    ${colors.border} bg-surface
                    hover:shadow-xl hover:shadow-brand-purple/10 transition-all duration-300
                    hover:-translate-y-1 cursor-pointer`}
                >
                  {/* Popular badge */}
                  {service.popular && (
                    <div
                      className="absolute -top-3 left-4 bg-gradient-to-r
                        from-brand-purple to-brand-orange text-white text-[10px]
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
                  <h3 className="font-bold text-ink text-base mb-2">
                    {service.title}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed mb-5">
                    {service.desc}
                  </p>
                  {/* Meta row */}
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`text-xs font-semibold ${colors.text}
                        ${colors.icon} px-2.5 py-1 rounded-full`}
                    >
                      🕐 {service.time}
                    </span>
                    <span className="text-sm font-bold text-ink">
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
                bg-gradient-to-r from-brand-purple to-brand-orange text-white font-semibold rounded-xl
                hover:scale-105 transition-all shadow-lg shadow-brand-purple/20 text-sm"
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
        className="py-24 px-6 bg-surface"
        id="how-it-works"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block text-brand-purple font-semibold text-sm
                uppercase tracking-widest bg-brand-purple/10 px-4 py-1.5
                rounded-full mb-4"
            >
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl text-ink mb-4 tracking-wide">
              How It Works
            </h2>
            <p className="text-ink-soft max-w-xl mx-auto text-lg">
              Getting your device repaired has never been this easy. Five simple
              steps to a perfectly working device.
            </p>
          </div>
          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="hidden lg:block absolute top-10 left-[10%]
                right-[10%] h-0.5 border-t-2 border-dashed border-line
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
                    className="relative w-20 h-20 bg-bg border-2
                      border-line rounded-2xl shadow-lg flex items-center
                      justify-center text-4xl mb-5 hover:scale-110
                      hover:border-brand-purple/60 hover:shadow-brand-purple/10
                      transition-all duration-300"
                  >
                    {step.icon}
                    <div
                      className="absolute -top-3 -right-3 w-7 h-7
                        bg-gradient-to-br from-brand-purple to-brand-orange
                        text-white text-xs font-bold rounded-full
                        flex items-center justify-center shadow-md"
                    >
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-base">
                    {step.title}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed">
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
                bg-gradient-to-r from-brand-purple to-brand-orange text-white
                font-bold text-base rounded-2xl shadow-xl
                shadow-brand-purple/20 hover:shadow-brand-orange/30
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
      <section className="py-24 px-6 bg-bg" id="why-us">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div>
              <span
                className="inline-block text-brand-purple font-semibold text-sm
                  uppercase tracking-widest bg-brand-purple/10 px-4 py-1.5
                  rounded-full mb-5"
              >
                Why OM Mobile?
              </span>
              <h2
                className="text-4xl md:text-5xl text-ink
                  mb-6 leading-tight tracking-wide"
              >
                Repair Experience{" "}
                <span className="gradient-text">You Can Trust</span>
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-8">
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
                      hover:bg-brand-purple/5 transition-colors group"
                  >
                    <div
                      className="w-11 h-11 bg-brand-purple/15 rounded-xl
                        flex items-center justify-center text-2xl
                        flex-shrink-0 group-hover:scale-110
                        transition-transform"
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-ink-soft text-xs leading-relaxed">
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
                className="bg-gradient-to-br from-brand-purple to-bg
                  rounded-3xl p-8 text-white shadow-2xl border border-brand-purple/20"
              >
                <h3 className="text-2xl mb-6 tracking-wide">Our Repair Promise</h3>
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
                        border border-white/10"
                    >
                      <span className="text-2xl flex-shrink-0 text-brand-orange">
                        {promise.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{promise.label}</p>
                        <p className="text-white/70 text-xs mt-0.5">
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
                  bg-brand-orange/10 rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 6 — SUPPORTED BRANDS
      ════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-surface border-y border-line">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-center text-ink-soft text-sm font-semibold
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
                  className="w-12 h-12 bg-surface2 rounded-xl border border-line
                    flex items-center justify-center text-2xl shadow-sm
                    group-hover:border-brand-purple/40 group-hover:shadow-md
                    group-hover:scale-110 transition-all duration-200"
                >
                  {brand.icon}
                </div>
                <span className="text-xs text-ink-soft font-medium">
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
        className="py-24 px-6 bg-bg"
        id="reviews"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-brand-purple font-semibold text-sm
                uppercase tracking-widest bg-brand-purple/10 px-4 py-1.5
                rounded-full mb-4"
            >
              Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl text-ink mb-4 tracking-wide">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex text-amber-400 text-2xl">{"★★★★★"}</div>
              <span className="text-ink font-bold text-lg">4.9/5</span>
            </div>
            <p className="text-ink-soft">
              Based on{" "}
              <span className="font-semibold text-ink">5,000+</span>{" "}
              verified customer reviews
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>
      {/* ════════════════════════════════════════
          SECTION 8 — FAQ
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-bg" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-brand-purple font-semibold text-sm
                uppercase tracking-widest bg-brand-purple/10 px-4 py-1.5
                rounded-full mb-4"
            >
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl text-ink mb-4 tracking-wide">
              Frequently Asked Questions
            </h2>
            <p className="text-ink-soft text-lg">
              Everything you need to know about our repair services. Can't find
              an answer?{" "}
              <a
                href="tel:+9779800000000"
                className="text-brand-purple font-medium hover:underline"
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
        className="py-24 px-6 bg-bg relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div
          className="absolute top-0 right-0 w-96 h-96
            bg-brand-orange/15 rounded-full blur-3xl animate-blob"
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80
            bg-brand-purple/20 rounded-full blur-3xl animate-blob
            animation-delay-2000"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-6 block animate-bounce">🔧</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-ink mb-6 leading-tight tracking-wide"
          >
            Ready to Fix Your <span className="gradient-text">Device?</span>
          </h2>
          <p className="text-ink-soft text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Book your repair in under 2 minutes. No queues, no hassle. Just drop
            it off and we'll handle the rest.
          </p>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2
                px-10 py-5 bg-gradient-to-r from-brand-purple to-brand-orange
                text-white font-extrabold
                text-lg rounded-2xl shadow-2xl shadow-brand-purple/30
                hover:shadow-brand-orange/30 hover:scale-105
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
                px-10 py-5 bg-white/5 border border-white/15
                text-ink font-bold text-lg rounded-2xl
                hover:bg-white/10 hover:border-white/25
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
                className="bg-white/5 border border-white/10
                  text-ink-soft text-sm font-medium
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
