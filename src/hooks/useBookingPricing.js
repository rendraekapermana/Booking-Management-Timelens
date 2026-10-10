import { useMemo } from "react";

/**
 * Hook to reactively calculate booking prices, transport surcharges, and make designs FREE
 * @param {Object} options
 * @param {string} options.duration (Contoh: "2 Jam", "5 Jam")
 * @param {string} options.paperType (Contoh: "Photostrip", "4R (4x6)")
 * @param {number} [options.distanceKm=0] - Jarak lokasi event dari studio
 * @param {number} [options.dpRatio=0.5]
 * @returns {Object}
 */
export function useBookingPricing({
  duration,
  paperType = "",
  distanceKm = 0,
  dpRatio = 0.5,
}) {
  return useMemo(() => {
    let basePrice = 0;

    // 1. Ambil angka jam dari string (misal "5 Jam" jadi angka 5)
    const hours = parseInt(duration) || 4;

    // 2. Cek apakah klien memilih Photostrip (case insensitive)
    const isPhotostrip = paperType.toLowerCase().includes("photostrip");

    // 3. Logika Harga Berdasarkan Jenis Kertas & Durasi
    if (isPhotostrip) {
      if (hours === 2) basePrice = 1500000;
      else if (hours === 3) basePrice = 1850000;
      else if (hours === 4) basePrice = 2100000;
      else if (hours > 4) {
        // Jika 5 jam atau lebih: Harga 4 jam + (selisih jam * 350.000)
        basePrice = 2100000 + (hours - 4) * 350000;
      }
    } else {
      // Logika untuk Postcard (4R) & Photo Crack
      if (hours === 2) basePrice = 1950000;
      else if (hours === 3) basePrice = 2250000;
      else if (hours === 4) basePrice = 2500000;
      else if (hours > 4) {
        // Jika 5 jam atau lebih: Harga 4 jam + (selisih jam * 375.000)
        basePrice = 2500000 + (hours - 4) * 375000;
      }
    }

    // 4. 🔥 LOGIKA TARIF TRANSPORT BARU
    let transportFee = 0;
    if (distanceKm > 60) {
      transportFee = 250000; // Lebih dari 60km = 250k
    } else if (distanceKm > 50) {
      transportFee = 150000; // Antara 50km - 60km = 150k
    } else if (distanceKm > 40) {
      transportFee = 100000; // Antara 40km - 50km = 100k
    }
    // Jika di bawah atau sama dengan 40km, transportFee tetap 0 (Gratis)

    // 5. Kalkulasi Total
    const grandTotal = basePrice + transportFee;
    const downPayment = grandTotal * dpRatio;
    const remainingDue = grandTotal - downPayment;

    return {
      basePrice,
      framePrice: 0, // GRATIS
      backdropPrice: 0, // GRATIS
      paperPrice: 0, // Harga kertas sudah include di basePrice
      transportFee,
      grandTotal,
      downPayment,
      remainingDue,
    };
  }, [duration, paperType, distanceKm, dpRatio]);
}
