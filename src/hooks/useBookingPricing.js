import { useMemo } from 'react';
import { calculateBookingPricing } from '../lib/calculations/pricing.js';

/**
 * Hook to reactively calculate booking prices and surcharges
 * @param {Object} options
 * @param {string} options.duration
 * @param {string} options.frameDesign
 * @param {string} options.backdrop
 * @param {string} options.paperType
 * @param {number} [options.dpRatio=0.5]
 * @returns {Object} { basePrice, framePrice, backdropPrice, paperPrice, grandTotal, downPayment, remainingDue }
 */
export function useBookingPricing({
  duration,
  frameDesign,
  backdrop,
  paperType,
  dpRatio = 0.5
}) {
  return useMemo(() => {
    return calculateBookingPricing({
      duration,
      frameDesign,
      backdrop,
      paperType,
      dpRatio
    });
  }, [duration, frameDesign, backdrop, paperType, dpRatio]);
}
