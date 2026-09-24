import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SizeSelector } from './SizeSelector';
import { getPriceForSize } from '../utils/productSizes';

export function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || '250G');

  const primaryImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80';

  // Calculate dynamic price based on selected size
  const currentPrice = getPriceForSize(product, selectedSize);
  const regularPrice = Math.round(currentPrice * 1.18);
  const discountPercent = Math.round(((regularPrice - currentPrice) / regularPrice) * 100);

  const handleOpenDetail = () => {
    onSelectProduct({
      ...product,
      selectedSize,
      price: currentPrice
    });
  };

  return (
    <div id={`product-${product.id}`} className="group relative bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col h-full scroll-mt-24">
      
      {/* Product Image Area */}
      <div 
        className="relative aspect-square overflow-hidden bg-[#f9f9f9] dark:bg-[#161616] cursor-pointer" 
        onClick={handleOpenDetail}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full bg-[#fee000] text-[#1d1d1d] shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.is_bestseller && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded-full bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d] shadow-sm">
              Top Pick
            </span>
          )}
          {product.is_new && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded-full bg-[#108474] text-white shadow-sm">
              Fresh Harvest
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="w-full py-2 px-3 bg-white/95 dark:bg-[#1d1d1d]/95 backdrop-blur-md rounded-full text-xs font-bold text-[#1d1d1d] dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-[#fee000] hover:text-black dark:hover:bg-[#fee000] dark:hover:text-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Sourcing Origin & Brand */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#108474] dark:text-[#14b8a6]">
              {product.origin || 'Sourced Globally'}
            </span>
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              {selectedSize}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleOpenDetail}
            className="text-sm sm:text-base font-bold text-[#1d1d1d] dark:text-neutral-100 leading-snug line-clamp-2 hover:text-[#fee000] dark:hover:text-[#fee000] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-[#fee000]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.floor(product.rating || 5) ? 'fill-[#fee000]' : 'text-neutral-300 dark:text-neutral-700'}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {Number(product.rating || 4.9).toFixed(1)}
            </span>
            <span className="text-[11px] text-neutral-400">
              ({product.reviews_count || 24})
            </span>
          </div>
        </div>

        {/* Pack Size Selector */}
        <div className="mt-3 pt-1" onClick={(e) => e.stopPropagation()}>
          <SizeSelector
            product={product}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            showLabel={true}
            compact={true}
          />
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#1d1d1d] dark:text-white">
                ₹ {currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                ₹ {regularPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#108474] block">
              In Stock & Ready to Ship
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, price: currentPrice, selectedSize }, 1, selectedSize);
            }}
            className="px-3.5 py-2 rounded-full bg-[#fee000] hover:bg-[#f5d600] active:scale-95 text-[#1d1d1d] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
