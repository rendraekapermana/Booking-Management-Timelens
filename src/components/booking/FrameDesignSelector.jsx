import React from 'react';
import { pricingOptions } from '../../lib/mock/mockData.js';
import { formatIDR } from '../../lib/formatters.js';

export default function FrameDesignSelector({
  selected,
  onChange,
  className = ''
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {pricingOptions.frameOptions.map((frame) => {
        const isSelected = selected === frame.label || selected === frame.id;
        return (
          <div
            key={frame.id}
            onClick={() => onChange(frame.label)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-[#ffffff] border-[#855230] shadow-sm ring-1 ring-[#855230]'
                : 'bg-[#f6f3ee]/30 border-[#d3c3be]/60 hover:bg-[#ffffff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-bold text-sm text-[#090100]">
                  {frame.label}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#855230] bg-[#855230]' : 'border-[#d3c3be]'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </div>
              </div>
              <p className="text-[11px] text-[#504440]">{frame.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#d3c3be]/30 flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-[#827470]">Biaya Desain</span>
              <span className={`text-xs font-semibold ${frame.surcharge > 0 ? 'text-[#855230]' : 'text-[#504440]'}`}>
                {frame.surcharge > 0 ? `+${formatIDR(frame.surcharge)}` : 'Termasuk'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
