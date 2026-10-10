import FrameDesignSelector from "./FrameDesignSelector.jsx";
import PaperTypeSelector from "./PaperTypeSelector.jsx";
import BackdropSelector from "./BackdropSelector.jsx";
import VenueAutocompleteMap from "./VenueAutocompleteMap.jsx";
import PaymentProofUpload from "./PaymentProofUpload.jsx";
import { formatIDR } from "../../lib/formatters.js";

export const SectionA = ({ formData, setFormData }) => (
  <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
        <div>
          <h2 className="text-base text-[#090100] font-serif font-bold">
            A. Informasi Klien &amp; Kontak (PIC)
          </h2>
          <p className="text-xs text-[#504440]">
            Data penanggung jawab pemesanan &amp; koordinasi acara.
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs font-semibold">
          Nama Lengkap PIC / Klien *
        </label>
        <input
          type="text"
          required
          placeholder="Contoh: Sarah Natasha"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="w-full bg-[#f6f3ee] px-4 py-2.5 rounded-lg text-sm border focus:bg-[#ffffff] focus:border-[#855230]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold">Email Klien *</label>
        <input
          type="email"
          required
          placeholder="sarah@email.com"
          value={formData.clientEmail}
          onChange={(e) =>
            setFormData({ ...formData, clientEmail: e.target.value })
          }
          className="w-full bg-[#f6f3ee] px-4 py-2.5 rounded-lg text-sm border focus:bg-[#ffffff]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold">Nomor WhatsApp Aktif *</label>
        <input
          type="tel"
          required
          placeholder="0812xxxxxx"
          value={formData.clientPhone}
          onChange={(e) =>
            setFormData({ ...formData, clientPhone: e.target.value })
          }
          className="w-full bg-[#f6f3ee] px-4 py-2.5 rounded-lg text-sm border focus:bg-[#ffffff]"
        />
      </div>
    </div>
  </section>
);

export const SectionB = ({ formData, setFormData, transportFee }) => (
  <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">
            celebration
          </span>
        </div>
        <div>
          <h2 className="text-base text-[#090100] font-serif font-bold">
            B. Detail Acara &amp; Venue
          </h2>
          <p className="text-xs text-[#504440]">
            Jadwal operasional, alamat lokasi, dan titik peta.
          </p>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold">Nama Acara *</label>
        <input
          type="text"
          required
          placeholder="Contoh: Pernikahan Sarah & Dimas"
          value={formData.eventName}
          onChange={(e) =>
            setFormData({ ...formData, eventName: e.target.value })
          }
          className="w-full bg-[#f6f3ee] px-4 py-2.5 rounded-lg text-sm border focus:bg-[#ffffff]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold">Jenis Acara *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {["Wedding", "Birthday", "Corporate", "Others"].map((type) => (
            <label
              key={type}
              onClick={() => setFormData({ ...formData, eventType: type })}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${formData.eventType === type ? "bg-[#ffffff] border-2 border-[#2c1810]" : "bg-[#f6f3ee]"}`}
            >
              <input
                type="radio"
                checked={formData.eventType === type}
                readOnly
                className="w-4 h-4 accent-[#2c1810]"
              />
              <span className="text-xs font-semibold">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold">Tanggal Acara *</label>
          <input
            type="date"
            required
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            className="w-full bg-[#f6f3ee] px-3 py-2.5 rounded-lg text-xs border focus:bg-[#ffffff]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold">Jam Acara *</label>
          <input
            type="text"
            required
            placeholder="18:00 - 22:00"
            value={formData.eventTime}
            onChange={(e) =>
              setFormData({ ...formData, eventTime: e.target.value })
            }
            className="w-full bg-[#f6f3ee] px-3 py-2.5 rounded-lg text-xs border focus:bg-[#ffffff]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold">Durasi *</label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full bg-[#f6f3ee] px-3 py-2.5 rounded-lg text-xs border focus:bg-[#ffffff]"
          >
            <option value="2 Jam">2 Jam</option>
            <option value="3 Jam">3 Jam</option>
            <option value="4 Jam">4 Jam</option>
            <option value="5 Jam">5 Jam</option>
            <option value="6 Jam">6 Jam</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4 border-t border-[#d3c3be]/30">
        <label className="text-sm font-bold text-[#090100]">
          Lokasi / venue
        </label>
        <textarea
          required
          placeholder="Alamat lengkap acara (jalan, gedung, patokan...)"
          value={formData.venueDetail}
          onChange={(e) =>
            setFormData({ ...formData, venueDetail: e.target.value })
          }
          className="w-full bg-[#ffffff] px-4 py-3 rounded-lg text-sm border border-[#d3c3be]/60 focus:outline-none focus:border-[#855230] min-h-[80px] shadow-sm resize-none"
        />
        <VenueAutocompleteMap
          onSelectLocation={(alamat, jarak, lat, lon) => {
            const gmapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            setFormData({
              ...formData,
              venueAddress: alamat,
              distanceKm: jarak,
              mapsLink: gmapsUrl,
            });
          }}
        />
        {formData.distanceKm > 0 && (
          <div className="p-3 bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 mt-1">
            <p className="text-[11px] text-[#855230] font-mono font-semibold">
              Jarak ke Venue: {formData.distanceKm.toFixed(1)} km{" "}
              {transportFee > 0
                ? ` (+ Biaya Transport ${formatIDR(transportFee)})`
                : " (Bebas Biaya Transport)"}
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
);

export const SectionC = ({ formData, setFormData }) => (
  <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">
            photo_camera
          </span>
        </div>
        <div>
          <h2 className="text-base text-[#090100] font-serif font-bold">
            C. Spesifikasi Photobooth
          </h2>
        </div>
      </div>
    </div>
    <div className="space-y-8">
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold">Design Frame *</label>
        <FrameDesignSelector
          selected={formData.designFrame}
          onChange={(val) => setFormData({ ...formData, designFrame: val })}
        />
      </div>
      <div className="flex flex-col gap-3 pt-4 border-t border-[#d3c3be]/30">
        <label className="text-xs font-semibold">Jenis Kertas Foto *</label>
        <div className="w-full h-48 sm:h-80 rounded-xl overflow-hidden border border-[#d3c3be]/60 bg-[#f6f3ee] relative shadow-sm group">
          <img
            src={
              formData.paperType.toLowerCase().includes("photostrip")
                ? "https://vlptvimjwooztqazonrq.supabase.co/storage/v1/object/sign/image_asset/Paper%20Type.jpg?token=eyJraWQiOiJhMjdkNGYzOS1kMjIyLTRjMTctYjYwMC03MjI1MDI0ODlmZjUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZV9hc3NldC9QYXBlciBUeXBlLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTE2MTQ1OTgsImV4cCI6MTgyMzE1MDU5OH0.rjfvKfP4zgO-TnF4UBS3TB_4DGnULLrjTVQuDKWxnwtUatOb4YjFFNRqwbmOI5xkIPGkNHU9xtPpLKbUR5r03g"
                : "https://vlptvimjwooztqazonrq.supabase.co/storage/v1/object/sign/image_asset/Paper%20Type.jpg?token=eyJraWQiOiJhMjdkNGYzOS1kMjIyLTRjMTctYjYwMC03MjI1MDI0ODlmZjUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZV9hc3NldC9QYXBlciBUeXBlLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTE2MTQ1OTgsImV4cCI6MTgyMzE1MDU5OH0.rjfvKfP4zgO-TnF4UBS3TB_4DGnULLrjTVQuDKWxnwtUatOb4YjFFNRqwbmOI5xkIPGkNHU9xtPpLKbUR5r03g"
            }
            alt={formData.paperType}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <PaperTypeSelector
          selected={formData.paperType}
          onChange={(val) => setFormData({ ...formData, paperType: val })}
        />
      </div>
      <div className="flex flex-col gap-3 pt-4 border-t border-[#d3c3be]/30">
        <label className="text-xs font-semibold">Backdrop Studio *</label>
        <div className="w-full h-48 sm:h-120 rounded-xl overflow-hidden border border-[#d3c3be]/60 bg-[#f6f3ee] relative shadow-sm group">
          <img
            src={
              formData.backdrop === "Satin Red"
                ? "https://vlptvimjwooztqazonrq.supabase.co/storage/v1/object/sign/image_asset/Backdrop.jpg?token=eyJraWQiOiJhMjdkNGYzOS1kMjIyLTRjMTctYjYwMC03MjI1MDI0ODlmZjUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZV9hc3NldC9CYWNrZHJvcC5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkxNjE0NTY3LCJleHAiOjE4MjMxNTA1Njd9.Fxz1WF8Mfg2OhbwUbD_mCTboHUp0Gp4DTSFnBp772-s9Ol19vwRHxfk9GSx9AZIF-yylKC1fdqQzqoPaf81okA"
                : "https://vlptvimjwooztqazonrq.supabase.co/storage/v1/object/sign/image_asset/Backdrop.jpg?token=eyJraWQiOiJhMjdkNGYzOS1kMjIyLTRjMTctYjYwMC03MjI1MDI0ODlmZjUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJpbWFnZV9hc3NldC9CYWNrZHJvcC5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzkxNjE0NTY3LCJleHAiOjE4MjMxNTA1Njd9.Fxz1WF8Mfg2OhbwUbD_mCTboHUp0Gp4DTSFnBp772-s9Ol19vwRHxfk9GSx9AZIF-yylKC1fdqQzqoPaf81okA"
            }
            alt={formData.backdrop}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <BackdropSelector
          selected={formData.backdrop}
          onChange={(val) => setFormData({ ...formData, backdrop: val })}
        />
      </div>
    </div>
  </section>
);

export const SectionD = ({
  formData,
  setFormData,
  handleCopyAccount,
  onShowToast,
}) => (
  <section className="bg-[#ffffff] rounded-xl p-6 sm:p-7 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between border-b border-[#d3c3be]/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#855230]/10 text-[#855230] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">
            payments
          </span>
        </div>
        <div>
          <h2 className="text-base text-[#090100] font-serif font-bold">
            D. Pembayaran &amp; Bukti
          </h2>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl bg-[#f6f3ee] border flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[#504440] block">
            BCA Resmi
          </span>
          <span className="font-bold">8830-492-110</span>
        </div>
        <button
          type="button"
          onClick={() => handleCopyAccount("8830492110")}
          className="px-2 py-1 text-xs bg-[#ebe8e3] rounded"
        >
          Salin
        </button>
      </div>
      <div className="p-4 rounded-xl bg-[#f6f3ee] border flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[#504440] block">
            Mandiri
          </span>
          <span className="font-bold">122-00-1988234-1</span>
        </div>
        <button
          type="button"
          onClick={() => handleCopyAccount("1220019882341")}
          className="px-2 py-1 text-xs bg-[#ebe8e3] rounded"
        >
          Salin
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold">
            Nominal Transfer (Rp) *
          </label>
          <input
            type="text"
            required
            placeholder="3.500.000"
            value={formData.transferAmount}
            onChange={(e) =>
              setFormData({ ...formData, transferAmount: e.target.value })
            }
            className="w-full bg-[#f6f3ee] px-4 py-2.5 rounded-lg text-sm border focus:bg-[#ffffff]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold">Upload Bukti Transfer *</label>
        <PaymentProofUpload
          onShowToast={onShowToast}
          onUploadComplete={(url, name) =>
            setFormData({ ...formData, proofUrl: url, uploadedFileName: name })
          }
        />
      </div>
    </div>
  </section>
);

export const OrderSummary = ({
  formData,
  formattedDate,
  basePrice,
  transportFee,
  grandTotal,
}) => (
  <div className="bg-[#ffffff] rounded-xl p-6 shadow-md border border-[#d3c3be]/30 flex flex-col gap-5 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#855230] to-[#2c1810]"></div>
    <div>
      <span className="text-[11px] text-[#855230] uppercase tracking-widest font-semibold">
        Reservation Spec
      </span>
      <h3 className="text-2xl font-serif font-bold mt-0.5">
        Ringkasan Pemesanan
      </h3>
    </div>
    <div className="bg-[#f6f3ee] rounded-xl p-4 flex flex-col gap-2.5 border">
      <span className="text-sm font-bold truncate">
        {formData.eventName || "Nama Acara"}
      </span>
      <div className="text-[#504440] text-xs space-y-2">
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-sm text-[#855230]">
            calendar_today
          </span>
          {formattedDate}
        </div>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-sm text-[#855230]">
            schedule
          </span>
          {formData.eventTime || "-"} • {formData.duration}
        </div>
        <div className="flex gap-2 items-start">
          <span className="material-symbols-outlined text-sm text-[#855230] pt-0.5">
            pin_drop
          </span>
          <span className="leading-snug line-clamp-2">
            {formData.venueDetail || "Belum ada lokasi"}
          </span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2.5 text-xs mt-1">
      <div className="flex justify-between py-1 border-b">
        <span className="text-[#504440]">Paket ({formData.duration})</span>
        <span className="font-semibold text-[#090100]">
          {formatIDR(basePrice)}
        </span>
      </div>
      {transportFee > 0 && (
        <div className="flex justify-between py-1 border-b">
          <span className="text-[#855230]">Biaya Transport Luar Kota</span>
          <span className="font-semibold text-[#855230]">
            {formatIDR(transportFee)}
          </span>
        </div>
      )}
      <div className="flex justify-between py-1 border-b bg-[#855230]/5 px-2 rounded">
        <span className="text-[#855230] font-semibold">Minimum DP (50%)</span>
        <span className="font-semibold text-[#855230]">
          {formatIDR(grandTotal * 0.5)}
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-1.5 mt-2">
      <div className="flex justify-between items-baseline">
        <span className="text-base font-serif font-bold">
          Total Biaya Atelier
        </span>
        <span className="text-2xl font-serif font-bold text-[#855230]">
          {formatIDR(grandTotal)}
        </span>
      </div>
    </div>
    <button
      type="submit"
      className="w-full mt-2 py-3.5 bg-[#2c1810] hover:bg-[#090100] text-[#fcf9f4] text-sm font-semibold rounded-lg shadow-sm"
    >
      Kirim Formulir Reservasi
    </button>
  </div>
);
