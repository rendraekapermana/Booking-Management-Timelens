import React, { useState } from 'react';
import { studioProfile } from '../lib/mock/mockData.js';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Clara Vance',
    email: 'curator@timelensatelier.com',
    phone: '+62 812-3456-7890',
    password: '••••••••',
    confirmPassword: '••••••••',
    agreeTerms: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: formData.fullName || 'Clara Vance',
      email: formData.email,
      role: 'Studio Owner'
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#fcf9f4] font-sans antialiased text-[#1c1c19]">
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center w-full mb-8">
            <div className="h-9 mb-4 flex items-center justify-center">
              <img
                src={studioProfile.logo}
                alt="Timelens"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-serif text-[#2c1810] font-bold tracking-tight">
              {isRegister ? 'Create Your Account' : 'Sign In to Atelier'}
            </h1>
            <p className="text-xs text-[#504440] mt-2">
              {isRegister
                ? 'Sign up to manage your studio events and bookings'
                : 'Enter your credentials to access the studio management console'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Clara Vance"
                  className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="curator@timelensatelier.com"
                className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
              />
            </div>

            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#504440] hover:text-[#2c1810] transition-colors cursor-pointer"
                  title="Toggle Password Visibility"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#f6f3ee] border border-[#d3c3be]/40 rounded-lg text-sm text-[#2c1810] focus:outline-none focus:border-[#2c1810] transition-colors"
                />
              </div>
            )}

            {isRegister && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded accent-[#2c1810] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#504440] leading-snug cursor-pointer">
                  I agree to Timelens Studio{' '}
                  <span className="font-semibold text-[#2c1810] underline">Terms of Service</span> and{' '}
                  <span className="font-semibold text-[#2c1810] underline">Privacy Policy</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-[#2c1810] text-[#fcf9f4] font-medium rounded-lg hover:bg-[#090100] transition-colors flex items-center justify-center gap-2 tracking-wide cursor-pointer shadow-sm text-sm"
            >
              <span>{isRegister ? 'Register Account' : 'Sign In to Atelier'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={() => onLoginSuccess(studioProfile.owner)}
              className="w-full py-2.5 bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#855230] text-xs font-semibold rounded-lg transition-colors border border-[#d3c3be]/40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Quick Login as Clara Vance (Studio Owner)</span>
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-8 pt-6 border-t border-[#f0ede9] w-full flex items-center justify-center gap-1.5 text-center text-xs">
            <span className="text-[#504440]">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
            </span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold text-[#2c1810] hover:underline cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Register Account'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#504440] tracking-wider">
            © 2024 Timelens Photobooth Atelier · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
