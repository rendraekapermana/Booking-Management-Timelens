import React, { useState } from 'react';
import { formatIDR } from '../lib/formatters.js';
import { useBookingPricing } from '../hooks/useBookingPricing.js';
import BackdropSelector from '../components/booking/BackdropSelector.jsx';
import PaperTypeSelector from '../components/booking/PaperTypeSelector.jsx';
import FrameDesignSelector from '../components/booking/FrameDesignSelector.jsx';

export default function CreateEditBookingFormPage({ onNavigate, onShowToast }) {
  const [formData, setFormData] = useState({
    clientName: 'Sarah Natasha',
    clientEmail: 'sarah.natasha@gmail.com',
    clientWa: '+62 812 8892 4110',
    eventName: 'Pernikahan Sarah & Dimas',
    eventType: 'wedding',
    eventDate: '2024-10-24',
    eventTime: '18:00 - 22:00',
    duration: '4 Jam',
    venueAddress: 'Bogor Botanical Gardens, Jl. Ir. H. Juanda No.13, Paledang, Bogor, Jawa Barat',
    designFrame: 'Dibuatkan oleh Timelens',
    paperType: '4R (4x6)',
    backdrop: 'Satin Red',
    transferAmount: '3.500.000',
    uploadedFileName: 'BCA_Transfer_3500000_SarahNatasha.jpg'
  });

  // Calculate pricing dynamically
  const pricing = useBookingPricing({
    duration: formData.duration,
    frameDesign: formData.designFrame,
    backdrop: formData.backdrop,
    paperType: formData.paperType
  });

  const { grandTotal: totalPrice } = pricing;

  const handleSave = () => {
    onShowToast('Form configuration saved! Live client intake settings are now updated.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Header Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#d3c3be]/40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('booking-forms')}
            className="text-xs uppercase tracking-wider text-[#855230] hover:text-[#090100] transition-colors cursor-pointer"
          >
            Booking Forms
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#827470]">chevron_right</span>
          <span className="text-xs uppercase tracking-wider text-[#090100] font-semibold">Edit Form</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('public-booking')}
            className="px-4 py-2.5 rounded-lg bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#090100] text-xs font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Pratinjau Link</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Simpan Perubahan Formulir</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section A: Informasi Klien & Kontak */}
        <section className="bg-[#ffffff] rounded-xl p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div>
                <h2 className="text-base text-[#090100] font-serif font-bold">A. Informasi Klien &amp; Kontak</h2>
                <p className="text-xs text-[#504440]">Kolom data pemesan utama dan jalur kontak darurat.</p>
              </div>
            </div>
            <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
              Wajib Diisi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold flex items-center justify-between">
                <span>Nama Lengkap <span className="text-[#ba1a1a]">*</span></span>
                <span className="text-[11px] text-[#504440] font-normal">PIC Utama</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-10 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#827470]">badge</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold">Email Klien <span className="text-[#ba1a1a]">*</span></label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-10 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#827470]">mail</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold">Nomor WhatsApp Aktif <span className="text-[#ba1a1a]">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.clientWa}
                  onChange={(e) => setFormData({ ...formData, clientWa: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-10 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#827470]">call</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section B: Detail Acara & Lokasi */}
        <section className="bg-[#ffffff] rounded-xl p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">celebration</span>
              </div>
              <div>
                <h2 className="text-base text-[#090100] font-serif font-bold">B. Detail Acara &amp; Lokasi</h2>
                <p className="text-xs text-[#504440]">Jadwal, jenis perhelatan, dan peta lokasi loading dock.</p>
              </div>
            </div>
            <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
              Jadwal Sesi
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold">Nama Acara <span className="text-[#ba1a1a]">*</span></label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#090100] font-semibold">Jenis Acara</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['wedding', 'birthday', 'corporate', 'others'].map((t) => (
                  <label
                    key={t}
                    onClick={() => setFormData({ ...formData, eventType: t })}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer capitalize text-xs font-semibold ${
                      formData.eventType === t
                        ? 'bg-[#ffffff] border-2 border-[#2c1810] shadow-xs text-[#090100]'
                        : 'bg-[#f6f3ee] border-[#d3c3be]/40 text-[#504440]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      checked={formData.eventType === t}
                      onChange={() => {}}
                      className="accent-[#2c1810]"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold">Tanggal Acara</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-xs border border-[#d3c3be]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold">Jam Acara</label>
                <input
                  type="text"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-xs border border-[#d3c3be]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold">Durasi Booking</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-xs border border-[#d3c3be]/30"
                >
                  <option value="2 Jam">2 Jam (Rp 2.000.000)</option>
                  <option value="3 Jam">3 Jam (Rp 2.400.000)</option>
                  <option value="4 Jam">4 Jam </option>
                  <option value="5 Jam">5 Jam (Rp 3.200.000)</option>
                  <option value="6 Jam">6 Jam (Rp 3.600.000)</option>
                </select>
              </div>
            </div>

            {/* Address & Google Maps Visual */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs text-[#090100] font-semibold flex items-center justify-between">
                <span>Alamat Lengkap Venue &amp; Titik Lokasi Google Maps</span>
                <span className="text-[11px] text-[#855230] font-medium">Auto-Locate Active</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-10 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#827470]">search</span>
              </div>

              <div className="relative w-full rounded-xl overflow-hidden border border-[#d3c3be]/40 shadow-xs mt-2">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Vl_zhbLnRq-AL5iWbXTelDn0o2nPLqz0atHlMJZp75BMVu1_pyQDVQVWpxuzCREaeHsyIADPfiPl7TT4J84LSkNPGnezxRUeZqTdW47dlgP1BpCPu1rPeks_h7Gj-VidAAHDJ-ghXyD-8Hhjbz-JhwAa2EIPaKSeISb1IZUExsUMJ4qPSEnkD5uUGgK3k2JOI8mk7b240_iqtJbhL0w56Q_UmFxNRNWPOS75syIlSfa6jou6Mt6-0HPA"
                  alt="Venue Map Location"
                  className="w-full h-56 object-cover block"
                />
                <div className="absolute top-3 left-3 bg-[#ffffff]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d3c3be]/30 shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#855230] animate-pulse"></span>
                  <span className="text-xs text-[#090100] font-semibold">Bogor Botanical Gardens</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Spesifikasi Photobooth */}
        <section className="bg-[#ffffff] rounded-xl p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </div>
              <div>
                <h2 className="text-base text-[#090100] font-serif font-bold">C. Spesifikasi Photobooth</h2>
                <p className="text-xs text-[#504440]">Frame design, jenis cetak foto archival, dan warna backdrop.</p>
              </div>
            </div>
            <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
              Styling Studio
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2.5">
              <label className="text-xs text-[#090100] font-semibold">Design Frame</label>
              <FrameDesignSelector
                selected={formData.designFrame}
                onChange={(val) => setFormData({ ...formData, designFrame: val })}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#090100] font-semibold">Jenis Kertas Foto</label>
              <PaperTypeSelector
                selected={formData.paperType}
                onChange={(val) => setFormData({ ...formData, paperType: val })}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#090100] font-semibold">Backdrop Photobooth</label>
              <BackdropSelector
                selected={formData.backdrop}
                onChange={(val) => setFormData({ ...formData, backdrop: val })}
              />
            </div>
          </div>
        </section>

        {/* Section D: Ringkasan Nilai & Status Form */}
        <div className="bg-[#ffffff] rounded-xl p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
              Live Total Package Calculation
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-[#090100]">
                {formatIDR(totalPrice)}
              </span>
              <span className="text-xs text-[#504440] font-medium">
                (Down Payment 50%: {formatIDR(Math.round(totalPrice * 0.5))})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('booking-forms')}
              className="px-5 py-2.5 rounded-lg border border-[#d3c3be]/60 text-xs font-semibold text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Simpan Perubahan Formulir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
