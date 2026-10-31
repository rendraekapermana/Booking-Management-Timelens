import React, { useState } from "react";
import { studioProfile } from "../lib/mock/mockData.js";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fcf9f4] font-sans antialiased text-[#1c1c19]">
      <div className="relative w-full max-w-md">
        <div className="bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center w-full mb-6">
            <div className="h-9 mb-4 flex items-center justify-center">
              <img
                src={studioProfile.logo}
                alt="Timelens"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#504440] mt-2">
              {isRegister
                ? "Sign up to manage your studio events and bookings"
                : "Enter your credentials to access the studio management console"}
            </p>
          </div>

          {/* Notifikasi Global */}
          {errorMessage && (
            <div className="w-full mb-4 p-3 bg-[#fdf2f2] border border-[#f8b4b4] text-[#9b2c2c] text-xs rounded-lg">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="w-full mb-4 p-3 bg-[#f0fff4] border border-[#9ae6b4] text-[#22543d] text-xs rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Pemanggilan Komponen Terpisah */}
          {isRegister ? (
            <RegisterForm
              onLoginSuccess={onLoginSuccess}
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
              switchToLogin={() => setIsRegister(false)}
            />
          ) : (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
            />
          )}

          {/* Bottom Switcher */}
          <div className="mt-8 pt-6 border-t border-[#f0ede9] w-full flex items-center justify-center gap-1.5 text-center text-xs">
            <span className="text-[#504440]">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account yet?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="font-semibold text-[#2c1810] hover:underline cursor-pointer"
            >
              {isRegister ? "Sign In" : "Register Account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#504440] tracking-wider">
            © 2026 Timelens Photobooth · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
