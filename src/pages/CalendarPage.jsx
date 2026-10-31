import React, { useState } from "react";
import CalendarEventDrawer from "../components/calendar/CalendarEventDrawer.jsx";

export default function CalendarPage({
  bookings = [],
  onNavigate,
  onSelectBooking,
  onShowToast,
}) {
  // State untuk melacak tahun dan bulan yang sedang dilihat di kalender
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  const todayStr = new Date().toISOString().slice(0, 10);

  // Default event terpilih
  const defaultEvent =
    bookings.find((b) => b.date === todayStr) || bookings[0] || null;
  const [selectedEventId, setSelectedEventId] = useState(
    defaultEvent ? defaultEvent.id : null,
  );
  const [drawerOpen, setDrawerOpen] = useState(Boolean(defaultEvent));

  const selectedEvent =
    bookings.find((b) => b.id === selectedEventId) || defaultEvent;

  // Format Nama Bulan & Tahun untuk Header (misal: October 2026)
  const currentMonthYearHeader = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleSelectEvent = (eventId) => {
    if (eventId) {
      setSelectedEventId(eventId);
      setDrawerOpen(true);
    }
  };

  // Navigasi Bulan (Sebelumnya / Berikutnya)
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Logika Pembuatan Grid Hari dalam Bulan Aktif
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  // Sesuaikan agar Senin menjadi awal minggu (0 = Mon, 6 = Sun)
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const monthDays = [];

  // Padding hari dari bulan sebelumnya jika diperlukan
  for (let i = 0; i < adjustedFirstDayIndex; i++) {
    monthDays.push({ isEmpty: true, id: `empty-${i}` });
  }

  // Hari-hari di bulan aktif
  for (let i = 1; i <= daysInMonth; i++) {
    const formattedDay = String(i).padStart(2, "0");
    const formattedMonth = String(month + 1).padStart(2, "0");
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

    const eventOnThisDay = bookings.filter(
      (b) =>
        b.date === dateKey &&
        (b.status === "Confirmed" || b.status === "Fully Paid"),
    );

    monthDays.push({
      isEmpty: false,
      dayNumber: i,
      dateKey,
      isToday: dateKey === todayStr,
      events: eventOnThisDay,
    });
  }

  // Hitung jumlah event terkonfirmasi di bulan yang sedang aktif
  const confirmedCountThisMonth = bookings.filter((b) => {
    const isThisMonth =
      b.date &&
      b.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`);
    return (
      isThisMonth && (b.status === "Confirmed" || b.status === "Fully Paid")
    );
  }).length;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Command Matrix & Header Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
            </div>
            <h1 className="text-4xl lg:text-5xl text-[#090100] tracking-tight font-serif font-bold">
              {currentMonthYearHeader}
            </h1>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Month Navigation Switcher */}
            <div className="flex items-center bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-1.5 gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Bulan Sebelumnya"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="text-xs font-serif font-bold text-[#090100] px-2 min-w-[110px] text-center">
                {currentMonthYearHeader}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Bulan Berikutnya"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Telemetry Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed Events Card */}
          <div className="bg-[#ffffff] p-5 rounded-2xl shadow-xs border border-[#d3c3be]/40 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f6f3ee]/60 to-transparent pointer-events-none"></div>
            <div className="flex flex-col z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#855230]"></span>
                <span className="text-[11px] text-[#855230] uppercase tracking-widest font-bold">
                  Confirmed Events
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-3xl text-[#090100] font-serif font-bold tracking-tight">
                  {confirmedCountThisMonth}
                </span>
                <span className="text-xs text-[#504440] font-medium uppercase tracking-wider">
                  Bookings
                </span>
              </div>
              <span className="text-xs text-[#827470] mt-1 font-medium">
                This Month
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-center justify-center text-[#855230] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">
                event_available
              </span>
            </div>
          </div>

          {/* Next Dispatch Card */}
          {(() => {
            const todayKey = new Date().toISOString().slice(0, 10);
            const upcomingList = bookings
              .filter(
                (b) =>
                  (b.status === "Confirmed" || b.status === "Fully Paid") &&
                  b.date >= todayKey,
              )
              .sort((a, b) => new Date(a.date) - new Date(b.date));

            const nextEvt = upcomingList[0];

            return (
              <div
                onClick={() => {
                  if (nextEvt && nextEvt.date) {
                    // Pindahkan tampilan kalender ke bulan event tersebut berada
                    const eventDate = new Date(nextEvt.date);
                    if (!isNaN(eventDate)) {
                      setCurrentDate(
                        new Date(
                          eventDate.getFullYear(),
                          eventDate.getMonth(),
                          1,
                        ),
                      );
                    }
                    // Pilih event dan buka drawer
                    handleSelectEvent(nextEvt.id);
                  }
                }}
                className={`bg-[#ffffff] p-5 rounded-2xl shadow-xs border border-[#d3c3be]/40 flex items-center justify-between relative overflow-hidden group ${
                  nextEvt
                    ? "cursor-pointer hover:border-[#855230] transition-all"
                    : ""
                }`}
              >
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f6f3ee]/60 to-transparent pointer-events-none"></div>
                <div className="flex flex-col min-w-0 pr-4 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#855230]"></span>
                    <span className="text-[11px] text-[#855230] uppercase tracking-widest font-bold">
                      Next Dispatch
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg text-[#090100] font-serif font-bold tracking-tight truncate">
                      {nextEvt
                        ? nextEvt.dateFormatted || nextEvt.date
                        : "No upcoming schedule"}
                    </span>
                    <span className="text-xs text-[#855230] font-mono bg-[#f6f3ee] px-2 py-0.5 rounded-md border border-[#d3c3be]/30 shrink-0">
                      {nextEvt ? nextEvt.time?.split("–")[0] : "-"}
                    </span>
                  </div>
                  <span className="text-xs text-[#504440] mt-1 truncate font-medium">
                    {nextEvt
                      ? `${nextEvt.venueName || "Studio"} · ${nextEvt.eventName || nextEvt.displayTitle}`
                      : "Belum ada jadwal terdekat"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-center justify-center text-[#855230] shadow-xs shrink-0 group-hover:scale-105 transition-transform z-10">
                  <span className="material-symbols-outlined text-[22px]">
                    local_shipping
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Main View Area: Calendar Grid + Drawer */}
      <div className="relative w-full flex flex-col lg:flex-row items-start gap-6">
        {/* Calendar Grid Canvas */}
        <div className="flex-1 w-full bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-4 transition-all duration-300">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 pb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-xs uppercase tracking-wider text-[#855230] font-semibold py-2 bg-[#f6f3ee] rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Dynamic Days Matrix */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((item) => {
              if (item.isEmpty) {
                return (
                  <div
                    key={item.id}
                    className="min-h-[110px] p-2 bg-[#f6f3ee]/20 rounded-lg opacity-40"
                  ></div>
                );
              }

              const hasEvents = item.events.length > 0;
              const isSelected = item.events.some(
                (e) => e.id === selectedEventId,
              );

              return (
                <div
                  key={item.dateKey}
                  onClick={() => {
                    if (hasEvents) {
                      handleSelectEvent(item.events[0].id);
                    }
                  }}
                  className={`min-h-[110px] p-2 rounded-lg flex flex-col justify-between transition-all ${
                    hasEvents
                      ? "cursor-pointer hover:bg-[#f6f3ee]"
                      : "bg-[#f6f3ee]/20"
                  } ${
                    isSelected
                      ? "border-2 border-[#855230] bg-[#ffffff] shadow-sm"
                      : item.isToday
                        ? "border border-[#855230]/60 bg-[#f6f3ee]/60"
                        : "border border-transparent bg-[#f6f3ee]/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${item.isToday ? "text-[#855230] font-bold" : "text-[#504440]"}`}
                    >
                      {String(item.dayNumber).padStart(2, "0")}
                    </span>
                    {item.isToday && (
                      <span className="text-[9px] font-bold text-[#855230] bg-[#855230]/10 px-1 py-0.2 rounded">
                        TODAY
                      </span>
                    )}
                    {hasEvents && !item.isToday && (
                      <span className="text-[9px] text-[#855230] font-semibold">
                        {item.events.length} EVENT
                        {item.events.length > 1 ? "S" : ""}
                      </span>
                    )}
                  </div>

                  {/* Render Event List di Tanggal tersebut */}
                  <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[70px]">
                    {item.events.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEvent(evt.id);
                        }}
                        className="w-full text-left p-1.5 rounded bg-[#f4ebe1] hover:bg-[#ebdfd3] shadow-xs relative overflow-hidden group border border-[#d3c3be]/30"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                        <div className="pl-1.5">
                          <span className="block text-[11px] leading-tight text-[#2c1810] font-bold truncate">
                            {evt.time || "10:00"} ·{" "}
                            {evt.eventName || evt.displayTitle}
                          </span>
                          <span className="block text-[10px] text-[#504440] truncate">
                            {evt.venueName || "Studio"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Drawer Preview: Event Detail */}
        {drawerOpen && selectedEvent && (
          <CalendarEventDrawer
            event={selectedEvent}
            onClose={() => setDrawerOpen(false)}
            onSelectBooking={onSelectBooking}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}
