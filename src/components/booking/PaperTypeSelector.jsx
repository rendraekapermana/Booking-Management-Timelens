import React from 'react';
import { pricingOptions } from '../../lib/mock/mockData.js';
import { formatIDR } from '../../lib/formatters.js';

export default function PaperTypeSelector({
  selected,
  onChange,
  className = ''
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {pricingOptions.paperOptions.map((paper) => {
        const isSelected = selected === paper.name || selected === paper.id;
        return (
          <div
            key={paper.id}
            onClick={() => onChange(paper.name)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-[#ffffff] border-[#855230] shadow-sm ring-1 ring-[#855230]'
                : 'bg-[#f6f3ee]/30 border-[#d3c3be]/60 hover:bg-[#ffffff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-bold text-sm text-[#090100]">
                  {paper.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#855230]/10 text-[#855230]">
                  {paper.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#504440] leading-relaxed">
                {paper.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#d3c3be]/30 flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-[#827470]">Surcharge</span>
              <span className={`text-xs font-semibold ${paper.surcharge > 0 ? 'text-[#855230]' : 'text-[#504440]'}`}>
                {paper.surcharge > 0 ? `+${formatIDR(paper.surcharge)}` : 'Termasuk'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
