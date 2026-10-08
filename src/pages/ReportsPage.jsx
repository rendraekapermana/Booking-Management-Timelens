import React, { useState } from 'react';
import { formatIDR } from '../lib/formatters.js';
import MonthlyRevenueChart from '../components/reports/MonthlyRevenueChart.jsx';
import EventVolumeChart from '../components/reports/EventVolumeChart.jsx';

export default function ReportsPage({ onShowToast }) {
  const [selectedMonth] = useState('Oktober 2024');

  const handleExportPDF = () => {
    window.print();
    onShowToast('Preparing Executive Financial & Operations Report PDF...');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-9 py-2 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-[#e6e0d6]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#855230]/10 border border-[#855230]/20 text-[#855230] text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#855230] animate-pulse"></span>
              TIMELENS ARCHIVE
            </span>
            <span className="text-xs text-[#827470] font-mono">/</span>
            <span className="font-mono text-xs text-[#504440] uppercase tracking-wider">
              Laporan Bulanan
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold mt-1">
            Executive Reports &amp; Ringkasan
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#ffffff] rounded-xl text-[#1c1c19] text-xs font-semibold border border-[#d3c3be]/40 shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-[#855230]">calendar_today</span>
            <span>{selectedMonth}</span>
            <span className="material-symbols-outlined text-[16px] text-[#827470]">expand_more</span>
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffffff] hover:bg-[#f6f3ee] text-[#090100] text-xs font-semibold rounded-xl border border-[#d3c3be]/40 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#855230]">download</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LAPORAN EVENT */}
      <section className="flex flex-col gap-6 bg-[#ffffff] p-7 md:p-8 rounded-2xl border border-[#ebe4da] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1ece4]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#f7f2ea] border border-[#e8dfd3] flex items-center justify-center text-[#2c1810]">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </div>
            <div>
              <h2 className="text-xl text-[#090100] font-serif font-bold">Laporan Event</h2>
              <p className="text-xs text-[#504440] mt-0.5">
                Aktivitas jadwal, durasi operasional, dan pemenuhan sesi photobooth.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7f3ec] border border-[#e8e0d5] text-[#855230] font-mono text-xs rounded-full">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              18 Reservasi Terdata
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">Total Event</span>
              <span className="w-2 h-2 rounded-full bg-[#855230]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#090100]">18</span>
              <span className="text-xs text-[#855230] font-semibold">+28% MoM</span>
            </div>
            <span className="text-[11px] text-[#504440] mt-1 font-mono">Bulan Oktober 2024</span>
          </div>

          <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">Event Selesai</span>
              <span className="w-2 h-2 rounded-full bg-[#2d633b]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#090100]">14</span>
              <span className="text-xs text-[#2d633b] font-semibold">78% Tuntas</span>
            </div>
            <span className="text-[11px] text-[#504440] mt-1 font-mono">Pelunasan Lunas</span>
          </div>

          <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">DP Terkonfirmasi</span>
              <span className="w-2 h-2 rounded-full bg-[#855230]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#090100]">4</span>
              <span className="text-xs text-[#855230] font-semibold">22% Siap Sesi</span>
            </div>
            <span className="text-[11px] text-[#504440] mt-1 font-mono">Akhir Pekan Depan</span>
          </div>

          <div className="p-5 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">Total Jam Booth</span>
              <span className="w-2 h-2 rounded-full bg-[#2c1810]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#090100]">68</span>
              <span className="text-xs text-[#504440] font-semibold">Jam Aktif</span>
            </div>
            <span className="text-[11px] text-[#504440] mt-1 font-mono">Avg 3.8 jam/event</span>
          </div>
        </div>

        {/* Volume Trend Section */}
        <div className="p-6 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#eee7dc]/80">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#090100] font-semibold">Tren Volume Acara</span>
                <span className="px-2 py-0.5 rounded-full bg-[#855230]/10 text-[#855230] text-[11px] font-mono font-medium">
                  Peak Season
                </span>
              </div>
              <span className="text-xs text-[#504440] mt-0.5">
                Volume kumulatif sesi photobooth terselesaikan vs status DP (Jul – Okt 2024)
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs text-[#504440] bg-[#ffffff] px-3.5 py-1.5 rounded-xl border border-[#d3c3be]/40 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2c1810]"></span>
                <span className="font-medium text-[#090100]">Sesi Terlaksana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#855230]"></span>
                <span className="font-medium text-[#090100]">DP / Terjadwal</span>
              </div>
            </div>
          </div>

          <EventVolumeChart />
        </div>
      </section>

      {/* SECTION 2: LAPORAN KEUANGAN */}
      <section className="flex flex-col gap-6 bg-[#ffffff] p-7 md:p-8 rounded-2xl border border-[#ebe4da] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1ece4]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#f7f2ea] border border-[#e8dfd3] flex items-center justify-center text-[#2c1810]">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-xl text-[#090100] font-serif font-bold">Laporan Keuangan</h2>
              <p className="text-xs text-[#504440] mt-0.5">
                Ringkasan pemasukan kotor, realisasi pengeluaran, dan net margin atelier.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7f3ec] border border-[#e8e0d5] text-[#855230] font-mono text-xs rounded-full">
              <span className="material-symbols-outlined text-[13px]">receipt</span>
              Ledger ID: #FIN-2024-10
            </span>
          </div>
        </div>

        {/* 3 Financial Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
          <div className="p-6 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">Pendapatan (Gross)</span>
              <div className="w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#855230] border border-[#d3c3be]/40">
                <span className="material-symbols-outlined text-[17px]">trending_up</span>
              </div>
            </div>
            <span className="text-2xl lg:text-3xl text-[#090100] font-serif font-bold tracking-tight">
              {formatIDR(32500000)}
            </span>
          </div>

          <div className="p-6 bg-[#faf7f2] rounded-xl border border-[#eee7dc] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">Pengeluaran (Expenses)</span>
              <div className="w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#504440] border border-[#d3c3be]/40">
                <span className="material-symbols-outlined text-[17px]">payments</span>
              </div>
            </div>
            <span className="text-2xl lg:text-3xl text-[#090100] font-serif font-bold tracking-tight">
              {formatIDR(4850000)}
            </span>
          </div>

          <div className="p-6 bg-gradient-to-br from-[#2c1810] via-[#24130d] to-[#1c0f0a] text-[#ffffff] rounded-xl shadow-md border border-[#523326]/60 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#ffdbc7] uppercase tracking-wider font-semibold">Laba Bersih (Net Profit)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#febb90]/20 border border-[#febb90]/40 text-[#ffdbc7] text-[11px] font-mono font-medium">
                Margin 85.1%
              </span>
            </div>
            <span className="text-2xl lg:text-3xl text-[#ffffff] font-serif font-bold tracking-tight">
              {formatIDR(27650000)}
            </span>
          </div>
        </div>

        {/* Financial Comparison Chart */}
        <MonthlyRevenueChart />
      </section>
    </div>
  );
}
