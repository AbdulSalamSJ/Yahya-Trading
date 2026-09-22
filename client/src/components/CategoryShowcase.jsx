import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const showcaseCategories = [
  {
    id: 'dates',
    slug: 'dates',
    name: 'Dates',
    subtitle: 'Royal Medina Ajwa, Medjoul & Mabroom',
    tag: 'Sacred Groves',
    badge: 'Direct Import',
    image: '/images/categories/dates.jpg',
    varieties: [
      { name: 'Saudi Ajwa', image: '/images/products/ajwa-dates.jpg', note: 'Medina' },
      { name: 'Medjoul King', image: '/images/products/medjoul-dates.jpg', note: 'Jumbo' },
      { name: 'Mabroom Royal', image: '/images/products/mabroom-dates.jpg', note: 'Al-Qassim' }
    ]
  },
  {
    id: 'nuts',
    slug: 'nuts',
    name: 'Nuts',
    subtitle: 'Almonds, Cashews, Walnuts, Peanuts & Pistachios',
    tag: 'California & India',
    badge: 'Wood-Fired Roast',
    image: '/images/categories/nuts.jpg',
    varieties: [
      { name: 'Almonds', image: '/images/products/california-almonds.jpg', note: 'Nonpareil' },
      { name: 'Cashews', image: '/images/products/cashews-w180.jpg', note: 'W180 Jumbo' },
      { name: 'Walnuts', image: '/images/products/walnuts.jpg', note: 'Kashmir' },
      { name: 'Peanuts', image: '/images/products/peanuts.jpg', note: 'Roasted' },
      { name: 'Pistachios', image: '/images/products/pistachios.jpg', note: 'In-Shell' }
    ]
  },
  {
    id: 'dry-fruits',
    slug: 'dry-fruits',
    name: 'Dry Fruits',
    subtitle: 'Afghani Anjeer Figs, Raisins & Berries',
    tag: 'Sun-Dried Mountain',
    badge: '100% Natural',
    image: '/images/categories/dry-fruits.jpg',
    varieties: [
      { name: 'Afghani Anjeer', image: '/images/products/afghani-anjeer.jpg', note: 'Kandahar' },
      { name: 'Orange Slices', image: '/images/products/orange-slices.jpg', note: 'Citrus' },
      { name: 'Golden Raisins', image: '/images/products/golden-raisins.jpg', note: 'Afghan' }
    ]
  },
  {
    id: 'spices',
    slug: 'spices',
    name: 'Spices',
    subtitle: 'Green Cardamom 8.5mm, Saffron & Cinnamon',
    tag: 'Idukki Kerala Estates',
    badge: 'Extra Bold Pods',
    image: '/images/categories/spices.jpg',
    varieties: [
      { name: 'Green Cardamom', image: '/images/products/cardamom-pods.jpg', note: '8.5mm' },
      { name: 'Black Pepper', image: '/images/products/black-pepper.jpg', note: 'Malabar' },
      { name: 'Cinnamon Quills', image: '/images/products/cinnamon-quills.jpg', note: 'Ceylon' },
      { name: 'Royal Saffron', image: '/images/products/saffron.jpg', note: 'Kashmir' }
    ]
  },
  {
    id: 'chocolates',
    slug: 'chocolates',
    name: 'Chocolates',
    subtitle: 'Swiss Toblerone, KitKat & Belgian Truffles',
    tag: 'European Imports',
    badge: 'Honey Nougat Crunch',
    image: '/images/categories/chocolates.jpg',
    varieties: [
      { name: 'Swiss Toblerone', image: '/images/products/toblerone.jpg', note: 'Nougat' },
      { name: 'KitKat Crisp', image: '/images/products/kitkat.jpg', note: 'Nestlé' },
      { name: 'Belgian Truffles', image: '/images/products/belgian-truffles.jpg', note: 'Cocoa' }
    ]
  },
  {
    id: 'seeds',
    slug: 'seeds',
    name: 'Seeds',
    subtitle: 'Organic Chia, Pumpkin & Sunflower Seeds',
    tag: 'Superfood Blend',
    badge: 'Rich in Omega-3',
    image: '/images/categories/seeds.jpg',
    varieties: [
      { name: 'Organic Chia', image: '/images/products/chia-seeds.jpg', note: 'Omega-3' },
      { name: 'Pumpkin Seeds', image: '/images/products/pumpkin-seeds.jpg', note: 'AAA Grade' },
      { name: 'Sunflower Seeds', image: '/images/products/sunflower-seeds.jpg', note: 'Shelled' }
    ]
  },
  {
    id: 'herbs',
    slug: 'herbs',
    name: 'Herbs',
    subtitle: 'Wild Mountain Rosemary, Oregano & Thyme',
    tag: 'Mediterranean Harvest',
    badge: 'Pure Botanical',
    image: '/images/categories/herbs.jpg',
    varieties: [
      { name: 'Rosemary & Thyme', image: '/images/products/rosemary-thyme.jpg', note: 'Crete' },
      { name: 'Greek Oregano', image: '/images/products/oregano.jpg', note: 'Wild' }
    ]
  },
  {
    id: 'snacks',
    slug: 'snacks',
    name: 'Snacks',
    subtitle: 'Peri-Peri Cashews & Crunchy Foxnut Makhana',
    tag: 'Guilt-Free Munchies',
    badge: 'Artisan Batch',
    image: '/images/categories/snacks.jpg',
    varieties: [
      { name: 'Peri-Peri Makhana', image: '/images/products/periperi-cashews-makhana.jpg', note: 'Spicy' },
      { name: 'Artisan Trail Mix', image: '/images/products/trail-mix.jpg', note: 'Energy' }
    ]
  }
];

export function CategoryShowcase({ onSelectCategory }) {
  return (
    <section className="w-full py-10 sm:py-16 bg-neutral-50/50 dark:bg-[#121212] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee000]/20 text-[#1d1d1d] dark:text-[#fee000] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1d1d1d] dark:text-white tracking-tight">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Select any collection below to discover our hand-picked harvests and artisan delicacies.
          </p>
        </div>

        {/* 8-Category Visual Grid (4 columns on desktop, 2 on mobile & tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {showcaseCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Subtle top & bottom shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Top Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#fee000] text-[#1d1d1d] shadow-sm tracking-wide uppercase">
                  {cat.badge}
                </span>

                {/* Bottom Overlay Category Name */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold text-[#fee000] tracking-wider uppercase block">
                    {cat.tag}
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight text-white group-hover:text-[#fee000] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>


                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#108474] dark:text-[#14b8a6] group-hover:text-[#1d1d1d] dark:group-hover:text-white transition-colors border-t border-neutral-100 dark:border-neutral-800/80">
                  <span>Explore Collection</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
