import React from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Textarea from '../ui/Textarea.jsx';

export default function WhatsAppGatewayTab({
  settings,
  currentKey,
  onSelectKey,
  currentText,
  onChangeText,
  onSendTest
}) {
  const variableTags = [
    '{nama_klien}',
    '{no_invoice}',
    '{total_tagihan}',
    '{nominal_dp}',
    '{jatuh_tempo}',
    '{nama_bank}',
    '{nomor_rekening}',
    '{link_invoice}',
    '{link_kwitansi}'
  ];

  const handleInsertTag = (tag) => {
    onChangeText(currentText + ' ' + tag);
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Gateway Status */}
      <Card
        title="1. Integrasi Meta WhatsApp Cloud Gateway"
        subtitle="Koneksi resmi nomor studio untuk pengiriman otomatis notifikasi faktur dan kwitansi."
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f6f3ee] rounded-xl border border-[#d3c3be]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c7ecce] text-[#01210f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">mark_chat_read</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[#090100]">
                  WhatsApp Business Cloud API Terhubung
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#c7ecce] text-[#01210f]">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-[#504440] mt-0.5 font-mono">
                Nomor Resmi Studio: +62 811-920-8800 (Timelens Atelier Concierge)
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onSendTest}>
            Kirim Uji Coba
          </Button>
        </div>
      </Card>

      {/* SECTION 2: Template Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="2. Draf Template Pesan Notifikasi"
            subtitle="Pilih skenario pesan lalu sesuaikan redaksi kata sesuai gaya editorial studio."
          >
            {/* Template Selector Pills */}
            <div className="flex items-center gap-2 p-1 bg-[#f0ede9] rounded-xl mb-4 border border-[#d3c3be]/30">
              {[
                { key: 'dp', label: 'Tagihan DP (Invoice Baru)' },
                { key: 'receipt', label: 'Kwitansi Pelunasan' },
                { key: 'reminder', label: 'Pengingat H-3 Acara' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectKey(item.key)}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                    currentKey === item.key
                      ? 'bg-[#ffffff] text-[#090100] shadow-xs'
                      : 'text-[#504440] hover:text-[#090100]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Clickable Variable Tag Chips */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#504440] block mb-2">
                Sisipkan Tag Variabel Dinamis:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {variableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#855230] border border-[#d3c3be]/50 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Format Teks Pesan WhatsApp"
              rows={11}
              value={currentText}
              onChange={(e) => onChangeText(e.target.value)}
              className="font-mono text-xs leading-relaxed"
            />
          </Card>
        </div>

        {/* SECTION 3: Live Preview Phone View */}
        <div className="lg:col-span-5">
          <div className="bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl p-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
                <span className="font-serif font-bold text-sm text-[#090100]">
                  Pratinjau Pesan Klien
                </span>
              </div>
              <span className="text-[10px] text-[#827470]">Format WhatsApp</span>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="bg-[#e5ddd5] p-4 rounded-xl border border-[#d4cbbf] min-h-[300px] flex flex-col justify-end">
              <div className="bg-[#ffffff] rounded-2xl rounded-tl-xs p-4 shadow-xs text-xs text-[#1c1c19] space-y-2 max-w-[95%] border border-[#000000]/5 leading-relaxed whitespace-pre-line font-sans">
                {currentText}
                <div className="text-[10px] text-[#827470] text-right pt-1 font-mono">
                  14:32 WIB ✓✓
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f1ece4] flex items-center justify-between text-[11px] text-[#504440]">
              <span>Karakter: {currentText.length}</span>
              <span className="text-[#855230] font-semibold">Terkurasi Standar Atelier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
