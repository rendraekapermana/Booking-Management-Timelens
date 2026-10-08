/**
 * Invoice Settings Service Layer
 * Abstracts data access to enable clean future Supabase migration.
 */

import { defaultInvoiceSettings } from '../lib/mock/mockData.js';

let invoiceSettingsState = { ...defaultInvoiceSettings };

export const invoiceService = {
  getSettings: async () => {
    return Promise.resolve({ ...invoiceSettingsState });
  },

  updateSettings: async (newSettings) => {
    invoiceSettingsState = { ...invoiceSettingsState, ...newSettings };
    return Promise.resolve({ ...invoiceSettingsState });
  }
};
