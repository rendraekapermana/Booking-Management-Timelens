import React from 'react';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';

export default function InvoiceTemplateTab({ settings, onChange }) {
  const updateSetting = (key, val) => {
    onChange({ ...settings, [key]: val });
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Identitas Atelier & Letterhead */}
      <Card
        title="1. Identitas Atelier & Kop Surat"
        subtitle="Informasi legalitas dan kontak yang tercetak pada letterhead faktur resmi."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nama Studio / Brand"
            value={settings.studioName}
            onChange={(e) => updateSetting('studioName', e.target.value)}
          />
          <Input
            label="Nomor Telepon & Concierge"
            value={settings.studioPhone}
            onChange={(e) => updateSetting('studioPhone', e.target.value)}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Alamat Studio / Workshop Legal"
              rows={2}
              value={settings.studioAddress}
              onChange={(e) => updateSetting('studioAddress', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* SECTION 2: Penomoran & Rekening */}
      <Card
        title="2. Penomoran Faktur & Rekening Pembayaran"
        subtitle="Konfigurasi kode tagihan dan rekening bank tujuan pembayaran Down Payment."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pb-5 border-b border-[#f1ece4]">
          <Input
            label="Prefix Nomor Invoice"
            value={settings.invoicePrefix}
            onChange={(e) => updateSetting('invoicePrefix', e.target.value)}
            helperText="Awalan kode faktur (misal: TL-INV-)"
          />
          <Input
            label="Pola Penomoran Dinamis"
            value={settings.invoicePattern}
            onChange={(e) => updateSetting('invoicePattern', e.target.value)}
            helperText="Variable pola: [TAHUN]/[BULAN]/[NO]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <Input
            label="Bank Rekening"
            value={settings.bankName}
            onChange={(e) => updateSetting('bankName', e.target.value)}
          />
          <Input
            label="Nomor Rekening"
            value={settings.accountNum}
            onChange={(e) => updateSetting('accountNum', e.target.value)}
          />
          <Input
            label="Atas Nama (Holder)"
            value={settings.accountName}
            onChange={(e) => updateSetting('accountName', e.target.value)}
          />
        </div>

        <Textarea
          label="Instruksi & Catatan Transfer"
          rows={2}
          value={settings.paymentInstruction}
          onChange={(e) => updateSetting('paymentInstruction', e.target.value)}
        />
      </Card>

      {/* SECTION 3: Klausul & Footer */}
      <Card
        title="3. Klausul Syarat & Ketentuan Reservasi"
        subtitle="Ketentuan pembatalan, pembayaran pelunasan, dan hak operasional teknis tim photobooth."
      >
        <div className="space-y-5">
          <Textarea
            label="Syarat & Ketentuan (Terms & Conditions)"
            rows={4}
            value={settings.termsConditions}
            onChange={(e) => updateSetting('termsConditions', e.target.value)}
            helperText="Gunakan nomor atau tanda baris baru untuk memisahkan setiap klausul perjanjian."
          />
          <Input
            label="Catatan Kaki Dokumen (Footer Note)"
            value={settings.footerNote}
            onChange={(e) => updateSetting('footerNote', e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
}
