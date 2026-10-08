import React from 'react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { formatIDR } from '../../lib/formatters.js';

export default function PaymentLedger({
  booking,
  onOpenRecordPayment
}) {
  if (!booking) return null;

  const isPaidInFull = booking.remainingDue === 0;

  return (
    <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#855230]">receipt</span>
          <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
            Payment Summary
          </h2>
        </div>
        <Badge status={isPaidInFull ? 'Fully Paid' : 'Down Payment'} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center py-2 border-b border-[#f0ede9]">
          <span className="text-sm text-[#504440]">Total Event Value</span>
          <span className="text-sm text-[#090100] font-mono font-semibold">
            {formatIDR(booking.totalPrice)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-[#f0ede9]">
          <span className="text-sm text-[#504440]">Down Payment Paid</span>
          <span className="text-sm text-[#2d633b] font-mono font-semibold">
            {formatIDR(booking.downPayment)}
          </span>
        </div>

        <div className="p-4 mt-1 bg-[#f6f3ee] rounded-lg flex justify-between items-center border border-[#d3c3be]/30">
          <span className="text-xs text-[#855230] uppercase font-bold tracking-wider">
            Remaining Due
          </span>
          <span className="text-xl text-[#090100] font-serif font-bold">
            {formatIDR(booking.remainingDue)}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onOpenRecordPayment}
      >
        Record Additional Payment
      </Button>
    </div>
  );
}
