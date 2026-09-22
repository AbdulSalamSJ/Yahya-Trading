import React from 'react';

const categoryItems = [
  {
    id: 'all',
    slug: 'all',
    name: 'All Harvest',
    count: '12+ items',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
    icon: '🌾'
  },
  {
    id: 'dates',
    slug: 'dates',
    name: 'Royal Dates',
    count: 'Medina & Jordan',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=80',
    icon: '🌴'
  },
  {
    id: 'nuts',
    slug: 'nuts',
    name: 'Nuts & Cashews',
    count: 'W180, Almonds',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    icon: '🌰'
  },
  {
    id: 'dry-fruits',
    slug: 'dry-fruits',
    name: 'Dry Fruits',
    count: 'Anjeer, Berries',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80',
    icon: '🍇'
  },
  {
    id: 'chocolates',
    slug: 'chocolates',
    name: 'Chocolates',
    count: 'Toblerone, KitKat',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=300&q=80',
    icon: '🍫'
  },
  {
    id: 'gift-boxes',
    slug: 'gift-boxes',
    name: 'Gift Boxes',
    count: 'Luxury Hampers',
    image: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&w=300&q=80',
    icon: '🎁'
  },
  {
    id: 'spices-seeds',
    slug: 'spices-seeds',
    name: 'Spices & Seeds',
    count: 'Cardamom, Chia',
    image: 'https://images.unsplash.com/photo-1596040033282-e3170b02f928?auto=format&fit=crop&w=300&q=80',
    icon: '🌿'
  }
];

export function CategoryCircles({ selectedCategory, onSelectCategory }) {
  return (
    <section className="py-8 bg-neutral-50 dark:bg-[#181818] border-b border-gray-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1d] dark:text-white">
              Shop by Category
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Hand-picked collections sourced directly from top farms & orchards globally
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-[#fee000] underline"
          >
            View All Categories
          </button>
        </div>

        {/* Category Circular Icons Row */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {categoryItems.map(item => {
            const isSelected = selectedCategory === item.slug;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.slug)}
                className="flex flex-col items-center group flex-shrink-0 text-center transition-transform hover:-translate-y-1 focus:outline-none"
              >
                {/* Circle Container */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                    isSelected
                      ? 'ring-4 ring-[#fee000] shadow-md scale-105'
                      : 'ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-[#fee000]/60'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-white dark:bg-neutral-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
                    
                    {/* Badge Emoji */}
                    <span className="absolute bottom-1 right-1 text-sm bg-white/90 dark:bg-black/80 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <span
                  className={`mt-2.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-[#1d1d1d] dark:text-[#fee000]'
                      : 'text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
