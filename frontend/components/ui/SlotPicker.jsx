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
      <div className="text-center py-8 text-gray-400 text-sm">
        <p className="text-2xl mb-2">📅</p>
        <p>Select a date to see available time slots</p>
      </div>
    );
  }
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
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
        <p className="text-sm text-gray-600">
          {availableCount > 0 ? (
            <span className="text-emerald-600 font-medium">
              ✅ {availableCount} slot{availableCount > 1 ? "s" : ""} available
            </span>
          ) : (
            <span className="text-red-500 font-medium">
              ❌ No slots available for this date
            </span>
          )}
        </p>
        <p className="text-xs text-gray-400">Max 3 bookings/slot</p>
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
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
            >
              {/* Full badge */}
              {isFull && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2
                  text-[10px] bg-red-100 text-red-500 font-semibold
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
                              ? "bg-blue-800"
                              : "bg-emerald-400"
                            : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              )}
              {!isFull && (
                <p
                  className={`text-xs mt-1
                  ${isSelected ? "text-blue-900" : "text-gray-400"}`}
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
