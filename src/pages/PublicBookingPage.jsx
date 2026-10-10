import { useState } from "react";
import { formatDateID } from "../lib/formatters.js";
import { studioProfile } from "../lib/mock/mockData.js";
import { useBookingPricing } from "../hooks/useBookingPricing.js";
import { bookingService } from "../services/bookingService.js";

// Import komponen-komponen UI yang sudah kita pisahkan
import {
  SectionA,
  SectionB,
  SectionC,
  SectionD,
  OrderSummary,
} from "../components/booking/BookingFormSections.jsx";

export default function PublicBookingPage({
  onNavigate,
  onAddNewOrder,
  onShowToast,
}) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventName: "",
    eventType: "Wedding",
    eventDate: "",
    eventTime: "",
    duration: "4 Jam",
    venueDetail: "",
    venueAddress: "",
    distanceKm: 0,
    mapsLink: "",
    designFrame: "Dibuatkan oleh Timelens",
    paperType: "4R (4x6)",
    backdrop: "Satin Red",
    transferAmount: "",
    proofUrl: null,
    uploadedFileName: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [orderRefNumber] = useState(
    `#TL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  const { basePrice, transportFee, grandTotal } = useBookingPricing({
    duration: formData.duration,
    paperType: formData.paperType,
    distanceKm: formData.distanceKm,
  });

  const formattedDate = formData.eventDate
    ? formatDateID(formData.eventDate, true)
    : "-";

  const handleCopyAccount = (number) => {
    navigator.clipboard?.writeText(number);
    onShowToast(`Nomor rekening ${number} berhasil disalin!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.clientName ||
      !formData.venueDetail ||
      !formData.venueAddress ||
      !formData.proofUrl
    ) {
      return onShowToast(
        "Mohon lengkapi alamat detail, titik peta, dan unggah bukti transfer",
        "error",
      );
    }

    const gabunganAlamat = `${formData.venueDetail} (Area: ${formData.venueAddress})`;

    const newBookingPayload = {
      eventName: formData.eventName,
      customerName: formData.clientName,
      customer_email: formData.clientEmail,
      customer_phone: formData.clientPhone,
      date: formData.eventDate,
      time: formData.eventTime ? formData.eventTime + " WIB" : "-",

      // 🔥 PERBAIKAN: Menggunakan venueName sesuai permintaan (bukan venue_address)
      venueName: gabunganAlamat,
      venue_maps_link: formData.mapsLink,

      duration: formData.duration,
      frame_design: formData.designFrame,
      backdrop: formData.backdrop,
      paperType: formData.paperType,
      totalPrice: grandTotal,
      downPayment: parseInt(formData.transferAmount.replace(/\D/g, "")) || 0,
      status: "Pending",
      uploaded_file_name: formData.proofUrl,
    };

    try {
      await bookingService.create(newBookingPayload);
      onShowToast("Reservasi berhasil dikirim dan disinkronkan ke database!");
      setShowModal(true);
    } catch (error) {
      onShowToast("Gagal menyimpan reservasi ke database.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex flex-col font-sans antialiased selection:bg-[#855230] selection:text-[#fcf9f4]">
      <header className="sticky top-0 z-40 bg-[#fcf9f4]/95 backdrop-blur-md border-b border-[#d3c3be]/40 px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 flex items-center">
              <img
                src={studioProfile.logo}
                alt="Timelens Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="h-4 w-px bg-[#d3c3be]/60 hidden sm:block"></div>
            <span className="text-xs uppercase tracking-widest text-[#855230] font-semibold hidden sm:inline-block">
              Official Event Reservation
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
            <p className="text-sm text-[#504440] max-w-3xl mt-1">
              Silakan lengkapi detail penyelenggaraan acara Anda, kurasi format
              photobooth archival, dan sertakan konfirmasi pembayaran uang muka.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* KOMPONEN FORM YANG SUDAH DIPISAH */}
              <SectionA formData={formData} setFormData={setFormData} />
              <SectionB
                formData={formData}
                setFormData={setFormData}
                transportFee={transportFee}
              />
              <SectionC formData={formData} setFormData={setFormData} />
              <SectionD
                formData={formData}
                setFormData={setFormData}
                handleCopyAccount={handleCopyAccount}
                onShowToast={onShowToast}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-28">
              {/* KOMPONEN RINGKASAN */}
              <OrderSummary
                formData={formData}
                formattedDate={formattedDate}
                basePrice={basePrice}
                transportFee={transportFee}
                grandTotal={grandTotal}
              />
            </div>
          </div>
        </form>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#090100]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] max-w-xl w-full rounded-2xl p-6 sm:p-10 flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#855230] via-[#2c1810] to-[#855230]"></div>
            <div className="w-16 h-16 rounded-full bg-[#c7ecce] text-[#01210f] flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-3xl">
                check_circle
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
              Reservasi Diterima
            </h2>
            <p className="text-xs text-[#504440] mb-6">
              Terima kasih telah mempercayakan momen Anda pada Timelens. Kami
              sedang memverifikasi detail Anda.
            </p>
            <div className="w-full bg-[#f6f3ee] rounded-xl p-5 mb-6 text-left border">
              <span className="text-[11px] text-[#504440] uppercase">
                Ref Number:{" "}
              </span>
              <span className="font-mono font-bold">{orderRefNumber}</span>
            </div>

            <button
              onClick={() => {
                const waNumber = "6281234567890";
                const message = `Halo Timelens Atelier, saya ${formData.clientName} baru saja melakukan reservasi photobooth via website dengan Nomor Referensi: *${orderRefNumber}*. Mohon verifikasi pemesanan saya. Terima kasih!`;
                window.open(
                  `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
                  "_blank",
                );
                setShowModal(false);
              }}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                forum
              </span>
              <span>Konfirmasi via WhatsApp</span>
            </button>
            <p className="text-[10px] text-[#504440] mt-4">
              Silakan klik tombol di atas untuk menghubungi tim kami via
              WhatsApp agar proses verifikasi lebih cepat.
            </p>
          </div>
        </div>
      )}

      <footer className="w-full bg-[#f6f3ee] border-t py-8 mt-auto text-center">
        <p className="text-xs text-[#504440]">
          © {new Date().getFullYear()} Timelens Vintage Photobooth Atelier.
        </p>
      </footer>
    </div>
  );
}
