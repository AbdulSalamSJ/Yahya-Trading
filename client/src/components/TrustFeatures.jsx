import React from 'react';
import { Truck, PackageCheck, Zap, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export function TrustFeatures() {
  const features = [
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Dispatched within 24 hours. Fast express shipping nationwide, free on orders above ₹ 499.',
      badge: '24h Dispatch'
    },
    {
      icon: PackageCheck,
      title: 'Custom Packaging',
      description: 'Aroma-lock vacuum pouches & luxury presentation boxes to guarantee crisp freshness upon arrival.',
      badge: 'Freshness Seal'
    },
    {
      icon: Zap,
      title: 'Express Checkout',
      description: 'Instant, secure checkout supporting UPI, Google Pay, Cards, NetBanking, and Cash on Delivery.',
      badge: '100% Secure'
    },
    {
      icon: Award,
      title: 'Top Quality, Just for You!',
      description: 'Hand-sorted and ethically sourced directly from Medina, California, Jordan, Switzerland & Kerala.',
      badge: 'Sourced Globally'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#141414] border-y border-gray-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#108474] dark:text-[#14b8a6] bg-[#e6f4f1] dark:bg-[#108474]/20 px-3 py-1 rounded-full">
            The Yahiya Traders Guarantee
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1d] dark:text-white mt-2">
            Why Discerning Food Lovers Choose Yahiya Traders
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Premium quality, certified freshness, and unmatched customer care at every step.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200/80 dark:border-neutral-800 hover:border-[#fee000] dark:hover:border-[#fee000]/60 transition-all duration-300 hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fee000] text-[#1d1d1d] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {f.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#1d1d1d] dark:text-white mb-2 group-hover:text-black dark:group-hover:text-[#fee000] transition-colors">
                    {f.title}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
