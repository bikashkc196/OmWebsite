"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useToast } from "../../../context/ToastContext";

const steps = ["Device Info", "Issue Details", "Pick Date & Time", "Confirm"];

const deviceTypes = ["smartphone", "tablet", "laptop", "smartwatch", "other"];
const issueCategories = [
  { value: "screen_replacement", label: "📱 Screen Replacement" },
  { value: "battery_replacement", label: "🔋 Battery Replacement" },
  { value: "water_damage", label: "💧 Water Damage" },
  { value: "charging_port", label: "⚡ Charging Port" },
  { value: "software_issue", label: "💻 Software Issue" },
  { value: "camera_repair", label: "📷 Camera Repair" },
  { value: "speaker_repair", label: "🔊 Speaker Repair" },
  { value: "other", label: "🔧 Other" },
];
const timeSlots = [
  "07:00-9:00",
  "11:30-13:00",
  "13:30-15:00",
  "15:30-17:00",
  "17:30-19:00",
];

export default function BookRepairPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deviceType: "",
    deviceBrand: "",
    deviceModel: "",
    issueCategory: "",
    issueDescription: "",
    bookingDate: "",
    timeSlot: "",
  });

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/bookings", form);
      toast.success("🎉 Booking confirmed! We'll see you soon.");
      router.push("/my-repairs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Book a Repair</h1>
          <p className="text-gray-500 mt-2">
            Quick, easy, and hassle-free device repair booking
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold
                text-sm transition-all duration-300
                ${
                  i <= step
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500
                ${i < step ? "bg-blue-600" : "bg-gray-200"}
                ${i === steps.length - 1 ? "hidden" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* STEP 0 — Device Info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800">
                Tell us about your device
              </h2>
              <div>
                <label className="label-style">Device Type</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {deviceTypes.map((d) => (
                    <button
                      key={d}
                      onClick={() => update("deviceType", d)}
                      className={`py-2 px-3 rounded-xl border-2 capitalize text-sm font-medium
                        transition-all ${
                          form.deviceType === d
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-style">Brand</label>
                  <input
                    value={form.deviceBrand}
                    onChange={(e) => update("deviceBrand", e.target.value)}
                    className="input-style mt-1"
                    placeholder="e.g. Samsung"
                  />
                </div>
                <div>
                  <label className="label-style">Model</label>
                  <input
                    value={form.deviceModel}
                    onChange={(e) => update("deviceModel", e.target.value)}
                    className="input-style mt-1"
                    placeholder="e.g. Galaxy S23"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Issue Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800">
                Describe the issue
              </h2>
              <div>
                <label className="label-style">Issue Category</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {issueCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => update("issueCategory", cat.value)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium text-left
                        transition-all ${
                          form.issueCategory === cat.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-style">Detailed Description</label>
                <textarea
                  value={form.issueDescription}
                  onChange={(e) => update("issueDescription", e.target.value)}
                  rows={4}
                  className="input-style mt-1 resize-none"
                  placeholder="Describe the problem in detail..."
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Time */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800">
                Pick your preferred slot
              </h2>
              <div>
                <label className="label-style">Repair Date</label>
                <input
                  type="date"
                  value={form.bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("bookingDate", e.target.value)}
                  className="input-style mt-1"
                />
              </div>
              <div>
                <label className="label-style">Time Slot</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => update("timeSlot", slot)}
                      className={`py-3 rounded-xl border-2 font-medium text-sm transition-all
                        ${
                          form.timeSlot === slot
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                    >
                      🕐 {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm your booking
              </h2>
              <div className="bg-blue-50 rounded-2xl p-5 space-y-3 text-sm">
                {[
                  [
                    "Device",
                    `${form.deviceBrand} ${form.deviceModel} (${form.deviceType})`,
                  ],
                  ["Issue", form.issueCategory?.replace(/_/g, " ")],
                  ["Description", form.issueDescription],
                  ["Date", form.bookingDate],
                  ["Time Slot", form.timeSlot],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="font-medium text-gray-600">{label}</span>
                    <span className="text-gray-800 capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600
                  hover:bg-gray-50 transition font-medium"
              >
                ← Back
              </button>
            )}
            <div className="ml-auto">
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-medium
                    hover:bg-blue-700 transition shadow-md shadow-blue-200"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-2.5 bg-emerald-500 text-white rounded-xl font-medium
                    hover:bg-emerald-600 transition shadow-md disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "✅ Confirm Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
