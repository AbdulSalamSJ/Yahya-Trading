import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Check, CheckCircle2, AlertCircle, Image as ImageIcon, Scale, Tag, Package, MapPin, Layers } from 'lucide-react';
import { api } from '../services/api';
import logoImg from '../image/logo.jpg';

const CATEGORY_IMAGE_PRESETS = {
  1: [
    { label: 'Ajwa Dates', url: '/images/products/ajwa-dates.jpg' },
    { label: 'Medjoul Dates', url: '/images/products/medjoul-dates.jpg' },
    { label: 'Mabroom Dates', url: '/images/products/mabroom-dates.jpg' },
    { label: 'Dates Category', url: '/images/categories/dates.jpg' }
  ],
  2: [
    { label: 'California Almonds', url: '/images/products/california-almonds.jpg' },
    { label: 'W180 Cashews', url: '/images/products/cashews-w180.jpg' },
    { label: 'Kashmiri Walnuts', url: '/images/products/walnuts.jpg' },
    { label: 'Roasted Peanuts', url: '/images/products/peanuts.jpg' },
    { label: 'Salted Pistachios', url: '/images/products/pistachios.jpg' }
  ],
  3: [
    { label: 'Afghani Anjeer / Figs', url: '/images/products/afghani-anjeer.jpg' },
    { label: 'Dried Orange Slices', url: '/images/products/orange-slices.jpg' },
    { label: 'Golden Afghan Raisins', url: '/images/products/golden-raisins.jpg' },
    { label: 'Dry Fruits Blend', url: '/images/categories/dry-fruits.jpg' }
  ],
  4: [
    { label: 'Green Cardamom 8.5mm', url: '/images/products/cardamom-pods.jpg' },
    { label: 'Tellicherry Black Pepper', url: '/images/products/black-pepper.jpg' },
    { label: 'Ceylon Cinnamon Quills', url: '/images/products/cinnamon-quills.jpg' },
    { label: 'Kashmiri Mongra Saffron', url: '/images/products/saffron.jpg' }
  ],
  5: [
    { label: 'Swiss Toblerone Nougat', url: '/images/products/toblerone.jpg' },
    { label: 'KitKat Crisp Wafers', url: '/images/products/kitkat.jpg' },
    { label: 'Belgian Cocoa Truffles', url: '/images/products/belgian-truffles.jpg' },
    { label: 'Luxury Chocolates', url: '/images/categories/chocolates.jpg' }
  ],
  6: [
    { label: 'Organic Chia Seeds', url: '/images/products/chia-seeds.jpg' },
    { label: 'AAA Pumpkin Seeds', url: '/images/products/pumpkin-seeds.jpg' },
    { label: 'Shelled Sunflower Seeds', url: '/images/products/sunflower-seeds.jpg' }
  ],
  7: [
    { label: 'Mountain Rosemary & Thyme', url: '/images/products/rosemary-thyme.jpg' },
    { label: 'Greek Oregano Flakes', url: '/images/products/oregano.jpg' }
  ],
  8: [
    { label: 'Peri-Peri Cashews & Makhana', url: '/images/products/periperi-cashews-makhana.jpg' },
    { label: 'Wholesome Artisan Trail Mix', url: '/images/products/trail-mix.jpg' }
  ]
};

export function AddItemModal({ isOpen, onClose, categories = [], onProductCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    brand: 'Yahya Traders Select',
    price: '',
    cocoa_percentage: 500,
    stock: 50,
    origin: 'Medina, Saudi Arabia',
    short_desc: '',
    description: '',
    image_url: '/images/products/ajwa-dates.jpg',
    is_featured: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Update default image when category changes
  useEffect(() => {
    const presets = CATEGORY_IMAGE_PRESETS[formData.category_id];
    if (presets && presets.length > 0 && !formData.name) {
      setFormData(prev => ({ ...prev, image_url: presets[0].url }));
    }
  }, [formData.category_id]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid price in ₹ INR');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category_id: Number(formData.category_id),
        brand: formData.brand || 'Yahya Traders Select',
        price: Number(formData.price),
        stock: Number(formData.stock || 50),
        origin: formData.origin || 'Imported',
        cocoa_percentage: Number(formData.cocoa_percentage || 500),
        short_desc: formData.short_desc || `Authentic premium selection from Yahya Traders. Freshly harvested and packed.`,
        description: formData.description || `Hand-sorted, certified pure harvest. Guaranteed fresh packaging with sealed aroma lock.`,
        is_featured: !!formData.is_featured,
        images: [formData.image_url || '/images/products/california-almonds.jpg']
      };

      const res = await api.createProduct(payload);
      if (res && res.product) {
        setSuccessMsg(`✓ "${res.product.name}" has been successfully added to catalog!`);
        if (onProductCreated) {
          onProductCreated(res.product);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.message || 'Failed to add item to catalog');
    } finally {
      setLoading(false);
    }
  };

  const currentPresets = CATEGORY_IMAGE_PRESETS[formData.category_id] || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-[#fafafa] dark:bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#fee000] shadow-sm flex-shrink-0 bg-white">
              <img src={logoImg} alt="Yahya Traders" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1d1d1d] dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-[#108474]" />
                <span>Add New Item to Catalog</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Publish a new dates, nuts, dry fruits, spices, chocolates, seeds, herbs, or snacks harvest.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-full bg-neutral-100 dark:bg-neutral-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid Layout: Form Controls & Live Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* 1. Item Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Harvest Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Saudi Ajwa Al-Madinah Dates (500g)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                  />
                </div>

                {/* 2. Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Store Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Brand / Harvest Label
                    </label>
                    <input
                      type="text"
                      placeholder="Yahya Traders Select"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>
                </div>

                {/* 3. Price & Net Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Price (₹ INR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-neutral-400">₹</span>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        required
                        placeholder="750"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Net Weight (grams) *
                    </label>
                    <div className="relative mb-1.5">
                      <input
                        type="number"
                        step="10"
                        min="1"
                        required
                        placeholder="500"
                        value={formData.cocoa_percentage}
                        onChange={(e) => setFormData({ ...formData, cocoa_percentage: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">grams</span>
                    </div>
                    {/* Presets */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-neutral-400">Presets:</span>
                      {[150, 250, 400, 500, 1000].map(wt => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() => setFormData({ ...formData, cocoa_percentage: wt })}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition cursor-pointer ${
                            Number(formData.cocoa_percentage) === wt
                              ? 'bg-[#108474] text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                          }`}
                        >
                          {wt >= 1000 ? `${wt/1000}kg` : `${wt}g`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Stock & Harvest Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Initial Stock Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="50"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Harvest Origin / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Medina, Saudi Arabia"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>
                </div>

                {/* 5. Product Image URL & Fast Presets */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Product Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/images/products/ajwa-dates.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                  />
                  
                  {/* Category Image Suggestions */}
                  {currentPresets.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[11px] text-neutral-400 block mb-1">
                        Quick presets for selected category:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: preset.url })}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${
                              formData.image_url === preset.url
                                ? 'bg-[#fee000] text-[#1d1d1d] border-[#fee000]'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Short Tagline / Summary */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Short Tagline / Summary
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Short summary displayed on product cards..."
                    value={formData.short_desc}
                    onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                  ></textarea>
                </div>

                {/* 7. Full Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Full Tasting & Sourcing Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Detailed notes on aroma, curing process, natural flavors, and health benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                  ></textarea>
                </div>

                {/* 8. Featured Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new_is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#108474] focus:ring-[#108474] cursor-pointer"
                  />
                  <label htmlFor="new_is_featured" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    Feature this item in storefront highlights & bestsellers banner
                  </label>
                </div>

              </div>

              {/* Right Column: Live Storefront Card Preview */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Storefront Card Preview:
                </div>

                <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#262626] border border-neutral-200 dark:border-neutral-700 shadow-md">
                  <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={formData.image_url || '/images/products/california-almonds.jpg'}
                      alt={formData.name || 'Preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/images/products/california-almonds.jpg'; }}
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {formData.is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#108474] text-white shadow">
                          Featured
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#fee000] text-[#1d1d1d] shadow">
                        New Harvest
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#108474]">
                      {categories.find(c => c.id === Number(formData.category_id))?.name || 'Category'}
                    </p>
                    <h4 className="text-xs font-bold text-[#1d1d1d] dark:text-white line-clamp-2">
                      {formData.name || 'Product Title'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {formData.cocoa_percentage || 500}g • {formData.origin || 'Imported'}
                    </p>
                    <div className="pt-2 flex items-baseline justify-between border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-sm font-black text-[#1d1d1d] dark:text-[#fee000]">
                        ₹{Number(formData.price || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {formData.stock || 50} in stock
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-500 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                    <Check size={13} className="text-[#108474]" />
                    Instant MySQL DB Persistence
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                    <Check size={13} className="text-[#108474]" />
                    Real-time catalog refresh
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus size={16} />
                <span>{loading ? 'Publishing to Storefront...' : 'Publish Item to Storefront'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
