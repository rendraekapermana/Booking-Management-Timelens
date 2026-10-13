import React from "react";

export default function EventVolumeChart({ bookings = [] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#827470]">
        Belum ada data event untuk ditampilkan pada periode ini.
      </div>
    );
  }

  // ➔ PENGELOMPOKAN DATA 3 LAPIS
  const monthlyMap = {};
  bookings.forEach((b) => {
    if (!b.date) return;
    const monthKey = b.date.substring(0, 7);
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        total: 0,
        completed: 0,
        upcoming: 0,
        dp: 0,
        monthKey,
      };
    }

    monthlyMap[monthKey].total += 1;

    // Status berdasarkan properti cerdas yang kita buat di ReportsPage
    if (b.isCompleted) {
      monthlyMap[monthKey].completed += 1;
    } else if (b.isUpcomingPaid) {
      monthlyMap[monthKey].upcoming += 1;
    } else if (b.isDP) {
      monthlyMap[monthKey].dp += 1;
    }
  });

  const chartData = Object.values(monthlyMap).sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey),
  );

  const formatMonthLabel = (yyyyMM) => {
    const [year, month] = yyyyMM.split("-");
    const date = new Date(year, month - 1);
    return date
      .toLocaleDateString("id-ID", { month: "short", year: "numeric" })
      .toUpperCase();
  };

  const maxEvents = Math.max(...chartData.map((d) => d.total), 5);

  return (
    <div className="relative w-full pt-4">
      <div className="flex items-stretch gap-4">
        {/* Y-AXIS */}
        <div className="flex flex-col justify-between items-end text-[10px] font-mono text-[#827470] pb-8 pt-2 select-none pr-1">
          <span>{maxEvents}</span>
          <span>{Math.round(maxEvents * 0.75)}</span>
          <span>{Math.round(maxEvents * 0.5)}</span>
          <span>{Math.round(maxEvents * 0.25)}</span>
          <span>0</span>
        </div>

        <div className="relative flex-1">
          {/* Garis Horizontal Latar Belakang */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-3">
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-dashed border-[#e6dfd5]"></div>
            <div className="w-full border-b border-[#ded7cd]"></div>
          </div>

          {/* Grafik 3 Lapis (Stacked Bar) */}
          <div
            className={`relative h-64 w-full grid items-end gap-3 md:gap-8 px-2 md:px-6 z-10`}
            style={{
              gridTemplateColumns: `repeat(${Math.max(chartData.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {chartData.map((item) => {
              const completedPct =
                item.total > 0 ? (item.completed / item.total) * 100 : 0;
              const upcomingPct =
                item.total > 0 ? (item.upcoming / item.total) * 100 : 0;
              const dpPct = item.total > 0 ? (item.dp / item.total) * 100 : 0;

              return (
                <div
                  key={item.monthKey}
                  className="flex flex-col items-center gap-2.5 group h-full justify-end"
                >
                  {/* Badge Total Angka Di Atas Batang */}
                  <div className="px-2 py-0.5 bg-[#ffffff] text-[#090100] border border-[#d3c3be] text-[10px] font-mono rounded-md shadow-xs font-bold flex items-center gap-1 -mb-1 z-20">
                    {item.total}
                  </div>

                  {/* Tiang Grafik - Flex Column Reverse Agar Tertumpuk */}
                  <div className="relative w-full max-w-[70px] h-48 flex flex-col justify-end bg-[#f5efe7] rounded-xl p-1 border border-[#dfd4c6] shadow-xs gap-0.5 overflow-hidden">
                    {/* 3. Lapis Paling Atas: DP / Belum Lunas (Krem Terang) */}
                    {item.dp > 0 && (
                      <div
                        className="w-full bg-[#d3c3be] rounded flex flex-col items-center justify-center transition-all min-h-[16px]"
                        style={{ height: `${dpPct}%` }}
                        title={`${item.dp} DP / Pending`}
                      >
                        {dpPct > 15 && (
                          <span className="text-[10px] font-bold text-[#090100] font-mono">
                            {item.dp}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 2. Lapis Tengah: Siap Sesi / Upcoming Lunas (Coklat Sedang) */}
                    {item.upcoming > 0 && (
                      <div
                        className="w-full bg-[#855230] rounded flex flex-col items-center justify-center transition-all min-h-[16px]"
                        style={{ height: `${upcomingPct}%` }}
                        title={`${item.upcoming} Siap Sesi / Upcoming`}
                      >
                        {upcomingPct > 15 && (
                          <span className="text-[10px] font-bold text-[#fcf9f4] font-mono">
                            {item.upcoming}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 1. Lapis Bawah: Selesai (Coklat Gelap) */}
                    {item.completed > 0 && (
                      <div
                        className="w-full bg-[#2c1810] rounded flex flex-col items-center justify-center transition-all min-h-[16px]"
                        style={{ height: `${completedPct}%` }}
                        title={`${item.completed} Tuntas Selesai`}
                      >
                        {completedPct > 15 && (
                          <span className="text-[10px] font-bold text-[#fcf9f4] font-mono">
                            {item.completed}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center text-center mt-1">
                    <span className="font-mono text-[11px] font-bold text-[#090100]">
                      {formatMonthLabel(item.monthKey)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
