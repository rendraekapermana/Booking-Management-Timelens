import React, { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function RegisterForm({
  onLoginSuccess,
  setErrorMessage,
  setSuccessMessage,
  switchToLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Konfirmasi password tidak cocok.");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          fullname: formData.fullName,
          phone: formData.phone,
        });

        if (profileError)
          console.error("Gagal menyimpan profil:", profileError);

        if (authData?.session) {
          setSuccessMessage("Registrasi berhasil! Masuk ke studio...");
          setTimeout(() => {
            onLoginSuccess({
              name: formData.fullName,
              email: formData.email,
              role: "Studio Owner",
            });
          }, 1000);
        } else {
          setSuccessMessage(
            "Registrasi berhasil! Silakan periksa email atau langsung masuk.",
          );
          setTimeout(() => switchToLogin(), 1500);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Full Name
        </label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          placeholder="Natasya Mareta"
          className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Email Address
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="curator@timelens.com"
          className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Phone / WhatsApp Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="08123456789"
          className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-11 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-[#504440] hover:text-[#2c1810] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-11 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 text-[#504440] hover:text-[#2c1810] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showConfirmPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="terms"
          required
          checked={formData.agreeTerms}
          onChange={(e) =>
            setFormData({ ...formData, agreeTerms: e.target.checked })
          }
          className="h-4 w-4 mt-0.5 rounded accent-[#2c1810] cursor-pointer"
        />
        <label
          htmlFor="terms"
          className="text-xs text-[#504440] leading-snug cursor-pointer"
        >
          I agree to Timelens Studio{" "}
          <span className="font-semibold text-[#2c1810] underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-semibold text-[#2c1810] underline">
            Privacy Policy
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3.5 bg-[#2c1810] text-[#fcf9f4] font-medium rounded-lg hover:bg-[#090100] transition-colors flex items-center justify-center gap-2 tracking-wide cursor-pointer shadow-sm text-sm disabled:opacity-50"
      >
        <span>{loading ? "Processing..." : "Register Account"}</span>
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </button>
    </form>
  );
}
