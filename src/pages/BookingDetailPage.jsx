import React, { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService.js";
import { formatIDR } from "../lib/formatters.js";
import BookingSpecsCard from "../components/booking/BookingSpecsCard.jsx";
import PaymentLedger from "../components/booking/PaymentLedger.jsx";
import RecordPaymentModal from "../components/booking/RecordPaymentModal.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

// --- SUB-KOMPONEN: Header Navigasi & Tombol Aksi ---
const DetailHeader = ({ booking, onNavigate, onOpenEdit, onOpenPayment }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
    <div className="flex flex-col gap-1">
      <nav className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="text-xs uppercase tracking-wider text-[#504440] hover:text-[#090100] transition-colors cursor-pointer"
        >
          Bookings
        </button>
        <span className="material-symbols-outlined text-[14px] text-[#827470]">
          chevron_right
        </span>
        <span className="text-xs uppercase tracking-wider text-[#855230] font-semibold">
          {booking.orderRef || booking.id}
        </span>
      </nav>
      <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
        {booking.displayTitle || booking.eventName}
      </h1>
    </div>
    <div className="flex items-center flex-wrap gap-2.5">
      <Button variant="secondary" size="sm" icon="edit" onClick={onOpenEdit}>
        Edit Booking
      </Button>
      <Button
        variant="secondary"
        size="sm"
        icon="download"
        onClick={() => onNavigate("invoice-preview")}
      >
        Download Invoice
      </Button>
      <Button
        variant="primary"
        size="sm"
        icon="payments"
        onClick={onOpenPayment}
      >
        Record Payment
      </Button>
    </div>
  </div>
);

// --- SUB-KOMPONEN: Profil Event & Venue ---
const EventProfileCard = ({ booking }) => (
  <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] text-[#855230]">
          celebration
        </span>
        <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
          Event Profile &amp; Location
        </h2>
      </div>
      <Badge
        variant={
          booking.status === "Pending"
            ? "warning"
            : booking.status === "Rejected"
              ? "error"
              : "success"
        }
      >
        {booking.status}
      </Badge>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Event Date
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              calendar_today
            </span>
            <span className="text-base text-[#090100] font-bold">
              {booking.dateFormatted || booking.date}
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Operational Hours
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              schedule
            </span>
            <span className="text-sm text-[#1c1c19] font-semibold">
              {booking.time}
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Duration
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              timer
            </span>
            <span className="text-sm text-[#1c1c19] font-semibold">
              {booking.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Venue Name &amp; Address
          </span>
          <div className="flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              location_on
            </span>
            <span className="text-sm text-[#090100] font-bold block">
              {booking.venueName}
            </span>
          </div>
        </div>

        {booking.venueMapsLink ? (
          <a
            href={booking.venueMapsLink}
            target="_blank"
            rel="noreferrer"
            className="w-full h-32 rounded-lg bg-cover bg-center overflow-hidden shadow-inner border border-[#d3c3be]/40 relative flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer group"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')`,
            }}
          >
            <div className="bg-[#ffffff]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-[#855230] border border-[#d3c3be]/40 flex items-center gap-2 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px]">map</span>{" "}
              Buka di Google Maps
            </div>
          </a>
        ) : (
          <div className="w-full h-32 rounded-lg bg-[#f6f3ee] flex items-center justify-center border border-[#d3c3be]/40 border-dashed">
            <span className="text-xs text-[#827470]">
              Maps Link tidak tersedia
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- SUB-KOMPONEN: Profil Customer ---
const CustomerProfileCard = ({ booking }) => (
  <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-5">
    <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] text-[#855230]">
          person
        </span>
        <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
          Customer
        </h2>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#ffdbc7] flex items-center justify-center text-[#311300] font-serif font-bold text-xl shrink-0">
        {booking.customerName
          ?.split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("") || "T"}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xl text-[#090100] font-serif font-bold truncate">
          {booking.customerName}
        </span>
        <span className="text-xs text-[#504440]">
          {booking.customerTitle || "Client • Primary Contact"}
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-2.5 pt-2">
      <a
        href={`https://wa.me/${booking.customerPhone?.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
      >
        <span className="material-symbols-outlined text-[18px] text-[#25D366]">
          forum
        </span>
        <span className="text-sm font-semibold">{booking.customerPhone}</span>
      </a>
      <a
        href={`mailto:${booking.customerEmail}`}
        className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
      >
        <span className="material-symbols-outlined text-[18px] text-[#855230]">
          mail
        </span>
        <span className="text-sm font-medium truncate">
          {booking.customerEmail}
        </span>
      </a>
    </div>

    {booking.uploadedFileName && (
      <a
        href={booking.uploadedFileName}
        target="_blank"
        rel="noreferrer"
        className="mt-2 w-full text-center text-xs font-semibold text-blue-600 hover:underline"
      >
        Lihat Bukti Transfer DP
      </a>
    )}
  </div>
);

// --- KOMPONEN UTAMA ---
export default function BookingDetailPage(props) {
  const passedBooking = props.booking || props.initialBooking;
  const passedId = props.bookingId || props.id || passedBooking?.id;

  const [booking, setBooking] = useState(passedBooking || null);
  const [isLoading, setIsLoading] = useState(
    !passedBooking && Boolean(passedId),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editData, setEditData] = useState({});

  // 1. Saat inisialisasi, pastikan SEMUA field dibaca agar tidak hilang saat diedit
  useEffect(() => {
    if (passedBooking) {
      setBooking(passedBooking);
      setEditData({
        eventName: passedBooking.eventName || "",
        customerName: passedBooking.customerName || "",
        customerPhone: passedBooking.customerPhone || "",
        customerEmail: passedBooking.customerEmail || "",
        date: passedBooking.date || "",
        time: passedBooking.time || "",
        duration: passedBooking.duration || "4 hours",
        venueName: passedBooking.venueName || "",
        venueMapsLink: passedBooking.venueMapsLink || "",
        backdrop: passedBooking.backdrop || "Standard",
        paperType: passedBooking.paperType || "Photostrip",
        frameDesign: passedBooking.frameDesign || "-",
        totalPrice: passedBooking.totalPrice || 0,
        downPayment: passedBooking.downPayment || 0,
        status: passedBooking.status || "Pending",
        uploadedFileName: passedBooking.uploadedFileName || null,
      });
      setIsLoading(false);
      return;
    }

    const fetchBooking = async () => {
      if (!passedId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await bookingService.getById(passedId);
        setBooking(data);
        setEditData({
          eventName: data.eventName || "",
          customerName: data.customerName || "",
          customerPhone: data.customerPhone || "",
          customerEmail: data.customerEmail || "",
          date: data.date || "",
          time: data.time || "",
          duration: data.duration || "4 hours",
          venueName: data.venueName || "",
          venueMapsLink: data.venueMapsLink || "",
          backdrop: data.backdrop || "Standard",
          paperType: data.paperType || "Photostrip",
          frameDesign: data.frameDesign || "-",
          totalPrice: data.totalPrice || 0,
          downPayment: data.downPayment || 0,
          status: data.status || "Pending",
          uploadedFileName: data.uploadedFileName || null,
        });
      } catch (error) {
        if (props.onShowToast)
          props.onShowToast("Gagal memuat detail pesanan", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [passedId, passedBooking]);

  // 2. Saat menyimpan, gabungkan data lama dengan data edit agar properti lain tidak tertimpa kosong
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...booking, // Bawa data lama yang tidak tampil di form edit
        ...editData, // Timpa dengan data yang baru diubah
        id: booking.id,
      };

      const updatedData = await bookingService.update(payload);
      setBooking(updatedData);
      if (props.onUpdateBooking) props.onUpdateBooking(updatedData);
      setIsEditing(false);
      if (props.onShowToast)
        props.onShowToast("Detail booking berhasil diperbarui");
    } catch (error) {
      if (props.onShowToast)
        props.onShowToast("Gagal memperbarui data", "error");
    }
  };

  const handleRecordPayment = async (amt) => {
    try {
      const updatedData = await bookingService.recordPayment(booking.id, amt);
      setBooking(updatedData);
      if (props.onUpdateBooking) props.onUpdateBooking(updatedData);
      setShowPaymentModal(false);
      if (props.onShowToast)
        props.onShowToast(`Pembayaran ${formatIDR(amt)} berhasil dicatat`);
    } catch (error) {
      if (props.onShowToast)
        props.onShowToast("Gagal mencatat pembayaran", "error");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-[#855230] animate-spin">
          sync
        </span>
      </div>
    );
  if (!booking)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <p className="text-sm text-[#504440]">Data booking tidak ditemukan.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => props.onNavigate?.("dashboard")}
        >
          Kembali
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-2">
      <DetailHeader
        booking={booking}
        onNavigate={props.onNavigate}
        onOpenEdit={() => setIsEditing(true)}
        onOpenPayment={() => setShowPaymentModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <EventProfileCard booking={booking} />
          <BookingSpecsCard booking={booking} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <CustomerProfileCard booking={booking} />
          <PaymentLedger
            booking={booking}
            onOpenRecordPayment={() => setShowPaymentModal(true)}
          />
        </div>
      </div>

      <RecordPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={booking}
        onRecordPayment={handleRecordPayment}
      />

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-[#090100]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative border border-[#d3c3be]/40">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0ede9]">
              <h3 className="text-xl font-serif font-bold text-[#090100]">
                Edit Booking Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-[#504440] hover:text-[#090100] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <form
              onSubmit={handleSaveEdit}
              className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-1"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#504440]">
                  Event Name
                </label>
                <input
                  type="text"
                  value={editData.eventName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, eventName: e.target.value })
                  }
                  className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editData.date || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editData.time || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, time: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editData.customerName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, customerName: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editData.customerPhone || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        customerPhone: e.target.value,
                      })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#504440]">
                  Venue Name &amp; Address
                </label>
                <input
                  type="text"
                  value={editData.venueName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, venueName: e.target.value })
                  }
                  className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede9]">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
