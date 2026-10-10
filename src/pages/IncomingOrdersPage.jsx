import React, { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService.js";
import OrderReviewModal from "../components/orders/OrderReviewModal.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";

export default function IncomingOrdersPage({ onNavigate, onShowToast }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Ambil data dari Supabase saat halaman dimuat
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Gagal memuat pesanan:", error);
      onShowToast("Gagal memuat data pesanan dari database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtering System
  const filteredOrders = orders.filter((order) => {
    const statusMatch = order.status ? order.status.toLowerCase() : "";
    const matchesFilter =
      activeFilter === "all" || statusMatch === activeFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.eventName?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.venueName?.toLowerCase().includes(q) ||
      order.customerEmail?.toLowerCase().includes(q) ||
      order.orderRef?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status?.toLowerCase() === "pending").length,
    confirmed: orders.filter((o) => o.status?.toLowerCase() === "confirmed")
      .length,
    rejected: orders.filter((o) => o.status?.toLowerCase() === "rejected")
      .length,
    paid: orders.filter((o) => o.status?.toLowerCase() === "fully paid").length,
  };

  const handleApprove = async (order) => {
    try {
      const payload = {
        ...order,
        id: order.id,
        status: "Confirmed",
      };

      const updatedData = await bookingService.update(payload);

      setOrders(orders.map((o) => (o.id === order.id ? updatedData : o)));
      setSelectedOrder(null);
      onShowToast(
        `Pesanan "${order.eventName || order.eventTitle}" berhasil dikonfirmasi`,
      );
    } catch (error) {
      console.error("Gagal mengkonfirmasi:", error);
      onShowToast("Gagal mengkonfirmasi pesanan", "error");
    }
  };

  const handleDecline = async (order) => {
    try {
      await bookingService.update({ id: order.id, status: "Rejected" });
      setOrders(
        orders.map((o) =>
          o.id === order.id ? { ...o, status: "Rejected" } : o,
        ),
      );
      setSelectedOrder(null);
      onShowToast(`Pesanan "${order.eventName}" telah ditolak`);
    } catch (error) {
      onShowToast("Gagal menolak pesanan", "error");
    }
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
            <span className="text-[11px] text-[#504440] font-mono">
              LIVE SYNC
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
              Incoming Orders
            </h1>
            <span className="text-sm text-[#855230] bg-[#ebe8e3] px-3 py-0.5 rounded-full font-serif italic">
              {counts.pending} requests pending review
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="subtle" icon="refresh" onClick={fetchOrders}>
            Sync Data
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
            { key: "all", label: "All", count: counts.all },
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "confirmed", label: "Confirmed", count: counts.confirmed },
            { key: "fully paid", label: "Fully Paid", count: counts.paid },
            { key: "rejected", label: "Rejected", count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.key
                  ? "bg-[#2c1810] text-[#fcf9f4] shadow-xs"
                  : "bg-[#f6f3ee] text-[#504440] hover:bg-[#ebe8e3] hover:text-[#090100]"
              }`}
            >
              {tab.label}{" "}
              <span className="ml-1 opacity-80 font-mono">{tab.count}</span>
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
          {isLoading ? (
            <div className="bg-[#ffffff] rounded-xl p-12 text-center border border-[#d3c3be]/40">
              <span className="material-symbols-outlined text-4xl text-[#855230] animate-spin mb-2">
                sync
              </span>
              <p className="text-base text-[#090100] font-serif font-semibold">
                Memuat Data Pesanan...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#ffffff] rounded-xl p-12 text-center border border-[#d3c3be]/40">
              <span className="material-symbols-outlined text-4xl text-[#827470] mb-2">
                search_off
              </span>
              <p className="text-base text-[#090100] font-serif font-semibold">
                No orders found
              </p>
              <p className="text-xs text-[#504440] mt-1">
                Try adjusting your search query or switching filter tabs.
              </p>
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
                    <div className="w-12 h-14 bg-[#ebe8e3] rounded-lg flex items-center justify-center flex-shrink-0 relative shadow-xs border border-[#d3c3be]/40">
                      <span className="text-xl font-serif font-bold text-[#855230]">
                        {order.customerName?.charAt(0) || "T"}
                      </span>
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] text-[#fcf9f4] bg-[#2c1810]/80 px-1 rounded">
                        {order.orderRef?.split("-")[1] || order.id}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base text-[#090100] font-serif font-semibold truncate group-hover:text-[#855230] transition-colors">
                        {order.eventName}
                      </span>
                      <span className="text-sm text-[#1c1c19] font-medium truncate mt-0.5">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-[#827470] truncate">
                        {order.customerEmail}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="md:col-span-3 flex flex-col justify-center">
                    <span className="text-sm text-[#090100] font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#855230]">
                        calendar_today
                      </span>
                      {order.dateFormatted}
                    </span>
                    <span className="text-xs text-[#504440] pl-5">
                      {order.time}
                    </span>
                  </div>

                  {/* Package & Venue */}
                  <div className="md:col-span-3 flex flex-col justify-center min-w-0">
                    <span className="text-sm text-[#090100] font-semibold flex items-center gap-1.5 truncate">
                      {order.duration}
                    </span>
                    <span className="text-xs text-[#1c1c19] font-medium truncate mt-0.5">
                      {order.venueName}
                    </span>
                  </div>

                  {/* Status & Action */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                    <Badge
                      variant={
                        order.status === "Pending"
                          ? "warning"
                          : order.status === "Rejected"
                            ? "error"
                            : "success"
                      }
                    >
                      {order.status}
                    </Badge>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Kirim objek order lengkap atau ID-nya ke App.jsx agar selectedBooking tersetting dengan akurat
                        onNavigate("booking-detail", order);
                      }}
                      className="px-3 py-1.5 bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#090100] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Lead Dialog Modal */}
      {selectedOrder && (
        <OrderReviewModal
          order={selectedOrder}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}

