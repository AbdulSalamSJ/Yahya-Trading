import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    categorySlug: 'dates',
    tag: 'Direct Harvest • Royal Dates',
    title: 'Sacred Medina Ajwa & Royal King Medjoul Dates',
    subtitle: 'Hand-picked from certified palm groves in Saudi Arabia & Jordan Valley. Luscious caramel sweetness, rich in essential minerals, and packed at peak harvest.',
    startingPrice: 380,
    unit: '500g',
    image: '/images/categories/dates.jpg',
    ctaText: 'Explore Dates Collection',
    features: ['100% Pure & Natural', 'Certified Medina Ajwa', 'Zero Added Sugars'],
    accentColor: '#fee000',
    gradient: 'from-[#1c0c04]/85 via-[#351808]/50 to-transparent',
    bloomColor: 'bg-amber-400',
    varieties: [
      { name: 'Saudi Ajwa', price: 750, image: '/images/products/ajwa-dates.jpg' },
      { name: 'Medjoul King', price: 620, image: '/images/products/medjoul-dates.jpg' },
      { name: 'Mabroom Royal', price: 550, image: '/images/products/mabroom-dates.jpg' }
    ]
  },
  {
    id: 2,
    categorySlug: 'nuts',
    tag: 'Supreme Grade • Hand-Sorted Nuts',
    title: 'California Nonpareil Almonds & Jumbo W180 Cashews',
    subtitle: 'Wood-fired slow-roasted coastal cashews, California Nonpareil almonds, and Himalayan salt-dusted open-mouth pistachios for the ultimate golden crunch.',
    startingPrice: 280,
    unit: '500g',
    image: '/images/categories/nuts.jpg',
    ctaText: 'Explore Premium Nuts',
    features: ['Rare W180 Jumbo Grade', 'Wood-Fired Roast', 'Rich in Heart-Healthy Fats'],
    accentColor: '#10b981',
    gradient: 'from-[#031d13]/85 via-[#073623]/50 to-transparent',
    bloomColor: 'bg-emerald-400',
    varieties: [
      { name: 'California Almonds', price: 420, image: '/images/products/california-almonds.jpg' },
      { name: 'Jumbo Cashews', price: 480, image: '/images/products/cashews-w180.jpg' },
      { name: 'Kashmiri Walnuts', price: 540, image: '/images/products/walnuts.jpg' },
      { name: 'Roasted Pistachios', price: 490, image: '/images/products/pistachios.jpg' },
      { name: 'Roasted Peanuts', price: 180, image: '/images/products/peanuts.jpg' }
    ]
  },
  {
    id: 3,
    categorySlug: 'dry-fruits',
    tag: 'Naturally Dried • Sun-Kissed Fruits',
    title: 'Afghani Sun-Dried Anjeer & Exotic Ruby Berries',
    subtitle: 'Traditional string-dried Kandahar figs, plump golden raisins, sun-dehydrated Spanish orange crisps, and antioxidant-rich ruby cranberries.',
    startingPrice: 240,
    unit: '500g',
    image: '/images/categories/dry-fruits.jpg',
    ctaText: 'Explore Dry Fruits',
    features: ['Naturally String-Dried', 'Rich in Fiber & Iron', 'Peak Nutrient Density'],
    accentColor: '#f97316',
    gradient: 'from-[#2a0b02]/85 via-[#4e1504]/50 to-transparent',
    bloomColor: 'bg-orange-400',
    varieties: [
      { name: 'Afghani Anjeer', price: 580, image: '/images/products/afghani-anjeer.jpg' },
      { name: 'Orange Slices', price: 290, image: '/images/products/orange-slices.jpg' },
      { name: 'Golden Raisins', price: 240, image: '/images/products/golden-raisins.jpg' }
    ]
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
      className="relative w-full overflow-hidden bg-[#1c140e] border-b border-amber-900/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Images Background with cross-fade */}
      <div className="relative h-[500px] sm:h-[560px] lg:h-[620px] w-full">
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

              {/* Luminous colorful gradient overlay: left-side readable gradient, right-side bright and open */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

              {/* Radiant light bloom highlights */}
              <div className={`absolute -right-16 -top-16 w-96 h-96 rounded-full blur-3xl opacity-35 pointer-events-none ${item.bloomColor}`} />
              <div className={`absolute -left-16 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${item.bloomColor}`} />
            </div>
          );
        })}

        {/* Slide Content Layer */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-4 sm:space-y-5">
            
            {/* Tag / Category Badge & Starting Price Tag */}
            <div className="flex flex-wrap items-center gap-2.5 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black text-white shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fee000] animate-pulse" />
                <span className="tracking-wide uppercase text-[11px]">{slide.tag}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fee000] text-[#1d1d1d] font-black text-xs sm:text-sm shadow-md">
                <span className="text-[11px] uppercase tracking-wider font-bold">Starts from</span>
                <span className="text-sm sm:text-base font-black">₹ {slide.startingPrice.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-semibold text-neutral-700">/{slide.unit}</span>
              </div>
            </div>

            {/* Banner Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-100 leading-relaxed max-w-xl font-normal drop-shadow">
              {slide.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {slide.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles size={12} className="text-[#fee000]" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>

            {/* Varieties Preview Chips with Bright White Glass Cards & Rupee Price Tags */}
            <div className="pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#fee000] mb-2.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#fee000]" />
                <span>Featured Varieties &amp; Prices:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {slide.varieties.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCta(slide.categorySlug)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-neutral-900 border-2 border-[#fee000] hover:border-amber-400 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer transition-all group/v select-none"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-6 h-6 rounded-full object-cover border border-amber-300 group-hover/v:scale-110 transition-transform"
                    />
                    <span className="text-xs font-bold text-neutral-900 group-hover/v:text-[#92400e] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs font-black text-[#108474] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ₹ {item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => handleCta(slide.categorySlug)}
                className="px-7 sm:px-9 py-3.5 bg-[#fee000] hover:bg-[#f5d600] active:scale-95 text-[#1d1d1d] text-sm sm:text-base font-black rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleCta('all')}
                className="px-6 sm:px-7 py-3.5 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md border-2 border-white/50 text-white text-sm font-bold rounded-full transition-all cursor-pointer shadow-md"
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
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-neutral-900 border border-white shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-neutral-900 border border-white shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>

        {/* Bottom Banner Slide Indicators with Category Names & Starting Price */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
          {bannerSlides.map((item, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-md ${
                  isActive
                    ? 'bg-[#fee000] text-[#1d1d1d] font-black scale-105 ring-2 ring-[#fee000]/50'
                    : 'bg-white/80 hover:bg-white text-neutral-800 border border-white/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#1d1d1d]' : 'bg-neutral-500'}`} />
                <span className="capitalize">{item.categorySlug.replace('-', ' ')}</span>
                <span className={`text-[10px] font-extrabold ${isActive ? 'text-neutral-900' : 'text-[#108474]'}`}>
                  from ₹ {item.startingPrice}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
