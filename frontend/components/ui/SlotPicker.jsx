"use client";
import { useEffect, useState } from "react";
import { useBooking } from "../../hooks/useBooking";
import Spinner from "./Spinner";
export default function SlotPicker({ selectedDate, selectedSlot, onSelect }) {
  const { fetchSlots } = useBooking();
  const [slots, setSlots] = useState([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!selectedDate) return;
    const loadSlots = async () => {
      setFetching(true);
      const data = await fetchSlots(selectedDate);
      setSlots(data);
      setFetching(false);
    };
    loadSlots();
  }, [selectedDate]);
  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-ink-soft text-sm">
        <p className="text-2xl mb-2">📅</p>
        <p>Select a date to see available time slots</p>
      </div>
    );
  }
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8 gap-3 text-ink-soft">
        <Spinner size="sm" />
        <span className="text-sm">Checking availability...</span>
      </div>
    );
  }
  const availableCount = slots.filter((s) => !s.isFull).length;
  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {availableCount > 0 ? (
            <span className="text-emerald-400 font-medium">
              ✅ {availableCount} slot{availableCount > 1 ? "s" : ""} available
            </span>
          ) : (
            <span className="text-red-400 font-medium">
              ❌ No slots available for this date
            </span>
          )}
        </p>
        <p className="text-xs text-ink-soft/70">Max 3 bookings/slot</p>
      </div>
      {/* Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map(({ slot, available, isFull }) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={isFull}
              onClick={() => !isFull && onSelect(slot)}
              className={`relative py-3.5 px-3 rounded-xl border-2 text-sm
                font-medium transition-all duration-200 text-center
                ${
                  isFull
                    ? "border-line bg-surface2 text-ink-soft/40 cursor-not-allowed"
                    : isSelected
                      ? "border-brand-purple bg-brand-purple/10 text-brand-purple shadow-md shadow-brand-purple/20"
                      : "border-line text-ink-soft hover:border-brand-purple/50 hover:bg-brand-purple/5"
                }`}
            >
              {/* Full badge */}
              {isFull && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2
                  text-[10px] bg-red-500/15 text-red-300 font-semibold
                  px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  Full
                </span>
              )}
              <p className="font-semibold">🕐 {slot}</p>
              {/* Availability dots */}
              {!isFull && (
                <div className="flex justify-center gap-1 mt-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full
                        ${
                          i < available
                            ? isSelected
                              ? "bg-brand-orange"
                              : "bg-emerald-400"
                            : "bg-line"
                        }`}
                    />
                  ))}
                </div>
              )}
              {!isFull && (
                <p
                  className={`text-xs mt-1
                  ${isSelected ? "text-brand-purple" : "text-ink-soft/60"}`}
                >
                  {available} left
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
