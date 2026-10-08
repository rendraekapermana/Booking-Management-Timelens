import React, { useState } from 'react';
import { defaultInvoiceSettings } from '../lib/mock/mockData.js';
import InvoiceTemplateTab from '../components/invoice/InvoiceTemplateTab.jsx';
import ReceiptTemplateTab from '../components/invoice/ReceiptTemplateTab.jsx';
import WhatsAppGatewayTab from '../components/invoice/WhatsAppGatewayTab.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

export default function InvoiceSettingsPage({ onNavigate, onShowToast }) {
  const [activeTab, setActiveTab] = useState('invoice'); // 'invoice' | 'receipt' | 'whatsapp'
  const [settings, setSettings] = useState(defaultInvoiceSettings);
  const [whatsappTemplateKey, setWhatsappTemplateKey] = useState('dp');
  const [currentWhatsappText, setCurrentWhatsappText] = useState(defaultInvoiceSettings.whatsappTemplates.dp);

  const handleSwitchWhatsappTemplate = (key) => {
    setWhatsappTemplateKey(key);
    setCurrentWhatsappText(settings.whatsappTemplates[key] || '');
  };

  const handleSave = () => {
    onShowToast('Invoice & Billing Settings successfully saved to studio ledger!');
  };

  const handleSendTestWhatsapp = () => {
    onShowToast('Pesan uji coba terkirim ke WhatsApp +62 811-920-8800');
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <PageHeader
        eyebrow="Konfigurasi Studio & Penagihan"
        title="Pengaturan Invoice & Penagihan"
        description="Kelola identitas atelier, format penomoran faktur & kwitansi, rekening pembayaran, klausul syarat & ketentuan, serta template notifikasi pesan WhatsApp."
        actions={
          <>
            <Button
              variant="secondary"
              icon="visibility"
              onClick={() => onNavigate('invoice-preview')}
            >
              Pratinjau Dokumen Penuh
            </Button>
            <Button
              variant="primary"
              icon="save"
              onClick={handleSave}
            >
              Simpan Pengaturan
            </Button>
          </>
        }
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#d3c3be]/40 gap-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('invoice')}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'invoice'
              ? 'text-[#090100] border-b-2 border-[#855230]'
              : 'text-[#827470] hover:text-[#090100]'
          }`}
        >
          Template Faktur / Invoice
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipt')}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'receipt'
              ? 'text-[#090100] border-b-2 border-[#855230]'
              : 'text-[#827470] hover:text-[#090100]'
          }`}
        >
          <span>Kwitansi Pelunasan Resmi</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#c7ecce] text-[#01210f]">
            Lunas
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'whatsapp'
              ? 'text-[#090100] border-b-2 border-[#855230]'
              : 'text-[#827470] hover:text-[#090100]'
          }`}
        >
          <span>Notifikasi Pesan WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'invoice' && (
        <InvoiceTemplateTab
          settings={settings}
          onChange={setSettings}
        />
      )}

      {activeTab === 'receipt' && (
        <ReceiptTemplateTab
          settings={settings}
          onChange={setSettings}
        />
      )}

      {activeTab === 'whatsapp' && (
        <WhatsAppGatewayTab
          settings={settings}
          currentKey={whatsappTemplateKey}
          onSelectKey={handleSwitchWhatsappTemplate}
          currentText={currentWhatsappText}
          onChangeText={setCurrentWhatsappText}
          onSendTest={handleSendTestWhatsapp}
        />
      )}

      {/* Bottom Floating/Sticky Save Strip */}
      <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-xl border border-[#d3c3be]/40 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#504440]">
          <span className="material-symbols-outlined text-[18px] text-[#855230]">info</span>
          <span>Perubahan berlaku otomatis pada generasi dokumen baru atelier.</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setSettings(defaultInvoiceSettings)}
          >
            Reset Default
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
