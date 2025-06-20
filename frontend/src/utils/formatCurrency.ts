/**
 * Format a number as INR currency
 * @param amount - The amount to format
 * @param currency - The currency code (defaults to INR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Fallback for other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format a number as INR currency without the symbol
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export const formatNumberWithCommas = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount);
};