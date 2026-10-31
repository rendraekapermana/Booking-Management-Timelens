import React, { useState } from "react";
import { supabase } from "../lib/supabase.js";

// PERHATIKAN: Ada tambahan prop 'onForgotPassword'
export default function LoginForm({
  onLoginSuccess,
  setErrorMessage,
  setSuccessMessage,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (authData?.session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("fullname, phone")
          .eq("id", authData.session.user.id)
          .maybeSingle();

        if (profileError)
          console.warn("Gagal load profil tambahan:", profileError);

        const userName = profileData?.fullname || email.split("@")[0];

        setSuccessMessage("Berhasil masuk!");
        setTimeout(() => {
          onLoginSuccess({
            name: userName,
            email: email,
            phone: profileData?.phone || "",
            role: "Studio Owner",
          });
        }, 800);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
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

      <div className="flex flex-col gap-1.5">
        {/* BARIS INI DITAMBAHKAN TOMBOL FORGOT PASSWORD */}
        <div className="flex justify-between items-end">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
            Password
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-semibold text-[#855230] hover:text-[#2c1810] hover:underline cursor-pointer transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3.5 bg-[#2c1810] text-[#fcf9f4] font-medium rounded-lg hover:bg-[#090100] transition-colors flex items-center justify-center gap-2 tracking-wide cursor-pointer shadow-sm text-sm disabled:opacity-50"
      >
        <span>{loading ? "Processing..." : "Sign In"}</span>
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </button>
    </form>
  );
}
