import React, { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService.js";
import { expenseService } from "../services/expenseService.js";
import { formatIDR } from "../lib/formatters.js";
import BookingSpecsCard from "../components/booking/BookingSpecsCard.jsx";
import PaymentLedger from "../components/booking/PaymentLedger.jsx";
import RecordPaymentModal from "../components/booking/RecordPaymentModal.jsx";
import Button from "../components/ui/Button.jsx";
// 🔥 IMPOR GOOGLE CALENDAR
import { syncBookingToGoogleCalendar } from "../services/calendarSync.js";

// --- SUB-KOMPONEN: Header Navigasi & Tombol Aksi ---
const DetailHeader = ({ booking, onNavigate, onOpenEdit, onOpenPayment }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
    <div className="flex flex-col gap-1">
      <nav className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="text-xs uppercase tracking-wider text-[#504440] hover:text-[#090100] transition-colors cursor-pointer"
        >
          Bookings
        </button>
        <span className="material-symbols-outlined text-[14px] text-[#827470]">
          chevron_right
        </span>
        <span className="text-xs uppercase tracking-wider text-[#855230] font-semibold">
          {booking.orderRef || booking.id}
        </span>
      </nav>
      <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
        {booking.displayTitle || booking.eventName}
      </h1>
    </div>
    <div className="flex items-center flex-wrap gap-2.5">
      <Button variant="secondary" size="sm" icon="edit" onClick={onOpenEdit}>
        Edit Booking
      </Button>
      <Button
        variant="secondary"
        size="sm"
        icon="download"
        onClick={() => onNavigate("invoice-preview", booking)}
      >
        Download Invoice
      </Button>
      {!booking.isProfitSharing && (
        <Button
          variant="primary"
          size="sm"
          icon="payments"
          onClick={onOpenPayment}
        >
          Record Payment
        </Button>
      )}
    </div>
  </div>
);

// --- SUB-KOMPONEN: Profil Event & Venue ---
const EventProfileCard = ({ booking, onStatusChange }) => (
  <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-6">
    <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] text-[#855230]">
          celebration
        </span>
        <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
          Event Profile &amp; Location
        </h2>
      </div>

      {/* DROPDOWN STATUS PENGGANTI BADGE */}
      <div className="relative inline-block">
        <select
          value={booking.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 border outline-none cursor-pointer appearance-none transition-colors shadow-xs ${
            booking.status === "Pending"
              ? "bg-[#fff8e6] text-[#b38a22] border-[#ffe4a0]"
              : booking.status === "Confirmed"
                ? "bg-[#eefcf2] text-[#22a04c] border-[#bbf2ce]"
                : booking.status === "Fully Paid"
                  ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                  : "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]"
          }`}
        >
          <option value="Pending" className="bg-white text-[#1c1c19]">
            Pending
          </option>
          <option value="Confirmed" className="bg-white text-[#1c1c19]">
            Confirmed
          </option>
          <option value="Fully Paid" className="bg-white text-[#1c1c19]">
            Fully Paid
          </option>
          <option value="Rejected" className="bg-white text-[#1c1c19]">
            Rejected
          </option>
        </select>
        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none opacity-60">
          expand_more
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Event Type
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              celebration
            </span>
            <span className="text-sm text-[#1c1c19] font-semibold">
              {booking.eventType || "-"}
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Event Date
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              calendar_today
            </span>
            <span className="text-base text-[#090100] font-bold">
              {booking.dateFormatted || booking.date}
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Operational Hours
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              schedule
            </span>
            <span className="text-sm text-[#1c1c19] font-semibold">
              {booking.time}
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Duration
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">
              timer
            </span>
            <span className="text-sm text-[#1c1c19] font-semibold">
              {booking.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
            Venue Name &amp; Address
          </span>
          <div className="flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#855230] mt-0.5">
              location_on
            </span>
            <span className="text-sm text-[#090100] font-bold block">
              {booking.venueName}
            </span>
          </div>
        </div>
        {booking.venueMapsLink ? (
          <a
            href={booking.venueMapsLink}
            target="_blank"
            rel="noreferrer"
            className="w-full h-32 rounded-lg bg-cover bg-center overflow-hidden shadow-inner border border-[#d3c3be]/40 relative flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer group"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')`,
            }}
          >
            <div className="bg-[#ffffff]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-[#855230] border border-[#d3c3be]/40 flex items-center gap-2 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px]">map</span>{" "}
              Buka di Google Maps
            </div>
          </a>
        ) : (
          <div className="w-full h-32 rounded-lg bg-[#f6f3ee] flex items-center justify-center border border-[#d3c3be]/40 border-dashed">
            <span className="text-xs text-[#827470]">
              Maps Link tidak tersedia
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- SUB-KOMPONEN: Profil Customer ---
const CustomerProfileCard = ({ booking }) => (
  <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-5">
    <div className="flex items-center justify-between pb-3 border-b border-[#d3c3be]/30">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[20px] text-[#855230]">
          person
        </span>
        <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
          Customer
        </h2>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#ffdbc7] flex items-center justify-center text-[#311300] font-serif font-bold text-xl shrink-0">
        {booking.customerName
          ?.split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("") || "T"}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xl text-[#090100] font-serif font-bold truncate">
          {booking.customerName}
        </span>
        <span className="text-xs text-[#504440]">
          {booking.customerTitle || "Client"}
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-2.5 pt-2">
      <a
        href={`https://wa.me/${booking.customerPhone?.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
      >
        <span className="material-symbols-outlined text-[18px] text-[#25D366]">
          forum
        </span>
        <span className="text-sm font-semibold">{booking.customerPhone}</span>
      </a>
      <a
        href={`mailto:${booking.customerEmail}`}
        className="flex items-center gap-3 p-3 bg-[#f6f3ee] hover:bg-[#ebe8e3] rounded-lg text-[#1c1c19] transition-colors border border-[#d3c3be]/20"
      >
        <span className="material-symbols-outlined text-[18px] text-[#855230]">
          mail
        </span>
        <span className="text-sm font-medium truncate">
          {booking.customerEmail}
        </span>
      </a>
    </div>
    {booking.uploadedFileName && (
      <a
        href={booking.uploadedFileName}
        target="_blank"
        rel="noreferrer"
        className="mt-2 w-full text-center text-xs font-semibold text-blue-600 hover:underline"
      >
        Lihat Bukti Transfer DP
      </a>
    )}
  </div>
);

const ProfitSharingCard = ({
  booking,
  expenses,
  isLoading,
  error,
  onAddExpense,
  onViewExpenses,
}) => {
  const grossRevenue = Number(booking.totalPrice) || 0;
  const receivedAmount = Number(booking.downPayment) || 0;
  const totalExpenses = expenses.reduce(
    (total, expense) => total + (Number(expense.amount) || 0),
    0,
  );
  const deductibleExpenses = expenses.reduce((total, expense) => {
    const deductFromProfit =
      expense.deduct_from_profit_sharing !== false &&
      expense.deductFromProfitSharing !== false;
    return total + (deductFromProfit ? Number(expense.amount) || 0 : 0);
  }, 0);
  const netProfit = grossRevenue - deductibleExpenses;
  const timelensPercentage = Number(booking.timelensProfitPercentage);
  const clientPercentage = Number(booking.clientProfitPercentage);
  const hasValidSplit =
    booking.timelensProfitPercentage !== null &&
    booking.timelensProfitPercentage !== undefined &&
    booking.clientProfitPercentage !== null &&
    booking.clientProfitPercentage !== undefined &&
    Number.isFinite(timelensPercentage) &&
    Number.isFinite(clientPercentage) &&
    timelensPercentage >= 0 &&
    timelensPercentage <= 100 &&
    clientPercentage >= 0 &&
    clientPercentage <= 100 &&
    Math.abs(timelensPercentage + clientPercentage - 100) < 0.01;

  return (
    <section className="bg-white rounded-xl p-6 shadow-xs border border-[#d3c3be]/30 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d3c3be]/30">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#855230]">
            account_balance
          </span>
          <h2 className="text-sm text-[#090100] uppercase tracking-wider font-bold">
            Ringkasan Bagi Hasil
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon="add"
            onClick={onAddExpense}
          >
            Catat Pengeluaran
          </Button>
          <Button
            variant="subtle"
            size="sm"
            icon="receipt_long"
            onClick={onViewExpenses}
          >
            Expenses
          </Button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#ba1a1a]"
        >
          Pengeluaran event gagal dimuat. Ringkasan bagi hasil belum dapat
          dihitung. Periksa koneksi dan pastikan migrasi database expense sudah
          diterapkan.
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-[#827470]">
          <span className="material-symbols-outlined animate-spin">sync</span>
          Memuat pengeluaran event...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div className="flex justify-between gap-4 py-3 border-b border-[#f0ede9]">
              <span className="text-sm text-[#504440]">
                Nilai total event
              </span>
              <span className="text-sm font-mono font-semibold text-[#090100]">
                {formatIDR(grossRevenue)}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-[#f0ede9]">
              <span className="text-sm text-[#504440]">
                Pembayaran diterima
              </span>
              <span className="text-sm font-mono font-semibold text-[#2d633b]">
                {formatIDR(receivedAmount)}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-[#f0ede9]">
              <span className="text-sm text-[#504440]">
                Total pengeluaran event
              </span>
              <span className="text-sm font-mono font-semibold text-[#090100]">
                {formatIDR(totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-[#f0ede9]">
              <span className="text-sm text-[#504440]">
                Pengeluaran yang mengurangi laba
              </span>
              <span className="text-sm font-mono font-semibold text-[#ba1a1a]">
                - {formatIDR(deductibleExpenses)}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-[#f6f3ee] p-4 flex justify-between items-center gap-4">
            <div>
              <span className="block text-xs text-[#855230] uppercase tracking-wider font-bold">
                Laba / (rugi) bersih
              </span>
              <span className="text-[11px] text-[#827470]">
                Nilai total event dikurangi pengeluaran yang dipilih.
              </span>
            </div>
            <span className="text-xl font-serif font-bold text-[#090100] whitespace-nowrap">
              {formatIDR(netProfit)}
            </span>
          </div>

          {hasValidSplit ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#d3c3be]/40 p-4">
                <span className="block text-xs text-[#504440]">
                  Bagian Timelens ({timelensPercentage}%)
                </span>
                <span className="mt-1 block text-lg font-mono font-bold text-[#090100]">
                  {formatIDR((netProfit * timelensPercentage) / 100)}
                </span>
              </div>
              <div className="rounded-lg border border-[#d3c3be]/40 p-4">
                <span className="block text-xs text-[#504440]">
                  Bagian Klien ({clientPercentage}%)
                </span>
                <span className="mt-1 block text-lg font-mono font-bold text-[#090100]">
                  {formatIDR((netProfit * clientPercentage) / 100)}
                </span>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-[#ffe4a0] bg-[#fff8e6] p-3 text-xs text-[#855230]">
              Persentase bagi hasil belum valid. Atur bagian Timelens dan
              Klien agar totalnya 100% melalui Edit Booking.
            </p>
          )}

          <div className="border-t border-[#f0ede9] pt-4">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#855230]">
              Rincian pengeluaran event
            </h3>
            {expenses.length > 0 ? (
              <div className="divide-y divide-[#f0ede9]">
                {expenses.map((expense) => {
                  const deductFromProfit =
                    expense.deduct_from_profit_sharing !== false &&
                    expense.deductFromProfitSharing !== false;
                  return (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center gap-4 py-2.5"
                    >
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#090100]">
                          {expense.description || expense.category}
                        </span>
                        <span className="text-[11px] text-[#827470]">
                          {expense.dateFormatted || expense.date} ·{" "}
                          {expense.category}
                          {deductFromProfit
                            ? " · Mengurangi laba"
                            : " · Tidak mengurangi laba"}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-mono font-semibold text-[#090100]">
                        {formatIDR(expense.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#827470]">
                Belum ada pengeluaran yang ditautkan ke event ini.
              </p>
            )}
            {expenses.length === 0 && (
              <p className="mt-1 text-[11px] text-[#827470]">
                Jika pengeluaran lama belum muncul, buka Expenses, edit
                pengeluaran tersebut, lalu pilih ulang event ini untuk
                menautkannya.
              </p>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-[#827470]">
            Perhitungan memakai nilai total booking; pembayaran diterima hanya
            ditampilkan sebagai informasi. HPP/modal tidak ditambahkan terpisah
            agar tidak terhitung ganda—catat biaya tersebut di Expenses jika
            ingin menguranginya.
          </p>
        </>
      )}
    </section>
  );
};

// --- KOMPONEN UTAMA ---
export default function BookingDetailPage(props) {
  const passedBooking = props.booking || props.initialBooking;
  const passedId = props.bookingId || props.id || passedBooking?.id;

  const [booking, setBooking] = useState(passedBooking || null);
  const [isLoading, setIsLoading] = useState(
    !passedBooking && Boolean(passedId),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [profitSharingExpenses, setProfitSharingExpenses] = useState([]);
  const [isLoadingProfitExpenses, setIsLoadingProfitExpenses] = useState(false);
  const [profitExpenseError, setProfitExpenseError] = useState(false);

  useEffect(() => {
    if (passedBooking) {
      setBooking(passedBooking);
      setEditData({
        eventName: passedBooking.eventName || "",
        customerName: passedBooking.customerName || "",
        customerPhone: passedBooking.customerPhone || "",
        customerEmail: passedBooking.customerEmail || "",
        date: passedBooking.date || "",
        time: passedBooking.time || "",
        duration: passedBooking.duration || "4 hours",
        venueName: passedBooking.venueName || "",
        venueMapsLink: passedBooking.venueMapsLink || "",
        backdrop: passedBooking.backdrop || "Standard",
        paperType: passedBooking.paperType || "Photostrip",
        frameDesign: passedBooking.frameDesign || "-",
        totalPrice: passedBooking.totalPrice || 0,
        downPayment: passedBooking.downPayment || 0,
        status: passedBooking.status || "Pending",
        uploadedFileName: passedBooking.uploadedFileName || null,
        hppAmount: passedBooking.hppAmount || passedBooking.hpp_amount || 0,
        isProfitSharing: passedBooking.isProfitSharing === true,
        timelensProfitPercentage:
          passedBooking.timelensProfitPercentage ?? "",
        clientProfitPercentage: passedBooking.clientProfitPercentage ?? "",
      });
      setIsLoading(false);
      return;
    }

    const fetchBooking = async () => {
      if (!passedId) return;
      setIsLoading(true);
      try {
        const data = await bookingService.getById(passedId);
        setBooking(data);
        setEditData({
          eventName: data.eventName || "",
          customerName: data.customerName || "",
          customerPhone: data.customerPhone || "",
          customerEmail: data.customerEmail || "",
          date: data.date || "",
          time: data.time || "",
          duration: data.duration || "4 hours",
          venueName: data.venueName || "",
          venueMapsLink: data.venueMapsLink || "",
          backdrop: data.backdrop || "Standard",
          paperType: data.paperType || "Photostrip",
          frameDesign: data.frameDesign || "-",
          totalPrice: data.totalPrice || 0,
          downPayment: data.downPayment || 0,
          status: data.status || "Pending",
          uploadedFileName: data.uploadedFileName || null,
          hppAmount: data.hppAmount || data.hpp_amount || 0,
          isProfitSharing: data.isProfitSharing === true,
          timelensProfitPercentage: data.timelensProfitPercentage ?? "",
          clientProfitPercentage: data.clientProfitPercentage ?? "",
        });
      } catch (error) {
        if (props.onShowToast)
          props.onShowToast("Gagal memuat detail pesanan", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [passedId, passedBooking]);

  useEffect(() => {
    if (!booking?.id || !booking.isProfitSharing) {
      setProfitSharingExpenses([]);
      setProfitExpenseError(false);
      setIsLoadingProfitExpenses(false);
      return;
    }

    let isCurrentRequest = true;
    setIsLoadingProfitExpenses(true);
    setProfitExpenseError(false);

    expenseService
      .getByBookingId(booking.id)
      .then((expenses) => {
        if (isCurrentRequest) setProfitSharingExpenses(expenses);
      })
      .catch((error) => {
        console.error("Gagal memuat pengeluaran untuk bagi hasil:", error);
        if (isCurrentRequest) {
          setProfitSharingExpenses([]);
          setProfitExpenseError(true);
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoadingProfitExpenses(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [booking?.id, booking?.isProfitSharing]);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const timelensProfitPercentage = Number(
      editData.timelensProfitPercentage,
    );
    const clientProfitPercentage = Number(editData.clientProfitPercentage);
    if (
      editData.isProfitSharing &&
      (editData.timelensProfitPercentage === "" ||
        editData.clientProfitPercentage === "" ||
        timelensProfitPercentage < 0 ||
        timelensProfitPercentage > 100 ||
        clientProfitPercentage < 0 ||
        clientProfitPercentage > 100 ||
        Math.abs(timelensProfitPercentage + clientProfitPercentage - 100) >
          0.01)
    ) {
      if (props.onShowToast)
        props.onShowToast(
          "Persentase Timelens dan client harus berjumlah 100%",
          "error",
        );
      return;
    }

    try {
      const payload = {
        ...booking,
        ...editData,
        hppAmount: Number(editData.hppAmount || 0),
        totalPrice: Number(editData.totalPrice || 0),
        timelensProfitPercentage: editData.isProfitSharing
          ? timelensProfitPercentage
          : null,
        clientProfitPercentage: editData.isProfitSharing
          ? clientProfitPercentage
          : null,
        id: booking.id,
      };
      const updatedData = await bookingService.update(payload);
      setBooking(updatedData);
      if (props.onUpdateBooking) props.onUpdateBooking(updatedData);
      setIsEditing(false);
      if (props.onShowToast)
        props.onShowToast("Detail booking berhasil diperbarui");
    } catch (error) {
      if (props.onShowToast)
        props.onShowToast("Gagal memperbarui data", "error");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const payload = { ...booking, status: newStatus };
      const updatedData = await bookingService.update(payload);
      setBooking(updatedData);
      if (props.onUpdateBooking) props.onUpdateBooking(updatedData);

      if (newStatus === "Confirmed" || newStatus === "Fully Paid") {
        const syncResult = await syncBookingToGoogleCalendar(updatedData);
        if (props.onShowToast) {
          if (syncResult.error) {
            props.onShowToast(
              `Status diperbarui, tetapi sinkronisasi gagal: ${syncResult.error}`,
              "error",
            );
          } else if (syncResult.migrationFailures > 0) {
            props.onShowToast(
              "Status diperbarui, tetapi sebagian akun Google lama perlu dihubungkan ulang.",
              "error",
            );
          } else if (syncResult.failedCount > 0) {
            props.onShowToast(
              `Status diperbarui, tetapi sinkronisasi gagal untuk ${syncResult.failedCount} akun Google.`,
              "error",
            );
          } else if (syncResult.accountCount > 0) {
            props.onShowToast(
              `Status: ${newStatus}. Jadwal masuk ke Kalender!`,
              "success",
            );
          } else {
            props.onShowToast(
              `Status diperbarui menjadi ${newStatus}. Belum ada akun Google yang terhubung.`,
              "success",
            );
          }
        } else {
          if (props.onShowToast)
            props.onShowToast(`Status diperbarui menjadi ${newStatus}`);
        }
      } else {
        if (props.onShowToast)
          props.onShowToast(`Status diperbarui menjadi ${newStatus}`);
      }
    } catch (error) {
      if (props.onShowToast)
        props.onShowToast("Gagal memperbarui status", "error");
    }
  };

  const handleRecordPayment = async (amt) => {
    try {
      const updatedData = await bookingService.recordPayment(booking.id, amt);
      setBooking(updatedData);
      if (props.onUpdateBooking) props.onUpdateBooking(updatedData);
      setShowPaymentModal(false);
      if (props.onShowToast)
        props.onShowToast(`Pembayaran ${formatIDR(amt)} berhasil dicatat`);
    } catch (error) {
      if (props.onShowToast)
        props.onShowToast("Gagal mencatat pembayaran", "error");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-[#855230] animate-spin">
          sync
        </span>
      </div>
    );
  if (!booking)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <p className="text-sm text-[#504440]">Data booking tidak ditemukan.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => props.onNavigate?.("dashboard")}
        >
          Kembali
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pt-2">
      <DetailHeader
        booking={booking}
        onNavigate={props.onNavigate}
        onOpenEdit={() => setIsEditing(true)}
        onOpenPayment={() => setShowPaymentModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <EventProfileCard
            booking={booking}
            onStatusChange={handleStatusChange}
          />
          <BookingSpecsCard booking={booking} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <CustomerProfileCard booking={booking} />
          {!booking.isProfitSharing && (
            <PaymentLedger
              booking={booking}
              onOpenRecordPayment={() => setShowPaymentModal(true)}
            />
          )}
        </div>
      </div>

      {booking.isProfitSharing && (
        <ProfitSharingCard
          booking={booking}
          expenses={profitSharingExpenses}
          isLoading={isLoadingProfitExpenses}
          error={profitExpenseError}
          onAddExpense={() => props.onNavigate("add-expense", booking)}
          onViewExpenses={() => props.onNavigate("expenses")}
        />
      )}

      {!booking.isProfitSharing && (
        <RecordPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={booking}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {/* 🔥 MODAL EDIT YANG SUDAH DIRAPIKAN BERDASARKAN SEGMEN */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-[#090100]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative border border-[#d3c3be]/40">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0ede9]">
              <h3 className="text-xl font-serif font-bold text-[#090100]">
                Edit Booking Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-[#504440] hover:text-[#090100] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-2"
            >
              {/* --- 1. GENERAL & LOCATION --- */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#855230] uppercase tracking-wider border-b border-[#f0ede9] pb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">
                    event
                  </span>{" "}
                  General & Location
                </h4>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={editData.eventName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, eventName: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editData.date || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Time
                    </label>
                    <input
                      type="text"
                      value={editData.time || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, time: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Venue Name &amp; Address
                  </label>
                  <input
                    type="text"
                    value={editData.venueName || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, venueName: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>
              </div>

              {/* --- 2. CUSTOMER PROFILE --- */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#855230] uppercase tracking-wider border-b border-[#f0ede9] pb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">
                    person
                  </span>{" "}
                  Customer Profile
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={editData.customerName || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editData.customerPhone || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          customerPhone: e.target.value,
                        })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                </div>
              </div>

              {/* --- 3. PHOTOBOOTH CONFIG & FINANCIALS (TERMASUK HPP) --- */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#855230] uppercase tracking-wider border-b border-[#f0ede9] pb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">
                    tune
                  </span>{" "}
                  Photobooth Config & Financials
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Backdrop
                    </label>
                    <input
                      type="text"
                      value={editData.backdrop || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, backdrop: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#504440]">
                      Paper Type
                    </label>
                    <input
                      type="text"
                      value={editData.paperType || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, paperType: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#504440]">
                    Frame Design
                  </label>
                  <input
                    type="text"
                    value={editData.frameDesign || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, frameDesign: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#f6f3ee] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                  />
                </div>

                {/* Box Khusus Uang & Modal (HPP & Omzet saling berdampingan) */}
                {editData.isProfitSharing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-[#fcf9f4] p-3 rounded-lg border border-[#ebe4da]">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#855230]">
                        Bagian Timelens (%)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        value={editData.timelensProfitPercentage}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            timelensProfitPercentage: e.target.value,
                          })
                        }
                        className="w-full p-2.5 text-xs bg-[#ffffff] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#855230]">
                        Bagian Client (%)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        value={editData.clientProfitPercentage}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            clientProfitPercentage: e.target.value,
                          })
                        }
                        className="w-full p-2.5 text-xs bg-[#ffffff] rounded-lg border border-[#d3c3be]/40 text-[#090100]"
                      />
                    </div>
                    <span className="col-span-full text-[10px] text-[#827470]">
                      Total pembagian harus 100%.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-[#fcf9f4] p-3 rounded-lg border border-[#ebe4da]">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#2d633b]">
                      Total Omzet / Gross (Rp)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-mono font-bold text-[#2d633b]">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={editData.totalPrice || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            totalPrice: e.target.value,
                          })
                        }
                        className="w-full pl-9 p-2 text-xs bg-[#ffffff] rounded-lg border border-[#bbf2ce] text-[#090100] font-mono font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#ba1a1a]">
                      HPP / Modal Event (Rp)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-mono font-bold text-[#ba1a1a]">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={editData.hppAmount || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            hppAmount: e.target.value,
                          })
                        }
                        className="w-full pl-9 p-2 text-xs bg-[#ffffff] rounded-lg border border-[#fecaca] text-[#090100] font-mono font-semibold"
                      />
                    </div>
                  </div>
                  <div className="col-span-full pt-1">
                    <span className="text-[10px] text-[#827470] leading-tight block">
                      * <strong>Total Omzet</strong> = Harga jual paket ke
                      klien.
                      <br />* <strong>HPP</strong> = Perkiraan modal print/crew
                      event (Akan masuk ke <i>Operational Pocket</i>).
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede9]">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
