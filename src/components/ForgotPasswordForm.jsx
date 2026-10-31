import React, { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function ForgotPasswordForm({
  setErrorMessage,
  setSuccessMessage,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Supabase akan mengarahkan kembali ke URL asal aplikasimu
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setSuccessMessage(
        "A password reset link has been sent. Please check your email (including the spam folder).",
      );
      setEmail(""); // Kosongkan input setelah berhasil
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMessage(err.message || "Gagal mengirim email pemulihan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="curator@timelens.com"
          className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3.5 bg-[#2c1810] text-[#fcf9f4] font-medium rounded-lg hover:bg-[#090100] transition-colors flex items-center justify-center gap-2 tracking-wide cursor-pointer shadow-sm text-sm disabled:opacity-50"
      >
        <span>{loading ? "Sending..." : "Submit"}</span>
      </button>
    </form>
  );
}
