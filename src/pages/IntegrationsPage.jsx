import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export default function IntegrationsPage({ onShowToast }) {
  // Ambil token dan email yang tersimpan di browser agar tidak hilang saat direfresh
  const [connectedAccounts, setConnectedAccounts] = useState(() => {
    const saved = localStorage.getItem("googleAccounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // 🔥 State isConnecting ditambahkan kembali di sini
  const [isConnecting, setIsConnecting] = useState(false);

  // Simpan ke local storage tiap kali akun bertambah/berkurang
  useEffect(() => {
    localStorage.setItem("googleAccounts", JSON.stringify(connectedAccounts));
  }, [connectedAccounts]);

  // Logika Asli Popup Login Google
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.events", // Minta izin akses edit kalender
    onSuccess: async (tokenResponse) => {
      try {
        // Ambil info email pengguna dari token yang didapat
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoRes.json();

        const newAccount = {
          id: Date.now(),
          email: userInfo.email,
          name: userInfo.name || "Admin Studio",
          role: "Primary Calendar",
          accessToken: tokenResponse.access_token, // Simpan token untuk dipakai Auto-Sync
        };

        setConnectedAccounts([...connectedAccounts, newAccount]);
        if (onShowToast)
          onShowToast(
            `Akun ${userInfo.email} berhasil dihubungkan!`,
            "success",
          );
      } catch (err) {
        if (onShowToast)
          onShowToast("Gagal mengambil info akun Google.", "error");
      } finally {
        setIsConnecting(false); // Matikan loading
      }
    },
    onError: () => {
      setIsConnecting(false); // Matikan loading jika dibatalkan/error
      if (onShowToast) onShowToast("Login Google dibatalkan/gagal.", "error");
    },
  });

  const handleConnectGoogle = () => {
    setIsConnecting(true); // Nyalakan efek loading
    login(); // Panggil popup google login
  };

  const handleDisconnect = (id, email) => {
    setConnectedAccounts(connectedAccounts.filter((acc) => acc.id !== id));
    if (onShowToast)
      onShowToast(`Akun ${email} berhasil diputuskan.`, "success");
  };

  const toggleAutoSync = () => {
    setAutoSyncEnabled(!autoSyncEnabled);
    if (onShowToast) {
      onShowToast(
        !autoSyncEnabled
          ? "Auto-Sync diaktifkan. Event Confirmed akan otomatis masuk ke kalender."
          : "Auto-Sync dimatikan sementara.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Header Halaman */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#855230]"></span>
          <span className="text-[11px] uppercase tracking-widest text-[#855230] font-semibold">
            System Settings
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
          Integrations &amp; Automation
        </h1>
        <p className="text-sm text-[#504440] mt-1">
          Kelola koneksi aplikasi pihak ketiga dan atur alur kerja otomatisasi
          studio.
        </p>
      </div>

      {/* Google Calendar Section */}
      <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#d3c3be]/40 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[#d3c3be]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] flex items-center justify-center text-[#855230] shrink-0 border border-[#d3c3be]/30">
              <span className="material-symbols-outlined text-[24px]">
                event_sync
              </span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl text-[#090100] font-serif font-bold">
                Google Calendar Auto-Sync
              </h2>
              <p className="text-sm text-[#504440] mt-1 max-w-lg leading-relaxed">
                Setiap event dengan status <strong>Confirmed</strong> atau{" "}
                <strong>Fully Paid</strong> akan otomatis dibuatkan jadwalnya di
                kalender seluruh akun Google yang terhubung di bawah ini.
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3 bg-[#f6f3ee] py-2 px-4 rounded-xl border border-[#d3c3be]/30 shrink-0">
            <span className="text-xs font-semibold text-[#1c1c19]">
              {autoSyncEnabled ? "Active" : "Paused"}
            </span>
            <button
              type="button"
              onClick={toggleAutoSync}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoSyncEnabled ? "bg-[#855230]" : "bg-[#d3c3be]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#ffffff] absolute top-1 transition-transform ${
                  autoSyncEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Daftar Akun Terhubung */}
        <div className="p-6 md:p-8 bg-[#fcf9f4]/30 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1c1c19] uppercase tracking-wider">
              Connected Accounts ({connectedAccounts.length})
            </h3>
          </div>

          {connectedAccounts.length === 0 ? (
            <div className="text-center py-8 bg-[#ffffff] rounded-xl border border-dashed border-[#d3c3be]">
              <span className="material-symbols-outlined text-[32px] text-[#d3c3be] mb-2">
                cloud_off
              </span>
              <p className="text-sm text-[#504440] font-medium">
                Belum ada akun Google Calendar yang terhubung.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {connectedAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#ffffff] rounded-xl border border-[#d3c3be]/40 shadow-xs gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f6f3ee] flex items-center justify-center text-[#2c1810] font-bold text-sm border border-[#d3c3be]/40">
                      {acc.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#090100]">
                        {acc.name}
                      </span>
                      <span className="text-xs text-[#504440]">
                        {acc.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest font-semibold bg-[#e5e2dd] text-[#504440] px-2.5 py-1 rounded-md">
                      {acc.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDisconnect(acc.id, acc.email)}
                      className="text-xs font-semibold text-[#827470] hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tombol Tambah Akun */}
          <button
            type="button"
            onClick={handleConnectGoogle}
            disabled={isConnecting}
            className="mt-2 w-full sm:w-auto self-start inline-flex items-center gap-2 px-5 py-2.5 bg-[#ffffff] hover:bg-[#f6f3ee] text-[#090100] text-sm font-semibold rounded-xl border border-[#d3c3be] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="w-4 h-4"
            />
            <span>
              {isConnecting ? "Connecting..." : "Connect New Google Account"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
