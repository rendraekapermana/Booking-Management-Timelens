import React from 'react';
import { formatIDR } from '../../lib/formatters.js';

export default function BookingSummarySidebar({
  pricing,
  formData = {},
  formattedDate,
  onSubmit,
  submitLabel = 'Kirim Formulir Reservasi',
  isSubmitting = false,
  showSubmitButton = true,
  className = ''
}) {
  const {
    basePrice = 2800000,
    framePrice = 0,
    backdropPrice = 0,
    paperPrice = 0,
    grandTotal = 2800000,
    downPayment = 1400000,
    remainingDue = 1400000
  } = pricing || {};

  return (
    <div className={`bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6 ${className}`}>
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#f1ece4]">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#090100]">
              Ringkasan Reservasi
            </h3>
            <p className="text-[11px] text-[#504440] mt-0.5">
              Estimasi investasi atelier photobooth
            </p>
          </div>
          <span className="material-symbols-outlined text-[#855230] text-[20px]">
            receipt_long
          </span>
        </div>

        {/* Selected specifications breakdown */}
        <div className="py-4 space-y-3 text-xs border-b border-[#f1ece4]">
          <div className="flex justify-between items-center text-[#504440]">
            <span>Durasi ({formData.duration || '4 Jam'})</span>
            <span className="font-semibold text-[#1c1c19]">{formatIDR(basePrice)}</span>
          </div>

          <div className="flex justify-between items-center text-[#504440]">
            <span>Desain Frame ({formData.designFrame || 'Dari Client'})</span>
            <span className="font-semibold text-[#1c1c19]">
              {framePrice > 0 ? formatIDR(framePrice) : 'Included'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#504440]">
            <span>Backdrop ({formData.backdrop || 'Satin Red'})</span>
            <span className="font-semibold text-[#1c1c19]">
              {backdropPrice > 0 ? formatIDR(backdropPrice) : 'Included'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#504440]">
            <span>Kertas ({formData.paperType || 'Photostrip'})</span>
            <span className="font-semibold text-[#1c1c19]">
              {paperPrice > 0 ? formatIDR(paperPrice) : 'Included'}
            </span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 pb-2 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
              Total Investasi
            </span>
            <span className="font-serif font-bold text-2xl text-[#090100]">
              {formatIDR(grandTotal)}
            </span>
          </div>

          <div className="bg-[#f6f3ee] p-3.5 rounded-xl space-y-2 border border-[#d3c3be]/40 text-xs">
            <div className="flex justify-between text-[#504440]">
              <span>Uang Muka (DP 50%)</span>
              <span className="font-semibold text-[#855230]">{formatIDR(downPayment)}</span>
            </div>
            <div className="flex justify-between text-[#827470] text-[11px]">
              <span>Pelunasan (H-3 Acara)</span>
              <span>{formatIDR(remainingDue)}</span>
            </div>
          </div>
        </div>

        {/* Event Quick Info */}
        {(formData.eventName || formattedDate) && (
          <div className="pt-4 border-t border-[#f1ece4] text-[11px] text-[#504440] space-y-1.5">
            {formData.eventName && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">celebration</span>
                <span className="font-semibold text-[#1c1c19] truncate">{formData.eventName}</span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">calendar_today</span>
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showSubmitButton && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] active:scale-[0.99] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{submitLabel}</span>
        </button>
      )}
    </div>
  );
}
