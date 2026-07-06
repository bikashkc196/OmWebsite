// frontend/lib/currency.js
// ─────────────────────────────────────────────────────────
// Centralized currency helper for Nepali Rupees (NPR).
// Use this everywhere instead of hardcoding "₹", "$", or "Rs"
// so the whole app stays consistent and easy to re-brand later.
// ─────────────────────────────────────────────────────────

/**
 * Format a number as Nepali Rupees, e.g. formatNPR(1234.5) -> "Rs. 1,234.50"
 * @param {number|string} amount
 * @param {{ decimals?: boolean }} options - pass { decimals: false } for whole-number display
 */
export function formatNPR(amount, options = {}) {
  const { decimals = false } = options;
  const value = Number(amount) || 0;

  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });

  return `Rs. ${formatted}`;
}

// Short alias some components may prefer
export const npr = formatNPR;

// Plain symbol, in case only the prefix is needed inline
export const CURRENCY_SYMBOL = "Rs.";

export default formatNPR;
