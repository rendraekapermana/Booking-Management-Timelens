import React, { useState } from 'react';
import CalendarEventDrawer from '../components/calendar/CalendarEventDrawer.jsx';

export default function CalendarPage({ bookings, onNavigate, onSelectBooking, onShowToast }) {
  const [viewMode, setViewMode] = useState('Month');
  const [selectedEventId, setSelectedEventId] = useState('BK-2024-089'); // Oct 24 active by default
  const [drawerOpen, setDrawerOpen] = useState(true);

  const selectedEvent = bookings.find(b => b.id === selectedEventId) || bookings[0];

  const handleSyncGoogle = () => {
    onShowToast('Synchronizing with Google Calendar API... All 6 atelier bookings up to date.');
  };

  const handleSelectDate = (eventId) => {
    if (eventId) {
      setSelectedEventId(eventId);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Command Matrix & Header Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#855230]"></span>
              <span className="text-[11px] uppercase tracking-widest text-[#855230] font-semibold">
                Atelier Schedule Matrix
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl text-[#090100] tracking-tight font-serif font-bold">
              October 2024
            </h1>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* View Switcher */}
            <div className="flex items-center bg-[#f0ede9] p-1 rounded-lg shadow-xs">
              {['Month', 'Week', 'Day'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    viewMode === mode
                      ? 'bg-[#2c1810] text-[#fcf9f4] shadow-xs'
                      : 'text-[#504440] hover:text-[#090100]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center bg-[#ffffff] rounded-lg shadow-xs border border-[#d3c3be]/40 px-1 py-1">
              <button
                type="button"
                onClick={() => onShowToast('Previous month archived')}
                className="p-1.5 text-[#504440] hover:text-[#090100] rounded transition-colors cursor-pointer"
                title="Previous Month"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedEventId('BK-2024-089');
                  setDrawerOpen(true);
                }}
                className="px-3 py-1 text-xs font-semibold text-[#1c1c19] hover:text-[#855230] transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Next month preview')}
                className="p-1.5 text-[#504440] hover:text-[#090100] rounded transition-colors cursor-pointer"
                title="Next Month"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Google Calendar Sync */}
            <button
              type="button"
              onClick={handleSyncGoogle}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffffff] hover:bg-[#f6f3ee] text-[#1c1c19] text-xs font-semibold rounded-lg shadow-xs border border-[#d3c3be]/40 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#855230]">sync</span>
              <span>Sync with Google Calendar</span>
            </button>
          </div>
        </div>

        {/* Quick Telemetry Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-xs border border-[#d3c3be]/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#855230] uppercase tracking-wider font-semibold">
                Confirmed Events
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl text-[#090100] font-serif font-bold">6</span>
                <span className="text-xs text-[#504440] font-medium">Events</span>
              </div>
              <span className="text-[11px] text-[#855230] mt-0.5">This Month</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f6f3ee] flex items-center justify-center text-[#855230]">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
          </div>

          <div
            onClick={() => handleSelectDate('BK-2024-085')}
            className="bg-[#ffffff] p-4 rounded-xl shadow-xs border border-[#d3c3be]/30 flex items-center justify-between cursor-pointer hover:border-[#855230]/50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-[11px] text-[#855230] uppercase tracking-wider font-semibold">
                Next Dispatch
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl text-[#090100] font-serif font-bold">Fri, 18 Oct</span>
                <span className="text-xs text-[#504440] font-medium">19:00 WIB</span>
              </div>
              <span className="text-[11px] text-[#504440] mt-0.5 truncate">
                Villa Botanica · Maya &amp; Dan Wedding
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f6f3ee] flex items-center justify-center text-[#855230]">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area: Calendar Grid + Drawer */}
      <div className="relative w-full flex flex-col lg:flex-row items-start gap-6">
        {/* Calendar Grid Canvas */}
        <div className="flex-1 w-full bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-4 transition-all duration-300">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 pb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="text-center text-xs uppercase tracking-wider text-[#855230] font-semibold py-2 bg-[#f6f3ee] rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Matrix (5 Rows, 7 Cols) */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week 1: Sep 30 - Oct 6 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/50 rounded-lg flex flex-col justify-between opacity-50">
              <span className="text-xs font-semibold text-[#827470]">30</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">01</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">02</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">03</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">04</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">05</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">06</span>
            </div>

            {/* Week 2: Oct 7 - Oct 13 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">07</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">08</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">09</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">10</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">11</span>
            </div>

            {/* Oct 12: Harper Gala */}
            <div
              onClick={() => handleSelectDate('BK-2024-082')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors cursor-pointer border ${
                selectedEventId === 'BK-2024-082' ? 'border-[#855230] ring-1 ring-[#855230]' : 'border-transparent bg-[#f6f3ee]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#504440]">12</span>
                <span className="text-[10px] text-[#855230] font-semibold">1 EVENT</span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] hover:bg-[#ebdfd3] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-semibold truncate">
                    16:00 · Harper Gala (6h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    Grand Ballroom · 3 Ops
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">13</span>
            </div>

            {/* Week 3: Oct 14 - Oct 20 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">14</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">15</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">16</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">17</span>
            </div>

            {/* Oct 18: Maya & Dan Wedding */}
            <div
              onClick={() => handleSelectDate('BK-2024-085')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors cursor-pointer border ${
                selectedEventId === 'BK-2024-085' ? 'border-[#855230] ring-1 ring-[#855230]' : 'border-transparent bg-[#f6f3ee]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#504440]">18</span>
                <span className="text-[10px] text-[#855230] font-semibold">1 EVENT</span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] hover:bg-[#ebdfd3] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-semibold truncate">
                    19:00 · Maya &amp; Dan (4h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    Villa Botanica · 2 Ops
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">19</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">20</span>
            </div>

            {/* Week 4: Oct 21 - Oct 27 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">21</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">22</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">23</span>
            </div>

            {/* Oct 24: Adeline & Marcus Wedding (Active) */}
            <div
              onClick={() => handleSelectDate('BK-2024-089')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between transition-all cursor-pointer border ${
                selectedEventId === 'BK-2024-089'
                  ? 'border-[#855230] bg-[#ffffff] ring-2 ring-[#855230]/40 shadow-sm'
                  : 'border-[#d3c3be]/40 bg-[#f6f3ee]/40 hover:bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2c1810]">24</span>
                <span className="text-[10px] font-bold text-[#855230] bg-[#855230]/10 px-1.5 py-0.2 rounded">
                  TODAY
                </span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-bold truncate">
                    18:00 · Adeline &amp; Marcus (4h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    The Glasshouse · 2 Ops
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">25</span>
            </div>

            {/* Oct 26: Lumiere Pop-up */}
            <div
              onClick={() => handleSelectDate('BK-2024-091')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors cursor-pointer border ${
                selectedEventId === 'BK-2024-091' ? 'border-[#855230] ring-1 ring-[#855230]' : 'border-transparent bg-[#f6f3ee]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#504440]">26</span>
                <span className="text-[10px] text-[#855230] font-semibold">1 EVENT</span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] hover:bg-[#ebdfd3] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-semibold truncate">
                    14:00 · Lumière Brand (6h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    Gallery Pavilion · 3 Ops
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">27</span>
            </div>

            {/* Week 5: Oct 28 - Nov 3 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">28</span>
            </div>

            {/* Oct 29: Sarah 30th Birthday */}
            <div
              onClick={() => handleSelectDate('BK-2024-092')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors cursor-pointer border ${
                selectedEventId === 'BK-2024-092' ? 'border-[#855230] ring-1 ring-[#855230]' : 'border-transparent bg-[#f6f3ee]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#504440]">29</span>
                <span className="text-[10px] text-[#855230] font-semibold">1 EVENT</span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] hover:bg-[#ebdfd3] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-semibold truncate">
                    19:30 · Sarah 30th (2h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    Private Villa · 1 Op
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">30</span>
            </div>
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/30 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors">
              <span className="text-xs font-semibold text-[#504440]">31</span>
            </div>

            {/* Nov 01 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/50 rounded-lg flex flex-col justify-between opacity-50">
              <span className="text-xs font-semibold text-[#827470]">01</span>
            </div>

            {/* Nov 02: Evelyn Reception */}
            <div
              onClick={() => handleSelectDate('BK-2024-093')}
              className={`min-h-[105px] p-2 rounded-lg flex flex-col justify-between hover:bg-[#f6f3ee] transition-colors cursor-pointer border ${
                selectedEventId === 'BK-2024-093' ? 'border-[#855230] ring-1 ring-[#855230]' : 'border-transparent bg-[#f6f3ee]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#504440]">02</span>
                <span className="text-[10px] text-[#855230] font-semibold">1 EVENT</span>
              </div>
              <div className="w-full text-left p-1.5 rounded bg-[#f4ebe1] shadow-xs relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#855230]"></div>
                <div className="pl-1.5">
                  <span className="block text-[11px] leading-tight text-[#2c1810] font-semibold truncate">
                    17:00 · Evelyn Reception (4h)
                  </span>
                  <span className="block text-[10px] text-[#504440] truncate">
                    Botanica Hall · 2 Ops
                  </span>
                </div>
              </div>
            </div>

            {/* Nov 03 */}
            <div className="min-h-[105px] p-2 bg-[#f6f3ee]/50 rounded-lg flex flex-col justify-between opacity-50">
              <span className="text-xs font-semibold text-[#827470]">03</span>
            </div>
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
