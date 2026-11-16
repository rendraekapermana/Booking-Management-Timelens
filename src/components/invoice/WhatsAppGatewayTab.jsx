import React from 'react';
import Textarea from '../ui/Textarea.jsx';

export default function WhatsAppGatewayTab({
  currentKey,
  onSelectKey,
  currentText,
  onChangeText,
}) {
  const variableTags =
    currentKey === 'reminder'
      ? ['{nama_klien}', '{no_invoice}', '{nama_studio}']
      : ['{nama_klien}', '{no_invoice}', '{total_tagihan}'];

  const handleInsertTag = (tag) => {
    onChangeText(currentText + ' ' + tag);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#ffffff] rounded-xl border border-[#d3c3be]/40 p-6">
            <h2 className="text-sm font-semibold text-[#090100]">
              Template Pesan Notifikasi
            </h2>
            <p className="text-xs text-[#504440] mt-1 mb-5">
              Atur template pengingat acara H-5 dan pesan kwitansi pelunasan.
              Pengiriman otomatis belum aktif karena integrasi WhatsApp API dan
              penjadwal belum dikonfigurasi.
            </p>
            {/* Template Selector Pills */}
            <div className="flex items-center gap-2 p-1 bg-[#f0ede9] rounded-xl mb-4 border border-[#d3c3be]/30">
              {[
                { key: 'receipt', label: 'Kwitansi Pelunasan' },
                { key: 'reminder', label: 'Pengingat H-5 Acara' }
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
          </div>
        </div>

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
              <span className="text-[#855230] font-semibold">Terkurasi Standar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
