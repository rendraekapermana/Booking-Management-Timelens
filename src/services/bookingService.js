import { supabase } from "../lib/supabase.js";

// --- HELPER MAPPING ---
const mapToUI = (dbItem) => ({
  id: dbItem.id,
  eventName: dbItem.service_type || "Event Booking",
  displayTitle: dbItem.service_type || "Event Booking",
  eventType: dbItem.event_type || "",
  customerName: dbItem.customer_name || "Tanpa Nama",
  customerEmail: dbItem.customer_email || "client@example.com",
  customerPhone: dbItem.customer_phone || "-",
  date: dbItem.booking_date || "",
  dateFormatted: dbItem.booking_date || "",
  time: dbItem.time || "10:00 - 14:00",
  duration: dbItem.duration || "4 hours",

  // Venue & GMaps
  venueName: dbItem.venue_name || "-",
  venueMapsLink: dbItem.venue_maps_link || null,

  backdrop: dbItem.backdrop || "Standard",
  paperType: dbItem.paper_type || "Photostrip",
  frameDesign: dbItem.frame_design || "Dibuatkan oleh Timelens",
  totalPrice: dbItem.total_price || 0,
  downPayment: dbItem.down_payment || 0,
  isProfitSharing: dbItem.is_profit_sharing === true,
  timelensProfitPercentage:
    dbItem.timelens_profit_percentage === null ||
    dbItem.timelens_profit_percentage === undefined
      ? null
      : Number(dbItem.timelens_profit_percentage),
  clientProfitPercentage:
    dbItem.client_profit_percentage === null ||
    dbItem.client_profit_percentage === undefined
      ? null
      : Number(dbItem.client_profit_percentage),

  // 🔥 MAPPING HPP / MODAL EVENT
  hppAmount: dbItem.hpp_amount || 0,

  remainingDue: (dbItem.total_price || 0) - (dbItem.down_payment || 0),
  status: dbItem.status || "Pending",
  uploadedFileName: dbItem.uploaded_file_name || null,

  // UI helper pendukung
  customerTitle: "Client",
  paperSpecs: "Matte Cream Archival Foil Stamped Cards",
  isTodayActive: false,
  opsCount: 2,
  orderRef: `#TL-${dbItem.id ? String(dbItem.id).substring(0, 4) : "0000"}`,
});

const mapToDB = (uiItem) => ({
  service_type: uiItem.eventName || uiItem.service_type,
  event_type: uiItem.eventType || uiItem.event_type || null,
  customer_name: uiItem.customerName || uiItem.customer_name,
  customer_email:
    uiItem.clientEmail || uiItem.customerEmail || uiItem.customer_email,
  customer_phone:
    uiItem.clientPhone || uiItem.customerPhone || uiItem.customer_phone,
  booking_date: uiItem.eventDate || uiItem.date || uiItem.booking_date,
  time: uiItem.eventTime || uiItem.time || "-",
  duration: uiItem.duration || "-",

  venue_name: uiItem.venueName || uiItem.venue_name || "-",
  venue_maps_link: uiItem.venueMapsLink || uiItem.venue_maps_link || null,

  backdrop: uiItem.backdrop || "-",
  paper_type: uiItem.paperType || uiItem.paper_type || "-",
  frame_design:
    uiItem.designFrame || uiItem.frameDesign || uiItem.frame_design || "-",
  total_price: uiItem.totalPrice || uiItem.total_price || 0,
  down_payment: uiItem.downPayment || uiItem.down_payment || 0,
  is_profit_sharing:
    uiItem.isProfitSharing === true || uiItem.is_profit_sharing === true,
  timelens_profit_percentage:
    uiItem.isProfitSharing === true || uiItem.is_profit_sharing === true
      ? Number(uiItem.timelensProfitPercentage)
      : null,
  client_profit_percentage:
    uiItem.isProfitSharing === true || uiItem.is_profit_sharing === true
      ? Number(uiItem.clientProfitPercentage)
      : null,

  // 🔥 MAPPING HPP KE KOLOM DATABASE (Pastikan kolom hpp_amount ada di Supabase, atau biarkan kosong jika pakai migrasi on-the-fly)
  hpp_amount:
    uiItem.hppAmount !== undefined ? uiItem.hppAmount : uiItem.hpp_amount || 0,

  status: uiItem.status || "Pending",
  uploaded_file_name:
    uiItem.uploadedFileName || uiItem.uploaded_file_name || null,
});
// -----------------------------

export const fetchBookings = async () => {
  return await bookingService.getAll();
};

export const bookingService = {
  getExpenseEventOptions: async (search = "") => {
    let query = supabase
      .from("bookings")
      .select("id, service_type, customer_name, venue_name, booking_date");

    const normalizedSearch = search.trim();
    if (normalizedSearch.length >= 2) {
      query = query.ilike("service_type", `%${normalizedSearch}%`);
    } else {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      const firstDayAfterNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        1,
      );
      const toDateString = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      query = query
        .gte("booking_date", toDateString(firstDayOfMonth))
        .lt("booking_date", toDateString(firstDayAfterNextMonth));
    }

    const { data, error } = await query
      .order("booking_date", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Gagal mengambil pilihan event untuk pengeluaran:", error);
      throw error;
    }

    return (data || []).map((booking) => ({
      id: booking.id,
      eventName: booking.service_type || "Event Booking",
      customerName: booking.customer_name || "Tanpa Nama",
      venueName: booking.venue_name || "-",
      date: booking.booking_date || "",
    }));
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
      return [];
    }
    return data.map(mapToUI);
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Gagal mengambil data booking ${id}:`, error.message);
      return null;
    }
    return mapToUI(data);
  },

  create: async (newBooking) => {
    const { data, error } = await supabase
      .from("bookings")
      .insert([mapToDB(newBooking)])
      .select()
      .single();

    if (error) {
      console.error("Gagal membuat booking:", error.message);
      throw error;
    }
    return mapToUI(data);
  },

  update: async (updated) => {
    const { data, error } = await supabase
      .from("bookings")
      .update(mapToDB(updated))
      .eq("id", updated.id)
      .select()
      .single();

    if (error) {
      console.error("Gagal update booking:", error.message);
      throw error;
    }
    return mapToUI(data);
  },

  recordPayment: async (bookingId, amount) => {
    const booking = await bookingService.getById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const newPaid = (booking.downPayment || 0) + amount;
    const newRemaining = Math.max(0, (booking.totalPrice || 0) - newPaid);
    const newStatus = newRemaining === 0 ? "Fully Paid" : booking.status;

    const { data, error } = await supabase
      .from("bookings")
      .update({
        down_payment: newPaid,
        status: newStatus,
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("Gagal mencatat pembayaran:", error.message);
      throw error;
    }

    return mapToUI(data);
  },
};
