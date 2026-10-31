import { useState, useEffect } from "react";
import { bookingService, fetchBookings } from "./services/bookingService";
import { supabase } from "./lib/supabase.js"; // Pastikan import supabase
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import NewBookingModal from "./components/NewBookingModal.jsx";
import Toast from "./components/Toast.jsx";

import DashboardPage from "./pages/DashboardPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import IncomingOrdersPage from "./pages/IncomingOrdersPage.jsx";
import BookingDetailPage from "./pages/BookingDetailPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import AddExpensePage from "./pages/AddExpensePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import InvoiceSettingsPage from "./pages/InvoiceSettingsPage.jsx";
import InvoicePreviewPage from "./pages/InvoicePreviewPage.jsx";
import PublicBookingPage from "./pages/PublicBookingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import IntegrationsPage from "./pages/IntegrationsPage.jsx";
import { syncBookingToGoogleCalendar } from "./services/calendarSync.js";

import { initialIncomingOrders, initialExpenses } from "./lib/mock/mockData.js";

export default function App() {
  // --- STATE OTENTIKASI & USER ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Menyimpan data user yang login

  const [currentView, setCurrentView] = useState("login");
  const [bookings, setBookings] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setIncomingOrders(bookings);
  }, [bookings]);

  // --- CEK SESI SUPABASE ---
  useEffect(() => {
    // 1. Cek sesi saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentUser({
          name:
            session.user.user_metadata?.full_name ||
            session.user.email.split("@")[0],
          email: session.user.email,
        });
        // Jika sedang di halaman login, arahkan ke dashboard
        if (
          window.location.hash.replace("#", "") === "login" ||
          !window.location.hash
        ) {
          setCurrentView("dashboard");
        }
      }
    });

    // 2. Pantau perubahan status login/logout (Realtime)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentUser({
          name:
            session.user.user_metadata?.full_name ||
            session.user.email.split("@")[0],
          email: session.user.email,
        });
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        if (currentView !== "public-booking") {
          setCurrentView("login");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- LOAD DATA BOKING & ROUTING ---
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
      } else if (hash === "booking-forms" || hash === "edit-booking-form") {
        setCurrentView("dashboard");
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#dashboard`,
        );
      } else if (
        hash &&
        [
          "dashboard",
          "calendar",
          "incoming-orders",
          "booking-detail",
          "expenses",
          "add-expense",
          "reports",
          "invoice-settings",
          "invoice-preview",
          "integrations",
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

      const rawStatus =
        savedBookings.status || newBooking.status || "KOSONG/TIDAK ADA STATUS";
      const currentStatus = rawStatus.toLowerCase();

      if (currentStatus === "confirmed" || currentStatus === "fully paid") {
        const savedAccounts = JSON.parse(
          localStorage.getItem("googleAccounts") || "[]",
        );
        if (savedAccounts.length > 0) {
          savedAccounts.forEach(async (acc) => {
            await syncBookingToGoogleCalendar(savedBookings, acc.accessToken);
          });
        }
      }
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
    const updatedOrders = incomingOrders.map((o) => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (newStatus === "Confirmed" || newStatus === "Fully Paid") {
          const savedAccounts = JSON.parse(
            localStorage.getItem("googleAccounts") || "[]",
          );
          if (savedAccounts.length > 0) {
            savedAccounts.forEach(async (acc) => {
              await syncBookingToGoogleCalendar(updated, acc.accessToken);
            });
            showToast(
              `Status: ${newStatus}. Jadwal masuk ke Google Calendar!`,
              "success",
            );
          } else {
            showToast(
              `Status pesanan diperbarui menjadi ${newStatus}.`,
              "success",
            );
          }
        } else {
          showToast(
            `Status pesanan diperbarui menjadi ${newStatus}.`,
            "success",
          );
        }
        return updated;
      }
      return o;
    });
    setIncomingOrders(updatedOrders);
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

  // 1. PUBLIC FORM DIPERBOLEHKAN (TIDAK TERKUNCI)
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

  // 2. KUNCI SELURUH HALAMAN LAIN JIKA BELUM LOGIN (Proteksi Rute)
  if (!isAuthenticated || currentView === "login") {
    return (
      <>
        <LoginPage
          onLoginSuccess={(userData) => {
            setIsAuthenticated(true);
            setCurrentUser(userData);
            navigate("dashboard");
            showToast(
              `Welcome back, ${userData.name}.`,
            );
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

  // 3. MAIN DASHBOARD (HANYA BISA DIAKSES JIKA SUDAH LOGIN)
  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex print:bg-white">
      <div className="print:hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={navigate}
          user={currentUser} // Lempar data user ke Sidebar
          onLogout={async () => {
            await supabase.auth.signOut(); // Sign out dari Supabase
            setIsAuthenticated(false);
            setCurrentUser(null);
            navigate("login");
            showToast("Signed out of Timelens Atelier.");
          }}
        />
      </div>

      <div className="pl-72 print:pl-0 min-h-screen flex flex-col flex-1 bg-[#fcf9f4] print:bg-white">
        <div className="print:hidden">
          <Header
            currentView={currentView}
            onNavigate={navigate}
            onOpenNewBooking={() => setIsNewBookingModalOpen(true)}
          />
        </div>

        <main className="relative pt-16 print:pt-0 flex-1 w-full px-8 print:px-0 pb-12 print:pb-0">
          {currentView === "dashboard" && (
            <DashboardPage
              bookings={bookings}
              incomingOrders={incomingOrders}
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
              incomingOrders={incomingOrders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onNavigate={navigate}
              onSelectBookingFromOrder={handleSelectBookingFromOrder}
              onShowToast={showToast}
            />
          )}

          {currentView === "booking-detail" && (
            <BookingDetailPage
              booking={selectedBooking || bookings[0] || {}}
              onNavigate={navigate}
              onUpdateBooking={handleUpdateBooking}
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
              expenseToEdit={expenseToEdit}
              onShowToast={showToast}
            />
          )}

          {currentView === "reports" && <ReportsPage onShowToast={showToast} />}

          {currentView === "integrations" && (
            <IntegrationsPage onShowToast={showToast} />
          )}

          {currentView === "invoice-settings" && (
            <InvoiceSettingsPage
              onNavigate={navigate}
              onShowToast={showToast}
            />
          )}

          {currentView === "invoice-preview" && (
            <InvoicePreviewPage
              booking={selectedBooking}
              onNavigate={navigate}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onAddBooking={handleAddBooking}
      />

      <div className="print:hidden">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
