"use client";
import { useEffect, useRef, useState } from "react";

// Animate a number from 0 to target
function useCountUp(target, duration = 2000, startCounting) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (target - startValue) + startValue));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, startCounting]);

  return count;
}

function StatItem({ value, suffix, label, icon, duration, startCounting }) {
  const count = useCountUp(value, duration, startCounting);

  return (
    <div className="text-center group">
      <div
        className="inline-flex items-center justify-center w-16 h-16
          bg-white/10 rounded-2xl text-3xl mb-4
          group-hover:scale-110 group-hover:bg-white/20
          transition-all duration-300"
      >
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>
      <p className="text-blue-200 font-medium text-sm">{label}</p>
    </div>
  );
}

const STATS = [
  {
    value: 10000,
    suffix: "+",
    label: "Devices Repaired",
    icon: "🔧",
    duration: 2000,
  },
  {
    value: 98,
    suffix: "%",
    label: "Customer Satisfaction",
    icon: "⭐",
    duration: 1500,
  },
  {
    value: 30,
    suffix: " Min",
    label: "Average Repair Time",
    icon: "⚡",
    duration: 1200,
  },
  {
    value: 5000,
    suffix: "+",
    label: "Happy Customers",
    icon: "😊",
    duration: 1800,
  },
];

export default function StatsCounter() {
  const ref = useRef(null);
  const [startCounting, setStartCounting] = useState(false);

  // Start counting when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} startCounting={startCounting} />
      ))}
    </div>
  );
}
