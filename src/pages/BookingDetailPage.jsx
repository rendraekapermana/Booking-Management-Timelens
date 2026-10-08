import React, { useState } from 'react';
import { formatIDR } from '../lib/formatters.js';
import BookingSpecsCard from '../components/booking/BookingSpecsCard.jsx';
import PaymentLedger from '../components/booking/PaymentLedger.jsx';
import RecordPaymentModal from '../components/booking/RecordPaymentModal.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function BookingDetailPage({
  booking,
  onNavigate,
  onUpdateBooking,
  onShowToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Edit fields state
  const [editData, setEditData] = useState({
    eventName: booking.eventName,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    date: booking.date,
    time: booking.time,
    guestCount: booking.guestCount,
    venueName: booking.venueName,
    venueAddress: booking.venueAddress,
    backdrop: booking.backdrop,
    paperType: booking.paperType,
    frameDesign: booking.frameDesign
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = {
      ...booking,
      ...editData,
      displayTitle: editData.eventName
    };
    onUpdateBooking(updated);
    setIsEditing(false);
    onShowToast('Booking details successfully updated');
  };

  const handleRecordPayment = (amt) => {
    const newPaid = (booking.downPayment || 0) + amt;
    const newRemaining = Math.max(0, (booking.totalPrice || 0) - newPaid);

    const updated = {
      ...booking,
      downPayment: newPaid,
      remainingDue: newRemaining,
      status: newRemaining === 0 ? 'Fully Paid' : booking.status
    };
    onUpdateBooking(updated);
    onShowToast(`Recorded payment of ${formatIDR(amt)}. Remaining due: ${formatIDR(newRemaining)}`);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-2">
      {/* Top Action & Navigation Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="text-xs uppercase tracking-wider text-[#504440] hover:text-[#090100] transition-colors cursor-pointer"
            >
              Bookings
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#827470]">
              chevron_right
            </span>
            <span className="text-xs uppercase tracking-wider text-[#855230] font-semibold">
              {booking.id}
            </span>
          </nav>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
              {booking.displayTitle || booking.eventName}
            </h1>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon="edit"
            onClick={() => setIsEditing(true)}
          >
            Edit Booking
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon="download"
            onClick={() => onNavigate('invoice-preview')}
          >
            Download Invoice
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon="payments"
            onClick={() => setShowPaymentModal(true)}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Main Content Asymmetric Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Dossier (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* 1. EVENT PROFILE */}
          <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#855230]">celebration</span>
                <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
                  Event Profile &amp; Location
                </h2>
              </div>
              <Badge status={booking.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Event Date
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-[#855230]">calendar_today</span>
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
                    <span className="material-symbols-outlined text-[18px] text-[#855230]">schedule</span>
                    <span className="text-sm text-[#1c1c19] font-semibold">{booking.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Expected Guests
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-[#855230]">group</span>
                    <span className="text-sm text-[#1c1c19] font-semibold">~{booking.guestCount} Guests</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Venue Name &amp; Address
                  </span>
                  <div className="flex items-start gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">location_on</span>
                    <div>
                      <span className="text-sm text-[#090100] font-bold block">{booking.venueName}</span>
                      <span className="text-xs text-[#504440] leading-snug">{booking.venueAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Map snippet view */}
                <div
                  className="w-full h-40 rounded-lg bg-cover bg-center overflow-hidden shadow-inner border border-[#d3c3be]/40 relative"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida/AEtjO1Vl_zhbLnRq-AL5iWbXTelDn0o2nPLqz0atHlMJZp75BMVu1_pyQDVQVWpxuzCREaeHsyIADPfiPl7TT4J84LSkNPGnezxRUeZqTdW47dlgP1BpCPu1rPeks_h7Gj-VidAAHDJ-ghXyD-8Hhjbz-JhwAa2EIPaKSeISb1IZUExsUMJ4qPSEnkD5uUGgK3k2JOI8mk7b240_iqtJbhL0w56Q_UmFxNRNWPOS75syIlSfa6jou6Mt6-0HPA')` }}
                >
                  <div className="absolute top-2 left-2 bg-[#ffffff]/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-medium text-[#090100] border border-[#d3c3be]/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#855230]"></span>
                    <span>Bogor Botanical &amp; Senayan Area</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PHOTOBOOTH CONFIGURATION */}
          <BookingSpecsCard booking={booking} />
        </div>

        {/* Right Column: Customer & Payment Summary (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Customer Profile */}
          <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#855230]">person</span>
                <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
                  Customer
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ffdbc7] flex items-center justify-center text-[#311300] font-serif font-bold text-xl shrink-0">
                {booking.customerName?.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl text-[#090100] font-serif font-bold truncate">
                  {booking.customerName}
                </span>
                <span className="text-xs text-[#504440]">{booking.customerTitle}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={`tel:${booking.customerPhone}`}
                className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
              >
                <span className="material-symbols-outlined text-[18px] text-[#855230]">call</span>
                <span className="text-sm font-semibold">{booking.customerPhone}</span>
              </a>

              <a
                href={`mailto:${booking.customerEmail}`}
                className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
              >
                <span className="material-symbols-outlined text-[18px] text-[#855230]">mail</span>
                <span className="text-sm font-medium truncate">{booking.customerEmail}</span>
              </a>
            </div>
          </div>

          {/* Payment Summary Component */}
          <PaymentLedger
            booking={booking}
            onOpenRecordPayment={() => setShowPaymentModal(true)}
          />
        </div>
      </div>

      {/* Record Payment Modal Component */}
      <RecordPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={booking}
        onRecordPayment={handleRecordPayment}
      />

      {/* Edit Booking Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-[#090100]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative border border-[#d3c3be]/40">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0ede9]">
              <h3 className="text-xl font-serif font-bold text-[#090100]">Edit Booking Details</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-[#504440] hover:text-[#090100] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#504440]">Event Name</label>
                <input
                  type="text"
                  value={editData.eventName}
                  onChange={(e) => setEditData({ ...editData, eventName: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">Date</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">Time</label>
                  <input
                    type="text"
                    value={editData.time}
                    onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">Customer Name</label>
                  <input
                    type="text"
                    value={editData.customerName}
                    onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">Phone</label>
                  <input
                    type="text"
                    value={editData.customerPhone}
                    onChange={(e) => setEditData({ ...editData, customerPhone: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#504440]">Venue Name &amp; Address</label>
                <input
                  type="text"
                  value={editData.venueName}
                  onChange={(e) => setEditData({ ...editData, venueName: e.target.value })}
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
