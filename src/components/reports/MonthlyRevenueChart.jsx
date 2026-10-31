import React from "react";
import { formatIDR } from "../../lib/formatters.js";

export default function MonthlyRevenueChart({ bookings = [], expenses = [] }) {
  const allMonths = [
    ...new Set([
      ...bookings.map((b) => (b.date ? b.date.substring(0, 7) : "")),
      ...expenses.map((e) => (e.date ? e.date.substring(0, 7) : "")),
    ]),
  ]
    .filter(Boolean)
    .sort();

  if (allMonths.length === 0) {
    return (
      <div className="bg-[#fcf9f4] p-6 rounded-xl border border-[#ebe4da] text-center text-xs text-[#827470]">
        Belum ada data finansial untuk ditampilkan.
      </div>
    );
  }

  const chartData = allMonths.map((monthKey) => {
    const monthBookings = bookings.filter(
      (b) => b.date && b.date.startsWith(monthKey),
    );
    const monthExpenses = expenses.filter(
      (e) => e.date && e.date.startsWith(monthKey),
    );

    const revenue = monthBookings.reduce(
      (sum, b) => sum + Number(b.totalPrice || 0),
      0,
    );
    const exp = monthExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0,
    );
    const net = revenue - exp;

    const [year, month] = monthKey.split("-");
    const dateObj = new Date(year, month - 1);
    const monthName = dateObj.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

    return { monthKey, monthName, revenue, expenses: exp, net };
  });

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.revenue, d.expenses)),
    10000000,
  );

  const formatShortIDR = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}Rb`;
    return num;
  };

  return (
    <div className="bg-[#fcf9f4] p-6 rounded-xl border border-[#ebe4da] flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base text-[#090100] font-serif font-bold">
            Tren Finansial Bulanan
          </h3>
          <span className="text-xs text-[#504440] mt-0.5">
            Komparasi tren omzet kotor, beban operasional, dan laba bersih per
            bulan
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#504440] bg-[#ffffff] px-3.5 py-1.5 rounded-xl border border-[#d3c3be]/40 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2c1810]"></span>
            <span className="font-medium text-[#090100]">Pendapatan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cfc3b6]"></span>
            <span className="font-medium text-[#090100]">Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="relative w-full pt-4">
        <div className="flex items-stretch gap-4">
          <div className="flex flex-col justify-between items-end text-[10px] font-mono text-[#827470] pb-8 pt-2 select-none pr-1">
            <span>{formatShortIDR(maxVal)}</span>
            <span>{formatShortIDR(maxVal * 0.75)}</span>
            <span>{formatShortIDR(maxVal * 0.5)}</span>
            <span>{formatShortIDR(maxVal * 0.25)}</span>
            <span>0</span>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-3">
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-[#ded7cd]"></div>
            </div>

            <div
              className={`relative h-60 w-full grid items-end gap-3 md:gap-8 px-2 md:px-6 z-10`}
              style={{
                gridTemplateColumns: `repeat(${Math.max(chartData.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {chartData.map((item) => {
                const revHeight = Math.min(
                  100,
                  Math.max(15, (item.revenue / maxVal) * 100),
                );
                const expHeight = Math.min(
                  100,
                  Math.max(15, (item.expenses / maxVal) * 100),
                );

                return (
                  <div
                    key={item.monthKey}
                    className="flex flex-col items-center gap-2.5 group"
                  >
                    <div className="relative flex items-end justify-center gap-2 h-48 w-full max-w-[96px] rounded-xl px-2 pb-0 pt-2 bg-[#ffffff]/60 border border-[#eee7dc]">
                      {/* Bar Pendapatan (Angka di dalam dengan teks putih bersih) */}
                      <div
                        className="w-6 md:w-7 bg-[#2c1810] rounded-t-md flex flex-col items-center justify-start pt-1.5 shadow-xs overflow-hidden"
                        style={{ height: `${revHeight}%` }}
                        title={`Pendapatan: ${formatIDR(item.revenue)}`}
                      >
                        <span className="text-[8px] font-bold text-[#fcf9f4] font-mono [writing-mode:vertical-lr] select-none">
                          {formatShortIDR(item.revenue)}
                        </span>
                      </div>

                      {/* Bar Pengeluaran (Angka di dalam dengan warna kontras) */}
                      <div
                        className="w-6 md:w-7 bg-[#d3c3be] rounded-t-md flex flex-col items-center justify-start pt-1.5 shadow-xs overflow-hidden"
                        style={{ height: `${expHeight}%` }}
                        title={`Pengeluaran: ${formatIDR(item.expenses)}`}
                      >
                        <span className="text-[8px] font-bold text-[#090100] font-mono [writing-mode:vertical-lr] select-none">
                          {formatShortIDR(item.expenses)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center mt-1">
                      <span className="font-mono text-xs font-semibold text-[#504440]">
                        {item.monthName}
                      </span>
                      {/* 🔥 KONDISI WARNA NET: MERAH JIKA MINUS, HIJAU JIKA PLUS */}
                      <span
                        className={`text-[10px] font-mono font-bold ${item.net < 0 ? "text-[#ef4444]" : "text-[#2d633b]"}`}
                      >
                        Net: {formatIDR(item.net)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
