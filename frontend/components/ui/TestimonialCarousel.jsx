"use client";
import { useState, useEffect, useCallback } from "react";
const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Salyan",
    avatar: "RS",
    avatarColor: "from-blue-500 to-indigo-500",
    rating: 5,
    device: "Samsung Galaxy S23",
    issue: "Screen Replacement",
    review:
      "Absolutely amazing service! My phone screen was shattered and they fixed it in under 45 minutes. The display looks brand new. Very professional team and the price was very reasonable compared to the service center.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Dang",
    avatar: "PP",
    avatarColor: "from-pink-500 to-rose-500",
    rating: 5,
    device: "iPhone 14 Pro",
    issue: "Battery Replacement",
    review:
      "I was skeptical at first but OM Mobile Repair completely blew me away. Genuine Apple battery, perfect installation, and my phone now lasts a full day again. The booking system is so smooth and convenient!",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Amit Verma",
    location: "Rukum",
    avatar: "AV",
    avatarColor: "from-emerald-500 to-teal-500",
    rating: 5,
    device: "OnePlus 11",
    issue: "Water Damage Repair",
    review:
      "Dropped my phone in water and was devastated. Brought it here as a last resort and they saved it completely! Everything works perfectly. Highly recommend their water damage service. True experts!",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    location: "Surkhet",
    avatar: "SK",
    avatarColor: "from-purple-500 to-violet-500",
    rating: 5,
    device: "MacBook Pro M2",
    issue: "Charging Port Repair",
    review:
      "My MacBook wasn't charging and I was panicking before an important presentation. OM Mobile Repair fixed it within 2 hours! They even cleaned the entire port. Super fast, professional, and affordable.",
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Karthik Nair",
    location: "Gorahi",
    avatar: "KN",
    avatarColor: "from-orange-500 to-amber-500",
    rating: 5,
    device: "iPad Air 5",
    issue: "Screen Replacement",
    review:
      "Got my iPad screen replaced here and the quality is outstanding. The original Apple display quality is maintained perfectly. The staff were very knowledgeable and kept me updated throughout the repair.",
    date: "2 months ago",
  },
];
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base ${i < rating ? "text-amber-400" : "text-ink-soft/30"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState("right");
  const goTo = useCallback((index, dir = "right") => {
    setDirection(dir);
    setCurrent(index);
  }, []);
  const next = useCallback(() => {
    goTo((current + 1) % TESTIMONIALS.length, "right");
  }, [current, goTo]);
  const prev = useCallback(() => {
    goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, "left");
  }, [current, goTo]);
  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, next]);
  const t = TESTIMONIALS[current];
  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="bg-surface rounded-3xl shadow-xl border border-line
          p-8 md:p-10 relative overflow-hidden"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Decorative quote mark */}
        <div
          className="absolute top-6 right-8 text-8xl font-serif text-brand-purple/10
            leading-none pointer-events-none select-none"
        >
          "
        </div>
        {/* Reviewer Info */}
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br
              ${t.avatarColor} flex items-center justify-center
              text-white font-bold text-lg shadow-lg flex-shrink-0`}
          >
            {t.avatar}
          </div>
          <div>
            <h3 className="font-bold text-ink text-lg">{t.name}</h3>
            <p className="text-ink-soft text-sm">📍 {t.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={t.rating} />
              <span className="text-xs text-ink-soft/70">{t.date}</span>
            </div>
          </div>
          {/* Device Tag */}
          <div className="ml-auto hidden sm:block">
            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl px-3 py-2 text-right">
              <p className="text-xs text-brand-purple/70 font-medium">Device</p>
              <p className="text-xs font-semibold text-brand-purple">{t.device}</p>
              <p className="text-xs text-brand-orange capitalize">{t.issue}</p>
            </div>
          </div>
        </div>
        {/* Review Text */}
        <blockquote className="text-ink-soft text-base leading-relaxed relative z-10">
          "{t.review}"
        </blockquote>
        {/* Verified badge */}
        <div className="flex items-center gap-1.5 mt-5">
          <span className="text-emerald-400 text-sm">✅</span>
          <span className="text-xs text-ink-soft font-medium">
            Verified Customer Review
          </span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Dots */}
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "right" : "left")}
              className={`rounded-full transition-all duration-300
                ${
                  i === current
                    ? "w-7 h-2.5 bg-gradient-to-r from-brand-purple to-brand-orange"
                    : "w-2.5 h-2.5 bg-surface2 hover:bg-line"
                }`}
            />
          ))}
        </div>
        {/* Arrow Buttons */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-xl border-2 border-line
              flex items-center justify-center text-ink-soft
              hover:border-brand-purple hover:text-brand-purple
              hover:bg-brand-purple/10 transition-all"
          >
            ←
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-xl border-2 border-line
              flex items-center justify-center text-ink-soft
              hover:border-brand-purple hover:text-brand-purple
              hover:bg-brand-purple/10 transition-all"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
