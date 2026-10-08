/**
 * Formatter utilities for Timelens Photobooth Atelier
 */

/**
 * Format number to Indonesian Rupiah currency format (e.g., Rp 3.500.000)
 * @param {number|string} num
 * @returns {string}
 */
export function formatIDR(num) {
  if (typeof num !== 'number') num = Number(num) || 0;
  return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format date to standard Indonesian format (e.g. Kamis, 24 Okt 2024 or 24 Okt 2024)
 * @param {string|Date} dateStr
 * @param {boolean} includeDay
 * @returns {string}
 */
export function formatDateID(dateStr, includeDay = false) {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' && !dateStr.includes('T')
      ? new Date(dateStr + 'T00:00:00')
      : new Date(dateStr);
    
    if (isNaN(d.getTime())) return String(dateStr);

    if (includeDay) {
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format date to English display (e.g. Friday, Oct 24, 2024)
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDateEN(dateStr) {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' && !dateStr.includes('T')
      ? new Date(dateStr + 'T00:00:00')
      : new Date(dateStr);
    
    if (isNaN(d.getTime())) return String(dateStr);

    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Clean numeric string into an integer
 * @param {string|number} val
 * @returns {number}
 */
export function parseCleanNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
}
