import React, { useState } from 'react';
import { formatDateID, parseCleanNumber } from '../lib/formatters.js';
import Button from '../components/ui/Button.jsx';

export default function AddExpensePage({ onNavigate, onAddExpense, expenseToEdit, onShowToast }) {
  const [formData, setFormData] = useState({
    date: expenseToEdit ? expenseToEdit.date : '2024-10-21',
    category: expenseToEdit ? expenseToEdit.category : 'Transportasi',
    eventName: expenseToEdit ? expenseToEdit.eventName : 'Wedding Sarah & Dimas (The Glass House)',
    description: expenseToEdit ? expenseToEdit.description : 'Transport & Tol antar perlengkapan booth - SCBD',
    amount: expenseToEdit ? String(expenseToEdit.amount) : '250.000',
    paymentMethod: expenseToEdit ? expenseToEdit.paymentMethod : 'Cash',
    notes: expenseToEdit ? expenseToEdit.notes : 'Diserahkan kepada Kru Runner untuk reload logistik di SCBD.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAmount = parseCleanNumber(formData.amount);
    const formattedDate = formatDateID(formData.date);

    const newExpense = {
      id: expenseToEdit ? expenseToEdit.id : `EXP-${Date.now()}`,
      date: formData.date,
      dateFormatted: formattedDate,
      category: formData.category,
      eventName: formData.eventName,
      description: formData.description,
      amount: cleanAmount,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      period: formData.date.substring(0, 7)
    };

    onAddExpense(newExpense);
    onShowToast(`Pengeluaran sebesar Rp ${cleanAmount.toLocaleString('id-ID')} berhasil dicatat.`);
    onNavigate('expenses');
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-2 pb-12 flex flex-col gap-8">
      {/* Top Editorial Header & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('expenses')}
            className="text-xs uppercase tracking-wider text-[#855230] hover:text-[#090100] transition-colors cursor-pointer"
          >
            Expenses
          </button>
          <span className="material-symbols-outlined text-[13px] text-[#827470]">chevron_right</span>
          <span className="text-xs text-[#504440] uppercase tracking-wider">
            {expenseToEdit ? 'EDIT EXPENSE' : 'ADD EXPENSES'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl text-[#090100] tracking-tight font-serif font-bold">
              Catat Pengeluaran Operasional
            </h1>
            <p className="text-sm text-[#504440] mt-1 max-w-xl">
              Catat pengeluaran operasional per-event photobooth, konsumsi crew, akomodasi transportasi, serta logistik teknis lapangan.
            </p>
          </div>
        </div>
      </div>

      {/* Centered Form Canvas */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[640px] bg-[#ffffff] rounded-xl shadow-md border border-[#d3c3be]/40 overflow-hidden relative">
          {/* Warm Walnut Accent Bar at Card Top */}
          <div className="h-1.5 w-full bg-[#2c1810]"></div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 flex flex-col gap-6">
            {/* Section 1: Tanggal & Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">calendar_today</span>
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">category</span>
                  Kategori Pengeluaran
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                >
                  <option value="Konsumsi / Crew Ops">Konsumsi / Crew Ops</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Crew Fee / Ops">Crew Fee / Ops</option>
                  <option value="Logistik Event">Logistik Event</option>
                  <option value="Operasional Venue">Operasional Venue</option>
                  <option value="Perlengkapan Studio">Perlengkapan Studio</option>
                </select>
              </div>
            </div>

            {/* Section 2: Event Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">celebration</span>
                Terkait Booking / Event Photobooth
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding Sarah & Dimas (The Glass House)"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] placeholder:text-[#827470] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                required
              />
            </div>

            {/* Section 3: Deskripsi / Peruntukan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">description</span>
                Deskripsi Pengeluaran
              </label>
              <input
                type="text"
                placeholder="e.g. Transport & Tol antar perlengkapan booth - SCBD"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] placeholder:text-[#827470] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                required
              />
            </div>

            {/* Section 4: Nominal & Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">attach_money</span>
                  Jumlah Nominal (Rp)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-bold text-[#855230]">Rp</span>
                  <input
                    type="text"
                    placeholder="250.000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#f6f3ee] rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-mono font-semibold text-[#090100] placeholder:text-[#827470] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">credit_card</span>
                  Metode Pembayaran
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
                >
                  <option value="Cash">Cash / Petty Cash Studio</option>
                  <option value="Transfer BCA">Transfer BCA</option>
                  <option value="Transfer Mandiri">Transfer Mandiri</option>
                  <option value="Kartu Debit">Kartu Debit</option>
                </select>
              </div>
            </div>

            {/* Section 5: Catatan Tambahan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">notes</span>
                Catatan Tambahan
              </label>
              <textarea
                rows={3}
                placeholder="Keterangan tambahan untuk buku besar operasional..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] placeholder:text-[#827470] focus:bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#855230] border border-[#d3c3be]/40"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede9]">
              <Button
                variant="outline"
                onClick={() => onNavigate('expenses')}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon="save"
              >
                {expenseToEdit ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
