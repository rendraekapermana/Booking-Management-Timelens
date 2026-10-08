import React, { useState } from 'react';
import { studioProfile, formatIDR } from '../lib/mock/mockData.js';
import DocumentToolbar from '../components/invoice/DocumentToolbar.jsx';

export default function InvoicePreviewPage({ onNavigate, onShowToast }) {
  const [docType, setDocType] = useState('invoice'); // 'invoice' | 'receipt'

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('8830921144');
    onShowToast('Nomor rekening BCA 883-092-1144 disalin ke clipboard');
  };

  const handleDownloadPDF = () => {
    window.print();
    onShowToast('Mencetak dokumen resmi atelier ke PDF...');
  };

  const handleSendWhatsapp = () => {
    onShowToast('Pesan pengantar invoice untuk klien telah disiapkan ke WhatsApp');
  };

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* Top Header & Actions (hidden during print) */}
      <DocumentToolbar
        docType={docType}
        onChangeDocType={setDocType}
        onBack={() => onNavigate('invoice-settings')}
        onDownloadPDF={handleDownloadPDF}
        onSendWhatsapp={handleSendWhatsapp}
      />

      {/* Printable A4 Archival Document Container */}
      <div className="w-full max-w-[840px] bg-[#ffffff] text-[#1c1c19] rounded-xl shadow-[0_12px_32px_rgba(44,24,16,0.06),0_2px_6px_rgba(44,24,16,0.03)] px-10 sm:px-14 py-12 relative overflow-hidden border border-[#d3c3be]/40 print-sheet">
        {/* Top Decorative Craft Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2c1810]"></div>

        {/* Top Archival Meta Banner */}
        <div className="flex justify-between items-center pb-6 border-b border-[#d3c3be]/40 text-[10px] uppercase font-mono tracking-widest text-[#504440]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[13px] text-[#855230]">verified</span>
            <span>
              {docType === 'invoice'
                ? 'ARSIP TAGIHAN RESMI • DOKUMEN TEROTENTIKASI'
                : 'ARSIP PELUNASAN RESMI • DOKUMEN TEROTENTIKASI'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>LEMBAR 01 / 01 • DOKUMEN SAH ASLI</span>
          </div>
        </div>

        {/* Header: Studio Letterhead & Document Meta */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-8 pb-8 border-b border-[#d3c3be]/40">
          {/* Studio Identity */}
          <div className="flex flex-col max-w-[380px]">
            <div className="mb-3">
              <img
                src={studioProfile.logo}
                alt="Timelens Photobooth Atelier"
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#090100]">
              {studioProfile.legalName}
            </span>
            <span className="text-[11px] text-[#855230] font-medium mt-0.5">
              {studioProfile.secondaryAddress}
            </span>
            <p className="text-xs text-[#504440] mt-1.5 leading-relaxed">
              Jl. Wijaya II No. 42, Kebayoran Baru<br />
              Jakarta Selatan 12160, DKI Jakarta - Indonesia
            </p>
            <div className="flex flex-col gap-0.5 mt-2.5 text-[11px] text-[#504440]">
              <span>WhatsApp Concierge: <strong className="text-[#090100] font-semibold">{studioProfile.phone}</strong></span>
              <span>NPWP: {studioProfile.npwp}</span>
            </div>
          </div>

          {/* Document Metadata Column */}
          <div className="flex flex-col sm:items-end text-left sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f3ee] border border-[#d3c3be]/40 text-[10px] uppercase tracking-widest text-[#855230] font-semibold mb-2.5">
              <span className={`w-1.5 h-1.5 rounded-full ${docType === 'invoice' ? 'bg-[#855230]' : 'bg-[#2d633b]'}`}></span>
              <span>{docType === 'invoice' ? 'DOKUMEN PENAGIHAN SAH' : 'DOKUMEN PEMBAYARAN SAH'}</span>
            </div>

            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#090100]">
              {docType === 'invoice' ? 'FAKTUR PENAGIHAN' : 'KWITANSI RESMI'}
            </h1>
            <span className="text-[11px] text-[#855230] tracking-widest uppercase font-semibold mt-0.5">
              {docType === 'invoice' ? 'COMMERCIAL STUDIO INVOICE' : 'OFFICIAL SETTLEMENT RECEIPT'}
            </span>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-left sm:text-right text-xs bg-[#fcf9f4] p-3 rounded-lg border border-[#d3c3be]/30">
              <span className="text-[#504440] uppercase tracking-wider text-[10px]">
                {docType === 'invoice' ? 'No. Faktur:' : 'No. Kwitansi:'}
              </span>
              <span className="font-semibold text-[#090100] font-mono tracking-tight text-xs">
                {docType === 'invoice' ? 'TL-INV-2024/10/090' : 'TL-RCT-2024/10/042'}
              </span>

              <span className="text-[#504440] uppercase tracking-wider text-[10px]">Tanggal Terbit:</span>
              <span className="font-medium text-[#1c1c19]">24 Oktober 2024</span>

              {docType === 'invoice' ? (
                <>
                  <span className="text-[#504440] uppercase tracking-wider text-[10px]">Jatuh Tempo DP:</span>
                  <span className="font-semibold text-[#ba1a1a]">31 Oktober 2024</span>
                  <span className="text-[#504440] uppercase tracking-wider text-[10px]">Status Tagihan:</span>
                  <span className="font-bold text-[#855230]">DOWN PAYMENT (50%)</span>
                </>
              ) : (
                <>
                  <span className="text-[#504440] uppercase tracking-wider text-[10px]">Ref. Invoice:</span>
                  <span className="font-semibold text-[#855230] font-mono">TL-INV-2024/10/090</span>
                  <span className="text-[#504440] uppercase tracking-wider text-[10px]">Status Pelunasan:</span>
                  <span className="font-bold text-[#2d633b]">LUNAS PENUH (PAID)</span>
                </>
              )}

              <span className="text-[#504440] uppercase tracking-wider text-[10px]">Metode:</span>
              <span className="font-medium text-[#1c1c19]">BCA Virtual Account / Transfer</span>
            </div>
          </div>
        </div>

        {/* Bilateral Cards: Client & Operational Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          <div className="p-5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-[#855230] text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[15px]">person</span>
                <span>{docType === 'invoice' ? 'Ditagihkan Kepada (Client)' : 'Telah Diterima Dari (Received From)'}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#090100]">
                Ny. Amalia &amp; Dimas Hartanto
              </h3>
              <p className="text-xs text-[#1c1c19] mt-1 font-medium">Wedding Reception Celebration</p>
              <p className="text-xs text-[#504440] mt-0.5">The Glasshouse Ballroom SCBD, Senayan, Jakarta Selatan</p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#d3c3be]/40 flex items-center gap-2 text-xs text-[#504440]">
              <span className="material-symbols-outlined text-[14px] text-[#855230]">contact_phone</span>
              <span>PIC: <strong className="text-[#090100]">Clarissa Organizer</strong> (+62 812-7711-2299)</span>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-[#855230] text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[15px]">event</span>
                <span>Jadwal Operasional Photobooth</span>
              </div>
              <span className="text-base text-[#090100] font-bold block">Sabtu, 16 November 2024</span>
              <p className="text-xs text-[#1c1c19] mt-1 font-medium">
                18:30 – 21:30 WIB <span className="text-[#504440] font-normal">(3 Jam Sesi Aktif)</span>
              </p>
              <p className="text-xs text-[#504440] mt-0.5">Bilah Studio: Velvet Walnut Noir • Dual Printing Unit</p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#d3c3be]/40 flex items-center gap-2 text-xs text-[#504440]">
              <span className="material-symbols-outlined text-[14px] text-[#855230]">schedule</span>
              <span>Loading &amp; Kalibrasi Lensa: <strong className="text-[#090100]">16:30 WIB (H-2 Jam)</strong></span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6 border border-[#d3c3be]/40 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f6f3ee] text-[#855230] text-xs uppercase tracking-wider border-b border-[#d3c3be]/40">
                <th className="py-3 px-4 font-semibold">Deskripsi Layanan &amp; Spesifikasi Spesial</th>
                <th className="py-3 px-4 text-center font-semibold w-24">Kuantitas</th>
                <th className="py-3 px-4 text-right font-semibold w-36">Harga Satuan</th>
                <th className="py-3 px-4 text-right font-semibold w-36">Jumlah (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3c3be]/30 text-xs bg-[#ffffff]">
              <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                <td className="py-4 px-4 align-top">
                  <div className="font-semibold text-sm text-[#090100]">Paket Atelier Classic Photobooth</div>
                  <p className="text-[#504440] text-xs mt-1 leading-relaxed">
                    Sesi operasional 3 jam dengan cetak tanpa batas (Unlimited 4R &amp; Dual Photostrips), custom metallic foil branding, kurasi pencahayaan studio continuous softbox, live cloud preview gallery, serta 2 studio attendants bertugas resmi.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-[10px] text-[#855230] bg-[#f5efeb] px-2 py-0.5 rounded">
                    <span>Preset Kamera: Leica Medium Format Simulation</span>
                    <span>•</span>
                    <span>Sub-dye Pro Printer</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center align-top font-medium text-[#1c1c19]">3 Jam</td>
                <td className="py-4 px-4 text-right align-top font-mono">Rp 8.500.000 / pkg</td>
                <td className="py-4 px-4 text-right align-top font-semibold text-[#090100] font-mono">Rp 8.500.000</td>
              </tr>
              <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                <td className="py-4 px-4 align-top">
                  <div className="font-semibold text-sm text-[#090100]">Custom Wooden Keepsake Box</div>
                  <p className="text-[#504440] text-xs mt-1 leading-relaxed">
                    Kotak kayu walnut solid Indonesia buatan tangan pengrajin Jepara dengan grafir laser monogram nama pasangan “Amalia &amp; Dimas”, termasuk kompartemen khusus flash drive kuningan berisi seluruh master RAW file.
                  </p>
                </td>
                <td className="py-4 px-4 text-center align-top font-medium text-[#1c1c19]">1 Set</td>
                <td className="py-4 px-4 text-right align-top font-mono">Rp 1.250.000</td>
                <td className="py-4 px-4 text-right align-top font-semibold text-[#090100] font-mono">Rp 1.250.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terbilang Note in Box */}
        <div className="mb-6 p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[#855230] font-semibold">Terbilang:</span>
            <span className="italic text-[#090100] font-serif font-medium text-sm">
              {docType === 'invoice'
                ? '# Empat Juta Delapan Ratus Tujuh Puluh Lima Ribu Rupiah #'
                : '# Sembilan Juta Tujuh Ratus Lima Puluh Ribu Rupiah #'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#827470] uppercase tracking-wider">
            IDR CURRENCY VERIFIED
          </span>
        </div>

        {/* Financial Breakdown & Security Seal */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 my-6 pt-2">
          {/* Financial Breakdown */}
          <div className="sm:col-span-7 flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-[#504440] py-1 border-b border-[#d3c3be]/30">
              <span>Subtotal Layanan:</span>
              <span className="font-mono text-[#090100] font-medium">Rp 9.750.000</span>
            </div>
            <div className="flex justify-between items-center text-[#504440] py-1 border-b border-[#d3c3be]/30">
              <span>Pajak Restitusi / Diskon:</span>
              <span className="font-mono text-[#090100] font-medium">Rp 0</span>
            </div>
            <div className="flex justify-between items-center text-sm text-[#090100] py-1.5 font-bold">
              <span>Total Nilai Kontrak:</span>
              <span className="font-mono text-base">Rp 9.750.000</span>
            </div>

            {docType === 'invoice' ? (
              <div className="p-4 mt-1 rounded-lg bg-[#2c1810] text-[#fcf9f4] flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] tracking-wider uppercase font-semibold text-[#ffdbce]">
                    TOTAL DITAGIHKAN SEKARANG (DP 50%)
                  </span>
                  <span className="text-xl font-bold font-mono text-white">Rp 4.875.000</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#e3bfb2] pt-2 mt-1 border-t border-white/10">
                  <span>Sisa Pelunasan (H-3 Acara):</span>
                  <span className="font-mono font-medium">Rp 4.875.000 (Jatuh tempo: 13 Nov 2024)</span>
                </div>
              </div>
            ) : (
              <div className="p-4 mt-1 rounded-lg bg-[#2c1810] text-[#fcf9f4] flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] tracking-wider uppercase font-semibold text-[#ffdbce]">
                    TOTAL TRANSAKSI LUNAS DITERIMA
                  </span>
                  <span className="text-xl font-bold font-mono text-white">Rp 9.750.000</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#c7ecce] pt-2 mt-1 border-t border-white/10">
                  <span>Sisa Kewajiban Klien:</span>
                  <span className="font-mono font-bold">Rp 0 (LUNAS PENUH)</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Seal Emblem */}
          <div className="sm:col-span-5 p-4 rounded-lg bg-[#f6f3ee] border border-dashed border-[#d3c3be] flex flex-col justify-between items-center text-center">
            <div className="flex items-center gap-2 text-[#855230] text-[10px] uppercase tracking-widest font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>TIMELENS ATELIER SECURITY SEAL</span>
            </div>

            <div className="my-2 py-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-[#855230]/40 flex items-center justify-center text-[#855230] mb-1 bg-[#ffffff] shadow-xs">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <span className="text-xs text-[#090100] font-bold uppercase tracking-wider">
                {docType === 'invoice' ? 'INVOICE SAH' : 'LUNAS / PAID'}
              </span>
              <span className="text-[10px] text-[#855230] font-mono tracking-widest">
                VERIFIED &amp; VALIDATED
              </span>
            </div>

            <div className="w-full pt-2 border-t border-[#d3c3be]/30 flex justify-between items-center text-[10px] font-mono text-[#504440]">
              <span>AUTH: #90844A</span>
              <span>24-10-2024 • JKT</span>
            </div>
          </div>
        </div>

        {/* Payment Transfer Instructions Card */}
        <div className="p-5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/40 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#ffffff] border border-[#d3c3be]/40 flex items-center justify-center shadow-xs text-[#855230] font-bold font-mono text-sm">
                BCA
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
                  Instruksi Pembayaran Transfer Bank
                </span>
                <span className="text-sm font-bold text-[#090100]">
                  Bank Central Asia (BCA) - KCU Thamrin
                </span>
                <span className="text-xs text-[#504440]">
                  Atas Nama: <strong className="text-[#090100]">PT Timelens Kreasi Abadi</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#ffffff] px-4 py-2 rounded-lg border border-[#d3c3be]/40 shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#504440] uppercase font-semibold">Nomor Rekening Resmi</span>
                <span className="text-base font-mono font-bold text-[#090100] tracking-wider">883-092-1144</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="ml-2 p-1.5 rounded hover:bg-[#f6f3ee] text-[#855230] transition-colors cursor-pointer"
                title="Salin Nomor Rekening"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#d3c3be]/40 flex items-center gap-2 text-xs text-[#504440]">
            <span className="material-symbols-outlined text-[15px] text-[#855230]">info</span>
            <span>
              Wajib menyertakan Berita Transfer: <strong className="text-[#090100] font-mono">TL-INV-2024/10/090</strong> untuk sinkronisasi rekonsiliasi instan studio.
            </span>
          </div>
        </div>

        {/* Terms & Signature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 pb-6 border-t border-[#d3c3be]/40">
          <div className="md:col-span-7 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[#855230] font-bold mb-2">
              Klausul Syarat &amp; Ketentuan Penagihan
            </span>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-[#504440] leading-relaxed">
              <li>Uang Muka (Down Payment 50%) bersifat mengikat hak reservasi tanggal dan unit photobooth atelier, serta <em>non-refundable</em> bila terjadi pembatalan sepihak.</li>
              <li>Pelunasan sisa tagihan 50% wajib diselesaikan selambat-lambatnya <strong>H-3 sebelum jadwal acara (13 November 2024)</strong> sebelum instruksi teknis kru diterbitkan.</li>
              <li>Pihak penyewa / penanggung jawab venue bertanggung jawab menyediakan akses bongkar muat (loading dock) minimal 2 jam sebelum jam sewa dimulai.</li>
              <li>Kebutuhan suplai daya listrik stabil minimal 1.200 Watt 220V harus dipersiapkan di lokasi radius 5 meter dari titik instalasi backdrop bilik.</li>
            </ol>
          </div>

          <div className="md:col-span-5 flex flex-col sm:items-end text-left sm:text-right">
            <span className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
              JAKARTA, 24 OKTOBER 2024
            </span>
            <span className="text-xs text-[#855230] font-medium mt-0.5">Finance &amp; Studio Direction</span>
            <div className="my-4 py-2 sm:px-3">
              <span className="font-serif italic text-2xl text-[#090100] tracking-wide">
                Clara Vance
              </span>
            </div>
            <span className="text-sm text-[#090100] font-bold">{studioProfile.owner.fullName}</span>
            <span className="text-[11px] text-[#855230] font-medium">
              {studioProfile.owner.role}
            </span>
            <span className="font-mono text-[9px] text-[#827470] mt-1.5">
              SHA256: 8f4b119a0ce6...4b921e
            </span>
          </div>
        </div>

        {/* Legal Footer Bar */}
        <div className="mt-4 pt-4 border-t border-[#d3c3be]/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-[#504440] text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span>Format A4 Fine Paper • ISO 216 Archival Spec</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Enkripsi AES-256 Validated</span>
            <span>•</span>
            <span>Timelens Paris-Jakarta Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
