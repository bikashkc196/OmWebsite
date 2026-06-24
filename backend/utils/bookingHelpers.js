const Booking = require("../models/Booking");

/**
 * Check if a time slot is already taken on a given date
 * Max bookings per slot = 3 (configurable)
 */
const MAX_BOOKINGS_PER_SLOT = 5;

const isSlotAvailable = async (
  bookingDate,
  timeSlot,
  excludeBookingId = null,
) => {
  const dayStart = new Date(bookingDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(bookingDate);
  dayEnd.setHours(23, 59, 59, 999);

  const query = {
    bookingDate: { $gte: dayStart, $lte: dayEnd },
    timeSlot,
    status: { $nin: ["cancelled"] }, // Exclude cancelled bookings
  };

  // Exclude current booking when updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingCount = await Booking.countDocuments(query);
  return existingCount < MAX_BOOKINGS_PER_SLOT;
};

/**
 * Get available slots for a given date
 */
const ALL_SLOTS = [
  "07:00-9:00",
  "11:30-13:00",
  "13:30-15:00",
  "15:30-17:00",
  "17:30-19:00",
];

const getAvailableSlots = async (bookingDate) => {
  const dayStart = new Date(bookingDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(bookingDate);
  dayEnd.setHours(23, 59, 59, 999);

  // Get all bookings for this date (non-cancelled)
  const existingBookings = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: dayStart, $lte: dayEnd },
        status: { $nin: ["cancelled"] },
      },
    },
    {
      $group: {
        _id: "$timeSlot",
        count: { $sum: 1 },
      },
    },
  ]);

  // Map slot => count
  const slotCounts = {};
  existingBookings.forEach((b) => {
    slotCounts[b._id] = b.count;
  });

  // Build availability array
  const availability = ALL_SLOTS.map((slot) => ({
    slot,
    booked: slotCounts[slot] || 0,
    available: MAX_BOOKINGS_PER_SLOT - (slotCounts[slot] || 0),
    isFull: (slotCounts[slot] || 0) >= MAX_BOOKINGS_PER_SLOT,
  }));

  return availability;
};

/**
 * Check if date is valid for booking
 * Rules: Not in the past, not Sundays (shop closed)
 */
const isValidBookingDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Cannot book in the past
  if (date < today) {
    return { valid: false, message: "Booking date cannot be in the past" };
  }

  // Cannot book more than 30 days in advance
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  if (date > maxDate) {
    return {
      valid: false,
      message: "Cannot book more than 30 days in advance",
    };
  }

  // Shop closed on Sundays (0 = Sunday)
  if (date.getDay() === 0) {
    return { valid: false, message: "Sorry, we are closed on Sundays" };
  }

  return { valid: true };
};

/**
 * Build filter query from request params
 */
const buildBookingFilter = (query) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.deviceType) {
    filter.deviceType = query.deviceType;
  }

  if (query.date) {
    const day = new Date(query.date);
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const dayEnd = new Date(day.setHours(23, 59, 59, 999));
    filter.bookingDate = { $gte: dayStart, $lte: dayEnd };
  }

  if (query.from && query.to) {
    filter.bookingDate = {
      $gte: new Date(query.from),
      $lte: new Date(query.to),
    };
  }

  if (query.search) {
    filter.$or = [
      { deviceBrand: { $regex: query.search, $options: "i" } },
      { deviceModel: { $regex: query.search, $options: "i" } },
      { bookingRef: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
};

module.exports = {
  isSlotAvailable,
  getAvailableSlots,
  isValidBookingDate,
  buildBookingFilter,
  ALL_SLOTS,
};
