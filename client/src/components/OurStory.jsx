import React from 'react';
import { Globe, Award, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import logoImg from '../image/logo.jpg';

export function OurStory() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#161616] border-b border-gray-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-full overflow-hidden border-2 border-[#fee000] shadow-md mb-2 bg-white">
            <img src={logoImg} alt="Yahya Traders" className="w-16 h-16 object-cover rounded-full" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-[#108474] dark:text-[#14b8a6] bg-[#e6f4f1] dark:bg-[#108474]/20 px-3 py-1 rounded-full">
              Sourced Globally
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1d1d1d] dark:text-white tracking-tight">
            The Yahya Traders Sourcing Journey
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            At Yahya Traders, our mission is simple: to connect discerning gourmet food lovers in India with the world’s most celebrated harvests. From sacred date groves in Medina and sunny almond valleys in California to Swiss chocolate chocolatiers in Bern and spice estates in Kerala, every item in our store is carefully hand-selected for superior quality, authentic origin, and peak freshness.
          </p>
        </div>

        {/* Global Origins Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-2xl">🇸🇦</span>
            <h3 className="text-base font-bold text-[#1d1d1d] dark:text-white">Royal Saudi Dates</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Certified Ajwa dates from Medina and luscious Mabroom dates from Al-Qassim, harvested through centuries-old traditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-2xl">🇺🇸</span>
            <h3 className="text-base font-bold text-[#1d1d1d] dark:text-white">California Orchard Almonds</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Supreme Nonpareil almonds bathed in Mediterranean-style sunshine, bursting with plant protein and natural vitamin E.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-2xl">🇨🇭</span>
            <h3 className="text-base font-bold text-[#1d1d1d] dark:text-white">European Imported Chocolates</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Directly imported Alpine milk chocolates, crisp hazelnut nougat wafers, and exotic confectionery favorites.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#fee000] text-[#1d1d1d] flex items-center justify-center font-bold">
              <Globe size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1d1d1d] dark:text-white">Direct Farm Link</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We skip multiple layers of middlemen, working with direct producers to guarantee harvest purity and fair grower pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#fee000] text-[#1d1d1d] flex items-center justify-center font-bold">
              <Award size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1d1d1d] dark:text-white">Artisanal Small Batches</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our jumbo W180 cashews and pistachios are gently dry roasted in small batches to seal in their rich crunch.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#fee000] text-[#1d1d1d] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1d1d1d] dark:text-white">Aroma-Lock Packaging</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every pouch is nitrogen-flushed and hermetically sealed to preserve the orchard-fresh taste until the moment you open it.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#fee000] text-[#1d1d1d] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#1d1d1d] dark:text-white">24h Express Dispatch</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Orders are packaged and dispatched within 24 hours in insulated protective boxes to ensure pristine condition upon arrival.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
