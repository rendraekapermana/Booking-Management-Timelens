// src/services/calendarSync.js

export const syncBookingToGoogleCalendar = async (booking, accessToken) => {
  try {
    const status = (booking.status || "").toLowerCase();
    if (status !== "confirmed" && status !== "fully paid") return false;

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
      summary: `Atelier: ${booking.eventName || booking.displayTitle || "Event Studio"}`,
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

    // 🚀 3. TEMBAK API GOOGLE CALENDAR
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DETAIL ERROR DARI GOOGLE:", errorData);
      throw new Error(
        `Google API Error: ${errorData.error?.message || "Gagal membuat event"}`,
      );
    }

    const data = await response.json();
    console.log(
      "✅ Event BERHASIL dibuat di Google Calendar! Link:",
      data.htmlLink,
    );
    return true;
  } catch (error) {
    console.error("Auto-sync Google Calendar Error:", error.message);
    return false;
  }
};
