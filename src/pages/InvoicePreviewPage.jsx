import React, { useState, useEffect } from "react";
import { formatIDR } from "../lib/formatters.js";
import { invoiceSettingsService } from "../services/invoiceSettingsService.js";
import { defaultInvoiceSettings } from "../lib/mock/mockData.js";
import DocumentToolbar from "../components/invoice/DocumentToolbar.jsx";

export default function InvoicePreviewPage({
  booking,
  onNavigate,
  onShowToast,
}) {
  const [docType, setDocType] = useState("invoice");
  const [settings, setSettings] = useState(defaultInvoiceSettings);

  useEffect(() => {
    if (booking?.status === "Fully Paid") {
      setDocType("receipt");
    }

    const loadSettings = async () => {
      const data = await invoiceSettingsService.getSettings();
      if (data) setSettings(data);
    };
    loadSettings();
  }, [booking]);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="material-symbols-outlined text-4xl text-[#855230]">
          description
        </span>
        <p className="text-[#504440] font-medium">
          Data pesanan tidak ditemukan untuk di-generate Invoicenya.
        </p>
        <button
          onClick={() => onNavigate("dashboard")}
          className="px-4 py-2 bg-[#855230] text-white rounded-lg text-sm font-semibold"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // variabel dinamis berdasarkan pengaturan
  const studioName = settings?.studioName || "Timelens Photobooth";
  const studioAddress =
    settings?.studioAddress ||
    "Jl. Wijaya II No. 42, Kebayoran Baru, Jakarta Selatan 12160";
  const bankName = settings?.bankName || "BCA";
  const accountNum = settings?.accountNum || "8830921144";
  const accountName = settings?.accountName || "PT Timelens Kreasi Abadi";
  const paymentInstruction =
    settings?.paymentInstruction ||
    "Mohon cantumkan Nomor Invoice pada berita transfer.";
  const termsConditions = settings?.termsConditions || "";
  const footerNote = settings?.footerNote || "";

  const invPrefix = settings?.invoicePrefix || "TL-INV-";
  const rctPrefix = settings?.receiptPrefix || "TL-RCT-";

  const invoiceNumber = `${invPrefix}${booking.date?.substring(0, 7).replace("-", "/")}/${booking.orderRef || booking.id?.substring(0, 4).toUpperCase()}`;
  const receiptNumber = `${rctPrefix}${booking.date?.substring(0, 7).replace("-", "/")}/${booking.orderRef || booking.id?.substring(0, 4).toUpperCase()}`;

  const publishDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalPrice = Number(booking.totalPrice || 0);
  const downPayment = Number(booking.downPayment || 0);
  const remainingPayment = totalPrice - downPayment;

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(accountNum);
    if (onShowToast)
      onShowToast(
        `Nomor rekening ${bankName} ${accountNum} disalin ke clipboard`,
      );
  };

  const handleDownloadPDF = () => {
    window.print();
    if (onShowToast) onShowToast("Mencetak dokumen resmi ke PDF...");
  };

  const handleSendWhatsapp = () => {
    const rawTemplate =
      docType === "invoice"
        ? settings?.whatsappTemplates?.dp ||
          "Halo kak {nama_klien}, berikut kami lampirkan Invoice Uang Muka untuk event *{nama_event}*.\n\nTotal: {total_tagihan}\nDP Diterima: {nominal_dp}\n\nTransfer Sisa Pelunasan: {nama_bank} {nomor_rekening} a.n {nama_holder}"
        : settings?.whatsappTemplates?.receipt ||
          "Halo kak {nama_klien}, berikut kami lampirkan Kwitansi Pelunasan Resmi untuk event *{nama_event}*.\n\nTotal Lunas: {total_tagihan}";

    const waText = rawTemplate
      .replace(/{nama_klien}/g, booking.customerName || "")
      .replace(/{nama_event}/g, booking.eventName || "")
      .replace(/{no_invoice}/g, invoiceNumber)
      .replace(/{total_tagihan}/g, formatIDR(totalPrice))
      .replace(/{nominal_dp}/g, formatIDR(downPayment))
      .replace(/{nama_bank}/g, bankName)
      .replace(/{nomor_rekening}/g, accountNum)
      .replace(/{nama_holder}/g, accountName)
      .replace(/{nama_studio}/g, studioName);

    window.open(
      `https://wa.me/${booking.customerPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(waText)}`,
      "_blank",
    );
  };

  return (
    <div className="w-full flex flex-col items-center pt-8 pb-20 print:pt-0 print:pb-0">
      <DocumentToolbar
        docType={docType}
        onChangeDocType={setDocType}
        onBack={() => onNavigate("invoice-settings")}
        onDownloadPDF={handleDownloadPDF}
        onSendWhatsapp={handleSendWhatsapp}
      />

      <div className="w-full max-w-[840px] mt-6 bg-[#ffffff] text-[#1c1c19] rounded-xl shadow-[0_12px_32px_rgba(44,24,16,0.06)] px-10 sm:px-14 py-12 relative overflow-hidden border border-[#d3c3be]/40 print-sheet">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2c1810]"></div>

        <div className="flex justify-between items-center pb-6 border-b border-[#d3c3be]/40 text-[10px] uppercase font-mono tracking-widest text-[#504440]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[13px] text-[#855230]">
              verified
            </span>
            <span>
              {docType === "invoice"
                ? "ARSIP PEMBAYARAN DP"
                : "ARSIP PELUNASAN RESMI"}
            </span>
          </div>
          <span>LEMBAR 01 / 01 • DOKUMEN SAH ASLI</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-8 pb-8 border-b border-[#d3c3be]/40">
          <div className="flex flex-col max-w-[380px]">
            <h2 className="text-xl font-serif font-bold text-[#090100] tracking-tight mb-1">
              {studioName}
            </h2>
            <span className="text-[11px] text-[#855230] font-medium mt-0.5">
              {accountName}
            </span>
            <p className="text-xs text-[#504440] mt-1.5 leading-relaxed whitespace-pre-line">
              {studioAddress}
            </p>
          </div>

          <div className="flex flex-col sm:items-end text-left sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f3ee] border border-[#d3c3be]/40 text-[10px] uppercase tracking-widest text-[#855230] font-semibold mb-2.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#2d633b]`}></span>
              <span>
                {docType === "invoice"
                  ? "BUKTI PEMBAYARAN DP"
                  : "DOKUMEN PEMBAYARAN"}
              </span>
            </div>

            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#090100]">
              {docType === "invoice"
                ? "INVOICE UANG MUKA (DP)"
                : "KWITANSI RESMI"}
            </h1>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-left sm:text-right text-xs bg-[#fcf9f4] p-3 rounded-lg border border-[#d3c3be]/30">
              <span className="text-[#504440] uppercase tracking-wider text-[10px]">
                Nomor Dokumen:
              </span>
              <span className="font-semibold text-[#090100] font-mono tracking-tight text-xs">
                {docType === "invoice" ? invoiceNumber : receiptNumber}
              </span>
              <span className="text-[#504440] uppercase tracking-wider text-[10px]">
                Tanggal Terbit:
              </span>
              <span className="font-medium text-[#1c1c19]">{publishDate}</span>
              <span className="text-[#504440] uppercase tracking-wider text-[10px]">
                Status:
              </span>
              <span className={`font-bold text-[#2d633b]`}>
                {docType === "invoice" ? "DP TELAH DITERIMA" : "LUNAS (PAID)"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-[#855230] text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[15px]">
                  person
                </span>
                <span>
                  {docType === "invoice"
                    ? "Ditagihkan Kepada (Client)"
                    : "Telah Diterima Dari"}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#090100]">
                {booking.customerName}
              </h3>
              <p className="text-xs text-[#1c1c19] mt-1 font-medium">
                {booking.eventName}
              </p>
              <p className="text-xs text-[#504440] mt-0.5">
                {booking.venueName}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#d3c3be]/40 flex items-center gap-2 text-xs text-[#504440]">
              <span className="material-symbols-outlined text-[14px] text-[#855230]">
                contact_phone
              </span>
              <span>
                Telepon:{" "}
                <strong className="text-[#090100]">
                  {booking.customerPhone}
                </strong>
              </span>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-[#855230] text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[15px]">
                  event
                </span>
                <span>Jadwal Operasional Photobooth</span>
              </div>
              <span className="text-base text-[#090100] font-bold block">
                {booking.dateFormatted || booking.date}
              </span>
              <p className="text-xs text-[#1c1c19] mt-1 font-medium">
                {booking.time}{" "}
                <span className="text-[#504440] font-normal">
                  ({booking.duration})
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 border border-[#d3c3be]/40 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f6f3ee] text-[#855230] text-xs uppercase tracking-wider border-b border-[#d3c3be]/40">
                <th className="py-3 px-4 font-semibold">Deskripsi Layanan</th>
                <th className="py-3 px-4 text-center font-semibold w-24">
                  Durasi
                </th>
                <th className="py-3 px-4 text-right font-semibold w-36">
                  Harga Kontrak
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3c3be]/30 text-xs bg-[#ffffff]">
              <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                <td className="py-4 px-4 align-top">
                  <div className="font-semibold text-sm text-[#090100]">
                    Paket Layanan Photobooth
                  </div>
                  <p className="text-[#504440] text-xs mt-1 leading-relaxed">
                    Spesifikasi: {booking.paperType}, Backdrop{" "}
                    {booking.backdrop}, Frame {booking.frameDesign}.
                  </p>
                </td>
                <td className="py-4 px-4 text-center align-top font-medium text-[#1c1c19]">
                  {booking.duration}
                </td>
                <td className="py-4 px-4 text-right align-top font-semibold text-[#090100] font-mono">
                  {formatIDR(totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kotak Rekening Pembayaran */}
        <div className="my-6 p-4 rounded-lg bg-[#fcf9f4] border border-[#d3c3be]/40 text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#855230]">
              Rekening Pembayaran Pelunasan ({bankName})
            </span>
            <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#090100]">
              <span>{accountNum}</span>
              <span className="text-xs font-normal font-sans text-[#504440]">
                a.n. {accountName}
              </span>
            </div>
            {paymentInstruction && (
              <p className="text-[11px] text-[#504440] mt-1">
                {paymentInstruction}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyAccount}
            className="px-3 py-1.5 bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#855230] border border-[#d3c3be]/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">
              content_copy
            </span>
            <span>Salin Rekening</span>
          </button>
        </div>

        <div className="flex justify-end gap-6 my-6 pt-2">
          <div className="w-full sm:w-[350px] flex flex-col gap-2 text-xs">
            {docType === "invoice" ? (
              <div className="p-4 mt-1 rounded-lg bg-[#2c1810] text-[#fcf9f4] flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-[11px] text-[#e3bfb2] pb-2 mb-1 border-b border-white/10">
                  <span>Total Nilai Kontrak:</span>
                  <span className="font-mono">{formatIDR(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] tracking-wider uppercase font-semibold text-[#c7ecce]">
                    DP DIBAYARKAN
                  </span>
                  <span className="text-xl font-bold font-mono text-[#c7ecce]">
                    {formatIDR(downPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#ffdbce] pt-3 mt-2 border-t border-white/10">
                  <span className="font-bold">SISA PELUNASAN:</span>
                  <span className="font-mono font-bold text-base">
                    {formatIDR(remainingPayment > 0 ? remainingPayment : 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 mt-1 rounded-lg bg-[#2c1810] text-[#fcf9f4] flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] tracking-wider uppercase font-semibold text-[#ffdbce]">
                    TOTAL LUNAS DITERIMA
                  </span>
                  <span className="text-xl font-bold font-mono text-white">
                    {formatIDR(totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {termsConditions && (
          <div className="mt-8 pt-4 border-t border-[#d3c3be]/40 text-[11px] text-[#504440] space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#855230] block">
              Syarat & Ketentuan:
            </span>
            <p className="whitespace-pre-line leading-relaxed">
              {termsConditions}
            </p>
          </div>
        )}

        {footerNote && (
          <div className="mt-6 text-center text-[10px] italic text-[#827470]">
            {footerNote}
          </div>
        )}
      </div>
    </div>
  );
}
