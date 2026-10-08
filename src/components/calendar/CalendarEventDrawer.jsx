import React from 'react';
import Button from '../ui/Button.jsx';
import { formatIDR } from '../../lib/formatters.js';

export default function CalendarEventDrawer({
  event,
  onClose,
  onSelectBooking,
  onNavigate
}) {
  if (!event) return null;

  return (
    <aside className="w-full lg:w-96 bg-[#ffffff] rounded-xl shadow-md border border-[#d3c3be]/40 p-6 flex flex-col gap-6 transition-all duration-300 shrink-0">
      {/* Drawer Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#855230]">
            {event.orderRef}
          </span>
          <h3 className="text-lg font-serif font-bold text-[#090100] mt-0.5">
            {event.displayTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] transition-colors cursor-pointer"
          title="Close Drawer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Visual Preview */}
      <div className="relative w-full h-36 rounded-lg overflow-hidden bg-[#f0ede9] shadow-inner">
        <img
          src={event.venueImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBrC0BohAbPLiQEZ2CocKpfe4JUN3RwjBAaR7VZKP7nDIAwjifrs6Qp8jGrdrpj4eNFKZ-eFVfgyhVz46uOefV3e2vZXgZnIl-DzXxFR6-POFi9Wjtb_d4BorZK8uhOZeMHGoDbJc2_6nN2z-eWwXi7KAa7k2HHFNuRp8ToFmFysPStGVE8pF2WNOqc7K5NfBI8NOL8ZzyBolfJPecsrKPLpe6DYr7f034e3pHP6Yu-5FWmBneIYkj-"}
          alt="Venue Snapshot"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090100]/80 via-transparent to-transparent flex items-end p-3">
          <div className="flex items-center gap-2 text-[#fcf9f4]">
            <span className="material-symbols-outlined text-[16px] text-[#ffdbc7]">photo_camera</span>
            <span className="text-[11px] tracking-wide font-medium">Vintage Timber Booth 02 Attached</span>
          </div>
        </div>
      </div>

      {/* Event Metadata Bento */}
      <div className="flex flex-col gap-4">
        {/* Customer Tile */}
        <div className="bg-[#f6f3ee] p-3.5 rounded-lg flex items-center justify-between border border-[#d3c3be]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#ebe8e3] flex items-center justify-center text-[#2c1810] font-serif font-bold text-sm shrink-0">
              {event.customerName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#1c1c19] font-semibold truncate">
                {event.customerName}
              </span>
              <span className="text-xs text-[#504440] truncate">
                {event.customerPhone}
              </span>
            </div>
          </div>
          <a
            href={`tel:${event.customerPhone}`}
            className="p-2 rounded-lg bg-[#ffffff] text-[#855230] hover:text-[#090100] transition-colors shadow-xs"
            title="Call Client"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>

        {/* Specification Data Rows */}
        <div className="bg-[#f6f3ee] p-4 rounded-lg flex flex-col gap-3 border border-[#d3c3be]/30">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              inventory_2
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Package Configuration
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                {event.packageConfig}
              </span>
              <span className="text-xs text-[#504440] mt-0.5">
                {event.paperSpecs}
              </span>
            </div>
          </div>

          <div className="border-t border-[#d3c3be]/30 pt-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              location_on
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Venue Location
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                {event.venueName}
              </span>
              <span className="text-xs text-[#504440] mt-0.5 leading-snug">
                {event.venueDetail || event.venueAddress}
              </span>
            </div>
          </div>

          <div className="border-t border-[#d3c3be]/30 pt-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              schedule
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Execution Hours
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                {event.time} ({event.duration})
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#f6f3ee] p-4 rounded-lg flex items-center justify-between border border-[#d3c3be]/30">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
              Payment Status
            </span>
            <span className="text-sm font-semibold text-[#1c1c19] mt-0.5">
              {event.remainingDue === 0 ? 'Lunas (Fully Paid)' : 'DP Received'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#504440] block">Investasi</span>
            <span className="text-sm font-bold font-serif text-[#090100]">
              {formatIDR(event.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-auto pt-2 border-t border-[#d3c3be]/40">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            onSelectBooking(event);
            onNavigate('booking-detail');
          }}
        >
          View Full Booking Dossier
        </Button>
      </div>
    </aside>
  );
}
