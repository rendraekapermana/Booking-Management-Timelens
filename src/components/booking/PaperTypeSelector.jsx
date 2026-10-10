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
              <img src="" alt="" />
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-bold text-sm text-[#090100]">
                  {paper.name}
                </span>
              </div>
              <p className="text-[11px] text-[#504440] leading-relaxed">
                {paper.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
