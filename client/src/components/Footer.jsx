import React from 'react';
import { Mail, ShieldCheck, Award, Phone, MapPin, Instagram, Facebook, Youtube, Truck } from 'lucide-react';
import logoImg from '../image/logo.jpg';

const topCollections = [
  { label: 'Saudi Ajwa Dates', category: 'dates', productId: 1 },
  { label: 'W180 Jumbo Cashews', category: 'nuts', productId: 5 },
  { label: 'Afghani Dried Figs (Anjeer)', category: 'dry-fruits', productId: 7 },
  { label: 'Aromatic Spices & Cardamom', category: 'spices', productId: 12 },
  { label: 'Swiss Chocolates', category: 'chocolates', productId: 9 },
  { label: 'Nutrient Seeds', category: 'seeds', productId: 13 },
  { label: 'Natural Culinary Herbs', category: 'herbs', productId: 14 },
  { label: 'Gourmet Roasted Snacks', category: 'snacks', productId: 15 },
];

export function Footer({ onSelectItem, onOpenTracking, onSelectCategory }) {
  return (
    <footer className="bg-[#1d1d1d] text-neutral-300 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">

          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#fee000] flex-shrink-0 bg-white group-hover:scale-105 transition-transform">
                <img src={logoImg} alt="Yahiya Traders" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight group-hover:text-[#fee000] transition-colors">Yahiya Traders</span>
                <span className="text-[10px] block tracking-widest text-[#fee000] uppercase font-bold">
                  Sourced Globally
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Yahiya Traders is puliangudi's premier destination for globally sourced dates, tree nuts, exotic dry fruits, and imported European chocolates.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-400">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#fee000]" />
                <span>+91 98657 84876(Mon - Sat, 9am - 7pm IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#fee000]" />
                <span> yahiyatraders2@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#fee000]" />
                <span>14B,Telungar Street, Puliangudi-627855,TN., India</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.instagram.com/yahiya_traders?stkn=MXN3MXlyaG5hcTQx" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#fee000] hover:text-[#1d1d1d] flex items-center justify-center text-neutral-300 transition">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/people/Yahiya-Traders/61591530527010" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#fee000] hover:text-[#1d1d1d] flex items-center justify-center text-neutral-300 transition">
                <Facebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#fee000] hover:text-[#1d1d1d] flex items-center justify-center text-neutral-300 transition">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Col 3: Categories / Top Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Collections</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              {topCollections.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSelectItem && onSelectItem(item.category, item.productId)}
                    className="hover:text-[#fee000] text-left transition cursor-pointer flex items-center gap-1.5 group text-xs text-neutral-400 hover:translate-x-0.5 transform duration-150"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-[#fee000] transition-colors"></span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onOpenTracking && onOpenTracking()}
                  className="hover:text-[#fee000] text-left transition cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li><a href="#" className="hover:text-[#fee000] transition">Shipping Policy (24h Dispatch)</a></li>
              <li><a href="#" className="hover:text-[#fee000] transition">Returns & Replacements</a></li>
              <li><a href="#" className="hover:text-[#fee000] transition">Quality & Freshness Guarantee</a></li>
              <li><a href="#" className="hover:text-[#fee000] transition">Corporate & Festive Gifting</a></li>
              <li><a href="#" className="hover:text-[#fee000] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#fee000] transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 5:  */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Verified Trust</h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Truck size={16} className="text-[#fee000] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">24h Express Dispatch</p>
                  <p className="text-[11px] text-neutral-500">Fast safe transit with aroma-lock seal.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#108474] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">100% Sourced Globally</p>
                  <p className="text-[11px] text-neutral-500">Authentic origins with certified test reports.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award size={16} className="text-[#fee000] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">Judge.me 4.9★ Rated</p>
                  <p className="text-[11px] text-neutral-500">Over 2,400+ satisfied customers nationwide.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Data Infolenz. All rights reserved.</p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">UPI</span>
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">Google Pay</span>
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">RuPay</span>
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">VISA</span>
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">Mastercard</span>
            <span className="px-2 py-1 bg-neutral-800 rounded border border-neutral-700">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
