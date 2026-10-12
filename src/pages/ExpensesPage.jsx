import React, { useState, useEffect } from "react";
import { formatIDR } from "../lib/formatters.js";
import { useExpenseFilter } from "../hooks/useExpenseFilter.js";
import Button from "../components/ui/Button.jsx";
import { expenseService } from "../services/expenseService.js";

export default function ExpensesPage({
  onNavigate,
  onEditExpense,
  onShowToast,
}) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await expenseService.getAll();
      const dataWithPeriod = (data || []).map((item) => ({
        ...item,
        period: item.date ? item.date.substring(0, 7) : "",
      }));

      setExpenses(dataWithPeriod);
    } catch (error) {
      console.error("Gagal memuat pengeluaran:", error);
      if (onShowToast) onShowToast("Gagal memuat data pengeluaran", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const { filteredExpenses, totalCalculated } = useExpenseFilter(expenses, {
    category: selectedCategory,
    period: selectedPeriod,
    query: searchQuery,
  });

  const handleDelete = async (id, description) => {
    if (window.confirm(`Hapus pengeluaran "${description}" secara permanen?`)) {
      try {
        await expenseService.delete(id);
        setExpenses(expenses.filter((e) => e.id !== id));
        if (onShowToast) onShowToast("Pengeluaran berhasil dihapus", "success");
      } catch (error) {
        if (onShowToast) onShowToast("Gagal menghapus pengeluaran", "error");
      }
    }
  };

  // 🔥 1. LOGIKA PERIODE (BULAN) DINAMIS
  // Mengambil daftar unik bulan (YYYY-MM) dari data database
  const uniquePeriods = [
    ...new Set(expenses.map((e) => e.date?.substring(0, 7))),
  ]
    .filter(Boolean)
    .sort()
    .reverse();

  // Helper mengubah "2026-10" menjadi "Oktober 2026"
  const formatMonthName = (periodString) => {
    if (!periodString) return "";
    const [year, month] = periodString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  // 🔥 2. LOGIKA DISTRIBUSI POS BEBAN (REAL-TIME)
  // Menghitung total masing-masing kategori
  const categoryTotals = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const categoryColors = {
    "Crew Fee / Ops": "#2c1810",
    Transportasi: "#855230",
    "Konsumsi / Crew Ops": "#504440",
    "Logistik Event": "#febb90",
    "Operasional Venue": "#827470",
    "Perlengkapan Studio": "#3b82f6",
  };
  const fallbackColors = [
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#ec4899",
  ];

  const allUniqueCategories = [...new Set(expenses.map((e) => e.category))];

  // 🔥 FUNGSI BARU: Mengambil warna berdasarkan nama kategori
  const getCategoryColor = (categoryName) => {
    if (categoryColors[categoryName]) return categoryColors[categoryName];
    const fallbackIndex = allUniqueCategories.indexOf(categoryName);
    return fallbackColors[Math.max(0, fallbackIndex) % fallbackColors.length];
  };

  // Membentuk array data untuk Bar Chart
  const distributionData = Object.keys(categoryTotals)
    .map((key) => {
      return {
        category: key,
        amount: categoryTotals[key],
        percentage:
          totalCalculated > 0
            ? (categoryTotals[key] / totalCalculated) * 100
            : 0,
        color: getCategoryColor(key), // 👈 Memanggil fungsi warna di atas
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="relative w-full pb-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#855230] animate-pulse"></span>
            <span className="text-[11px] text-[#855230] font-mono tracking-widest font-semibold uppercase">
              Live Database
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            General Expenses
          </h1>
          <p className="text-sm text-[#504440] mt-1 max-w-2xl leading-relaxed">
            Catat pengeluaran operasional langsung per-event photobooth,
            konsumsi crew, akomodasi transportasi, serta logistik teknis
            lapangan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="subtle" icon="refresh" onClick={fetchExpenses}>
            Sync Data
          </Button>
          <Button
            variant="primary"
            icon="add_circle"
            onClick={() => onNavigate("add-expense")}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Top Summary Banner & Mini Metric Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-12 bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-[#855230] mb-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  payments
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Total Pengeluaran Sesuai Filter
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl text-[#090100] font-serif font-bold tracking-tight">
                  {formatIDR(totalCalculated)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0ede9]">
            <div className="flex justify-between items-center text-[#504440] text-xs mb-2.5">
              <span className="font-semibold text-[#855230] uppercase tracking-wider">
                Distribusi Pos Beban (Real-Time)
              </span>
            </div>

            {distributionData.length > 0 ? (
              <>
                {/* Visual breakdown bar dinamis */}
                <div className="w-full h-2.5 rounded-full bg-[#f0ede9] flex overflow-hidden mb-3.5 shadow-inner">
                  {distributionData.map((data, idx) => (
                    <div
                      key={idx}
                      className="h-full hover:opacity-80 transition-opacity cursor-pointer"
                      style={{
                        width: `${data.percentage}%`,
                        backgroundColor: data.color,
                      }}
                      title={`${data.category}: ${formatIDR(data.amount)} (${data.percentage.toFixed(1)}%)`}
                    ></div>
                  ))}
                </div>

                {/* Badges Legend dinamis */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {distributionData.map((data, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-black/10 shadow-xs"
                      style={{
                        backgroundColor: data.color,
                        color: ["#febb90", "#f59e0b"].includes(data.color)
                          ? "#090100"
                          : "#fcf9f4",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                      {data.category}: {formatIDR(data.amount)}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#827470]">
                Belum ada data pengeluaran untuk dihitung.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] rounded-xl p-4 mb-6 shadow-xs border border-[#d3c3be]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#827470]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari pengeluaran berdasarkan event atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f6f3ee] text-[#090100] placeholder:text-[#827470] text-xs rounded-lg focus:outline-none focus:bg-[#ffffff] border border-transparent focus:border-[#d3c3be] transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {/* 🔥 DROPDOWN KATEGORI YANG SUDAH DIRAPIKAN */}
          <div className="relative inline-block min-w-[160px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 pr-8 bg-[#f6f3ee] text-[#090100] text-xs rounded-lg border border-[#d3c3be]/40 focus:outline-none focus:bg-[#ffffff] font-medium cursor-pointer appearance-none transition-colors"
            >
              <option value="all">Semua Kategori</option>
              {/* Opsi dinamis berdasarkan kategori yang ada di DB */}
              {allUniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#827470] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* 🔥 DROPDOWN PERIODE YANG SUDAH DIRAPIKAN */}
          <div className="relative inline-block min-w-[150px]">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3.5 py-2 pr-8 bg-[#f6f3ee] text-[#090100] text-xs rounded-lg border border-[#d3c3be]/40 focus:outline-none focus:bg-[#ffffff] font-medium cursor-pointer appearance-none transition-colors"
            >
              <option value="all">Semua Periode</option>
              {uniquePeriods.map((period) => (
                <option key={period} value={period}>
                  {formatMonthName(period)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#827470] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f3ee] text-[#855230] text-xs uppercase tracking-wider border-b border-[#d3c3be]/40">
                <th className="py-3 px-6 font-semibold">Tanggal</th>
                <th className="py-3 px-6 font-semibold">Kategori</th>
                <th className="py-3 px-6 font-semibold">Terkait Event</th>
                <th className="py-3 px-6 font-semibold">
                  Deskripsi / Peruntukan
                </th>
                <th className="py-3 px-6 font-semibold text-right">Nominal</th>
                <th className="py-3 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3c3be]/30 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-[#855230] animate-spin mb-2">
                      sync
                    </span>
                    <p className="text-sm font-semibold text-[#090100]">
                      Memuat Data Keuangan...
                    </p>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#504440]">
                    <span className="material-symbols-outlined text-3xl text-[#827470] mb-2">
                      receipt
                    </span>
                    <p className="text-sm font-serif font-bold text-[#090100]">
                      Belum ada pengeluaran
                    </p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f6f3ee]/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-[#504440] whitespace-nowrap">
                      {item.dateFormatted || item.date}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-black/10 shadow-xs"
                        style={{
                          backgroundColor: getCategoryColor(item.category),
                          color: ["#febb90", "#f59e0b"].includes(
                            getCategoryColor(item.category),
                          )
                            ? "#090100"
                            : "#fcf9f4",
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-serif font-semibold text-[#090100] max-w-xs truncate">
                      {item.eventname || item.eventName || "-"}
                    </td>
                    <td className="py-4 px-6 text-[#504440] max-w-sm truncate">
                      {item.description}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#090100] text-right whitespace-nowrap">
                      {formatIDR(item.amount)}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onEditExpense(item);
                            onNavigate("add-expense");
                          }}
                          className="p-1 rounded-md text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id, item.description)
                          }
                          className="p-1 rounded-md text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
