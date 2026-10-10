/**
 * Booking Service Layer
 * Fully synchronized with Supabase PostgreSQL
 */

import { supabase } from "../lib/supabase.js";

// --- HELPER MAPPING ---
const mapToUI = (dbItem) => ({
  id: dbItem.id,
  eventName: dbItem.service_type || "Event Booking",
  displayTitle: dbItem.service_type || "Event Booking",
  customerName: dbItem.customer_name || "Tanpa Nama",
  customerEmail: dbItem.customer_email || "client@example.com",
  customerPhone: dbItem.customer_phone || "-",
  date: dbItem.booking_date || "",
  dateFormatted: dbItem.booking_date || "",
  time: dbItem.time || "10:00 - 14:00",
  duration: dbItem.duration || "4 hours",

  // 🔥 PERBAIKAN ALAMAT DAN GMAPS LINK
  venueName: dbItem.venue_name || "-",
  venueMapsLink: dbItem.venue_maps_link || null,

  backdrop: dbItem.backdrop || "Standard",
  paperType: dbItem.paper_type || "Photostrip",
  frameDesign: dbItem.frame_design || "Dibuatkan oleh Timelens",
  totalPrice: dbItem.total_price || 0,
  downPayment: dbItem.down_payment || 0,
  remainingDue: (dbItem.total_price || 0) - (dbItem.down_payment || 0),
  status: dbItem.status || "Pending",
  uploadedFileName: dbItem.uploaded_file_name || null,

  // UI helper pendukung
  customerTitle: "Client • Primary Contact",
  paperSpecs: "Matte Cream Archival Foil Stamped Cards",
  isTodayActive: false,
  opsCount: 2,
  orderRef: `#TL-${dbItem.id ? String(dbItem.id).substring(0, 4) : "0000"}`,
});

const mapToDB = (uiItem) => ({
  service_type: uiItem.eventName || uiItem.service_type,
  customer_name: uiItem.customerName || uiItem.customer_name,
  customer_email:
    uiItem.clientEmail || uiItem.customerEmail || uiItem.customer_email,
  customer_phone:
    uiItem.clientPhone || uiItem.customerPhone || uiItem.customer_phone,
  booking_date: uiItem.eventDate || uiItem.date || uiItem.booking_date,
  time: uiItem.eventTime || uiItem.time || "-",
  duration: uiItem.duration || "-",

  // 🔥 PERBAIKAN PAYLOAD: venue_address dihapus, diganti venue_name dan venue_maps_link
  venue_name: uiItem.venueName || uiItem.venue_name || "-",
  venue_maps_link: uiItem.venueMapsLink || uiItem.venue_maps_link || null,

  backdrop: uiItem.backdrop || "-",
  paper_type: uiItem.paperType || uiItem.paper_type || "-",
  frame_design:
    uiItem.designFrame || uiItem.frameDesign || uiItem.frame_design || "-",
  total_price: uiItem.totalPrice || uiItem.total_price || 0,
  down_payment: uiItem.downPayment || uiItem.down_payment || 0,
  status: uiItem.status || "Pending",
  uploaded_file_name:
    uiItem.uploadedFileName || uiItem.uploaded_file_name || null,
});
// -----------------------------

export const fetchBookings = async () => {
  return await bookingService.getAll();
};

export const bookingService = {
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
    // 🔥 PERBAIKAN TYPO: Menghapus "xmlns =" yang sebelumnya ada di kodinganmu
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
