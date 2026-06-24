/**
 * Generic validation middleware factory
 * Pass an array of field rules and it returns express middleware
 */

const validateBooking = (req, res, next) => {
  const {
    deviceType,
    deviceBrand,
    deviceModel,
    issueCategory,
    issueDescription,
    bookingDate,
    timeSlot,
  } = req.body;

  const errors = [];

  const validDeviceTypes = [
    "smartphone",
    "tablet",
    "laptop",
    "smartwatch",
    "other",
  ];
  const validIssueCategories = [
    "screen_replacement",
    "battery_replacement",
    "water_damage",
    "charging_port",
    "software_issue",
    "camera_repair",
    "speaker_repair",
    "motherboard_repair",
    "other",
  ];
  const validTimeSlots = [
    "07:00-9:00",
    "11:30-13:00",
    "13:30-15:00",
    "15:30-17:00",
    "17:30-19:00",
  ];

  // Required field checks
  if (!deviceType) errors.push("Device type is required");
  else if (!validDeviceTypes.includes(deviceType))
    errors.push(`Invalid device type: ${deviceType}`);

  if (!deviceBrand?.trim()) errors.push("Device brand is required");
  if (!deviceModel?.trim()) errors.push("Device model is required");

  if (!issueCategory) errors.push("Issue category is required");
  else if (!validIssueCategories.includes(issueCategory))
    errors.push(`Invalid issue category: ${issueCategory}`);

  if (!issueDescription?.trim()) errors.push("Issue description is required");
  else if (issueDescription.trim().length < 10)
    errors.push("Issue description must be at least 10 characters");

  if (!bookingDate) errors.push("Booking date is required");
  if (!timeSlot) errors.push("Time slot is required");
  else if (!validTimeSlots.includes(timeSlot))
    errors.push(`Invalid time slot: ${timeSlot}`);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = [
    "pending",
    "confirmed",
    "in_progress",
    "waiting_for_parts",
    "completed",
    "cancelled",
  ];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

module.exports = { validateBooking, validateStatusUpdate };
