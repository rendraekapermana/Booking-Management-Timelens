import React from 'react';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';

export default function ReceiptTemplateTab({ settings, onChange }) {
  const updateSetting = (key, val) => {
    onChange({ ...settings, [key]: val });
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Format Dokumen Kwitansi Pelunasan */}
      <Card
        title="1. Format Kwitansi Pelunasan Resmi"
        subtitle="Struktur teks tanda terima pelunasan saat klien telah melunasi seluruh biaya sewa photobooth."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Input
            label="Judul Dokumen Kwitansi"
            value={settings.receiptTitle}
            onChange={(e) => updateSetting('receiptTitle', e.target.value)}
          />
          <Input
            label="Prefix Penomoran Kwitansi"
            value={settings.receiptPrefix}
            onChange={(e) => updateSetting('receiptPrefix', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Input
            label="Label 'Telah Diterima Dari'"
            value={settings.receiptPayerLabel}
            onChange={(e) => updateSetting('receiptPayerLabel', e.target.value)}
          />
          <Input
            label="Label 'Sejumlah Uang'"
            value={settings.receiptWordsLabel}
            onChange={(e) => updateSetting('receiptWordsLabel', e.target.value)}
          />
        </div>

        <Input
          label="Deskripsi Default Peruntukan Pembayaran"
          value={settings.receiptDefaultDesc}
          onChange={(e) => updateSetting('receiptDefaultDesc', e.target.value)}
        />
      </Card>

      {/* SECTION 2: Cap Stempel Atelier & Tanda Tangan */}
      <Card
        title="2. Cap Stempel & Otentikasi Digital"
        subtitle="Penanda keabsahan tanda terima lunas resmi atelier."
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-[#f6f3ee] rounded-xl border border-[#d3c3be]/40">
            <div>
              <span className="font-semibold text-xs text-[#090100]">
                Tampilkan Cap Stempel Resmi Timelens
              </span>
              <p className="text-[11px] text-[#504440] mt-0.5">
                Mencetak stempel oval bergradasi bronze bertuliskan "LUNAS / VERIFIED" di atas tanda tangan.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeStamp}
                onChange={(e) => updateSetting('includeStamp', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#d3c3be] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#855230]"></div>
            </label>
          </div>

          <Input
            label="Teks Cap Stempel Atelier"
            value={settings.stampText}
            onChange={(e) => updateSetting('stampText', e.target.value)}
          />
        </div>
      </Card>

      {/* SECTION 3: Klausul Serah Terima */}
      <Card
        title="3. Klausul Serah Terima & Hak Cipta Soft File"
        subtitle="Ketentuan penyerahan master strip fisik dan pengunggahan soft file high-resolution."
      >
        <Textarea
          label="Klausul Penyerahan Kwitansi"
          rows={4}
          value={settings.handoverClauses}
          onChange={(e) => updateSetting('handoverClauses', e.target.value)}
        />
      </Card>
    </div>
  );
}
