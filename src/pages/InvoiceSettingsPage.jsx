import React, { useState, useEffect } from "react";
import { defaultInvoiceSettings } from "../lib/mock/mockData.js";
import { invoiceSettingsService } from "../services/invoiceSettingsService.js";
import InvoiceTemplateTab from "../components/invoice/InvoiceTemplateTab.jsx";
import ReceiptTemplateTab from "../components/invoice/ReceiptTemplateTab.jsx";
import WhatsAppGatewayTab from "../components/invoice/WhatsAppGatewayTab.jsx";
import Button from "../components/ui/Button.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

export default function InvoiceSettingsPage({ onNavigate, onShowToast }) {
  const [activeTab, setActiveTab] = useState("invoice");
  const [settings, setSettings] = useState(defaultInvoiceSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappTemplateKey, setWhatsappTemplateKey] = useState("dp");
  const [currentWhatsappText, setCurrentWhatsappText] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const dbSettings = await invoiceSettingsService.getSettings();
        const merged = { ...defaultInvoiceSettings, ...dbSettings };
        setSettings(merged);
        setCurrentWhatsappText(
          merged.whatsappTemplates?.dp ||
            defaultInvoiceSettings.whatsappTemplates.dp,
        );
      } catch (error) {
        console.error("Gagal load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSwitchWhatsappTemplate = (newKey) => {
    const updatedTemplates = {
      ...settings.whatsappTemplates,
      [whatsappTemplateKey]: currentWhatsappText,
    };
    setSettings((prev) => ({
      ...prev,
      whatsappTemplates: updatedTemplates,
    }));
    setWhatsappTemplateKey(newKey);
    setCurrentWhatsappText(updatedTemplates[newKey] || "");
  };

  const handleWhatsappTextChange = (text) => {
    setCurrentWhatsappText(text);
    setSettings((prev) => ({
      ...prev,
      whatsappTemplates: {
        ...prev.whatsappTemplates,
        [whatsappTemplateKey]: text,
      },
    }));
  };

  const handleSave = async () => {
    try {
      if (onShowToast)
        onShowToast("Menyimpan pengaturan ke database...", "info");

      const payload = {
        ...settings,
        whatsappTemplates: {
          ...settings.whatsappTemplates,
          [whatsappTemplateKey]: currentWhatsappText,
        },
      };

      await invoiceSettingsService.saveSettings(payload);
      setSettings(payload);

      if (onShowToast) {
        onShowToast(
          "Pengaturan Invoice & Penagihan berhasil disimpan!",
          "success",
        );
      }
    } catch (error) {
      console.error("Error save settings:", error);
      if (onShowToast)
        onShowToast("Gagal menyimpan pengaturan ke database.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-[#855230]">
        <span className="material-symbols-outlined animate-spin text-3xl">
          sync
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-8 pb-20 pt-4">
      <PageHeader
        title="Pengaturan Invoice & Penagihan"
        description="Kelola identitas, format penomoran faktur & kwitansi, rekening pembayaran, klausul syarat & ketentuan, serta template notifikasi pesan WhatsApp."
        actions={
          <Button
            variant="secondary"
            icon="visibility"
            onClick={() => {
              const mockPreviewBooking = {
                id: "BK-PREVIEW-001",
                orderRef: "#TL-PREVIEW",
                eventName: "Sample Wedding Reception",
                customerName: "Ny. Amalia & Dimas Hartanto (Preview)",
                customerPhone: "+62 812-3344-5566",
                customerEmail: "preview@client.com",
                date: "2026-12-31",
                dateFormatted: "Kamis, 31 Desember 2026",
                time: "18:00 - 21:00",
                duration: "3 Jam",
                venueName: "The Glasshouse Ballroom",
                backdrop: "Velvet Walnut Noir",
                paperType: "Photostrip 2x6",
                frameDesign: "Custom Minimalist",
                totalPrice: 8500000,
                downPayment: 4250000,
                status: "Pending",
              };
              onNavigate("invoice-preview", mockPreviewBooking);
            }}
          >
            Pratinjau Dokumen Penuh
          </Button>
        }
      />

      <div className="flex border-b border-[#d3c3be]/40 gap-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("invoice")}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "invoice"
              ? "text-[#090100] border-b-2 border-[#855230]"
              : "text-[#827470] hover:text-[#090100]"
          }`}
        >
          Template Faktur / Invoice
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("receipt")}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "receipt"
              ? "text-[#090100] border-b-2 border-[#855230]"
              : "text-[#827470] hover:text-[#090100]"
          }`}
        >
          <span>Kwitansi Pelunasan Resmi</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#c7ecce] text-[#01210f]">
            Lunas
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`pb-3.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "whatsapp"
              ? "text-[#090100] border-b-2 border-[#855230]"
              : "text-[#827470] hover:text-[#090100]"
          }`}
        >
          <span>Notifikasi Pesan WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
        </button>
      </div>

      {activeTab === "invoice" && (
        <InvoiceTemplateTab settings={settings} onChange={setSettings} />
      )}
      {activeTab === "receipt" && (
        <ReceiptTemplateTab settings={settings} onChange={setSettings} />
      )}
      {activeTab === "whatsapp" && (
        <WhatsAppGatewayTab
          settings={settings}
          currentKey={whatsappTemplateKey}
          onSelectKey={handleSwitchWhatsappTemplate}
          currentText={currentWhatsappText}
          onChangeText={handleWhatsappTextChange}
          onSendTest={() =>
            onShowToast &&
            onShowToast("Pesan uji coba terkirim ke WhatsApp Concierge")
          }
        />
      )}

      <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-xl border border-[#d3c3be]/40 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#504440]">
          <span className="material-symbols-outlined text-[18px] text-[#855230]">
            info
          </span>
          <span>
            Perubahan berlaku otomatis pada generasi dokumen baru.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSettings(defaultInvoiceSettings);
              setCurrentWhatsappText(
                defaultInvoiceSettings.whatsappTemplates.dp,
              );
              if (onShowToast)
                onShowToast("Pengaturan dikembalikan ke default.", "info");
            }}
          >
            Reset Default
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
