import React from 'react';
import Button from '../ui/Button.jsx';

export default function DocumentToolbar({
  docType,
  onChangeDocType,
  onBack,
  onDownloadPDF,
  onSendWhatsapp
}) {
  return (
    <div className="w-full max-w-4xl mb-8 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#d3c3be]/40">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#504440] hover:text-[#090100] transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Pengaturan Invoice</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex p-1 bg-[#f0ede9] rounded-lg border border-[#d3c3be]/30">
          <button
            type="button"
            onClick={() => onChangeDocType('invoice')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'invoice'
                ? 'bg-[#ffffff] text-[#090100] shadow-xs'
                : 'text-[#504440] hover:text-[#090100]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#855230]">receipt_long</span>
            <span>Faktur / Invoice (Tagihan DP)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#febb90]/30 text-[#794827]">
              Menunggu DP
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeDocType('receipt')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'receipt'
                ? 'bg-[#ffffff] text-[#090100] shadow-xs'
                : 'text-[#504440] hover:text-[#090100]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#855230]">verified</span>
            <span>Kwitansi Resmi Pelunasan</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#c7ecce] text-[#01210f]">
              LUNAS
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" icon="print" onClick={onDownloadPDF}>
            Cetak / PDF
          </Button>
          <Button variant="primary" size="sm" icon="send" onClick={onSendWhatsapp}>
            Kirim WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
