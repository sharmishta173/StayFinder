import { format, differenceInDays, addDays } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @param options - Options for formatting
 *   - formatStr: The format string (defaults to 'dd MMM yyyy')
 *   - addDays: Number of days to add to the date
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options?: { formatStr?: string; addDays?: number }
): string => {
  let date = new Date(dateString);
  
  // Add days if specified
  if (options?.addDays) {
    date = addDays(date, options.addDays);
  }
  
  // Use provided format or default
  const formatStr = options?.formatStr || 'dd MMM yyyy';
  
  return format(date, formatStr);
};

/**
 * Calculate the number of nights between two dates
 * @param checkInDate - The check-in date
 * @param checkOutDate - The check-out date
 * @returns Number of nights
 */
export const calculateNights = (checkInDate: string | Date, checkOutDate: string | Date): number => {
  const startDate = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
  const endDate = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;
  
  return differenceInDays(endDate, startDate);
};

/**
 * Format a date range as a string
 * @param checkInDate - The check-in date
 * @param checkOutDate - The check-out date
 * @returns Formatted date range string
 */
export const formatDateRange = (checkInDate: string | Date, checkOutDate: string | Date): string => {
  const startDate = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
  const endDate = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;
  
  const formattedStartDate = format(startDate, 'dd MMM');
  const formattedEndDate = format(endDate, 'dd MMM yyyy');
  
  return `${formattedStartDate} - ${formattedEndDate}`;
};