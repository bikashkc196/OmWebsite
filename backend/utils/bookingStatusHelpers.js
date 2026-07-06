const { restockPartsForBooking } = require("./inventoryHelpers");

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "waiting_for_parts",
  "completed",
  "cancelled",
];

class InvalidStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
class BookingClosedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

// Single source of truth for admin-driven status changes, used by both the booking
// controller and the admin controller so the two code paths can't drift out of sync.
// Mutates and saves `booking`; throws on invalid status or an already-closed booking.
const applyStatusChange = async (
  booking,
  { status, adminNote, estimatedCost, finalCost, technicianName, changedBy },
) => {
  if (!status || !VALID_STATUSES.includes(status)) {
    throw new InvalidStatusError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    );
  }
  if (["completed", "cancelled"].includes(booking.status)) {
    throw new BookingClosedError(
      `Cannot update a booking that is already "${booking.status}"`,
    );
  }
  const previousStatus = booking.status;
  booking.status = status;
  if (adminNote !== undefined) booking.adminNote = adminNote;
  if (estimatedCost !== undefined) booking.estimatedCost = estimatedCost;
  if (finalCost !== undefined) booking.finalCost = finalCost;
  if (technicianName !== undefined) booking.technicianName = technicianName;
  booking.statusHistory.push({
    status,
    changedBy,
    note: adminNote || `Status changed from ${previousStatus} to ${status}`,
  });
  // Cancelling a booking that already had parts deducted must put that stock back —
  // otherwise inventory silently drifts from what's actually on the shelf.
  if (status === "cancelled" && previousStatus !== "cancelled") {
    await restockPartsForBooking(booking);
  }
  await booking.save();
  return booking;
};

module.exports = { applyStatusChange, VALID_STATUSES };
