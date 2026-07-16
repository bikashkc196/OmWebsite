"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useToast } from "../../../context/ToastContext";
import {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Wrench,
  Monitor,
  Battery,
  Droplets,
  Zap,
  Cpu,
  Camera,
  Volume2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const steps = ["Device Info", "Issue Details", "Pick Date & Time", "Confirm"];

const deviceTypes = [
  { value: "smartphone", label: "Smartphone", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "smartwatch", label: "Smartwatch", icon: Watch },
  { value: "other", label: "Other", icon: Wrench },
];

const issueCategories = [
  { value: "screen_replacement", label: "Screen Replacement", icon: Monitor },
  { value: "battery_replacement", label: "Battery Replacement", icon: Battery },
  { value: "water_damage", label: "Water Damage", icon: Droplets },
  { value: "charging_port", label: "Charging Port", icon: Zap },
  { value: "software_issue", label: "Software Issue", icon: Cpu },
  { value: "camera_repair", label: "Camera Repair", icon: Camera },
  { value: "speaker_repair", label: "Speaker Repair", icon: Volume2 },
  { value: "other", label: "Other", icon: Wrench },
];

const timeSlots = [
  "07:00-09:00",
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
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    deviceType: "",
    deviceBrand: "",
    deviceModel: "",
    issueCategory: "",
    issueDescription: "",
    bookingDate: "",
    timeSlot: "",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Required-field validation, run before advancing each step ──
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!form.deviceType) newErrors.deviceType = "Please select a device type";
      if (!form.deviceBrand.trim()) newErrors.deviceBrand = "Device brand is required";
      if (!form.deviceModel.trim()) newErrors.deviceModel = "Device model is required";
    }

    if (currentStep === 1) {
      if (!form.issueCategory) newErrors.issueCategory = "Please select an issue category";
      if (!form.issueDescription.trim()) {
        newErrors.issueDescription = "Please describe the issue";
      } else if (form.issueDescription.trim().length < 10) {
        newErrors.issueDescription = "Description must be at least 10 characters";
      }
    }

    if (currentStep === 2) {
      if (!form.bookingDate) newErrors.bookingDate = "Please pick a repair date";
      if (!form.timeSlot) newErrors.timeSlot = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      toast.error("Please fill in all required fields before continuing.");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    // Final guard — re-validate everything in case of stale state
    const allValid = [0, 1, 2].every((s) => validateStep(s));
    if (!allValid) {
      toast.error("Some required fields are missing. Please review your booking.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bookings", form);
      toast.success("Booking confirmed! We'll see you soon.");
      router.push("/my-repairs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-4xl text-ink tracking-wide">Book a Repair</h1>
          <p className="text-ink-soft mt-2">
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
                    ? "bg-gradient-to-br from-brand-purple to-brand-orange text-white shadow-lg shadow-brand-purple/20 scale-100"
                    : "bg-surface2 text-ink-soft"
                }`}
              >
                {i < step ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500
                ${i < step ? "bg-brand-purple" : "bg-surface2"}
                ${i === steps.length - 1 ? "hidden" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-surface rounded-3xl shadow-xl p-8 border border-line">
          {/* STEP 0 — Device Info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-ink">
                Tell us about your device
              </h2>
              <div>
                <label className="label-style">
                  Device Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {deviceTypes.map((d) => {
                    const Icon = d.icon;
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => update("deviceType", d.value)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl border-2 text-sm font-medium
                          transition-all hover-lift ${
                            form.deviceType === d.value
                              ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                              : "border-line text-ink-soft hover:border-brand-purple/40"
                          }`}
                      >
                        <Icon size={20} />
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                {errors.deviceType && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.deviceType}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-style">
                    Brand <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.deviceBrand}
                    onChange={(e) => update("deviceBrand", e.target.value)}
                    className={`input-style mt-1 ${errors.deviceBrand ? "input-error" : ""}`}
                    placeholder="e.g. Samsung"
                  />
                  {errors.deviceBrand && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} /> {errors.deviceBrand}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label-style">
                    Model <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.deviceModel}
                    onChange={(e) => update("deviceModel", e.target.value)}
                    className={`input-style mt-1 ${errors.deviceModel ? "input-error" : ""}`}
                    placeholder="e.g. Galaxy S23"
                  />
                  {errors.deviceModel && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} /> {errors.deviceModel}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Issue Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-ink">
                Describe the issue
              </h2>
              <div>
                <label className="label-style">
                  Issue Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {issueCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => update("issueCategory", cat.value)}
                        className={`flex items-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium text-left
                          transition-all hover-lift ${
                            form.issueCategory === cat.value
                              ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                              : "border-line text-ink-soft hover:border-brand-purple/40"
                          }`}
                      >
                        <Icon size={18} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                {errors.issueCategory && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.issueCategory}
                  </p>
                )}
              </div>
              <div>
                <label className="label-style">
                  Detailed Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.issueDescription}
                  onChange={(e) => update("issueDescription", e.target.value)}
                  rows={4}
                  className={`input-style mt-1 resize-none ${errors.issueDescription ? "input-error" : ""}`}
                  placeholder="Describe the problem in detail... (min. 10 characters)"
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.issueDescription ? (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={13} /> {errors.issueDescription}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-ink-soft">
                    {form.issueDescription.trim().length}/10 min
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Time */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-ink">
                Pick your preferred slot
              </h2>
              <div>
                <label className="label-style flex items-center gap-1.5">
                  <Calendar size={15} /> Repair Date{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("bookingDate", e.target.value)}
                  className={`input-style mt-1 ${errors.bookingDate ? "input-error" : ""}`}
                />
                {errors.bookingDate && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.bookingDate}
                  </p>
                )}
              </div>
              <div>
                <label className="label-style flex items-center gap-1.5">
                  <Clock size={15} /> Time Slot{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update("timeSlot", slot)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all hover-lift
                        ${
                          form.timeSlot === slot
                            ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                            : "border-line text-ink-soft hover:border-brand-purple/40"
                        }`}
                    >
                      <Clock size={14} /> {slot}
                    </button>
                  ))}
                </div>
                {errors.timeSlot && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.timeSlot}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-ink">
                Confirm your booking
              </h2>
              <div className="bg-surface2 rounded-2xl p-5 space-y-3 text-sm">
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
                  <div key={label} className="flex justify-between gap-4">
                    <span className="font-medium text-ink-soft shrink-0">
                      {label}
                    </span>
                    <span className="text-ink capitalize text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-line text-ink-soft
                  hover:bg-surface2 transition font-medium"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <div className="ml-auto">
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-8 py-2.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl font-medium
                    hover:scale-[1.02] transition shadow-md shadow-brand-purple/20 active:scale-[0.98]"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-8 py-2.5 bg-emerald-500 text-white rounded-xl font-medium
                    hover:bg-emerald-600 transition shadow-md disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 size={16} />
                  {loading ? "Submitting..." : "Confirm Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
