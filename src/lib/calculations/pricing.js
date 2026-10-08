/**
 * Pricing Calculations for Timelens Photobooth Atelier
 */

import { pricingOptions } from '../mock/mockData.js';

/**
 * Calculates complete pricing breakdown for a booking
 * @param {Object} params
 * @param {string} params.duration e.g. "4 Jam" or "4 Hours"
 * @param {string} params.frameDesign e.g. "Dibuatkan oleh Timelens" or "timelens"
 * @param {string} params.backdrop e.g. "Satin Red" or "satin_red"
 * @param {string} params.paperType e.g. "4R (4x6)" or "Photo Crack"
 * @param {number} [params.dpRatio=0.5]
 * @returns {Object} { basePrice, framePrice, backdropPrice, paperPrice, grandTotal, downPayment, remainingDue }
 */
export function calculateBookingPricing({
  duration = '4 Jam',
  frameDesign = 'Dibuatkan oleh Timelens',
  backdrop = 'Satin Red',
  paperType = 'Photostrip (2x6)',
  dpRatio = 0.5
} = {}) {
  // Normalize duration key (e.g. "Photobooth 4 Hours" -> "4 Jam", "4 Hours" -> "4 Jam")
  const normDuration = String(duration)
    .replace('Photobooth ', '')
    .replace('Hours', 'Jam')
    .replace('Hour', 'Jam')
    .trim();

  const basePrice = pricingOptions.durationRates[normDuration] ||
    pricingOptions.durationRates['4 Jam'] ||
    2800000;

  // Frame surcharge
  const isCustomTimelens =
    frameDesign === 'timelens' ||
    frameDesign === 'Dibuatkan oleh Timelens' ||
    frameDesign?.toLowerCase().includes('timelens');
  const framePrice = isCustomTimelens ? 300000 : 0;

  // Backdrop surcharge
  let backdropPrice = 0;
  const bdObj = pricingOptions.backdropOptions.find(
    b => b.id === backdrop || b.name.toLowerCase() === backdrop?.toLowerCase()
  );
  if (bdObj) {
    backdropPrice = bdObj.surcharge;
  } else if (backdrop === 'satin_red' || backdrop === 'Satin Red') {
    backdropPrice = 400000;
  } else if (backdrop === 'glam_silver' || backdrop === 'Glam Silver') {
    backdropPrice = 250000;
  }

  // Paper surcharge
  let paperPrice = 0;
  const paperObj = pricingOptions.paperOptions.find(
    p => p.id === paperType || p.name.toLowerCase() === paperType?.toLowerCase()
  );
  if (paperObj) {
    paperPrice = paperObj.surcharge;
  } else if (paperType === 'photo_crack' || paperType === 'Photo Crack') {
    paperPrice = 150000;
  }

  const grandTotal = basePrice + framePrice + backdropPrice + paperPrice;
  const downPayment = Math.round(grandTotal * dpRatio);
  const remainingDue = grandTotal - downPayment;

  return {
    basePrice,
    framePrice,
    backdropPrice,
    paperPrice,
    grandTotal,
    downPayment,
    remainingDue
  };
}

/**
 * Calculates remaining balance given total price and paid amount
 * @param {number} total
 * @param {number} paid
 * @returns {number}
 */
export function calculateRemainingDue(total, paid) {
  const safeTotal = Number(total) || 0;
  const safePaid = Number(paid) || 0;
  return Math.max(0, safeTotal - safePaid);
}
