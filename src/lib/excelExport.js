import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Fungsi untuk men-generate dan mengunduh laporan eksekutif dalam bentuk Excel.
 * Dipisahkan secara modular agar UI komponen tetap bersih.
 */
export const generateReportsExcel = async (reportData, onShowToast) => {
  const {
    periodName,
    fileNameSuffix,
    metrics: {
      totalEvents,
      completedEvents,
      upcomingPaidEvents,
      dpEvents,
      grossRevenue,
      totalHppTransferred,
      incomePocket,
      totalExpensesReal,
      operationalPocketBalance,
      finalNetProfit,
    },
  } = reportData;

  if (onShowToast) onShowToast("Mempersiapkan Laporan Excel...", "success");

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Atelier");

    // 1. SETTING LEBAR KOLOM
    worksheet.columns = [
      { header: "Kategori", key: "kategori", width: 25 },
      { header: "Keterangan", key: "keterangan", width: 40 },
      { header: "Nilai / Jumlah", key: "nilai", width: 25 },
    ];

    // 2. JUDUL LAPORAN (Merge Cells & Styling)
    worksheet.mergeCells("A1:C1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `LAPORAN EKSEKUTIF TIMELENS ATELIER (${periodName})`;
    titleCell.font = {
      name: "Arial",
      size: 14,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2C1810" },
    }; // Coklat Gelap
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([]); // Baris kosong

    // 3. HEADER TABEL EVENT
    const headerRow = worksheet.addRow([
      "KATEGORI METRIK",
      "KETERANGAN",
      "NILAI LAPORAN",
    ]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF855230" },
      }; // Coklat Terang
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 4. DATA METRIK EVENT
    const eventData = [
      ["Total Event", "Semua reservasi terdata pada periode ini", totalEvents],
      ["Selesai", "Event lunas dan waktu telah berlalu", completedEvents],
      ["Upcoming", "Event lunas menunggu hari pelaksanaan", upcomingPaidEvents],
      ["DP / Pending", "Event yang belum dilunasi", dpEvents],
    ];

    eventData.forEach((data) => {
      const row = worksheet.addRow(data);
      row.getCell(3).alignment = { horizontal: "right" };
    });

    worksheet.addRow([]); // Baris kosong

    // 5. HEADER KEUANGAN
    const headerKeuangan = worksheet.addRow([
      "FINANSIAL",
      "KETERANGAN",
      "NOMINAL (IDR)",
    ]);
    headerKeuangan.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2D633B" },
      }; // Hijau
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // 6. DATA KEUANGAN
    const financialData = [
      ["Gross Revenue", "Omzet kotor dari pembayaran klien", grossRevenue],
      [
        "HPP Transferred",
        "Modal operasional (Dialihkan ke Pocket Ops)",
        totalHppTransferred,
      ],
      ["Pocket Income", "Pendapatan murni (Gross - HPP)", incomePocket],
      ["Real Expenses", "Beban pengeluaran riil bulan ini", totalExpensesReal],
      [
        "Pocket Operational",
        "Saldo Operasional (HPP - Beban Riil)",
        operationalPocketBalance,
      ],
      ["FINAL NET PROFIT", "Keuntungan bersih keseluruhan", finalNetProfit],
    ];

    financialData.forEach((data) => {
      const row = worksheet.addRow(data);
      const nominalCell = row.getCell(3);
      nominalCell.numFmt = '"Rp"#,##0;[Red]\-"Rp"#,##0'; // Format Rupiah + Merah jika minus
      nominalCell.alignment = { horizontal: "right" };

      if (data[0] === "FINAL NET PROFIT") {
        row.eachCell((c) => (c.font = { bold: true }));
      }
    });

    // 7. GENERATE & DOWNLOAD
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Timelens_Report_${fileNameSuffix}.xlsx`);
  } catch (error) {
    console.error("Gagal export excel:", error);
    if (onShowToast) onShowToast("Gagal mengunduh Excel", "error");
  }
};
