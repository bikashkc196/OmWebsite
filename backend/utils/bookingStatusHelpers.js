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

// Single source of truth for admin-driven status/cost changes, used by both the booking
// controller and the admin controller so the two code paths can't drift out of sync.
// Mutates and saves `booking`. Cost/note/technician fields can always be edited (e.g.
// correcting the final invoice after a repair is marked complete) — only an actual
// transition to a *different* status is blocked once a booking is closed.
const applyStatusChange = async (
  booking,
  { status, adminNote, estimatedCost, finalCost, technicianName, changedBy },
) => {
  if (!status || !VALID_STATUSES.includes(status)) {
    throw new InvalidStatusError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    );
  }
  const previousStatus = booking.status;
  const isStatusChanging = status !== previousStatus;
  if (isStatusChanging && ["completed", "cancelled"].includes(previousStatus)) {
    throw new BookingClosedError(
      `Cannot change the status of a booking that is already "${previousStatus}". ` +
        `You can still edit its cost or notes.`,
    );
  }
  booking.status = status;
  if (adminNote !== undefined) booking.adminNote = adminNote;
  if (estimatedCost !== undefined) booking.estimatedCost = estimatedCost;
  if (finalCost !== undefined) booking.finalCost = finalCost;
  if (technicianName !== undefined) booking.technicianName = technicianName;
  if (isStatusChanging) {
    booking.statusHistory.push({
      status,
      changedBy,
      note: adminNote || `Status changed from ${previousStatus} to ${status}`,
    });
    // Cancelling a booking that already had parts deducted must put that stock back —
    // otherwise inventory silently drifts from what's actually on the shelf.
    if (status === "cancelled") {
      await restockPartsForBooking(booking);
    }
  } else if (adminNote) {
    booking.statusHistory.push({ status, changedBy, note: adminNote });
  }
  await booking.save();
  return booking;
};

module.exports = { applyStatusChange, VALID_STATUSES };
