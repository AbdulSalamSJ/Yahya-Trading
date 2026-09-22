import React from 'react';
import { Sparkles, ShieldCheck, Truck, Award, CheckCircle2 } from 'lucide-react';

export function CategoryVarietyHero({
  category,
  products = [],
  selectedProductId,
  onSelectProductVariety
}) {
  if (!category) return null;

  const categoryImg = category.image_url || `/images/categories/${category.slug}.jpg`;

  return (
    <section className="mb-10 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181818] shadow-md transition-all p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => {
          const isSelected = selectedProductId === product.id;
          const varietyImage = product.images && product.images.length > 0
            ? product.images[0]
            : `/images/categories/${category.slug}.jpg`;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProductVariety(product.id)}
              className={`group relative flex flex-col p-2.5 rounded-2xl bg-white dark:bg-[#1f1f1f] border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isSelected
                ? 'border-[#fee000] ring-2 ring-[#fee000] shadow-md dark:border-[#fee000]'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-[#fee000] dark:hover:border-[#fee000]'
                }`}
            >
              {/* Variety Photo with thumbnail styling */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-2.5">
                <img
                  src={varietyImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-[#fee000] text-[#1d1d1d] rounded-full p-0.5 shadow">
                    <CheckCircle2 size={14} className="fill-[#1d1d1d] text-[#fee000]" />
                  </div>
                )}
                {product.origin && (
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/70 text-white truncate text-center backdrop-blur-xs">
                    {product.origin.split(',')[0]}
                  </span>
                )}
              </div>

              {/* Variety Name & Price */}
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-xs font-bold text-[#1d1d1d] dark:text-neutral-100 line-clamp-2 group-hover:text-[#108474] dark:group-hover:text-[#fee000] transition-colors leading-tight">
                  {product.name}
                </p>
                <p className="text-[11px] font-extrabold text-[#108474] dark:text-[#14b8a6] mt-1.5">
                  ₹{Number(product.price).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
