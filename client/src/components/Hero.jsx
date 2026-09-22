import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Award } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    categorySlug: 'dates',
    tag: 'Direct Harvest • Royal Dates',
    title: 'Sacred Medina Ajwa & Royal King Medjoul Dates',
    subtitle: 'Hand-picked from certified palm groves in Saudi Arabia & Jordan Valley. Luscious caramel sweetness, rich in essential minerals, and packed at peak harvest.',
    image: '/images/categories/dates.jpg',
    ctaText: 'Explore Dates Collection',
    features: ['100% Pure & Natural', 'Certified Medina Ajwa', 'Zero Added Sugars'],
    accentColor: '#fee000'
  },
  {
    id: 2,
    categorySlug: 'nuts',
    tag: 'Supreme Grade • Hand-Sorted Nuts',
    title: 'California Nonpareil Almonds & Jumbo W180 Cashews',
    subtitle: 'Wood-fired slow-roasted coastal cashews, California Nonpareil almonds, and Himalayan salt-dusted open-mouth pistachios for the ultimate golden crunch.',
    image: '/images/categories/nuts.jpg',
    ctaText: 'Explore Premium Nuts',
    features: ['Rare W180 Jumbo Grade', 'Wood-Fired Roast', 'Rich in Heart-Healthy Fats'],
    accentColor: '#eab308'
  },
  {
    id: 3,
    categorySlug: 'dry-fruits',
    tag: 'Naturally Dried • Sun-Kissed Fruits',
    title: 'Afghani Sun-Dried Anjeer & Exotic Tart Berries',
    subtitle: 'Traditional string-dried Kandahar figs, plump golden raisins, sun-dehydrated Spanish orange crisps, and antioxidant-rich ruby cranberries.',
    image: '/images/categories/dry-fruits.jpg',
    ctaText: 'Explore Dry Fruits',
    features: ['Naturally String-Dried', 'Rich in Fiber & Iron', 'Peak Nutrient Density'],
    accentColor: '#f97316'
  }
];

export function Hero({ onExploreClick, onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);

  // Auto-advance banner every 6.5 seconds when not hovered
  useEffect(() => {
    if (!isPaused) {
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
      }, 6500);
    }
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused]);

  const slide = bannerSlides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleCta = (slug) => {
    if (slug === 'all') {
      if (onExploreClick) onExploreClick();
    } else {
      if (onSelectCategory) onSelectCategory(slug);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-900 border-b border-neutral-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Images Background with cross-fade */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full">
        {bannerSlides.map((item, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image with subtle zoom on active */}
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Multi-layered cinematic gradient overlays for high contrast and readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
            </div>
          );
        })}

        {/* Slide Content Layer */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
            
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-neutral-100 shadow-sm animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-[#fee000] animate-pulse" />
              <span>{slide.tag}</span>
            </div>

            {/* Banner Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl font-normal drop-shadow">
              {slide.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {slide.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-neutral-200 flex items-center gap-1.5"
                >
                  <Sparkles size={11} className="text-[#fee000]" />
                  {feat}
                </span>
              ))}
            </div>

            {/* Dates Varieties Preview on Dates Slide */}
            {slide.categorySlug === 'dates' && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#fee000] mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Dates Varieties Included:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: 'Saudi Ajwa', image: '/images/products/ajwa-dates.jpg', tag: 'Soft & Sacred' },
                    { name: 'Medjoul King', image: '/images/products/medjoul-dates.jpg', tag: 'Colossal Caramel' },
                    { name: 'Mabroom Royal', image: '/images/products/mabroom-dates.jpg', tag: 'Rich Toffee' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCta('dates')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#fee000]/40 hover:border-[#fee000] text-white cursor-pointer transition shadow-sm group/v"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#fee000] group-hover/v:scale-110 transition-transform"
                      />
                      <span className="text-xs font-bold text-neutral-100 group-hover/v:text-[#fee000] transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nuts Varieties Preview on Nuts Slide */}
            {slide.categorySlug === 'nuts' && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#fee000] mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Nuts Varieties Included:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: 'California Almonds', image: '/images/products/california-almonds.jpg' },
                    { name: 'Jumbo Cashews', image: '/images/products/cashews-w180.jpg' },
                    { name: 'Kashmiri Walnuts', image: '/images/products/walnuts.jpg' },
                    { name: 'Roasted Peanuts', image: '/images/products/peanuts.jpg' },
                    { name: 'Roasted Pistachios', image: '/images/products/pistachios.jpg' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCta('nuts')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#fee000]/40 hover:border-[#fee000] text-white cursor-pointer transition shadow-sm group/v"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#fee000] group-hover/v:scale-110 transition-transform"
                      />
                      <span className="text-xs font-bold text-neutral-100 group-hover/v:text-[#fee000] transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dry Fruits Varieties Preview on Dry Fruits Slide */}
            {slide.categorySlug === 'dry-fruits' && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#fee000] mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Dry Fruits Varieties Included:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: 'Afghani Anjeer', image: '/images/products/afghani-anjeer.jpg' },
                    { name: 'Orange Slices', image: '/images/products/orange-slices.jpg' },
                    { name: 'Golden Raisins', image: '/images/products/golden-raisins.jpg' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCta('dry-fruits')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#fee000]/40 hover:border-[#fee000] text-white cursor-pointer transition shadow-sm group/v"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#fee000] group-hover/v:scale-110 transition-transform"
                      />
                      <span className="text-xs font-bold text-neutral-100 group-hover/v:text-[#fee000] transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => handleCta(slide.categorySlug)}
                className="px-6 sm:px-8 py-3.5 bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-sm font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleCta('all')}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-sm font-bold rounded-full transition-all cursor-pointer"
              >
                View All Harvest
              </button>
            </div>

          </div>
        </div>

        {/* Left & Right Arrow Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Banner Slide Indicators with Category Names */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
          {bannerSlides.map((item, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                  isActive
                    ? 'bg-[#fee000] text-[#1d1d1d] shadow-md scale-105'
                    : 'bg-black/50 text-neutral-300 hover:bg-black/70 border border-white/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#1d1d1d]' : 'bg-neutral-400'}`} />
                <span className="capitalize">{item.categorySlug.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
