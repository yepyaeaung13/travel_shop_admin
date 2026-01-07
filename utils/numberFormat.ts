/**
 * Handles change events on an <input> by stripping out non-digit characters
 * and clamping the result to a maximum length.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
 * @param {number} [limit=10] - Maximum number of digits allowed. default: 10
 * @returns {string} The cleaned and clamped numeric string.
 */
export const handleInputAmountChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  limit = 10,
) => {
  // 1. remove non-digits
  const numericOnly = event.target.value.replace(/[^0-9]/g, "");

  // 2. clamp to `limit` digits
  const clamped = numericOnly.length > 0 ? numericOnly.slice(0, limit) : "";

  // 3. write back and return as string
  return (event.target.value = clamped.toString());
};
/**
 * Formats numbers to display with K (thousands) and M (millions) suffixes
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: auto)
 * @returns Formatted string (e.g., "1.5K", "2M", "0")
 */
export const formatNumber = (value: number, decimals?: number): string => {
  if (value === 0) return "0";

  if (value >= 1000000) {
    const millions = value / 1000000;
    // If decimals is specified, use it; otherwise auto-detect
    if (decimals !== undefined) {
      return `${millions.toFixed(decimals)}M`;
    }
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }

  if (value >= 10000) {
    const thousands = value / 1000;
    if (decimals !== undefined) {
      return `${thousands.toFixed(decimals)}K`;
    }
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }

  return value.toString();
};

/**
 * Formats currency
 * @param value - The number to format
 * @param currency - Currency symbol (default: "$")
 */
export const formatCurrency = (
  value: number,
  currency: string = "Ks"
): string => {
  if (isNaN(value)) return "0";
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} ${currency}`;
};