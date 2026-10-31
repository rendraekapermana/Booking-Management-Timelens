import React, { useState } from "react";
import { studioProfile } from "../lib/mock/mockData.js";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import ForgotPasswordForm from "../components/ForgotPasswordForm.jsx"; // Import komponen baru

export default function LoginPage({ onLoginSuccess }) {
  // authView bisa bernilai: 'login', 'register', atau 'forgot'
  const [authView, setAuthView] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fungsi dinamis untuk teks judul berdasarkan view
  const getHeaderTexts = () => {
    switch (authView) {
      case "register":
        return {
          title: "Create Your Account",
          sub: "Sign up to manage your studio events and bookings",
        };
      case "forgot":
        return {
          title: "Reset Password",
          sub: "Enter your email to receive a password reset link",
        };
      default:
        return {
          title: "Sign In",
          sub: "Enter your credentials to access the studio management console",
        };
    }
  };

  const headerText = getHeaderTexts();

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
            <h1 className="text-2xl font-brand text-[#2c1810] font-bold tracking-tight">
              {headerText.title}
            </h1>
            <p className="text-xs text-[#504440] mt-2">{headerText.sub}</p>
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

          {/* Render Form Berdasarkan State authView */}
          {authView === "register" && (
            <RegisterForm
              onLoginSuccess={onLoginSuccess}
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
              switchToLogin={() => setAuthView("login")}
            />
          )}

          {authView === "forgot" && (
            <ForgotPasswordForm
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
            />
          )}

          {authView === "login" && (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
              onForgotPassword={() => {
                setAuthView("forgot");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            />
          )}

          {/* Bottom Switcher */}
          <div className="mt-8 pt-6 border-t border-[#f0ede9] w-full flex items-center justify-center gap-1.5 text-center text-xs">
            {authView === "forgot" ? (
              <button
                type="button"
                onClick={() => {
                  setAuthView("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="font-semibold text-[#2c1810] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  arrow_back
                </span>
                Back to Sign In
              </button>
            ) : (
              <>
                <span className="text-[#504440]">
                  {authView === "register"
                    ? "Already have an account?"
                    : "Don't have an account yet?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthView(authView === "register" ? "login" : "register");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="font-semibold text-[#2c1810] hover:underline cursor-pointer"
                >
                  {authView === "register" ? "Sign In" : "Register Account"}
                </button>
              </>
            )}
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
