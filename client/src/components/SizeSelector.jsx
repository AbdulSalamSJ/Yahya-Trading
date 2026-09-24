import React from 'react';
import { getProductSizes } from '../utils/productSizes';

export function SizeSelector({
  product,
  selectedSize,
  onSelectSize,
  showLabel = true,
  compact = false,
  className = ''
}) {
  const sizes = getProductSizes(product);
  const currentSize = selectedSize || sizes[0] || '250G';

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className={`block font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 ${compact ? 'text-[11px] mb-1' : 'text-xs sm:text-sm mb-1.5'} select-none`}>
          SIZE
        </label>
      )}

      <div className="relative inline-block w-full max-w-[240px]">
        <select
          value={currentSize}
          onChange={(e) => onSelectSize(e.target.value)}
          className={`w-full appearance-none bg-[#f2f2f2] hover:bg-[#e9e9e9] dark:bg-[#262626] dark:hover:bg-[#2f2f2f] text-neutral-900 dark:text-neutral-100 font-semibold border border-neutral-300 dark:border-neutral-700 rounded-sm cursor-pointer shadow-xs transition-colors focus:outline-none focus:border-neutral-500 ${
            compact ? 'px-3 py-1.5 text-xs pr-8' : 'px-3.5 py-2.5 text-sm sm:text-base pr-9'
          }`}
          aria-label="Select product size"
        >
          {sizes.map((size) => (
            <option
              key={size}
              value={size}
              className="bg-white dark:bg-[#222222] text-neutral-900 dark:text-white py-1.5"
            >
              {size}
            </option>
          ))}
        </select>

        {/* Downward triangle arrow matching screenshot */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-neutral-800 dark:text-neutral-200 select-none">
          ▼
        </span>
      </div>
    </div>
  );
}

export default SizeSelector;

