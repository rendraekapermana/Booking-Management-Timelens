import React, { useState } from "react";

export default function BookingFormsPage({ onNavigate, onShowToast }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDuration, setNewDuration] = useState(
    "Standard Evening (4 Hours • Dual Strips)",
  );
  const [requireDeposit, setRequireDeposit] = useState(true);

  // 🔥 STATE UNTUK FORM BUILDER DINAMIS (Default Field)
  const [formFields, setFormFields] = useState([
    {
      id: Date.now() + 1,
      label: "Nama Lengkap",
      type: "text",
      required: true,
      options: "",
    },
    {
      id: Date.now() + 2,
      label: "Nomor WhatsApp",
      type: "text",
      required: true,
      options: "",
    },
    {
      id: Date.now() + 3,
      label: "Tanggal Acara",
      type: "date",
      required: true,
      options: "",
    },
  ]);

  const publicUrl = `${window.location.origin}/#book/main-atelier`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicUrl);
    onShowToast("Public reservation URL copied to clipboard: " + publicUrl);
  };

  // 🔥 FUNGSI MANIPULASI FIELD FORM
  const handleAddField = () => {
    setFormFields([
      ...formFields,
      { id: Date.now(), label: "", type: "text", required: false, options: "" },
    ]);
  };

  const handleRemoveField = (id) => {
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id, key, value) => {
    setFormFields(
      formFields.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  // 🔥 SIMPAN FORM (Persiapan Integrasi Database)
  const handleCreateForm = async (e) => {
    e.preventDefault();

    // Payload data ini yang nantinya dikirim ke tabel `booking_forms` di Supabase
    const payload = {
      title: newFormName,
      slug: newSlug,
      duration_setup: newDuration,
      require_deposit: requireDeposit,
      form_schema: formFields, // ➔ Disimpan sebagai JSONB
    };

    console.log("Data Form yang akan disimpan ke DB:", payload);

    // Di sini nanti ditaruh fungsi: await supabase.from('booking_forms').insert(payload)

    setShowCreateModal(false);
    onShowToast(
      `New intake form "${newFormName || "Custom Event Form"}" published!`,
      "success",
    );

    // Reset Form
    setNewFormName("");
    setNewSlug("");
    setFormFields([
      {
        id: Date.now() + 1,
        label: "Nama Lengkap",
        type: "text",
        required: true,
        options: "",
      },
      {
        id: Date.now() + 2,
        label: "Nomor WhatsApp",
        type: "text",
        required: true,
        options: "",
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#855230] uppercase tracking-[0.25em] font-semibold">
              Atelier Form Engine
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            Booking Forms
          </h1>
          <p className="text-sm text-[#504440] leading-relaxed">
            Manage public booking request forms for your website and social
            links. Captured submissions sync directly to your atelier calendar
            and lead archive.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Create New Form</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-[#504440]">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
              Total Submissions
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#855230]">
              assignment
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl text-[#090100] font-serif font-bold">
              142{" "}
              <span className="text-xs text-[#504440] font-normal">
                Pesanan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Form Container & Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0ede9] pb-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c7ecce] text-[#01210f] text-xs font-semibold tracking-wide inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d633b] animate-pulse"></span>
                    Active · Live Form
                  </span>
                  <span className="text-xs text-[#504440] tracking-wider uppercase font-mono font-bold">
                    FORM-01
                  </span>
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <h2 className="text-2xl text-[#090100] font-serif font-bold">
                    Timelens Official Event Booking Form
                  </h2>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#ebe8e3] flex items-center justify-center shrink-0 text-[#855230]">
                    <span className="material-symbols-outlined text-[18px]">
                      link
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                      Public Share URL
                    </span>
                    <span className="text-xs text-[#090100] font-mono truncate select-all font-semibold">
                      timelens.studio/book/main-atelier
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 bg-[#ffffff] text-[#855230] text-xs font-semibold rounded-lg border border-[#d3c3be]/40 shadow-xs cursor-pointer inline-flex items-center gap-1.5 hover:bg-[#fcf9f4]"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>{" "}
                    Copy Link
                  </button>
                  <button
                    onClick={() => onNavigate("public-booking")}
                    className="px-3.5 py-1.5 bg-[#ffffff] text-[#855230] text-xs font-semibold rounded-lg border border-[#d3c3be]/40 shadow-xs cursor-pointer inline-flex items-center gap-1.5 hover:bg-[#fcf9f4]"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      open_in_new
                    </span>{" "}
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL CREATE NEW FORM (Diperlebar untuk Form Builder) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#090100]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative border border-[#d3c3be]/40 flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between pb-4 border-b border-[#f0ede9] shrink-0">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#855230] uppercase tracking-widest font-semibold">
                  Dynamic Engine
                </span>
                <h3 className="text-2xl text-[#090100] font-serif font-bold mt-0.5">
                  Create Custom Booking Form
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#504440] hover:bg-[#f6f3ee] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <form
              onSubmit={handleCreateForm}
              className="pt-4 overflow-y-auto pr-2 space-y-6 flex-1"
            >
              {/* SECTION 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#855230] uppercase tracking-wider border-b border-[#f0ede9] pb-2">
                  1. Form Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
                      Form Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Autumn Vintage Weddings 2025"
                      value={newFormName}
                      onChange={(e) => setNewFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f3ee] text-[#090100] text-sm focus:outline-none focus:bg-[#ffffff] border border-[#d3c3be]/40"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
                      URL Slug
                    </label>
                    <div className="flex items-center bg-[#f6f3ee] rounded-lg px-3 py-2.5 border border-[#d3c3be]/40">
                      <span className="text-xs text-[#827470] font-mono">
                        timelens/
                      </span>
                      <input
                        type="text"
                        placeholder="autumn-2025"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        className="bg-transparent flex-1 text-[#090100] font-mono text-sm focus:outline-none pl-1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 SECTION 2: Form Builder */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#855230] uppercase tracking-wider border-b border-[#f0ede9] pb-2 flex justify-between items-center">
                  <span>2. Form Fields (Questions)</span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="text-xs bg-[#f6f3ee] px-2 py-1 rounded text-[#090100] hover:bg-[#ebe8e3] cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      add
                    </span>{" "}
                    Add Field
                  </button>
                </h4>

                <div className="flex flex-col gap-3">
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-3.5 bg-[#ffffff] border border-[#d3c3be]/60 rounded-xl shadow-xs flex flex-col gap-3 relative group"
                    >
                      {/* Tombol Hapus Field */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="absolute top-3 right-3 text-[#827470] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-8">
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold text-[#504440] uppercase">
                            Question Label
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              handleUpdateField(
                                field.id,
                                "label",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Tipe Kertas Foto"
                            className="w-full px-3 py-1.5 text-sm bg-[#f6f3ee] border border-transparent focus:border-[#d3c3be] rounded-md outline-none"
                            required
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-[#504440] uppercase">
                            Input Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleUpdateField(
                                field.id,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-1.5 text-sm bg-[#f6f3ee] border border-transparent focus:border-[#d3c3be] rounded-md outline-none cursor-pointer appearance-none"
                          >
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text (Notes)</option>
                            <option value="select">Dropdown Menu</option>
                            <option value="date">Date Picker</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                handleUpdateField(
                                  field.id,
                                  "required",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 accent-[#2c1810]"
                            />
                            <span className="text-xs font-semibold text-[#1c1c19]">
                              Required
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Tampilkan Input Options Khusus untuk Tipe "select" */}
                      {field.type === "select" && (
                        <div className="w-full">
                          <label className="text-[10px] font-bold text-[#504440] uppercase">
                            Dropdown Options (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            value={field.options}
                            onChange={(e) =>
                              handleUpdateField(
                                field.id,
                                "options",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Hitam, Putih, Merah Marun"
                            className="w-full px-3 py-1.5 mt-1 text-sm bg-[#fcf9f4] border border-[#d3c3be]/40 rounded-md outline-none focus:border-[#855230]"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {formFields.length === 0 && (
                    <div className="text-center p-6 text-sm text-[#827470] border border-dashed border-[#d3c3be] rounded-xl">
                      Belum ada field pertanyaan. Klik "Add Field" di atas.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f0ede9] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#504440] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Publish Form to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
