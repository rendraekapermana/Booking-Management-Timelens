import { useState, useEffect } from "react";
import { bookingService, fetchBookings } from "./services/bookingService";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import NewBookingModal from "./components/NewBookingModal.jsx";
import Toast from "./components/Toast.jsx";

import DashboardPage from "./pages/DashboardPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import IncomingOrdersPage from "./pages/IncomingOrdersPage.jsx";
import BookingDetailPage from "./pages/BookingDetailPage.jsx";
import BookingFormsPage from "./pages/BookingFormsPage.jsx";
import CreateEditBookingFormPage from "./pages/CreateEditBookingFormPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import AddExpensePage from "./pages/AddExpensePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import InvoiceSettingsPage from "./pages/InvoiceSettingsPage.jsx";
import InvoicePreviewPage from "./pages/InvoicePreviewPage.jsx";
import PublicBookingPage from "./pages/PublicBookingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import { initialIncomingOrders, initialExpenses } from "./lib/mock/mockData.js";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  useEffect(() => {
    setIncomingOrders(bookings);
  }, [bookings]);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync hash routing if present & Load Supabase Data
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchBookings();
      if (data) {
        setBookings(data);
      }
    };

    loadData();

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "book/main-atelier" || hash === "public-booking") {
        setCurrentView("public-booking");
      } else if (hash === "login") {
        setCurrentView("login");
      } else if (
        hash &&
        [
          "dashboard",
          "calendar",
          "incoming-orders",
          "booking-detail",
          "booking-forms",
          "edit-booking-form",
          "expenses",
          "add-expense",
          "reports",
          "invoice-settings",
          "invoice-preview",
        ].includes(hash)
      ) {
        setCurrentView(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (viewId, param = null) => {
    setCurrentView(viewId);

    if (param) {
      if (typeof param === "object") {
        setSelectedBooking(param);
      } else {
        const found =
          bookings.find((b) => b.id === param) ||
          incomingOrders.find((o) => o.id === param);
        if (found) setSelectedBooking(found);
      }
    }

    window.location.hash = viewId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleAddBooking = async (newBooking) => {
    try {
      const savedBookings = await bookingService.create(newBooking);

      setBookings([savedBookings, ...bookings]);
      setSelectedBooking(savedBookings);
      setIsNewBookingModalOpen(false);

      showToast(
        `New booking "${newBooking.eventName}" confirmed and scheduled.`,
      );
    } catch (error) {
      console.error("Gagal menyimpan booking:", error);
      showToast("Gagal menyimpan booking ke database.", "error");
    }
  };

  const handleUpdateBooking = (updated) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBooking(updated);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setIncomingOrders(
      incomingOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      ),
    );
  };

  const handleSelectBookingFromOrder = (order) => {
    const newBooking = {
      id: `BK-2024-${Math.floor(100 + Math.random() * 900)}`,
      eventName: order.eventTitle,
      displayTitle: order.eventTitle,
      customerName: order.clientName,
      customerTitle: "Client • Primary Contact",
      customerPhone: order.clientPhone || "+62 812-3344-5566",
      customerEmail: order.clientEmail,
      date: order.eventDate,
      dateFormatted: order.eventDateFormatted,
      time: order.eventTime,
      duration: order.duration.replace("Photobooth ", ""),
      durationHours: 4,
      guestCount: 250,
      venueName: order.venueName,
      venueAddress: order.venueDetail,
      venueDetail: order.venueDetail,
      status: "Confirmed",
      packageConfig: order.duration,
      paperSpecs: "Matte Cream Archival Foil Stamped Cards",
      backdrop: "Satin Red",
      paperType: "Photostrip (2x6)",
      frameDesign: "Dibuatkan oleh Timelens",
      totalPrice: order.packageTotal || 3500000,
      downPayment: Math.round((order.packageTotal || 3500000) * 0.5),
      remainingDue: Math.round((order.packageTotal || 3500000) * 0.5),
      isTodayActive: false,
      opsCount: 2,
      orderRef: `#TL-${Math.floor(8800 + Math.random() * 100)}`,
    };

    setBookings([newBooking, ...bookings]);
    setSelectedBooking(newBooking);
    navigate("booking-detail");
  };

  const handleAddExpense = (newExpense) => {
    if (expenseToEdit) {
      setExpenses(
        expenses.map((e) => (e.id === newExpense.id ? newExpense : e)),
      );
      setExpenseToEdit(null);
    } else {
      setExpenses([newExpense, ...expenses]);
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddNewPublicOrder = (order) => {
    setIncomingOrders([order, ...incomingOrders]);
    showToast(
      `Formulir reservasi untuk "${order.eventTitle}" berhasil disinkronkan ke studio!`,
    );
  };

  // If user navigated to Public Booking page (standalone client intake without studio sidebar)
  if (currentView === "public-booking") {
    return (
      <>
        <PublicBookingPage
          onNavigate={navigate}
          onAddNewOrder={handleAddNewPublicOrder}
          onShowToast={showToast}
        />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // If unauthenticated or viewing Login page
  if (!isAuthenticated || currentView === "login") {
    return (
      <>
        <LoginPage
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            navigate("dashboard");
            showToast("Welcome back, Clara Vance. Atelier briefing loaded.");
          }}
        />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex">
      {/* Studio Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={navigate}
        onLogout={() => {
          setIsAuthenticated(false);
          navigate("login");
          showToast("Signed out of Timelens Atelier.");
        }}
      />

      {/* Main Studio Console Viewport */}
      <div className="pl-72 min-h-screen flex flex-col flex-1 bg-[#fcf9f4]">
        <Header
          currentView={currentView}
          onNavigate={navigate}
          onOpenNewBooking={() => setIsNewBookingModalOpen(true)}
        />

        <main className="relative pt-16 flex-1 w-full px-8 pb-12">
          {currentView === "dashboard" && (
            <DashboardPage
              bookings={bookings}
              incomingOrders={bookings}
              onNavigate={navigate}
              onSelectBooking={(b) => setSelectedBooking(b)}
              onSelectOrder={() => navigate("incoming-orders")}
            />
          )}

          {currentView === "calendar" && (
            <CalendarPage
              bookings={bookings}
              onNavigate={navigate}
              onSelectBooking={(b) => setSelectedBooking(b)}
              onShowToast={showToast}
            />
          )}

          {currentView === "incoming-orders" && (
            <IncomingOrdersPage
              incomingOrders={bookings} // 🔥 SINKRONISASI KE DATABASE
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onNavigate={navigate}
              onSelectBookingFromOrder={handleSelectBookingFromOrder}
              onShowToast={showToast}
            />
          )}

          {currentView === "booking-detail" && (
            <BookingDetailPage
              /* PERBAIKAN: Menambahkan fallback || {} agar tidak crash saat array kosong */
              booking={selectedBooking || bookings[0] || {}}
              onNavigate={navigate}
              onUpdateBooking={handleUpdateBooking}
              onShowToast={showToast}
            />
          )}

          {currentView === "booking-forms" && (
            <BookingFormsPage onNavigate={navigate} onShowToast={showToast} />
          )}

          {currentView === "edit-booking-form" && (
            <CreateEditBookingFormPage
              onNavigate={navigate}
              onShowToast={showToast}
            />
          )}

          {currentView === "expenses" && (
            <ExpensesPage
              expenses={expenses}
              onNavigate={navigate}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={(item) => setExpenseToEdit(item)}
              onShowToast={showToast}
            />
          )}

          {currentView === "add-expense" && (
            <AddExpensePage
              onNavigate={navigate}
              onAddExpense={handleAddExpense}
              expenseToEdit={expenseToEdit}
              onShowToast={showToast}
            />
          )}

          {currentView === "reports" && <ReportsPage onShowToast={showToast} />}

          {currentView === "invoice-settings" && (
            <InvoiceSettingsPage
              onNavigate={navigate}
              onShowToast={showToast}
            />
          )}

          {currentView === "invoice-preview" && (
            <InvoicePreviewPage onNavigate={navigate} onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Global New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onAddBooking={handleAddBooking}
      />

      {/* Toast Notification Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
