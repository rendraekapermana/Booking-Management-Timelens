import React, { useState, useEffect } from "react";
import { formatDateID, parseCleanNumber } from "../lib/formatters.js";
import Button from "../components/ui/Button.jsx";
import { expenseService } from "../services/expenseService.js";
import { bookingService } from "../services/bookingService.js";

// Kategori bawaan (Standard) yang tidak bisa dihapus
const DEFAULT_CATEGORIES = [
  "Konsumsi / Crew Ops",
  "Transportasi",
  "Crew Fee / Ops",
  "Logistik Event",
  "Operasional Venue",
  "Perlengkapan Studio",
];

export default function AddExpensePage({
  onNavigate,
  expenseToEdit,
  bookingForExpense,
  onShowToast,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [eventSearch, setEventSearch] = useState("");
  const [eventOptions, setEventOptions] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  // 🔥 STATE UNTUK MANAJEMEN KATEGORI
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Load kategori kustom dari Local Storage
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem("customExpenseCategories");
    return saved ? JSON.parse(saved) : [];
  });

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    date: expenseToEdit ? expenseToEdit.date : getTodayDate(),
    category: expenseToEdit ? expenseToEdit.category : DEFAULT_CATEGORIES[1],
    eventName: expenseToEdit
      ? expenseToEdit.eventname || expenseToEdit.eventName
      : bookingForExpense?.eventName || "",
    bookingId: expenseToEdit
      ? expenseToEdit.booking_id || ""
      : bookingForExpense?.id || "",
    deductFromProfitSharing: expenseToEdit
      ? expenseToEdit.deduct_from_profit_sharing !== false
      : true,
    description: expenseToEdit ? expenseToEdit.description : "",
    amount: expenseToEdit ? String(expenseToEdit.amount) : "",
    paymentMethod: expenseToEdit ? expenseToEdit.paymentMethod : "Cash",
    notes: expenseToEdit ? expenseToEdit.notes : "",
  });

  const handleCancel = () =>
    onNavigate(
      bookingForExpense ? "booking-detail" : "expenses",
      bookingForExpense || null,
    );

  useEffect(() => {
    let isCurrentRequest = true;
    const search = eventSearch.trim();
    const timeout = window.setTimeout(
      async () => {
        setIsLoadingEvents(true);
        try {
          const options = await bookingService.getExpenseEventOptions(search);
          if (isCurrentRequest) setEventOptions(options);
        } catch (error) {
          console.error("Gagal memuat pilihan event:", error);
          if (isCurrentRequest) {
            setEventOptions([]);
            if (onShowToast)
              onShowToast("Gagal memuat daftar event.", "error");
          }
        } finally {
          if (isCurrentRequest) setIsLoadingEvents(false);
        }
      },
      search.length >= 2 ? 250 : 0,
    );

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeout);
    };
  }, [eventSearch]);

  // Jika sedang mengedit, pastikan kategori lamanya masuk ke daftar custom (jika belum ada)
  useEffect(() => {
    if (expenseToEdit && expenseToEdit.category) {
      if (
        !DEFAULT_CATEGORIES.includes(expenseToEdit.category) &&
        !customCategories.includes(expenseToEdit.category)
      ) {
        const updated = [...customCategories, expenseToEdit.category];
        setCustomCategories(updated);
        localStorage.setItem(
          "customExpenseCategories",
          JSON.stringify(updated),
        );
      }
    }
  }, [expenseToEdit]);

  // 🔥 FUNGSI SIMPAN KATEGORI KUSTOM
  const handleSaveCustomCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: DEFAULT_CATEGORIES[0] });
      return;
    }

    // Cek apakah sudah ada
    if (
      !DEFAULT_CATEGORIES.includes(trimmed) &&
      !customCategories.includes(trimmed)
    ) {
      const updated = [...customCategories, trimmed];
      setCustomCategories(updated);
      localStorage.setItem("customExpenseCategories", JSON.stringify(updated));
    }

    setFormData({ ...formData, category: trimmed });
    setIsCustomCategory(false);
    setNewCategoryInput("");
  };

  // 🔥 FUNGSI HAPUS KATEGORI KUSTOM
  const handleDeleteCustomCategory = (catToDelete) => {
    if (
      window.confirm(
        `Hapus kategori "${catToDelete}" dari daftar pilihan? (Data pengeluaran lama tidak akan terhapus)`,
      )
    ) {
      const updated = customCategories.filter((c) => c !== catToDelete);
      setCustomCategories(updated);
      localStorage.setItem("customExpenseCategories", JSON.stringify(updated));
      setFormData({ ...formData, category: DEFAULT_CATEGORIES[0] }); // Reset pilihan ke default
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const cleanAmount = parseCleanNumber(formData.amount);
      const formattedDate = formatDateID(formData.date);

      const payload = {
        date: formData.date,
        dateFormatted: formattedDate,
        category: formData.category,
        eventName: formData.eventName || "-",
        booking_id: formData.bookingId ? String(formData.bookingId) : null,
        deduct_from_profit_sharing: formData.deductFromProfitSharing,
        description: formData.description,
        amount: cleanAmount,
      };

      if (expenseToEdit) {
        await expenseService.update(expenseToEdit.id, payload);
        if (onShowToast) onShowToast(`Pengeluaran berhasil diperbarui.`);
      } else {
        await expenseService.create(payload);
        if (onShowToast)
          onShowToast(
            `Pengeluaran Rp ${cleanAmount.toLocaleString("id-ID")} berhasil dicatat.`,
          );
      }

      onNavigate(
        bookingForExpense ? "booking-detail" : "expenses",
        bookingForExpense || null,
      );
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      if (onShowToast)
        onShowToast("Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-2 pb-12 flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs uppercase tracking-wider text-[#855230] hover:text-[#090100] transition-colors cursor-pointer"
          >
            Expenses
          </button>
          <span className="material-symbols-outlined text-[13px] text-[#827470]">
            chevron_right
          </span>
          <span className="text-xs text-[#504440] uppercase tracking-wider">
            {expenseToEdit ? "EDIT EXPENSE" : "ADD EXPENSES"}
          </span>
        </div>
        <div>
          <h1 className="text-3xl text-[#090100] tracking-tight font-serif font-bold">
            {expenseToEdit
              ? "Edit Pengeluaran Operasional"
              : "Catat Pengeluaran Operasional"}
          </h1>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[640px] bg-[#ffffff] rounded-xl shadow-md border border-[#d3c3be]/40 overflow-hidden relative">
          <div className="h-1.5 w-full bg-[#2c1810]"></div>

          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-10 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tanggal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">
                    calendar_today
                  </span>{" "}
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] focus:bg-[#ffffff] border border-[#d3c3be]/40 outline-none focus:border-[#855230]"
                  required
                />
              </div>

              {/* 🔥 LOGIKA KATEGORI (DROPDOWN + INPUT + DELETE) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#855230]">
                    category
                  </span>{" "}
                  Kategori Pengeluaran
                </label>

                {isCustomCategory ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ketik kategori baru..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveCustomCategory();
                        }
                      }}
                      className="w-full bg-[#ffffff] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] border border-[#855230] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomCategory}
                      className="p-2 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] rounded-lg transition-colors shadow-xs"
                      title="Simpan Kategori"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setNewCategoryInput("");
                      }}
                      className="p-2 bg-[#f6f3ee] text-[#827470] hover:text-[#090100] rounded-lg border border-[#d3c3be]/40 transition-colors"
                      title="Batal"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === "ADD_CUSTOM") {
                            setIsCustomCategory(true);
                          } else {
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            });
                          }
                        }}
                        className="w-full bg-[#f6f3ee] rounded-lg pl-3.5 pr-8 py-2.5 text-sm text-[#090100] focus:bg-[#ffffff] border border-[#d3c3be]/40 cursor-pointer appearance-none outline-none focus:border-[#855230]"
                      >
                        {DEFAULT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}

                        {customCategories.length > 0 && (
                          <optgroup label="Custom Categories">
                            {customCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        <option disabled>──────────</option>
                        <option
                          value="ADD_CUSTOM"
                          className="font-bold text-[#855230]"
                        >
                          + Tambah Kategori Baru...
                        </option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#827470] pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Tombol Hapus jika kategori yang dipilih adalah kategori Custom */}
                    {customCategories.includes(formData.category) && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCustomCategory(formData.category)
                        }
                        className="p-2.5 bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] border border-[#fecaca] rounded-lg transition-colors shrink-0"
                        title="Hapus Kategori Custom Ini"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Event Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">
                  celebration
                </span>{" "}
                Nama Event
              </label>
              <div className="relative">
                <input
                  type="text"
                  role="combobox"
                  aria-expanded={isEventDropdownOpen}
                  aria-controls="expense-event-options"
                  autoComplete="off"
                  placeholder="Cari atau pilih nama event..."
                  value={
                    isEventDropdownOpen ? eventSearch : formData.eventName
                  }
                  onFocus={() => {
                    setEventSearch("");
                    setIsEventDropdownOpen(true);
                  }}
                  onChange={(e) => {
                    setEventSearch(e.target.value);
                    setFormData({
                      ...formData,
                      eventName: "",
                      bookingId: "",
                    });
                    setIsEventDropdownOpen(true);
                  }}
                  onBlur={() =>
                    window.setTimeout(
                      () => setIsEventDropdownOpen(false),
                      120,
                    )
                  }
                  className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[#090100] border border-[#d3c3be]/40 outline-none focus:border-[#855230]"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#827470] pointer-events-none">
                  expand_more
                </span>
                {isEventDropdownOpen && (
                  <div
                    id="expense-event-options"
                    role="listbox"
                    className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-[#d3c3be]/60 bg-white shadow-lg"
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={!formData.eventName}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          eventName: "",
                          bookingId: "",
                        });
                        setEventSearch("");
                        setIsEventDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs text-[#504440] hover:bg-[#f6f3ee]"
                    >
                      Tidak terkait event
                    </button>
                    {isLoadingEvents ? (
                      <p className="px-3.5 py-3 text-xs text-[#827470]">
                        Memuat event...
                      </p>
                    ) : eventOptions.length > 0 ? (
                      eventOptions.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          role="option"
                          aria-selected={formData.eventName === event.eventName}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              eventName: event.eventName,
                              bookingId: String(event.id),
                            });
                            setEventSearch("");
                            setIsEventDropdownOpen(false);
                          }}
                          className="w-full border-t border-[#f0ede9] px-3.5 py-2.5 text-left hover:bg-[#f6f3ee]"
                        >
                          <span className="block text-xs font-semibold text-[#090100]">
                            {event.eventName}
                          </span>
                          <span className="mt-1 block text-[11px] text-[#827470]">
                            {[formatDateID(event.date), event.customerName, event.venueName]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3.5 py-3 text-xs text-[#827470]">
                        {eventSearch.trim().length >= 2
                          ? "Event tidak ditemukan. Coba kata kunci lain."
                          : "Tidak ada event untuk bulan ini dan bulan berikutnya."}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#827470]">
                Menampilkan event bulan ini dan bulan berikutnya. Ketik minimal
                2 karakter untuk mencari semua event, termasuk event lama.
              </p>
              {formData.bookingId && (
                <label className="flex items-start gap-2 rounded-lg border border-[#d3c3be]/40 bg-[#fcf9f4] p-3 text-xs text-[#504440]">
                  <input
                    type="checkbox"
                    checked={formData.deductFromProfitSharing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deductFromProfitSharing: e.target.checked,
                      })
                    }
                    className="mt-0.5 accent-[#855230]"
                  />
                  <span>
                    <span className="block font-semibold text-[#090100]">
                      Kurangi laba sebelum dibagi
                    </span>
                    Biaya ini akan mengurangi laba bersih pada ringkasan bagi
                    hasil event.
                  </span>
                </label>
              )}
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">
                  description
                </span>{" "}
                Deskripsi Pengeluaran
              </label>
              <input
                type="text"
                placeholder="e.g. Transport & Tol antar perlengkapan booth - SCBD"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-[#f6f3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#090100] border border-[#d3c3be]/40 outline-none focus:border-[#855230]"
                required
              />
            </div>

            {/* Nominal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#090100] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#855230]">
                  attach_money
                </span>{" "}
                Jumlah Nominal (Rp)
              </label>
              <div className="relative flex items-center w-full md:w-1/2">
                <span className="absolute left-3.5 text-xs font-mono font-bold text-[#855230]">
                  Rp
                </span>
                <input
                  type="text"
                  placeholder="250.000"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full bg-[#f6f3ee] rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-mono font-semibold text-[#090100] border border-[#d3c3be]/40 outline-none focus:border-[#855230]"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede9]">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Batal
              </Button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] disabled:opacity-50 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      sync
                    </span>{" "}
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">
                      save
                    </span>{" "}
                    {expenseToEdit ? "Simpan Perubahan" : "Catat Pengeluaran"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
