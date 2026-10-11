import React from "react";
import Button from "../ui/Button.jsx";
import { formatIDR } from "../../lib/formatters.js";

export default function CalendarEventDrawer({
  event,
  onClose,
  onSelectBooking,
  onNavigate,
}) {
  if (!event) return null;

  return (
    <aside className="w-full lg:w-96 bg-[#ffffff] rounded-xl shadow-md border border-[#d3c3be]/40 p-6 flex flex-col gap-6 transition-all duration-300 shrink-0">
      {/* Drawer Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-serif font-bold text-[#090100] mt-0.5">
            {event.eventName || event.displayTitle}
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

      {/* Event Metadata Bento */}
      <div className="flex flex-col gap-4">
        {/* Customer Tile */}
        <div className="bg-[#f6f3ee] p-3.5 rounded-lg flex items-center justify-between border border-[#d3c3be]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#ebe8e3] flex items-center justify-center text-[#2c1810] font-serif font-bold text-sm shrink-0">
              {event.customerName
                ? event.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "C"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#1c1c19] font-semibold truncate">
                {event.customerName || "Tanpa Nama"}
              </span>
              <span className="text-xs text-[#504440] truncate">
                {event.customerPhone || "-"}
              </span>
            </div>
          </div>
          {event.customerPhone && (
            <a
              href={`tel:${event.customerPhone}`}
              className="p-2 rounded-lg bg-[#ffffff] text-[#855230] hover:text-[#090100] transition-colors shadow-xs"
              title="Call Client"
            >
              <span className="material-symbols-outlined text-[18px]">
                call
              </span>
            </a>
          )}
        </div>

        {/* Specification Data Rows (Backdrop & Paper Type) */}
        <div className="bg-[#f6f3ee] p-4 rounded-lg flex flex-col gap-3 border border-[#d3c3be]/30">
          {/* Backdrop & Paper Type */}
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              inventory_2
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Backdrop &amp; Paper Type
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                Backdrop: {event.backdrop || "Standard"}
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                Paper: {event.paperType || "Photostrip"}
              </span>
            </div>
          </div>

          {/* Venue Location */}
          <div className="border-t border-[#d3c3be]/30 pt-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              location_on
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Venue Location
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold truncate">
                {event.venueName || "-"}
              </span>
              {event.venueMapsLink ? (
                <a
                  href={event.venueMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-0.5 truncate"
                >
                  Buka Link Google Maps
                </a>
              ) : (
                <span className="text-xs text-[#504440] mt-0.5 truncate">
                  {event.venueDetail || event.venueAddress || "-"}
                </span>
              )}
            </div>
          </div>

          {/* Execution Hours */}
          <div className="border-t border-[#d3c3be]/30 pt-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              schedule
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                Execution Hours
              </span>
              <span className="text-sm text-[#1c1c19] font-semibold">
                {event.time || "-"} ({event.duration || "4 hours"})
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
              {event.status === "Fully Paid" ||
              (event.remainingDue === 0 && event.totalPrice > 0)
                ? "Lunas (Fully Paid)"
                : "DP Received"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#504440] block">Investasi</span>
            <span className="text-sm font-bold font-serif text-[#090100]">
              {formatIDR(event.totalPrice || 0)}
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
            if (onSelectBooking) onSelectBooking(event);
            onNavigate("booking-detail");
          }}
        >
          View Full Booking Dossier
        </Button>
      </div>
    </aside>
  );
}
