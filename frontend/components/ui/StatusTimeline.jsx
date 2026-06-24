"use client";

const STATUS_STEPS = [
  {
    key: "pending",
    label: "Booking Received",
    icon: "📋",
    desc: "We've received your repair request",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: "✅",
    desc: "Your appointment is confirmed",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: "🔧",
    desc: "Technician is working on your device",
  },
  {
    key: "waiting_for_parts",
    label: "Awaiting Parts",
    icon: "⏳",
    desc: "Waiting for spare parts to arrive",
  },
  {
    key: "completed",
    label: "Completed",
    icon: "🎉",
    desc: "Your device is ready for pickup!",
  },
];

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "in_progress",
  "waiting_for_parts",
  "completed",
];

const getStepState = (stepKey, currentStatus) => {
  if (currentStatus === "cancelled") return "cancelled";

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(stepKey);

  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "upcoming";
};

export default function StatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div
        className="flex items-center gap-3 py-4 px-5
        bg-red-50 border border-red-100 rounded-2xl"
      >
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-700">Booking Cancelled</p>
          <p className="text-sm text-red-500 mt-0.5">
            This repair booking has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {STATUS_STEPS.map((step, index) => {
        const state = getStepState(step.key, status);
        const isLast = index === STATUS_STEPS.length - 1;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Left — icon + connector line */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center
                  justify-center text-lg flex-shrink-0 transition-all duration-500
                  ${
                    state === "done"
                      ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                      : state === "active"
                        ? "bg-blue-600 shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                        : "bg-gray-100"
                  }`}
              >
                {state === "done" ? (
                  <span className="text-white text-sm font-bold">✓</span>
                ) : (
                  <span className={state === "active" ? "animate-pulse" : ""}>
                    {step.icon}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`w-0.5 h-8 mt-1 rounded-full transition-all duration-700
                    ${state === "done" ? "bg-emerald-400" : "bg-gray-200"}`}
                />
              )}
            </div>

            {/* Right — label + description */}
            <div className="pb-6">
              <p
                className={`font-semibold text-sm transition-colors
                  ${
                    state === "done"
                      ? "text-emerald-700"
                      : state === "active"
                        ? "text-blue-700"
                        : "text-gray-400"
                  }`}
              >
                {step.label}
                {state === "active" && (
                  <span
                    className="ml-2 text-xs bg-blue-100 text-blue-600
                    px-2 py-0.5 rounded-full font-medium"
                  >
                    Current
                  </span>
                )}
              </p>
              <p
                className={`text-xs mt-0.5
                  ${state === "upcoming" ? "text-gray-300" : "text-gray-500"}`}
              >
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
