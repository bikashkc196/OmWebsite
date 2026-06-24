"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "How long does a typical repair take?",
    a: "Most common repairs like screen replacement and battery replacement are completed within 30–60 minutes. Complex repairs such as water damage or motherboard issues may take 1–3 hours. We'll give you an accurate time estimate when you bring in your device.",
  },
  {
    q: "Do you use genuine/original parts?",
    a: "Yes! We use only OEM (Original Equipment Manufacturer) or high-quality certified parts for all repairs. We never compromise on part quality, and every part comes with its own warranty.",
  },
  {
    q: "Is there a warranty on repairs?",
    a: "Absolutely. All our repairs come with a minimum 3-month warranty on parts and labor. Screen replacements and battery replacements come with a 6-month warranty. If anything goes wrong within the warranty period, we fix it for free.",
  },
  {
    q: "Can I track the status of my repair?",
    a: "Yes! Once you book online, you'll receive a unique Booking Reference Number. You can log in to your account anytime to check the real-time status of your repair — from Pending → Confirmed → In Progress → Completed.",
  },
  {
    q: "What if the repair cost is different from the estimate?",
    a: "We'll always contact you before proceeding if the actual repair cost differs significantly from the estimate shown during booking. We never do any additional work without your explicit approval.",
  },
  {
    q: "Do I need an appointment or can I walk in?",
    a: "We strongly recommend booking online to guarantee your time slot and avoid waiting. Walk-ins are welcome but subject to technician availability. Booking online also gives you priority service.",
  },
  {
    q: "What devices do you repair?",
    a: "We repair a wide range of devices including smartphones (all brands), tablets, laptops, and smartwatches. This includes Apple, Samsung, OnePlus, Xiaomi, Oppo, Vivo, Realme, and many more brands.",
  },
  {
    q: "Is my data safe during the repair?",
    a: "We take data privacy very seriously. We only access your device if absolutely required for the repair (e.g., software issues). We recommend backing up your data before bringing in your device. We sign a privacy agreement if requested.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden
              ${
                isOpen
                  ? "border-blue-200 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-blue-200"
              }`}
          >
            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between
                px-6 py-5 text-left gap-4"
            >
              <span
                className={`font-semibold text-base transition-colors
                  ${isOpen ? "text-blue-700" : "text-gray-800"}`}
              >
                {faq.q}
              </span>
              <span
                className={`text-xl flex-shrink-0 transition-transform duration-300
                  ${
                    isOpen
                      ? "rotate-45 text-blue-600"
                      : "rotate-0 text-gray-400"
                  }`}
              >
                +
              </span>
            </button>

            {/* Answer */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-5">
                <div className="w-full h-px bg-blue-100 mb-4" />
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
