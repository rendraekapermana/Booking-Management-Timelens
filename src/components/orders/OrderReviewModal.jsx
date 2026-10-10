import React from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";
import { formatIDR } from "../../lib/formatters.js";

export default function OrderReviewModal({
  order,
  isOpen,
  onClose,
  onApprove,
  onDecline,
  onShowToast,
}) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={order.eventName || "Event Booking"}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Customer & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f6f3ee] rounded-xl border border-[#d3c3be]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ebe8e3] text-[#2c1810] flex items-center justify-center font-serif font-bold text-base">
              {order.customerName?.charAt(0) || "C"}
            </div>
            <div>
              <span className="font-semibold text-sm text-[#090100] block">
                {order.customerName}
              </span>
              <span className="text-xs text-[#504440]">
                {order.customerEmail} • {order.customerPhone}
              </span>
            </div>
          </div>
          <Badge
            variant={
              order.status === "Pending"
                ? "warning"
                : order.status === "Rejected"
                  ? "error"
                  : "success"
            }
          >
            {order.status}
          </Badge>
        </div>

        {/* Event Schedule & Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider">
              Jadwal & Waktu Acara
            </span>
            <p className="font-semibold text-sm text-[#090100]">
              {order.dateFormatted || order.date}
            </p>
            <p className="text-[#504440]">
              {order.time} ({order.duration})
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider">
              Lokasi & Venue
            </span>
            <p className="font-semibold text-sm text-[#090100] truncate">
              {order.venueName}
            </p>
            {order.venueMapsLink ? (
              <a
                href={order.venueMapsLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline block truncate"
              >
                Buka Link Google Maps
              </a>
            ) : (
              <p className="text-[#504440] truncate">-</p>
            )}
          </div>
        </div>

        {/* Investment & Payment Proof Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex flex-col justify-center h-full">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider block">
              Total Nilai & Down Payment
            </span>
            <span className="text-xl font-serif font-bold text-[#090100] mt-1">
              {formatIDR(order.totalPrice || 0)}
            </span>
            <span className="text-xs text-[#504440] mt-0.5">
              Sudah Dibayar (DP):{" "}
              <strong className="text-[#090100]">
                {formatIDR(order.downPayment || 0)}
              </strong>
            </span>
          </div>

          {/* Preview Bukti Transfer */}
          <div className="p-3 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider">
              Bukti Transfer DP
            </span>
            {order.uploadedFileName ? (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/40 overflow-hidden shrink-0">
                  <img
                    src={order.uploadedFileName}
                    alt="Bukti Transfer"
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      window.open(order.uploadedFileName, "_blank")
                    }
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#090100] truncate">
                    Lampiran Pembayaran
                  </span>
                  <a
                    href={order.uploadedFileName}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                  >
                    Perbesar Gambar
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-xs text-[#827470] bg-[#f6f3ee]/50 rounded-lg border border-dashed border-[#d3c3be]/40">
                Belum ada bukti transfer diunggah
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f1ece4]">
          <Button
            variant="danger"
            onClick={() => onDecline(order)}
            disabled={order.status === "Rejected"}
          >
            Tolak Pesanan
          </Button>

          <Button
            variant="primary"
            onClick={() => onApprove(order)}
            disabled={
              order.status === "Confirmed" || order.status === "Fully Paid"
            }
          >
            Konfirmasi & Jadwalkan (ACC)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
