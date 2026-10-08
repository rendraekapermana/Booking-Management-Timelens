import React from 'react';
import { monthlyReportsData } from '../../lib/mock/mockData.js';

export default function MonthlyRevenueChart() {
  return (
    <div className="bg-[#fcf9f4] p-6 rounded-xl border border-[#ebe4da] flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base text-[#090100] font-serif font-bold">
            Tren Finansial Bulanan Atelier
          </h3>
          <span className="text-xs text-[#504440] mt-0.5">
            Komparasi tren omzet kotor, beban operasional, dan laba bersih (Juli – Oktober)
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
          <div className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-[#2d633b]"></span>
            <span className="font-medium text-[#2d633b]">Net Margin</span>
          </div>
        </div>
      </div>

      <div className="relative w-full pt-4">
        <div className="flex items-stretch gap-4">
          <div className="flex flex-col justify-between items-end text-[10px] font-mono text-[#827470] pb-8 pt-2 select-none pr-1">
            <span>35 Jt</span>
            <span>25 Jt</span>
            <span>15 Jt</span>
            <span>5 Jt</span>
            <span>0 Jt</span>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-3">
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
              <div className="w-full border-b border-[#ded7cd]"></div>
            </div>

            <div className="relative h-60 w-full grid grid-cols-4 items-end gap-3 md:gap-8 px-2 md:px-6 z-10">
              {monthlyReportsData.map((item) => (
                <div key={item.month} className="flex flex-col items-center gap-2.5 group">
                  <div
                    className={`relative flex items-end justify-center gap-2 h-48 w-full max-w-[96px] rounded-xl px-2 pb-0 pt-2 border ${
                      item.isPeak
                        ? 'bg-[#f5efe7] border-[#dfd4c6] ring-2 ring-[#855230]/25 shadow-xs'
                        : 'bg-[#ffffff]/60 border-[#eee7dc]'
                    }`}
                  >
                    <div
                      className="w-6 md:w-7 bg-[#2c1810] rounded-t-md flex flex-col items-center justify-start pt-1.5 shadow-xs"
                      style={{ height: `${(item.revenue / 35000000) * 100}%` }}
                    >
                      <span className="text-[9px] font-bold text-[#fcf9f4] font-mono">
                        {item.revenueShort}
                      </span>
                    </div>

                    <div
                      className="w-6 md:w-7 bg-[#cfc3b6] rounded-t-md flex flex-col items-center justify-start pt-1.5 shadow-xs"
                      style={{ height: `${(item.expenses / 35000000) * 100}%` }}
                    >
                      <span className="text-[9px] font-bold text-[#090100] font-mono">
                        {item.expenseShort}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center mt-1">
                    <span className="font-mono text-xs font-semibold text-[#504440] flex items-center gap-1">
                      {item.month}
                      {item.isPeak && (
                        <span className="material-symbols-outlined text-[13px] text-[#855230]">
                          trending_up
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        item.isPeak ? 'text-[#855230]' : 'text-[#2d633b]'
                      }`}
                    >
                      Net: {item.netShort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
