import React, { useState } from 'react';
import { formatIDR } from '../lib/formatters.js';
import { useExpenseFilter } from '../hooks/useExpenseFilter.js';
import Button from '../components/ui/Button.jsx';

export default function ExpensesPage({
  expenses,
  onNavigate,
  onDeleteExpense,
  onEditExpense,
  onShowToast
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-10');
  const [searchQuery, setSearchQuery] = useState('');

  // Use custom filter hook
  const { filteredExpenses, totalCalculated } = useExpenseFilter(expenses, {
    category: selectedCategory,
    period: selectedPeriod,
    query: searchQuery
  });

  return (
    <div className="relative w-full pb-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            General Expenses
          </h1>
          <p className="text-sm text-[#504440] mt-1 max-w-2xl leading-relaxed">
            Catat pengeluaran operasional langsung per-event photobooth, konsumsi crew, akomodasi transportasi, serta logistik teknis lapangan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon="add_circle"
            onClick={() => onNavigate('add-expense')}
          >
            + Add Expense
          </Button>
        </div>
      </div>

      {/* Top Summary Banner & Mini Metric Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-12 bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#d3c3be]/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-[#855230] mb-1.5">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Total Pengeluaran Bulan Ini
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl text-[#090100] font-serif font-bold tracking-tight">
                  {formatIDR(totalCalculated)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#f6f3ee] text-[#855230] font-medium border border-[#d3c3be]/30">
                  <span className="material-symbols-outlined text-[14px]">event</span>
                  Oktober 2024
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0ede9]">
            <div className="flex justify-between items-center text-[#504440] text-xs mb-2.5">
              <span className="font-semibold text-[#855230] uppercase tracking-wider">
                Distribusi Pos Beban Event
              </span>
              <span className="font-mono text-[#504440] text-xs">
                Crew Fee 33% · Transport 28% · Konsumsi 17% · Logistik 13% · Operasional Venue 9%
              </span>
            </div>

            {/* Visual breakdown bar */}
            <div className="w-full h-2 rounded-full bg-[#f0ede9] flex overflow-hidden mb-3.5">
              <div className="h-full bg-[#2c1810]" style={{ width: '33%' }} title="Crew Fee: Rp 300.000"></div>
              <div className="h-full bg-[#855230]" style={{ width: '28%' }} title="Transportasi: Rp 250.000"></div>
              <div className="h-full bg-[#504440]" style={{ width: '17%' }} title="Konsumsi: Rp 150.000"></div>
              <div className="h-full bg-[#febb90]" style={{ width: '13%' }} title="Logistik: Rp 120.000"></div>
              <div className="h-full bg-[#827470]" style={{ width: '9%' }} title="Venue / Parkir: Rp 80.000"></div>
            </div>

            {/* Badges Legend */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-[#2c1810] text-[#fcf9f4] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Crew Fee: Rp 300.000
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#855230] text-[#fcf9f4] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Transportasi: Rp 250.000
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#504440] text-[#fcf9f4] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Konsumsi: Rp 150.000
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#febb90] text-[#794827] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#794827]"></span> Logistik: Rp 120.000
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#827470] text-[#fcf9f4] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Venue / Parkir: Rp 80.000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] rounded-xl p-4 mb-6 shadow-xs border border-[#d3c3be]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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

        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#f6f3ee] text-[#090100] text-xs rounded-lg border border-[#d3c3be]/40 focus:outline-none focus:bg-[#ffffff] font-medium"
          >
            <option value="all">Semua Kategori</option>
            <option value="Konsumsi">Konsumsi / Crew Ops</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Crew Fee">Crew Fee / Ops</option>
            <option value="Logistik">Logistik Event</option>
            <option value="Operasional Venue">Operasional Venue</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-[#f6f3ee] text-[#090100] text-xs rounded-lg border border-[#d3c3be]/40 focus:outline-none focus:bg-[#ffffff] font-medium"
          >
            <option value="all">Semua Periode</option>
            <option value="2024-10">Oktober 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-08">Agustus 2024</option>
          </select>
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
                <th className="py-3 px-6 font-semibold">Deskripsi / Peruntukan</th>
                <th className="py-3 px-6 font-semibold text-right">Nominal</th>
                <th className="py-3 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3c3be]/30 text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#504440]">
                    <span className="material-symbols-outlined text-3xl text-[#827470] mb-2">receipt</span>
                    <p className="text-sm font-serif font-bold text-[#090100]">Belum ada pengeluaran pada filter ini</p>
                    <p className="text-xs text-[#827470] mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f6f3ee]/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#504440] whitespace-nowrap">
                      {item.dateFormatted}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f6f3ee] text-[#855230] border border-[#d3c3be]/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-serif font-semibold text-[#090100] max-w-xs truncate">
                      {item.eventName}
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
                            onNavigate('add-expense');
                          }}
                          className="p-1 rounded-md text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] transition-colors cursor-pointer"
                          title="Edit Pengeluaran"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus pengeluaran "${item.description}"?`)) {
                              onDeleteExpense(item.id);
                              onShowToast('Pengeluaran berhasil dihapus');
                            }
                          }}
                          className="p-1 rounded-md text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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
