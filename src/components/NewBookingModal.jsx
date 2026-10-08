import React, { useState } from 'react';
import { calculateBookingPricing } from '../lib/calculations/pricing.js';
import { formatIDR, formatDateEN } from '../lib/formatters.js';

export default function NewBookingModal({ isOpen, onClose, onAddBooking }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventName: '',
    eventType: 'Wedding',
    date: '2024-11-20',
    time: '18:00 – 22:00',
    duration: '4 Jam',
    venueName: '',
    venueAddress: '',
    paperType: 'Photostrip (2x6)',
    backdrop: 'Satin Red',
    frameDesign: 'Dibuatkan oleh Timelens',
    guestCount: 250,
    notes: ''
  });

  if (!isOpen) return null;

  // Calculate pricing using centralized calculation utility
  const pricing = calculateBookingPricing({
    duration: formData.duration,
    frameDesign: formData.frameDesign,
    backdrop: formData.backdrop,
    paperType: formData.paperType
  });

  const {
    basePrice,
    framePrice,
    backdropPrice,
    paperPrice,
    grandTotal: totalCalculated,
    downPayment: dpAmount
  } = pricing;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.clientName) return;

    const newBooking = {
      id: `BK-2024-${Math.floor(100 + Math.random() * 900)}`,
      eventName: formData.eventName,
      displayTitle: formData.eventName,
      customerName: formData.clientName,
      customerTitle: `${formData.eventType} Host • Primary Contact`,
      customerPhone: formData.clientPhone || '+62 812-0000-0000',
      customerEmail: formData.clientEmail || 'client@example.com',
      date: formData.date,
      dateFormatted: formatDateEN(formData.date),
      time: formData.time,
      duration: formData.duration,
      durationHours: parseInt(formData.duration) || 4,
      guestCount: parseInt(formData.guestCount) || 250,
      venueName: formData.venueName || 'The Glasshouse, Senayan',
      venueAddress: formData.venueAddress || 'Jakarta',
      venueDetail: 'Ground Floor Ballroom',
      status: 'Confirmed',
      packageConfig: `Photobooth ${formData.duration} + Custom Backdrop`,
      paperSpecs: `${formData.paperType} Foil Stamped`,
      backdrop: formData.backdrop,
      paperType: formData.paperType,
      frameDesign: formData.frameDesign,
      totalPrice: totalCalculated,
      downPayment: dpAmount,
      remainingDue: totalCalculated - dpAmount,
      isTodayActive: false,
      opsCount: 2,
      orderRef: `#TL-${Math.floor(8800 + Math.random() * 100)}`
    };

    onAddBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090100]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-[#d3c3be]/40 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Top Walnut Accent Line */}
        <div className="h-1.5 w-full bg-[#2c1810]"></div>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between border-b border-[#f0ede9]">
          <div>
            <span className="text-[11px] text-[#855230] uppercase tracking-widest font-semibold block mb-1">
              Atelier Schedule & Reservation
            </span>
            <h2 className="text-2xl font-serif text-[#090100] font-semibold">
              Create New Booking
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#504440] hover:text-[#090100] hover:bg-[#ebe8e3] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#855230] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">person</span>
              Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Client / Host Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Clara Vance"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="client@atelier.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Phone / WhatsApp *</label>
                <input
                  required
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 pt-2 border-t border-[#f0ede9]">
            <h3 className="text-xs uppercase tracking-wider text-[#855230] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              Event Specification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Event Name / Occasion *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jessica & Ryan Wedding"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Engagement">Engagement</option>
                  <option value="School">School / Graduation</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Date of Event</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Operational Hours</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                >
                  <option value="2 Jam">2 Jam (Rp 2.000.000)</option>
                  <option value="3 Jam">3 Jam (Rp 2.400.000)</option>
                  <option value="4 Jam">4 Jam (Standar - Rp 2.800.000)</option>
                  <option value="5 Jam">5 Jam (Rp 3.200.000)</option>
                  <option value="6 Jam">6 Jam (Rp 3.600.000)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Venue Location</label>
                <input
                  type="text"
                  placeholder="e.g. The Glasshouse, Senayan"
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Guest Estimate</label>
                <input
                  type="number"
                  placeholder="300"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none focus:border-[#2c1810]"
                />
              </div>
            </div>
          </div>

          {/* Photobooth Specs */}
          <div className="space-y-4 pt-2 border-t border-[#f0ede9]">
            <h3 className="text-xs uppercase tracking-wider text-[#855230] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              Configuration & Studio Styling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Design Frame</label>
                <select
                  value={formData.frameDesign}
                  onChange={(e) => setFormData({ ...formData, frameDesign: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none"
                >
                  <option value="Dari Client">Dari Client (+Rp 0)</option>
                  <option value="Dibuatkan oleh Timelens">Dibuatkan Timelens (+Rp 300.000)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Photo Paper</label>
                <select
                  value={formData.paperType}
                  onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none"
                >
                  <option value="Photostrip (2x6)">Photostrip (2x6)</option>
                  <option value="4R (4x6)">4R (4x6)</option>
                  <option value="Photo Crack">Photo Crack (+Rp 150.000)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#504440] font-medium block">Backdrop Choice</label>
                <select
                  value={formData.backdrop}
                  onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-[#090100] focus:outline-none"
                >
                  <option value="Satin Red">Satin Red Luxe Velvet (+Rp 400.000)</option>
                  <option value="Glam Silver">Glam Silver Shimmer (+Rp 250.000)</option>
                  <option value="Clean White">Clean White Minimal (+Rp 0)</option>
                  <option value="Dari Client">Dari Client (+Rp 0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 bg-[#f6f3ee] rounded-xl border border-[#d3c3be]/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-[#504440]">
              <span>Base Duration ({formData.duration}):</span>
              <span className="font-mono font-medium">{formatIDR(basePrice)}</span>
            </div>
            {framePrice > 0 && (
              <div className="flex justify-between items-center text-xs text-[#504440]">
                <span>Custom Frame Curation:</span>
                <span className="font-mono font-medium">{formatIDR(framePrice)}</span>
              </div>
            )}
            {backdropPrice > 0 && (
              <div className="flex justify-between items-center text-xs text-[#504440]">
                <span>Backdrop ({formData.backdrop}):</span>
                <span className="font-mono font-medium">{formatIDR(backdropPrice)}</span>
              </div>
            )}
            {paperPrice > 0 && (
              <div className="flex justify-between items-center text-xs text-[#504440]">
                <span>Specialty Paper ({formData.paperType}):</span>
                <span className="font-mono font-medium">{formatIDR(paperPrice)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#d3c3be]/50 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-serif font-bold text-[#090100]">Total Investment:</span>
                <span className="text-[11px] text-[#855230] block">Down payment 50%: {formatIDR(dpAmount)}</span>
              </div>
              <span className="text-lg font-mono font-bold text-[#2c1810]">
                {formatIDR(totalCalculated)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#504440] hover:text-[#090100] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Confirm & Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
