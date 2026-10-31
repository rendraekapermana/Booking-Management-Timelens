import React, { useState, useEffect } from "react";
import { formatIDR } from "../lib/formatters.js";
import MonthlyRevenueChart from "../components/reports/MonthlyRevenueChart.jsx";
import EventVolumeChart from "../components/reports/EventVolumeChart.jsx";
import { expenseService } from "../services/expenseService.js";
import { bookingService } from "../services/bookingService.js";
import { generateReportsExcel } from "../lib/excelExport.js";

export default function ReportsPage({ onShowToast }) {
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 STATE NAVIGASI KALENDER (PENGGANTI DROPDOWN)
  const [filterMode, setFilterMode] = useState("month"); // "all", "year", "month"
  const [currentDate, setCurrentDate] = useState(new Date()); // Waktu yang sedang dilihat

  // 🔥 FUNGSI EXPORT EXCEL (Memanggil dari lib eksternal)
  const handleExportExcel = () => {
    const reportData = {
      periodName: displayPeriod(),
      fileNameSuffix: getFilterString() || "AllTime",
      metrics: {
        totalEvents,
        completedEvents,
        upcomingPaidEvents,
        dpEvents,
        grossRevenue,
        totalHppTransferred,
        incomePocket,
        totalExpensesReal,
        operationalPocketBalance,
        finalNetProfit,
      },
    };
    generateReportsExcel(reportData, onShowToast);
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [bookingsData, expensesData] = await Promise.all([
        bookingService.getAll(),
        expenseService.getAll(),
      ]);
      setBookings(bookingsData || []);
      setExpenses(expensesData || []);
    } catch (error) {
      console.error("Gagal memuat data laporan:", error);
      if (onShowToast) onShowToast("Gagal memuat data laporan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // 🔥 FUNGSI NAVIGASI < SEBELUMNYA | SELANJUTNYA >
  const changePeriod = (offset) => {
    const newDate = new Date(currentDate);
    if (filterMode === "year") {
      newDate.setFullYear(newDate.getFullYear() + offset);
    } else if (filterMode === "month") {
      newDate.setMonth(newDate.getMonth() + offset);
    }
    setCurrentDate(newDate);
  };

  // Format Teks Periode Aktif
  const displayPeriod = () => {
    if (filterMode === "year") return currentDate.getFullYear();
    if (filterMode === "month") {
      return currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    }
    return "Semua Waktu";
  };

  // Generator String Filter (misal: "2026" atau "2026-10")
  const getFilterString = () => {
    if (filterMode === "all") return "";
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    return filterMode === "year" ? `${y}` : `${y}-${m}`;
  };

  const filterStr = getFilterString();

  // Filter Data Booking & Expense
  const filteredBookings =
    filterMode === "all"
      ? bookings
      : bookings.filter((b) => b.date && b.date.startsWith(filterStr));

  const filteredExpenses =
    filterMode === "all"
      ? expenses
      : expenses.filter((e) => e.date && e.date.startsWith(filterStr));

  // ============================================
  // 🔥 PARSER WAKTU & STATUS EVENT
  // ============================================
  const now = new Date();

  const getEventEndTime = (b) => {
    if (!b.date) return null;
    try {
      const dateParts = b.date.split("-");
      if (dateParts.length !== 3) return new Date(`${b.date}T23:59:59`);

      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      let hours = 23;
      let mins = 59;
      if (b.time && b.time.includes("-")) {
        const endTimePart = b.time.split("-")[1].trim();
        const timeParts = endTimePart.split(":");
        if (timeParts.length >= 2) {
          hours = parseInt(timeParts[0], 10);
          mins = parseInt(timeParts[1], 10);
        }
      }
      return new Date(year, month, day, hours, mins, 59);
    } catch (e) {
      return null;
    }
  };

  const processedBookings = filteredBookings.map((b) => {
    const endTime = getEventEndTime(b);
    const isPast = endTime ? now > endTime : false;
    return {
      ...b,
      isCompleted: b.status === "Fully Paid" && isPast,
      isUpcomingPaid: b.status === "Fully Paid" && !isPast,
      isDP: b.status === "Confirmed" || b.status === "Pending",
    };
  });

  const totalEvents = processedBookings.length;
  const completedEvents = processedBookings.filter((b) => b.isCompleted).length;
  const upcomingPaidEvents = processedBookings.filter(
    (b) => b.isUpcomingPaid,
  ).length;
  const dpEvents = processedBookings.filter((b) => b.isDP).length;

  // ============================================
  // 🔥 PERHITUNGAN KEUANGAN DUAL-POCKET
  // ============================================
  const grossRevenue = processedBookings.reduce(
    (sum, b) => sum + Number(b.totalPrice || 0),
    0,
  );
  const totalHppTransferred = processedBookings.reduce((sum, b) => {
    const hpp = b.hppAmount || b.hpp_amount || 0;
    return sum + Number(hpp);
  }, 0);

  const incomePocket = grossRevenue - totalHppTransferred;
  const totalExpensesReal = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0,
  );
  const operationalPocketBalance = totalHppTransferred - totalExpensesReal;
  const finalNetProfit = grossRevenue - totalExpensesReal;
  const profitMargin =
    grossRevenue > 0 ? ((finalNetProfit / grossRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-9 py-2 pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 pb-5 border-b border-[#e6e0d6]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold mt-1">
            Financial &amp; Event Reports
          </h1>
        </div>

        {/* 🔥 PANEL NAVIGASI KALENDER SCALABLE */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Toggle Mode: All / Tahun / Bulan */}
          <div className="flex items-center bg-[#ffffff] p-1 rounded-xl border border-[#d3c3be]/40 shadow-xs">
            {["all", "year", "month"].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterMode === mode
                    ? "bg-[#f6f3ee] text-[#855230]"
                    : "text-[#827470] hover:bg-[#faf7f2] hover:text-[#090100]"
                }`}
              >
                {mode === "all"
                  ? "All-Time"
                  : mode === "year"
                    ? "Tahunan"
                    : "Bulanan"}
              </button>
            ))}
          </div>

          {/* 2. Tombol Navigasi < Waktu > */}
          {filterMode !== "all" && (
            <div className="flex items-center gap-1 bg-[#ffffff] px-2 py-1.5 rounded-xl border border-[#d3c3be]/40 shadow-xs">
              <button
                onClick={() => changePeriod(-1)}
                className="p-1 text-[#827470] hover:text-[#090100] rounded-md hover:bg-[#f6f3ee] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>
              <span className="text-xs font-bold text-[#090100] min-w-[110px] text-center select-none uppercase tracking-wide">
                {displayPeriod()}
              </span>
              <button
                onClick={() => changePeriod(1)}
                className="p-1 text-[#827470] hover:text-[#090100] rounded-md hover:bg-[#f6f3ee] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          )}
          {/* 3. Tombol Export Excel */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d633b] hover:bg-[#224c2d] text-white text-xs font-semibold rounded-xl border border-[#2d633b] shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              table_view
            </span>
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-4xl text-[#855230] animate-spin mb-2">
            sync
          </span>
        </div>
      ) : (
        <>
          {/* SECTION 1: LAPORAN EVENT */}
          <section className="flex flex-col gap-6 bg-[#ffffff] p-7 md:p-8 rounded-2xl border border-[#ebe4da] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1ece4]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#f7f2ea] border border-[#e8dfd3] flex items-center justify-center text-[#2c1810]">
                  <span className="material-symbols-outlined text-[22px]">
                    photo_camera
                  </span>
                </div>
                <div>
                  <h2 className="text-xl text-[#090100] font-serif font-bold">
                    Laporan Event
                  </h2>
                  <p className="text-xs text-[#504440] mt-0.5">
                    Aktivitas jadwal, pemenuhan sesi, dan status pelunasan.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7f3ec] border border-[#e8e0d5] text-[#855230] font-mono text-xs rounded-full">
                  <span className="material-symbols-outlined text-[13px]">
                    verified
                  </span>
                  {totalEvents} Reservasi
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Total Event
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#855230]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#090100]">
                    {totalEvents}
                  </span>
                </div>
                <span className="text-[11px] text-[#504440] mt-1 font-mono">
                  {displayPeriod()}
                </span>
              </div>

              <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Tuntas Selesai
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#2c1810]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#090100]">
                    {completedEvents}
                  </span>
                  <span className="text-xs text-[#2c1810] font-semibold">
                    Sesi
                  </span>
                </div>
                <span className="text-[11px] text-[#504440] mt-1 font-mono">
                  Lunas &amp; Waktu Berlalu
                </span>
              </div>

              <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Siap Sesi (Upcoming)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#855230]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#090100]">
                    {upcomingPaidEvents}
                  </span>
                  <span className="text-xs text-[#855230] font-semibold">
                    Sesi
                  </span>
                </div>
                <span className="text-[11px] text-[#504440] mt-1 font-mono">
                  Lunas, Menunggu Hari-H
                </span>
              </div>

              <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    DP Terkonfirmasi
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#d3c3be]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#090100]">
                    {dpEvents}
                  </span>
                  <span className="text-xs text-[#827470] font-semibold">
                    Sesi
                  </span>
                </div>
                <span className="text-[11px] text-[#504440] mt-1 font-mono">
                  Masih Belum Lunas
                </span>
              </div>
            </div>

            <div className="p-6 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col gap-6 mt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#eee7dc]/80">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#090100] font-semibold">
                      Tren Volume Acara
                    </span>
                  </div>
                  <span className="text-xs text-[#504440] mt-0.5">
                    Komposisi penyelesaian pesanan
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#504440] bg-[#ffffff] px-3.5 py-2 rounded-xl border border-[#d3c3be]/40 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2c1810]"></span>
                    <span className="font-medium text-[11px]">Selesai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#855230]"></span>
                    <span className="font-medium text-[11px]">Upcoming</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d3c3be]"></span>
                    <span className="font-medium text-[11px]">DP/Pending</span>
                  </div>
                </div>
              </div>

              <EventVolumeChart bookings={processedBookings} />
            </div>
          </section>

          {/* SECTION 2: LAPORAN KEUANGAN DUAL-POCKET */}
          <section className="flex flex-col gap-6 bg-[#ffffff] p-7 md:p-8 rounded-2xl border border-[#ebe4da] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1ece4]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#f7f2ea] border border-[#e8dfd3] flex items-center justify-center text-[#2c1810]">
                  <span className="material-symbols-outlined text-[22px]">
                    account_balance_wallet
                  </span>
                </div>
                <div>
                  <h2 className="text-xl text-[#090100] font-serif font-bold">
                    Laporan Keuangan (Dual-Pocket)
                  </h2>
                  <p className="text-xs text-[#504440] mt-0.5">
                    Pemisahan alur uang bersih (Income Pocket) dan alokasi
                    beban/HPP (Operational Pocket).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
              <div className="p-6 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                    Pocket Income (Bersih)
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#2d633b] border border-[#d3c3be]/40 shadow-xs">
                    <span className="material-symbols-outlined text-[17px]">
                      savings
                    </span>
                  </div>
                </div>
                <span className="text-2xl lg:text-3xl text-[#090100] font-serif font-bold tracking-tight">
                  {formatIDR(incomePocket)}
                </span>
                <span className="text-[10px] text-[#827470] mt-2 font-mono leading-tight">
                  <span className="font-semibold text-[#090100]">Gross:</span>{" "}
                  {formatIDR(grossRevenue)} <br />
                  dikurangi <span className="text-[#ba1a1a]">Total HPP</span>
                </span>
              </div>

              <div
                className={`p-6 rounded-xl border flex flex-col justify-between ${operationalPocketBalance < 0 ? "bg-[#fef2f2] border-[#fecaca]" : "bg-[#faf7f2] border-[#eee7dc]"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] uppercase tracking-wider font-semibold ${operationalPocketBalance < 0 ? "text-[#ef4444]" : "text-[#504440]"}`}
                  >
                    Saldo Operational
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center border shadow-xs ${operationalPocketBalance < 0 ? "text-[#ef4444] border-[#fecaca]" : "text-[#855230] border-[#d3c3be]/40"}`}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      account_balance
                    </span>
                  </div>
                </div>
                <span
                  className={`text-2xl lg:text-3xl font-serif font-bold tracking-tight ${operationalPocketBalance < 0 ? "text-[#ef4444]" : "text-[#090100]"}`}
                >
                  {formatIDR(operationalPocketBalance)}
                </span>
                <span
                  className={`text-[10px] mt-2 font-mono leading-tight ${operationalPocketBalance < 0 ? "text-[#ef4444]" : "text-[#827470]"}`}
                >
                  <span className="font-semibold text-[#090100]">
                    Dana HPP:
                  </span>{" "}
                  {formatIDR(totalHppTransferred)} <br />
                  <span className="font-semibold text-[#ba1a1a]">
                    Beban Riil:
                  </span>{" "}
                  {formatIDR(totalExpensesReal)}
                </span>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#2c1810] via-[#24130d] to-[#1c0f0a] text-[#ffffff] rounded-xl shadow-md border border-[#523326]/60 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#ffdbc7] uppercase tracking-wider font-semibold">
                    Final Net Profit
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#febb90]/20 border border-[#febb90]/40 text-[#ffdbc7] text-[11px] font-mono font-medium">
                    Margin {profitMargin}%
                  </span>
                </div>
                <span className="text-2xl lg:text-3xl text-[#ffffff] font-serif font-bold tracking-tight">
                  {formatIDR(finalNetProfit)}
                </span>
                <span className="text-[11px] text-[#d3c3be] mt-2 font-mono">
                  Income + Sisa Ops Pocket
                </span>
              </div>
            </div>

            <div className="mt-2">
              <MonthlyRevenueChart
                bookings={processedBookings}
                expenses={filteredExpenses}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
