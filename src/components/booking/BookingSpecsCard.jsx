import React from 'react';

export default function BookingSpecsCard({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#855230]">tune</span>
          <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
            Photobooth Configuration &amp; Additional Options
          </h2>
        </div>
        <span className="text-xs text-[#855230] uppercase font-semibold">
          {booking.duration} Duration
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#f6f3ee] rounded-lg flex flex-col justify-between gap-2 border border-[#d3c3be]/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
              Backdrop
            </span>
            <span className="text-sm text-[#090100] font-semibold">{booking.backdrop}</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#f6f3ee] rounded-lg flex flex-col justify-between gap-2 border border-[#d3c3be]/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
              Durasi Booking
            </span>
            <span className="text-sm text-[#090100] font-semibold">{booking.duration}</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#f6f3ee] rounded-lg flex flex-col justify-between gap-2 border border-[#d3c3be]/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
              Ukuran Kertas
            </span>
            <span className="text-sm text-[#090100] font-semibold">{booking.paperType}</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#f6f3ee] rounded-lg flex flex-col justify-between gap-2 border border-[#d3c3be]/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
              Design Frame
            </span>
            <span className="text-sm text-[#090100] font-semibold">{booking.frameDesign}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
