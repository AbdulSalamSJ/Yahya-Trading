import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Dr. Zeeshan Farooqui',
    role: 'Verified Buyer',
    location: 'Mumbai',
    product: 'Royal Saudi Ajwa Al-Madinah Dates',
    rating: 5,
    title: 'Pure authentic Medina Ajwa! Outstanding quality',
    comment: 'The Ajwa dates were fresh, tender, and came in pristine luxury vacuum packaging. Tastes exactly like what we get directly from Saudi Arabia. Yahya Traders has become our family go-to.',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Priyanka Saxena',
    role: 'Verified Buyer',
    location: 'Bangalore',
    product: 'Medjoul King Dates Jumbo',
    rating: 5,
    title: 'Colossal dates that melt in your mouth',
    comment: 'Biggest dates I have ever seen online in India! Naturally sweet, soft as caramel, and perfect for morning breakfast smoothies and healthy snacking.',
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    role: 'Verified Buyer',
    location: 'Delhi NCR',
    product: 'King Jumbo W180 Roasted & Salted Cashews',
    rating: 5,
    title: 'Crispy, jumbo cashews with perfect Himalayan salt',
    comment: 'Not a single broken piece in the 500g pouch. The wood-roasted aroma and crunch are unmatched. Shipped within 24 hours just as advertised!',
    date: '3 weeks ago'
  },
  {
    id: 4,
    name: 'Siddharth Varma',
    role: 'Corporate Gifting',
    location: 'Hyderabad',
    product: 'Yahya Traders Royal Wooden Gift Hamper',
    rating: 5,
    title: 'Gave this hamper to our clients — they were thrilled!',
    comment: 'The wooden box craftsmanship is remarkable. All four jars were sealed and brimming with premium dry fruits. 10/10 gift!',
    date: '1 month ago'
  }
];

export function CustomerTestimonials() {
  return (
    <section className="py-14 bg-neutral-50 dark:bg-[#181818] border-b border-gray-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center text-[#fee000]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#fee000" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                4.9 / 5.0 Rating (2,400+ Reviews)
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1d] dark:text-white">
              Let Our Customers Speak for Us
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Genuine experiences from verified Yahya Traders customers across India
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#108474] bg-[#e6f4f1] dark:bg-[#108474]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              100% Verified Buyer Reviews
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#fee000]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#fee000" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{item.date}</span>
                </div>

                {/* Review Title */}
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                  "{item.title}"
                </h4>

                {/* Review Comment */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  {item.comment}
                </p>
              </div>

              {/* Author and Product */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#1d1d1d] dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {item.location}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-[#108474] bg-[#e6f4f1] dark:bg-[#108474]/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} />
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 truncate">
                  Item: {item.product}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
