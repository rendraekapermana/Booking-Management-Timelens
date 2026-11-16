// src/services/calendarSync.js

import {
  getGoogleAccessToken,
  loadGoogleAccounts,
} from "./googleTokenService.js";

export const syncBookingToGoogleCalendar = async (booking) => {
  try {
    const status = (booking.status || "").toLowerCase();
    if (status !== "confirmed" && status !== "fully paid") {
      return {
        success: true,
        skipped: true,
        accountCount: 0,
        failedCount: 0,
        migrationFailures: 0,
      };
    }

    // 🕒 1. PEMBERSIH FORMAT TANGGAL (Memaksa jadi YYYY-MM-DD)
    const rawDate = booking.date || booking.eventDate || new Date();
    const d = new Date(rawDate);

    let safeDate;
    if (isNaN(d.getTime())) {
      // Fallback jika format tanggal di database gagal dibaca sistem
      const today = new Date();
      safeDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    } else {
      safeDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    // 🕒 2. PEMBERSIH FORMAT WAKTU (Memaksa jadi HH:mm:00)
    const timeString = booking.time || booking.eventTime || "";
    let startH = "10",
      startM = "00";
    let endH = "14",
      endM = "00"; // Default 4 Jam

    // Ekstrak hanya angka dari string jam (Misal: "10.30 - 14.00" -> ["10", "30", "14", "00"])
    const timeNumbers = timeString.match(/\d{1,2}/g);
    if (timeNumbers && timeNumbers.length >= 2) {
      startH = timeNumbers[0].padStart(2, "0");
      startM = timeNumbers[1].padStart(2, "0");

      if (timeNumbers.length >= 4) {
        endH = timeNumbers[2].padStart(2, "0");
        endM = timeNumbers[3].padStart(2, "0");
      } else {
        // Jika tidak ada jam selesai (misal cm diisi "10:00"), otomatis tambah 4 jam
        let e = parseInt(startH) + 4;
        endH = String(e > 23 ? 23 : e).padStart(2, "0");
        endM = startM;
      }
    }

    const start_time = `${safeDate}T${startH}:${startM}:00+07:00`; // +07:00 adalah Zona Waktu WIB
    const end_time = `${safeDate}T${endH}:${endM}:00+07:00`;

    const formatIDR = (amount) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount || 0);

    const event = {
      summary: `${booking.eventName || booking.displayTitle || "Event Studio"}`,
      location: booking.venueName || booking.venueAddress || "-",
      description:
        `=== Info Klien ===\n` +
        `Klien: ${booking.customerName || "-"}\n` +
        `No HP: ${booking.customerPhone || "-"}\n` +
        `Status: ${booking.status || "-"}\n\n` +
        `=== Detail Paket ===\n` +
        `Backdrop: ${booking.backdrop || "-"}\n` +
        `Paper Type: ${booking.paperType || "-"}\n` +
        `Design Frame: ${booking.frameDesign || "-"}\n\n` +
        `=== Pembayaran ===\n` +
        `Total Harga: ${formatIDR(booking.totalPrice)}\n` +
        `Down Payment (DP): ${formatIDR(booking.downPayment)}`,
      start: { dateTime: start_time },
      end: { dateTime: end_time },
    };

    const { accounts, migrationFailures } = await loadGoogleAccounts();
    const results = await Promise.all(
      accounts.map(async (account) => {
        try {
          let accessToken = await getGoogleAccessToken(account.email);
          const calendarUrl =
            "https://www.googleapis.com/calendar/v3/calendars/primary/events";
          const sendEvent = () =>
            fetch(calendarUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(event),
            });
          let response = await sendEvent();

          if (response.status === 401) {
            accessToken = await getGoogleAccessToken(account.email);
            response = await sendEvent();
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error?.message || "Gagal membuat event kalender.",
            );
          }

          const data = await response.json();
          console.log(
            `✅ Event berhasil disinkronkan ke ${account.email}:`,
            data.htmlLink,
          );
          return { success: true };
        } catch (error) {
          console.error(
            `Auto-sync Google Calendar gagal untuk ${account.email}:`,
            error.message,
          );
          return { success: false };
        }
      }),
    );

    const failedCount = results.filter((result) => !result.success).length;
    return {
      success: accounts.length > 0 && failedCount === 0,
      accountCount: accounts.length,
      failedCount,
      migrationFailures,
    };
  } catch (error) {
    console.error("Auto-sync Google Calendar Error:", error.message);
    return {
      success: false,
      accountCount: 0,
      failedCount: 0,
      migrationFailures: 0,
      error: error.message,
    };
  }
};
