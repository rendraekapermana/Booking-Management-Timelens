import React from 'react';

/**
 * Event Volume Chart Component for Reports
 */
export default function EventVolumeChart() {
  return (
    <div className="relative w-full pt-4">
      <div className="flex items-stretch gap-4">
        <div className="flex flex-col justify-between items-end text-[10px] font-mono text-[#827470] pb-8 pt-2 select-none pr-1">
          <span>20 evt</span>
          <span>15 evt</span>
          <span>10 evt</span>
          <span>5 evt</span>
          <span>0 evt</span>
        </div>

        <div className="relative flex-1">
          {/* Horizontal Dashed Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-3">
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-[#ded7cd]"></div>
          </div>

          <div className="relative h-60 w-full grid grid-cols-4 items-end gap-3 md:gap-8 px-2 md:px-6 z-10">
            {/* Juli */}
            <div className="flex flex-col items-center gap-2.5 group">
              <div className="relative w-full max-w-[64px] h-48 flex items-end justify-center rounded-xl bg-[#ffffff]/60 p-1.5 border border-[#eee7dc]">
                <div className="w-full bg-[#2c1810] rounded-lg flex flex-col items-center justify-between py-2 shadow-xs" style={{ height: '40%' }}>
                  <span className="text-[11px] font-bold text-[#fcf9f4] font-mono">8</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center mt-1">
                <span className="font-mono text-xs font-semibold text-[#504440]">JULI</span>
                <span className="text-[10px] text-[#827470] font-mono">8 Sesi</span>
              </div>
            </div>

            {/* Agustus */}
            <div className="flex flex-col items-center gap-2.5 group">
              <div className="relative w-full max-w-[64px] h-48 flex items-end justify-center rounded-xl bg-[#ffffff]/60 p-1.5 border border-[#eee7dc]">
                <div className="w-full bg-[#2c1810] rounded-lg flex flex-col items-center justify-between py-2 shadow-xs" style={{ height: '55%' }}>
                  <span className="text-[11px] font-bold text-[#fcf9f4] font-mono">11</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center mt-1">
                <span className="font-mono text-xs font-semibold text-[#504440]">AGUSTUS</span>
                <span className="text-[10px] text-[#827470] font-mono">11 Sesi</span>
              </div>
            </div>

            {/* September */}
            <div className="flex flex-col items-center gap-2.5 group">
              <div className="relative w-full max-w-[64px] h-48 flex items-end justify-center rounded-xl bg-[#ffffff]/60 p-1.5 border border-[#eee7dc]">
                <div className="w-full bg-[#2c1810] rounded-lg flex flex-col items-center justify-between py-2 shadow-xs" style={{ height: '65%' }}>
                  <span className="text-[11px] font-bold text-[#fcf9f4] font-mono">13</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center mt-1">
                <span className="font-mono text-xs font-semibold text-[#504440]">SEPTEMBER</span>
                <span className="text-[10px] text-[#827470] font-mono">13 Sesi</span>
              </div>
            </div>

            {/* Oktober (Peak) */}
            <div className="flex flex-col items-center gap-2.5 group">
              <div className="px-2.5 py-0.5 bg-[#855230] text-[#fcf9f4] text-[10px] font-mono rounded-full shadow-xs font-semibold tracking-wide flex items-center gap-1.5 -mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#febb90] animate-pulse"></span>
                18 Event Aktif
              </div>
              <div className="relative w-full max-w-[80px] h-48 flex items-end justify-center gap-1.5 bg-[#f5efe7] rounded-xl p-1.5 border border-[#dfd4c6] ring-2 ring-[#855230]/25 shadow-xs">
                <div className="flex-1 bg-[#2c1810] rounded-lg flex flex-col items-center justify-start pt-2 shadow-xs" style={{ height: '70%' }} title="14 Terlaksana">
                  <span className="text-[11px] font-bold text-[#fcf9f4] font-mono">14</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#d3c3be] font-medium mt-0.5">Selesai</span>
                </div>
                <div className="flex-1 bg-[#855230] rounded-lg flex flex-col items-center justify-start pt-2 shadow-xs" style={{ height: '25%' }} title="4 DP Terkonfirmasi">
                  <span className="text-[11px] font-bold text-[#fcf9f4] font-mono">4</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#ffdbc7] font-medium mt-0.5">DP</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center mt-1">
                <span className="font-mono text-xs font-bold text-[#090100] flex items-center gap-1">
                  OKTOBER
                  <span className="material-symbols-outlined text-[13px] text-[#855230]">workspace_premium</span>
                </span>
                <span className="text-[10px] text-[#855230] font-semibold font-mono">Peak Atelier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
