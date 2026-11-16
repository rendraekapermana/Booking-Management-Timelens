import { createDecipheriv, createCipheriv, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const TABLE_NAME = "google_calendar_credentials";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const getEncryptionKey = () => {
  const key = Buffer.from(
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || "",
    "base64",
  );
  if (key.length !== 32) {
    throw new ApiError(
      500,
      "Konfigurasi enkripsi token Google belum valid.",
    );
  }
  return key;
};

const encryptRefreshToken = (token) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
};

const decryptRefreshToken = (value) => {
  const [version, encodedIv, encodedTag, encodedCiphertext] =
    String(value || "").split(".");
  if (version !== "v1" || !encodedIv || !encodedTag || !encodedCiphertext) {
    throw new ApiError(500, "Format refresh token tersimpan tidak valid.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encodedIv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(encodedTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
};

const getAuthenticatedClient = async (req) => {
  const authorization = req.headers.authorization || "";
  const accessToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new ApiError(401, "Sesi login diperlukan.");

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new ApiError(500, "Konfigurasi autentikasi backend belum lengkap.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) throw new ApiError(401, "Sesi login tidak valid.");

  return { supabase, user: data.user };
};

const googleClientId =
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const exchangeGoogleToken = async (params) => {
  if (!googleClientId || !googleClientSecret) {
    throw new ApiError(500, "Konfigurasi OAuth Google di backend belum lengkap.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      ...params,
    }).toString(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      400,
      data.error_description || data.error || "Google menolak permintaan token.",
    );
  }
  return data;
};

const getGoogleUserInfo = async (accessToken) => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.email) {
    throw new ApiError(
      400,
      data.error?.message || "Profil akun Google tidak dapat dibaca.",
    );
  }
  return data;
};

const getCredential = async (supabase, userId, email) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("user_id, email, display_name, encrypted_refresh_token")
    .eq("user_id", userId)
    .eq("email", email)
    .maybeSingle();

  if (error) throw new ApiError(500, "Gagal membaca koneksi Google Calendar.");
  return data;
};

const saveCredential = async (
  supabase,
  userId,
  email,
  displayName,
  encryptedRefreshToken,
) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        user_id: userId,
        email,
        display_name: displayName || email,
        encrypted_refresh_token: encryptedRefreshToken,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,email" },
    )
    .select("email, display_name")
    .single();

  if (error) throw new ApiError(500, "Gagal menyimpan koneksi Google Calendar.");
  return {
    id: data.email,
    email: data.email,
    name: data.display_name,
    role: "Primary Calendar",
  };
};

const connectAccount = async (supabase, user, code) => {
  if (!code) throw new ApiError(400, "Kode otorisasi Google diperlukan.");
  const tokens = await exchangeGoogleToken({
    code,
    grant_type: "authorization_code",
    redirect_uri: "postmessage",
  });
  if (!tokens.access_token) {
    throw new ApiError(400, "Google tidak mengembalikan access token.");
  }

  const userInfo = await getGoogleUserInfo(tokens.access_token);
  const email = userInfo.email.toLowerCase();
  const existing = await getCredential(supabase, user.id, email);
  const refreshToken =
    tokens.refresh_token ||
    (existing
      ? decryptRefreshToken(existing.encrypted_refresh_token)
      : null);
  if (!refreshToken) {
    throw new ApiError(
      400,
      "Google tidak memberikan refresh token. Cabut akses aplikasi di akun Google lalu hubungkan kembali.",
    );
  }

  const account = await saveCredential(
    supabase,
    user.id,
    email,
    userInfo.name,
    encryptRefreshToken(refreshToken),
  );
  return { account };
};

const migrateLegacyAccount = async (supabase, user, body) => {
  const email = String(body.email || "").trim().toLowerCase();
  const refreshToken = String(body.refresh_token || "");
  if (!email || !refreshToken) {
    throw new ApiError(400, "Email dan refresh token lama diperlukan.");
  }

  const tokens = await exchangeGoogleToken({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  if (!tokens.access_token) {
    throw new ApiError(400, "Refresh token lama tidak dapat digunakan.");
  }

  const userInfo = await getGoogleUserInfo(tokens.access_token);
  if (userInfo.email.toLowerCase() !== email) {
    throw new ApiError(
      403,
      "Email akun tidak cocok dengan refresh token yang akan dipindahkan.",
    );
  }

  const account = await saveCredential(
    supabase,
    user.id,
    email,
    body.name || userInfo.name,
    encryptRefreshToken(tokens.refresh_token || refreshToken),
  );
  return { account };
};

const listAccounts = async (supabase, userId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("email, display_name")
    .eq("user_id", userId)
    .order("email");

  if (error) throw new ApiError(500, "Gagal memuat akun Google Calendar.");
  return {
    accounts: (data || []).map((account) => ({
      id: account.email,
      email: account.email,
      name: account.display_name,
      role: "Primary Calendar",
    })),
  };
};

const getAccessToken = async (supabase, userId, email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) throw new ApiError(400, "Email akun Google diperlukan.");

  const credential = await getCredential(supabase, userId, normalizedEmail);
  if (!credential) {
    throw new ApiError(404, "Koneksi akun Google tidak ditemukan.");
  }

  const refreshToken = decryptRefreshToken(
    credential.encrypted_refresh_token,
  );
  const tokens = await exchangeGoogleToken({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  if (!tokens.access_token) {
    throw new ApiError(400, "Google tidak mengembalikan access token baru.");
  }

  if (tokens.refresh_token) {
    await saveCredential(
      supabase,
      userId,
      normalizedEmail,
      credential.display_name,
      encryptRefreshToken(tokens.refresh_token),
    );
  }

  return {
    access_token: tokens.access_token,
    expires_in: tokens.expires_in,
  };
};

const disconnectAccount = async (supabase, userId, email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) throw new ApiError(400, "Email akun Google diperlukan.");

  const credential = await getCredential(supabase, userId, normalizedEmail);
  if (!credential) return { success: true, revoked: false };

  const refreshToken = decryptRefreshToken(
    credential.encrypted_refresh_token,
  );
  let revoked = false;
  try {
    const response = await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: refreshToken }).toString(),
    });
    revoked = response.ok;
  } catch (error) {
    console.error("Gagal mencabut token Google:", error.message);
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("user_id", userId)
    .eq("email", normalizedEmail);
  if (error) {
    throw new ApiError(500, "Gagal menghapus koneksi Google Calendar.");
  }
  return { success: true, revoked };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { supabase, user } = await getAuthenticatedClient(req);
    const body = req.body || {};
    let result;

    switch (body.action) {
      case "connect":
        result = await connectAccount(supabase, user, body.code);
        break;
      case "migrate":
        result = await migrateLegacyAccount(supabase, user, body);
        break;
      case "list":
        result = await listAccounts(supabase, user.id);
        break;
      case "access-token":
        result = await getAccessToken(supabase, user.id, body.email);
        break;
      case "disconnect":
        result = await disconnectAccount(supabase, user.id, body.email);
        break;
      default:
        throw new ApiError(400, "Aksi Google Calendar tidak dikenal.");
    }

    return res.status(200).json(result);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    if (status >= 500) console.error("Google token API error:", error.message);
    return res.status(status).json({
      error:
        error instanceof ApiError
          ? error.message
          : "Terjadi kesalahan pada layanan Google Calendar.",
    });
  }
}
