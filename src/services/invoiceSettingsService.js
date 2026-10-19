import { supabase } from "../lib/supabase";
import { defaultInvoiceSettings } from "../lib/mock/mockData.js";

export const invoiceSettingsService = {
  // Ambil pengaturan dari Supabase
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("setting_value")
        .eq("setting_key", "invoice_config")
        .maybeSingle();

      if (error) {
        console.warn(
          "Gagal mengambil data dari Supabase, menggunakan default:",
          error.message,
        );
        return defaultInvoiceSettings;
      }

      if (data && data.setting_value) {
        return { ...defaultInvoiceSettings, ...data.setting_value };
      }

      return defaultInvoiceSettings;
    } catch (err) {
      console.error("Error getSettings:", err);
      return defaultInvoiceSettings;
    }
  },

  // Simpan pengaturan ke Supabase
  async saveSettings(settingsObj) {
    const { data, error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "invoice_config",
          setting_value: settingsObj,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" },
      )
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }
    return data;
  },
};
