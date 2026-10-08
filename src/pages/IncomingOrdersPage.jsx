import React, { useState } from 'react';
import OrderReviewModal from '../components/orders/OrderReviewModal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';

export default function IncomingOrdersPage({
  incomingOrders,
  onUpdateOrderStatus,
  onNavigate,
  onSelectBookingFromOrder,
  onShowToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtering
  const filteredOrders = incomingOrders.filter((order) => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.eventTitle?.toLowerCase().includes(q) ||
      order.clientName?.toLowerCase().includes(q) ||
      order.venueName?.toLowerCase().includes(q) ||
      order.clientEmail?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: incomingOrders.length,
    new: incomingOrders.filter(o => o.status === 'new').length,
    reviewed: incomingOrders.filter(o => o.status === 'reviewed').length,
    confirmed: incomingOrders.filter(o => o.status === 'confirmed').length,
    rejected: incomingOrders.filter(o => o.status === 'rejected').length
  };

  const handleApprove = (order) => {
    onUpdateOrderStatus(order.id, 'confirmed');
    onSelectBookingFromOrder(order);
    setSelectedOrder(null);
    onShowToast(`Order "${order.eventTitle}" confirmed & placed on atelier calendar`);
  };

  const handleDecline = (order) => {
    onUpdateOrderStatus(order.id, 'rejected');
    setSelectedOrder(null);
    onShowToast(`Order "${order.eventTitle}" moved to rejected archives`);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pt-2">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#855230] uppercase tracking-[0.25em] font-semibold">
              Atelier Pipeline
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#855230]"></span>
            <span className="text-[11px] text-[#504440] font-mono">REC-2024-Q4</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
              Incoming Orders
            </h1>
            <span className="text-sm text-[#855230] bg-[#ebe8e3] px-3 py-0.5 rounded-full font-serif italic">
              {counts.new} requests pending review
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="subtle"
            icon="tune"
            onClick={() => onShowToast('Feed filters configured to real-time auto-sync')}
          >
            Feed Filter
          </Button>
        </div>
      </div>

      {/* Search and Status Pills Bar */}
      <div className="bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#827470]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by customer, event, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-[#f6f3ee] text-[#090100] placeholder:text-[#827470] text-sm rounded-lg focus:outline-none focus:bg-[#ffffff] border border-transparent focus:border-[#d3c3be] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'new', label: 'New', count: counts.new },
            { key: 'reviewed', label: 'Reviewed', count: counts.reviewed },
            { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
            { key: 'rejected', label: 'Rejected', count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-[#2c1810] text-[#fcf9f4] shadow-xs'
                  : 'bg-[#f6f3ee] text-[#504440] hover:bg-[#ebe8e3] hover:text-[#090100]'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-80 font-mono">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-3 w-full">
        {/* Table Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-2 text-xs uppercase tracking-wider text-[#855230] font-semibold">
          <div className="col-span-4">Event &amp; Client</div>
          <div className="col-span-3">Date &amp; Time</div>
          <div className="col-span-3">Package &amp; Venue</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3.5">
          {filteredOrders.length === 0 ? (
            <div className="bg-[#ffffff] rounded-xl p-12 text-center border border-[#d3c3be]/40">
              <span className="material-symbols-outlined text-4xl text-[#827470] mb-2">search_off</span>
              <p className="text-base text-[#090100] font-serif font-semibold">No orders found</p>
              <p className="text-xs text-[#504440] mt-1">Try adjusting your search query or switching filter tabs.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="group bg-[#ffffff] hover:bg-[#f6f3ee]/60 rounded-xl p-5 md:p-6 shadow-xs border border-[#d3c3be]/40 transition-all duration-200 cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Event & Client */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="w-12 h-14 bg-[#ebe8e3] rounded-lg flex-shrink-0 overflow-hidden relative shadow-xs border border-[#d3c3be]/40">
                      <img
                        src={order.imageSrc}
                        alt="Portrait sample"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] text-[#fcf9f4] bg-[#2c1810]/80 px-1 rounded">
                        {order.imageNum}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base text-[#090100] font-serif font-semibold truncate group-hover:text-[#855230] transition-colors">
                        {order.eventTitle}
                      </span>
                      <span className="text-sm text-[#1c1c19] font-medium truncate mt-0.5">
                        {order.clientName}
                      </span>
                      <span className="text-xs text-[#827470] truncate">
                        {order.clientEmail}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="md:col-span-3 flex flex-col justify-center">
                    <span className="text-sm text-[#090100] font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#855230]">
                        calendar_today
                      </span>
                      {order.eventDateFormatted}
                    </span>
                    <span className="text-xs text-[#504440] pl-5">{order.eventTime}</span>
                    <span className="text-[11px] text-[#827470] pl-5 mt-0.5">
                      {order.submittedTime}
                    </span>
                  </div>

                  {/* Package & Venue */}
                  <div className="md:col-span-3 flex flex-col justify-center min-w-0">
                    <span className="text-sm text-[#090100] font-semibold flex items-center gap-1.5 truncate">
                      {order.duration}
                      {order.durationExtra && (
                        <span className="text-[10px] bg-[#855230]/10 text-[#855230] px-1.5 py-0.5 rounded font-bold font-mono">
                          {order.durationExtra}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-[#1c1c19] font-medium truncate mt-0.5">
                      {order.venueName}
                    </span>
                    <span className="text-xs text-[#504440] truncate">
                      {order.venueDetail}
                    </span>
                  </div>

                  {/* Status & Action */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                    <Badge status={order.status} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="px-3 py-1.5 bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#090100] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Lead Dialog Modal */}
      <OrderReviewModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onApprove={handleApprove}
        onDecline={handleDecline}
        onShowToast={onShowToast}
      />
    </div>
  );
}
