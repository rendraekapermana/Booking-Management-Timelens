import React from 'react';
import MetricCard from '../components/ui/MetricCard.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function DashboardPage({ bookings, incomingOrders, onNavigate, onSelectBooking, onSelectOrder }) {
  // Filter confirmed upcoming bookings
  const upcomingEvents = bookings.slice(0, 4);
  const pendingRequests = incomingOrders.filter(o => o.status === 'new').slice(0, 2);

  return (
    <div className="flex flex-col gap-10">
      {/* Top Header & Operational Briefing */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#855230] font-semibold">
            Operational Briefing
          </span>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            Today at the Atelier
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#504440] font-medium bg-[#f6f3ee] px-3.5 py-1.5 rounded-lg border border-[#d3c3be]/40">
            Thursday, Oct 24, 2024
          </span>
        </div>
      </div>

      {/* 3 Metric Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Upcoming Events"
          value="8"
          subtitle="Next 14 days scheduled"
          icon="calendar_month"
          accentColor="bg-[#855230]/30"
          onClick={() => onNavigate('calendar')}
        />

        <MetricCard
          title="Pending Bookings"
          value="3"
          subtitle="Awaiting owner review"
          icon="pending_actions"
          accentColor="bg-[#febb90]"
          onClick={() => onNavigate('incoming-orders')}
        />

        <MetricCard
          title="Events This Month"
          value="14"
          subtitle="October 2024"
          icon="auto_stories"
          accentColor="bg-[#e5e2dd]"
          onClick={() => onNavigate('reports')}
        />
      </div>

      {/* Main Grid: Upcoming Events & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Events Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl text-[#090100] font-serif font-semibold">
                Upcoming Events
              </h2>
              <span className="text-[11px] text-[#504440] uppercase tracking-widest font-medium">
                Next Engagements
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="text-sm text-[#855230] hover:text-[#090100] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Full Schedule</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="bg-[#ffffff] rounded-xl shadow-sm overflow-hidden border border-[#d3c3be]/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f6f3ee]/60 border-b border-[#d3c3be]/30">
                    <th className="py-4 px-6 text-xs text-[#504440] tracking-wider uppercase font-semibold">
                      Date & Time
                    </th>
                    <th className="py-4 px-6 text-xs text-[#504440] tracking-wider uppercase font-semibold">
                      Event & Host
                    </th>
                    <th className="py-4 px-6 text-xs text-[#504440] tracking-wider uppercase font-semibold">
                      Configuration
                    </th>
                    <th className="py-4 px-6 text-xs text-[#504440] tracking-wider uppercase font-semibold">
                      Location
                    </th>
                    <th className="py-4 px-6 text-xs text-[#504440] tracking-wider uppercase font-semibold text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {upcomingEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      onClick={() => {
                        onSelectBooking(evt);
                        onNavigate('booking-detail');
                      }}
                      className="hover:bg-[#f6f3ee]/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-5 px-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#090100] font-semibold group-hover:text-[#855230] transition-colors">
                            {evt.dateFormatted.split(',')[1]}
                          </span>
                          <span className="text-xs text-[#504440]">
                            {evt.time.split('–')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#090100] font-serif font-semibold group-hover:text-[#855230] transition-colors">
                            {evt.displayTitle}
                          </span>
                          <span className="text-xs text-[#504440]">
                            {evt.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="text-sm text-[#1c1c19]">
                          Photobooth {evt.duration}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-1.5 text-[#504440]">
                          <span className="material-symbols-outlined text-[16px] opacity-70 text-[#855230]">
                            location_on
                          </span>
                          <span className="text-xs text-[#1c1c19] truncate max-w-[170px]" title={evt.venueName}>
                            {evt.venueName}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right whitespace-nowrap">
                        <Badge status={evt.status} size="sm">
                          {evt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Requests (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl text-[#090100] font-serif font-semibold">
                Recent Requests
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#855230] text-[#ffffff] text-xs font-semibold">
                {pendingRequests.length}
              </span>
            </div>
            <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
              Awaiting Review
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#ffffff] rounded-xl p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden group border border-[#d3c3be]/30 hover:shadow-md transition-shadow"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#febb90]"></div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#855230] font-semibold uppercase tracking-wider">
                      {req.submittedTime}
                    </span>
                    <span className="material-symbols-outlined text-[#855230] opacity-40 text-[18px]">
                      mark_email_unread
                    </span>
                  </div>
                  <h3 className="text-base text-[#090100] font-serif font-semibold leading-snug">
                    {req.eventTitle}
                  </h3>
                  <p className="text-xs text-[#504440]">
                    Submitted by {req.clientName}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#855230]">
                      photo_camera
                    </span>
                    <span className="text-xs text-[#1c1c19] font-medium">
                      {req.duration}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrder(req);
                      onNavigate('incoming-orders');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2c1810] text-[#ffffff] hover:bg-[#090100] text-xs font-semibold transition-colors duration-150 cursor-pointer shadow-xs"
                  >
                    <span>Review</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Quick summary button to view all */}
            <button
              type="button"
              onClick={() => onNavigate('incoming-orders')}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#d3c3be] text-xs font-semibold text-[#855230] hover:bg-[#f6f3ee] hover:border-[#855230] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View All Incoming Pipeline</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
