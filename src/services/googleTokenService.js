import { supabase } from "../lib/supabase.js";

const GOOGLE_ACCOUNTS_KEY = "googleAccounts";

const stripTokenFields = (account) => {
  const metadata = { ...account };
  delete metadata.accessToken;
  delete metadata.refreshToken;
  delete metadata.expiresAt;
  return metadata;
};

const googleTokenRequest = async (action, payload = {}) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session?.access_token) {
    throw new Error("Sesi login tidak tersedia. Login kembali lalu coba lagi.");
  }

  const response = await fetch("/api/google-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...payload }),
  });
  let result = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(
      result.error || `Permintaan Google Calendar gagal (${response.status}).`,
    );
  }
  return result;
};

const removeLegacyTokens = (email) => {
  let accounts;
  try {
    accounts = JSON.parse(localStorage.getItem(GOOGLE_ACCOUNTS_KEY) || "[]");
  } catch {
    throw new Error("Data akun Google di browser tidak dapat dibaca.");
  }
  if (!Array.isArray(accounts)) {
    throw new Error("Data akun Google di browser tidak valid.");
  }

  const sanitizedAccounts = accounts.map((account) => {
    if (account.email?.toLowerCase() !== email.toLowerCase()) return account;
    return stripTokenFields(account);
  });
  localStorage.setItem(
    GOOGLE_ACCOUNTS_KEY,
    JSON.stringify(sanitizedAccounts),
  );
};

export const storeGoogleAccountMetadata = (accounts) => {
  const metadata = accounts.map(stripTokenFields);
  let savedAccounts = [];
  try {
    const saved = JSON.parse(localStorage.getItem(GOOGLE_ACCOUNTS_KEY) || "[]");
    if (Array.isArray(saved)) savedAccounts = saved;
  } catch (error) {
    console.error("Data akun Google lama tidak dapat dibaca:", error);
  }

  for (const savedAccount of savedAccounts) {
    if (!savedAccount?.email || !savedAccount.refreshToken) continue;

    const existingIndex = metadata.findIndex(
      (account) =>
        account.email?.toLowerCase() === savedAccount.email.toLowerCase(),
    );
    const pendingLegacyAccount = {
      ...stripTokenFields(savedAccount),
      refreshToken: savedAccount.refreshToken,
    };

    if (existingIndex === -1) {
      metadata.push(pendingLegacyAccount);
    } else {
      metadata[existingIndex] = {
        ...metadata[existingIndex],
        refreshToken: savedAccount.refreshToken,
      };
    }
  }

  localStorage.setItem(GOOGLE_ACCOUNTS_KEY, JSON.stringify(metadata));
};

export const connectGoogleAccount = (code) =>
  googleTokenRequest("connect", { code });

export const migrateLegacyGoogleAccount = async (account) => {
  if (!account?.refreshToken || !account.email) return account;
  const result = await googleTokenRequest("migrate", {
    email: account.email,
    name: account.name,
    refresh_token: account.refreshToken,
  });
  removeLegacyTokens(account.email);
  return result.account;
};

export const listGoogleAccounts = async () => {
  const { accounts } = await loadGoogleAccounts();
  return accounts;
};

export const loadGoogleAccounts = async () => {
  let legacyAccounts = [];
  let migrationFailures = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(GOOGLE_ACCOUNTS_KEY) || "[]");
    if (Array.isArray(saved)) {
      legacyAccounts = saved;
    } else {
      migrationFailures += 1;
    }
  } catch (error) {
    console.error("Data akun Google lama tidak dapat dibaca:", error);
    migrationFailures += 1;
  }

  for (const account of legacyAccounts) {
    if (account.refreshToken) {
      try {
        await migrateLegacyGoogleAccount(account);
      } catch (error) {
        console.error(
          `Gagal memindahkan token akun ${account.email}:`,
          error,
        );
        migrationFailures += 1;
      }
    } else if (account.accessToken) {
      migrationFailures += 1;
    }
  }

  const result = await googleTokenRequest("list");
  const accounts = result.accounts || [];
  storeGoogleAccountMetadata(accounts);
  return { accounts, migrationFailures };
};

export const getGoogleAccessToken = async (email) => {
  const result = await googleTokenRequest("access-token", { email });
  if (!result.access_token) {
    throw new Error("Backend tidak mengembalikan access token Google.");
  }
  return result.access_token;
};

export const disconnectGoogleAccount = async (email) => {
  const result = await googleTokenRequest("disconnect", { email });
  removeLegacyTokens(email);
  return result;
};
