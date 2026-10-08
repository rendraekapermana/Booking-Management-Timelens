import React, { useState } from 'react';
import { formatIDR, formatDateID } from '../lib/formatters.js';
import { studioProfile } from '../lib/mock/mockData.js';
import { useBookingPricing } from '../hooks/useBookingPricing.js';
import BackdropSelector from '../components/booking/BackdropSelector.jsx';
import PaperTypeSelector from '../components/booking/PaperTypeSelector.jsx';
import FrameDesignSelector from '../components/booking/FrameDesignSelector.jsx';

export default function PublicBookingPage({ onNavigate, onAddNewOrder, onShowToast }) {
  const [formData, setFormData] = useState({
    clientName: 'Sarah Natasha',
    clientEmail: 'sarah.natasha@gmail.com',
    clientPhone: '+62 812 8892 4110',
    eventName: 'Pernikahan Sarah & Dimas',
    eventType: 'Wedding',
    eventDate: '2024-10-24',
    eventTime: '18:00 - 22:00',
    duration: '4 Jam',
    venueAddress: 'Bogor Botanical Gardens, Jl. Ir. H. Juanda No.13, Paledang, Bogor',
    designFrame: 'Dibuatkan oleh Timelens',
    paperType: '4R (4x6)',
    backdrop: 'Satin Red',
    transferAmount: '3.500.000',
    uploadedFileName: 'BCA_Transfer_3500000_SarahNatasha.jpg'
  });

  const [showModal, setShowModal] = useState(false);
  const [orderRefNumber] = useState('#TL-2024-1024');

  // Reactively calculate pricing
  const pricing = useBookingPricing({
    duration: formData.duration,
    frameDesign: formData.designFrame,
    backdrop: formData.backdrop,
    paperType: formData.paperType
  });

  const { basePrice, framePrice, backdropPrice, grandTotal } = pricing;

  const formattedDate = formatDateID(formData.eventDate, true) || 'Kamis, 24 Okt 2024';

  const handleCopyAccount = (number) => {
    navigator.clipboard?.writeText(number);
    onShowToast(`Nomor rekening ${number} berhasil disalin!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.eventName) return;

    const newOrder = {
      id: `ORD-${Math.floor(10 + Math.random() * 90)}`,
      eventTitle: formData.eventName,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      eventDate: formData.eventDate,
      eventDateFormatted: formatDateID(formData.eventDate),
      eventTime: formData.eventTime + ' WIB',
      duration: `Photobooth ${formData.duration}`,
      durationExtra: null,
      venueName: formData.venueAddress.split(',')[0],
      venueDetail: formData.venueAddress,
      submittedTime: 'Baru saja',
      status: 'new',
      imageNum: '05',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qcZOxe59lyN4ynHexj5gGTEUoFagI9HFY4ZuUjE_UYOTSfdaZESw6JnmFSYJMh4WFuFwBqZvpKPbGHu8ba0ogU4Q9svKChMrPkcP4kgHdR9Jq8PVm6MGCJAIzpx5EhD8CoVhtOqxRwSwXZ9Ol_k5o3WDQ6ewXOcIza4Ttecim8D7BM90q03-1O1ponoyLOEtkyNjRfv0_1OG0zQzXAJ5ki49nYCGAvX7gCv-GE0ErHRkSMCZOt-J',
      packageTotal: grandTotal,
      estimatedFee: formatIDR(grandTotal)
    };

    onAddNewOrder(newOrder);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex flex-col font-sans antialiased selection:bg-[#855230] selection:text-[#fcf9f4]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fcf9f4]/95 backdrop-blur-md border-b border-[#d3c3be]/40 px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 flex items-center">
              <img
                src={studioProfile.logo}
                alt="Timelens Logo"
                className="h-7 w-auto object-contain cursor-pointer"
                onClick={() => onNavigate('dashboard')}
              />
            </div>
            <div className="h-4 w-px bg-[#d3c3be]/60 hidden sm:block"></div>
            <span className="text-xs uppercase tracking-widest text-[#855230] font-semibold hidden sm:inline-block">
              Official Event Reservation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-1.5 rounded-lg border border-[#d3c3be]/60 bg-[#ffffff] hover:bg-[#f6f3ee] text-xs font-semibold text-[#090100] transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#855230]">admin_panel_settings</span>
              <span>Kembali ke Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col gap-8">
          {/* Header Banner */}
          <div className="flex flex-col gap-2 border-b border-[#d3c3be]/40 pb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#855230]"></span>
              <span className="text-[11px] text-[#855230] uppercase tracking-[0.25em] font-semibold">
                Client Intake Portal
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl text-[#090100] tracking-tight font-serif font-bold">
              Formulir Reservasi Timelens
            </h1>
            <p className="text-sm text-[#504440] max-w-3xl leading-relaxed mt-1">
              Silakan lengkapi detail penyelenggaraan acara Anda, kurasi format photobooth archival, dan sertakan konfirmasi pembayaran uang muka untuk mengunci jadwal atelier kami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Intake Sections (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Bagian A: Informasi Klien & Kontak (PIC) */}
              <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <div>
                      <h2 className="text-base text-[#090100] font-serif font-bold">
                        A. Informasi Klien &amp; Kontak (PIC)
                      </h2>
                      <p className="text-xs text-[#504440]">Data penanggung jawab pemesanan &amp; koordinasi acara.</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
                    Wajib Diisi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs text-[#090100] font-semibold">Nama Lengkap PIC / Klien *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff] focus:border-[#855230]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#090100] font-semibold">Email Klien *</label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff] focus:border-[#855230]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#090100] font-semibold">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff] focus:border-[#855230]"
                    />
                  </div>
                </div>
              </section>

              {/* Bagian B: Detail Acara & Venue */}
              <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">celebration</span>
                    </div>
                    <div>
                      <h2 className="text-base text-[#090100] font-serif font-bold">B. Detail Acara &amp; Venue</h2>
                      <p className="text-xs text-[#504440]">Jadwal operasional, alamat lokasi, dan titik peta panggung booth.</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
                    Logistik
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#090100] font-semibold">Nama Acara *</label>
                    <input
                      type="text"
                      required
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff] focus:border-[#855230]"
                    />
                  </div>

                  {/* Jenis Acara Radio Options */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#090100] font-semibold">Jenis Acara *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['Wedding', 'Birthday', 'Corporate', 'Others'].map((type) => (
                        <label
                          key={type}
                          onClick={() => setFormData({ ...formData, eventType: type })}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            formData.eventType === type
                              ? 'bg-[#ffffff] border-2 border-[#2c1810] shadow-xs'
                              : 'bg-[#f6f3ee] border-[#d3c3be]/40 hover:bg-[#ebe8e3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="jenis_acara_pub"
                            checked={formData.eventType === type}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#2c1810]"
                          />
                          <span className="text-xs font-semibold text-[#090100]">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#090100] font-semibold">Tanggal Acara *</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full bg-[#f6f3ee] text-[#090100] px-3 py-2.5 pl-9 rounded-lg text-xs border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-3 text-[16px] text-[#827470]">
                          calendar_today
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#090100] font-semibold">Jam Acara *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.eventTime}
                          onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                          className="w-full bg-[#f6f3ee] text-[#090100] px-3 py-2.5 pl-9 rounded-lg text-xs border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                          placeholder="18:00 - 22:00"
                        />
                        <span className="material-symbols-outlined absolute left-2.5 top-3 text-[16px] text-[#827470]">
                          schedule
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#090100] font-semibold">Durasi Booking *</label>
                      <div className="relative">
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full bg-[#f6f3ee] text-[#090100] px-3 py-2.5 pl-9 rounded-lg text-xs border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                        >
                          <option value="2 Jam">2 Jam</option>
                          <option value="3 Jam">3 Jam</option>
                          <option value="4 Jam">4 Jam (Standar Atelier)</option>
                          <option value="5 Jam">5 Jam</option>
                          <option value="6 Jam">6 Jam</option>
                        </select>
                        <span className="material-symbols-outlined absolute left-2.5 top-3 text-[16px] text-[#827470]">
                          timelapse
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Maps Integration */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-xs text-[#090100] font-semibold flex items-center justify-between">
                      <span>Alamat Lokasi Acara &amp; Titik di Google Maps *</span>
                      <span className="text-[11px] text-[#855230] font-medium">Bogor Presisi</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.venueAddress}
                        onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                        className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-10 rounded-lg text-sm border border-[#d3c3be]/30 focus:outline-none focus:bg-[#ffffff]"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#827470]">
                        search
                      </span>
                    </div>

                    <div className="relative w-full rounded-xl overflow-hidden border border-[#d3c3be]/40 shadow-xs mt-1">
                      <img
                        src="https://lh3.googleusercontent.com/aida/AEtjO1Vl_zhbLnRq-AL5iWbXTelDn0o2nPLqz0atHlMJZp75BMVu1_pyQDVQVWpxuzCREaeHsyIADPfiPl7TT4J84LSkNPGnezxRUeZqTdW47dlgP1BpCPu1rPeks_h7Gj-VidAAHDJ-ghXyD-8Hhjbz-JhwAa2EIPaKSeISb1IZUExsUMJ4qPSEnkD5uUGgK3k2JOI8mk7b240_iqtJbhL0w56Q_UmFxNRNWPOS75syIlSfa6jou6Mt6-0HPA"
                        alt="Venue Map Location"
                        className="w-full h-64 object-cover block"
                      />
                      <div className="absolute top-3 left-3 bg-[#ffffff]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d3c3be]/30 shadow-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#855230] animate-pulse"></span>
                        <span className="text-xs text-[#090100] font-semibold">Bogor Botanical Gardens</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 bg-[#ffffff]/95 backdrop-blur-md p-3 rounded-xl border border-[#d3c3be]/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#855230]/15 text-[#855230] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-[#090100] truncate font-bold">
                              {formData.venueAddress.split(',')[0]}
                            </span>
                            <span className="text-[10px] text-[#504440] font-mono">
                              Lat: -6.5976, Lng: 106.7995 (Bogor Botanical Gardens)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onShowToast('Titik koordinat venue terverifikasi')}
                            className="px-3.5 py-1.5 rounded bg-[#2c1810] text-[#fcf9f4] text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            <span>Gunakan Titik Ini</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bagian C: Spesifikasi Photobooth */}
              <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </div>
                    <div>
                      <h2 className="text-base text-[#090100] font-serif font-bold">
                        C. Spesifikasi Photobooth
                      </h2>
                      <p className="text-xs text-[#504440]">
                        Pilihan desain frame kustom, jenis kertas foto, dan swatch material backdrop studio.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
                    Katalog Visual
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Design Frame */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs text-[#090100] font-semibold">Design Frame *</label>
                    <FrameDesignSelector
                      selected={formData.designFrame}
                      onChange={(val) => setFormData({ ...formData, designFrame: val })}
                    />
                  </div>

                  {/* Jenis Kertas */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[#090100] font-semibold">Jenis Kertas (Photo Paper) *</label>
                      <span className="text-xs text-[#855230] font-bold">{formData.paperType}</span>
                    </div>
                    <PaperTypeSelector
                      selected={formData.paperType}
                      onChange={(val) => setFormData({ ...formData, paperType: val })}
                    />
                  </div>

                  {/* Backdrop Photobooth */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[#090100] font-semibold">Backdrop Photobooth *</label>
                      <span className="text-xs text-[#855230] font-bold">{formData.backdrop}</span>
                    </div>
                    <BackdropSelector
                      selected={formData.backdrop}
                      onChange={(val) => setFormData({ ...formData, backdrop: val })}
                    />
                  </div>
                </div>
              </section>

              {/* Bagian D: Pembayaran DP & Upload Bukti Transfer */}
              <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                    </div>
                    <div>
                      <h2 className="text-base text-[#090100] font-serif font-bold">
                        D. Pembayaran &amp; Bukti Transfer (Payment &amp; Verification)
                      </h2>
                      <p className="text-xs text-[#504440]">
                        Pilihan pembayaran uang muka (DP min. 50%) atau pelunasan dengan verifikasi instan.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#f6f3ee] text-[#855230] px-2.5 py-1 rounded font-semibold uppercase">
                    Verifikasi Transaksi
                  </span>
                </div>

                {/* Bank Account Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                        Rekening Resmi Studio (BCA)
                      </span>
                      <span className="font-mono text-base font-bold text-[#090100] tracking-wide">
                        8830-492-110
                      </span>
                      <span className="text-xs text-[#504440]">a.n. PT Timelens Kreasi Abadi</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('8830492110')}
                      className="px-2.5 py-1 text-xs rounded bg-[#ebe8e3] hover:bg-[#e5e2dd] text-[#090100] font-semibold transition-colors cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
                        Rekening Alternatif (Mandiri)
                      </span>
                      <span className="font-mono text-base font-bold text-[#090100] tracking-wide">
                        122-00-1988234-1
                      </span>
                      <span className="text-xs text-[#504440]">a.n. PT Timelens Kreasi Abadi</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('1220019882341')}
                      className="px-2.5 py-1 text-xs rounded bg-[#ebe8e3] hover:bg-[#e5e2dd] text-[#090100] font-semibold transition-colors cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#090100] font-semibold flex items-center justify-between">
                        <span>Kolom: Nominal Transfer (Rp) *</span>
                        <span className="text-[11px] text-[#855230] font-semibold">DP Min. 50% / Lunas</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-sm text-[#855230] font-serif font-bold">
                          Rp
                        </span>
                        <input
                          type="text"
                          value={formData.transferAmount}
                          onChange={(e) => setFormData({ ...formData, transferAmount: e.target.value })}
                          className="w-full bg-[#f6f3ee] text-[#090100] px-4 py-2.5 pl-12 rounded-lg text-sm font-semibold border border-[#d3c3be]/30"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/30 space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#504440]">
                        <span>Paket Photobooth ({formData.duration})</span>
                        <span className="font-mono font-medium text-[#090100]">{formatIDR(basePrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#504440]">
                        <span>{formData.designFrame}</span>
                        <span className="font-mono font-medium text-[#090100]">{formatIDR(framePrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#504440]">
                        <span>Backdrop {formData.backdrop}</span>
                        <span className="font-mono font-medium text-[#090100]">{formatIDR(backdropPrice)}</span>
                      </div>
                      <div className="pt-2 border-t border-[#d3c3be]/40 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#090100]">Total Tagihan</span>
                        <span className="font-mono font-bold text-[#855230] text-base">{formatIDR(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs text-[#090100] font-semibold flex items-center justify-between">
                      <span>Upload Foto Bukti Transfer *</span>
                      <span className="text-[10px] text-[#504440]">Maks. 10MB (JPG, PNG, PDF)</span>
                    </label>

                    <div
                      onClick={() => onShowToast('File selector opened for transfer proof')}
                      className="border-2 border-dashed border-[#d3c3be] hover:border-[#855230] rounded-xl p-5 bg-[#f6f3ee] flex flex-col items-center justify-center text-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#ffffff] shadow-xs flex items-center justify-center text-[#855230]">
                        <span className="material-symbols-outlined text-[22px]">upload_file</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-[#090100] block">
                          Seret dan lepaskan file bukti transfer di sini
                        </span>
                        <span className="text-[11px] text-[#504440]">
                          Atau klik untuk memilih foto/tangkapan layar m-Banking
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-[#ffffff] border border-[#d3c3be]/40 text-[#855230] text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Pilih File Dokumen
                      </button>
                    </div>

                    {formData.uploadedFileName && (
                      <div className="p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-[#c7ecce] text-[#01210f] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-[#090100] truncate">
                              {formData.uploadedFileName}
                            </span>
                            <span className="text-[10px] text-[#504440] font-mono">
                              2.4 MB • Terunggah &amp; Terverifikasi
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Public Summary Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-28">
              <div className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-md border border-[#d3c3be]/30 flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#855230] to-[#2c1810]"></div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-[#855230] uppercase tracking-widest font-semibold">
                      Public Reservation Spec
                    </span>
                    <h3 className="text-2xl text-[#090100] font-serif font-bold mt-0.5">
                      Ringkasan Pemesanan
                    </h3>
                  </div>

                  <div className="flex flex-col gap-1 p-1.5 bg-[#f0ede9] rounded shadow-inner">
                    <span className="w-5 h-2 rounded bg-[#855230]/40"></span>
                    <span className="w-5 h-2 rounded bg-[#855230]/60"></span>
                    <span className="w-5 h-2 rounded bg-[#855230]/90"></span>
                  </div>
                </div>

                {/* Event Snapshot Box */}
                <div className="bg-[#f6f3ee] rounded-xl p-4 flex flex-col gap-2.5 border border-[#d3c3be]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#090100] font-bold truncate">
                      {formData.eventName || 'Nama Acara'}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#855230]/15 text-[#855230] font-bold">
                      {formData.eventType}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[#504440] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#855230]">calendar_today</span>
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#855230]">schedule</span>
                      <span>{formData.eventTime} WIB • {formData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-sm text-[#855230]">pin_drop</span>
                      <span className="truncate">{formData.venueAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Specs Breakdown */}
                <div className="flex flex-col gap-2.5 pt-1 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#f0ede9]">
                    <span className="text-[#504440]">PIC Pemesan</span>
                    <span className="font-semibold text-[#090100]">{formData.clientName || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#f0ede9]">
                    <span className="text-[#504440]">Desain Frame</span>
                    <span className="font-semibold text-[#090100]">{formData.designFrame}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#f0ede9]">
                    <span className="text-[#504440]">Jenis Kertas Foto</span>
                    <span className="font-semibold text-[#090100]">{formData.paperType}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#f0ede9]">
                    <span className="text-[#504440]">Pilihan Backdrop</span>
                    <span className="font-semibold text-[#090100]">{formData.backdrop}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#504440]">Estimasi Transfer Klien</span>
                    <span className="font-mono font-bold text-[#855230]">
                      {formData.transferAmount.startsWith('Rp') ? formData.transferAmount : `Rp ${formData.transferAmount}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="h-px bg-[#d3c3be]/40 w-full my-1"></div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base text-[#090100] font-serif font-bold">Total Biaya Atelier</span>
                    <span className="text-2xl text-[#090100] font-serif font-bold tracking-tight">
                      {formatIDR(grandTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#504440]">
                    <span>Ketentuan Pembayaran</span>
                    <span className="font-semibold text-[#855230]">DP Minimal 50% / Pelunasan</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-2 py-3.5 px-6 rounded-lg bg-[#2c1810] hover:bg-[#090100] text-[#fcf9f4] text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Kirim Formulir Reservasi</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 text-[#504440] text-xs">
                  <span className="material-symbols-outlined text-[#855230] text-base shrink-0">verified</span>
                  <span>
                    Konfirmasi ketersediaan &amp; perjanjian final akan dikirimkan otomatis via WhatsApp dalam waktu maksimal 24 jam.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation State Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#090100]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] max-w-xl w-full rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#855230] via-[#2c1810] to-[#855230]"></div>

            <div className="w-16 h-16 rounded-full bg-[#c7ecce] text-[#01210f] flex items-center justify-center mb-5 shadow-xs">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <span className="text-[11px] text-[#855230] uppercase tracking-widest font-bold mb-2">
              Formulir Berhasil Dikirim
            </span>

            <h2 className="text-2xl sm:text-3xl text-[#090100] mb-3 tracking-tight font-serif font-bold">
              Reservasi Anda Telah Diterima
            </h2>

            <p className="text-xs text-[#504440] max-w-md leading-relaxed mb-6">
              Terima kasih telah mempercayakan momen Anda pada Timelens Atelier. Tim kurator studio kami sedang memverifikasi bukti transfer dan detail reservasi Anda.
            </p>

            {/* Receipt Reference Box */}
            <div className="w-full bg-[#f6f3ee] rounded-xl p-5 mb-6 text-left flex flex-col gap-3 border border-[#d3c3be]/30">
              <div className="flex items-center justify-between pb-2 border-b border-[#d3c3be]/40">
                <span className="text-[11px] text-[#504440] uppercase tracking-wider">
                  Atelier Order Reference
                </span>
                <span className="text-xs text-[#090100] font-mono font-bold tracking-wider">
                  {orderRefNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <span className="text-[10px] text-[#504440] block">Nama Pemesan</span>
                  <span className="font-semibold text-[#090100]">{formData.clientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#504440] block">Tanggal Acara</span>
                  <span className="font-semibold text-[#090100]">{formattedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#504440] block">Format &amp; Backdrop</span>
                  <span className="font-semibold text-[#090100]">{formData.paperType} • {formData.backdrop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#504440] block">Status Pembayaran</span>
                  <span className="font-semibold text-[#855230]">Dalam Verifikasi DP</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onNavigate('incoming-orders');
                }}
                className="w-full py-3 px-6 rounded-lg bg-[#2c1810] text-[#fcf9f4] text-xs font-semibold hover:bg-[#090100] transition-all cursor-pointer"
              >
                Selesai &amp; Kembali ke Studio
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto py-3 px-6 rounded-lg bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#090100] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">print</span>
                <span>Cetak Bukti</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Footer */}
      <footer className="w-full bg-[#f6f3ee] border-t border-[#d3c3be]/40 py-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <span className="text-base text-[#090100] font-serif font-bold">Timelens Atelier</span>
            <p className="text-xs text-[#504440]">
              Handcrafted silver-gelatin &amp; analogue print booths. Crafted for permanence.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#504440]">
              © 2024 Timelens Vintage Photobooth Atelier. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
