import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PaymentProofUpload({ onUploadComplete, onShowToast }) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Buat nama file unik
      const fileExt = file.name.split(".").pop();
      const uniqueName = `tf_${Date.now()}.${fileExt}`;

      // Upload ke Supabase Storage (bucket: payment_proofs)
      const { error } = await supabase.storage
        .from("payment_proofs")
        .upload(uniqueName, file);

      if (error) throw error;

      // Ambil URL Publiknya
      const { data } = supabase.storage.from("payment_proofs").getPublicUrl(uniqueName);

      setFileName(file.name);
      onUploadComplete(data.publicUrl, file.name); // Kirim URL ke form utama
      onShowToast("Bukti transfer berhasil diamankan di database!");
    } catch (error) {
      console.error("Upload error:", error);
      onShowToast("Gagal mengunggah bukti transfer.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (fileName) {
    return (
      <div className="p-4 rounded-xl bg-[#c7ecce]/20 border border-[#c7ecce] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c7ecce] text-[#01210f] flex items-center justify-center">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#090100]">{fileName}</span>
            <span className="text-[10px] block text-[#504440]">Berhasil Diunggah</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <label className="border-2 border-dashed border-[#d3c3be] hover:border-[#855230] rounded-xl p-5 bg-[#f6f3ee] flex flex-col items-center justify-center text-center gap-2.5 transition-colors cursor-pointer relative">
      <div className="w-11 h-11 rounded-full bg-[#ffffff] shadow-xs flex items-center justify-center text-[#855230]">
        <span className="material-symbols-outlined text-[22px]">
          {isUploading ? "hourglass_top" : "upload_file"}
        </span>
      </div>
      <span className="text-xs font-semibold text-[#090100]">
        {isUploading ? "Sedang Mengunggah..." : "Klik untuk memilih foto (Max 5MB)"}
      </span>
      <input type="file" accept="image/*,application/pdf" onChange={handleUpload} className="hidden" disabled={isUploading} />
    </label>
  );
}