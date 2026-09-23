import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileImage,
  RefreshCw,
  Trash2,
  Scale,
  Package,
  Layers,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import logoImg from '../image/logo.jpg';

export function AddItemModal({ isOpen, onClose, categories = [], onProductCreated }) {
  // Empty form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    brand: '',
    price: '',
    cocoa_percentage: '',
    stock: '',
    origin: '',
    short_desc: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedInfo, setUploadedInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset form completely whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category_id: categories.length > 0 ? String(categories[0].id) : '1',
        brand: '',
        price: '',
        cocoa_percentage: '',
        stock: '',
        origin: '',
        short_desc: '',
        description: '',
        image_url: '',
        is_featured: false
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadedInfo(null);
      setIsUploading(false);
      setUploadError('');
      setError('');
      setSuccessMsg('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  // Handle file selection from system
  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image exceeds 15MB limit. Please select a smaller photo.');
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Upload immediately to server /images/products
    setIsUploading(true);
    try {
      const res = await api.uploadProductImage(file);
      if (res && res.imageUrl) {
        setFormData(prev => ({ ...prev, image_url: res.imageUrl }));
        setUploadedInfo({
          filename: res.filename,
          size: file.size,
          url: res.imageUrl
        });
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      setUploadError(err.message || 'Failed to upload image to server');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedInfo(null);
    setUploadError('');
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit product creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setError('Please enter a harvest item name');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please enter a valid price in ₹ INR');
      return;
    }
    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }

    if (isUploading) {
      setError('Please wait for the image upload to complete');
      return;
    }

    if (!formData.image_url) {
      setError('Please upload a product image from your system');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category_id: Number(formData.category_id),
        brand: formData.brand.trim() || 'Yahya Traders Select',
        price: Number(formData.price),
        stock: formData.stock ? Number(formData.stock) : 50,
        origin: formData.origin.trim() || 'Imported Selection',
        cocoa_percentage: formData.cocoa_percentage ? Number(formData.cocoa_percentage) : 500,
        short_desc: formData.short_desc.trim() || 'Authentic premium selection from Yahya Traders. Freshly harvested and packed.',
        description: formData.description.trim() || 'Hand-sorted, certified pure harvest. Guaranteed fresh packaging with sealed aroma lock.',
        is_featured: !!formData.is_featured,
        images: [formData.image_url]
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

  const selectedCategoryObj = categories.find(c => String(c.id) === String(formData.category_id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
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
                Fill the empty form below and upload a product image from your system.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-full bg-neutral-100 dark:bg-neutral-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-5">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-shrink-0" />
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
                    placeholder="e.g. Royal Saudi Ajwa Al-Madinah Dates"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
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
                      placeholder="e.g. Yahya Traders Select"
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
                        placeholder="e.g. 750"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Net Weight (grams)
                    </label>
                    <div className="relative mb-1.5">
                      <input
                        type="number"
                        step="10"
                        min="1"
                        placeholder="e.g. 500"
                        value={formData.cocoa_percentage}
                        onChange={(e) => setFormData({ ...formData, cocoa_percentage: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs font-black rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">grams</span>
                    </div>
                    {/* Quick presets */}
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
                      Stock Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 50"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Harvest Origin / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Medina, Saudi Arabia / California"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#262626] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>
                </div>

                {/* 5. SYSTEM FILE UPLOAD SECTION */}
                <div className="p-4 rounded-2xl bg-[#fafafa] dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <UploadCloud size={16} className="text-[#108474]" />
                      <span>Product Image Upload (From System) *</span>
                    </label>
                    <span className="text-[10px] font-bold text-neutral-400">
                      Saves in /images/products
                    </span>
                  </div>

                  {/* Hidden System File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* Upload Dropzone / File Picker */}
                  {!previewUrl && !formData.image_url ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        isDragging
                          ? 'border-[#108474] bg-emerald-50 dark:bg-emerald-950/20'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-[#fee000] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#108474] dark:text-emerald-400 flex items-center justify-center mb-2 shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        Click to browse or drag & drop image from your system
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Supports JPG, PNG, WEBP, GIF (Max 15MB)
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-3 px-4 py-1.5 rounded-full bg-[#108474] hover:bg-[#0d6e61] text-white text-xs font-bold shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <FileImage size={14} />
                        <span>Choose File From Computer</span>
                      </button>
                    </div>
                  ) : (
                    /* Image Selected / Uploaded State */
                    <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#181818] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          <img
                            src={previewUrl || formData.image_url}
                            alt="Selected Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                            {uploadedInfo?.filename || selectedFile?.name || formData.image_url.split('/').pop()}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {isUploading ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <RefreshCw size={12} className="animate-spin" />
                                Uploading to /images/products/...
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <Check size={12} />
                                Saved in /images/products/
                              </span>
                            )}
                            {uploadedInfo?.size && (
                              <span className="text-[10px] text-neutral-400">
                                ({(uploadedInfo.size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{uploadError}</span>
                    </p>
                  )}
                </div>

                {/* 6. Short Tagline / Summary */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Short Tagline / Summary
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Hand-picked royal dates with rich caramel notes..."
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
                  <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                    {previewUrl || formData.image_url ? (
                      <img
                        src={previewUrl || formData.image_url}
                        alt={formData.name || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-neutral-400">
                        <UploadCloud size={36} className="mx-auto mb-2 opacity-50 text-[#108474]" />
                        <p className="text-xs font-bold">No image selected</p>
                        <p className="text-[10px] mt-0.5">Upload a photo to see preview</p>
                      </div>
                    )}

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
                      {selectedCategoryObj?.name || 'Select Category'}
                    </p>
                    <h4 className="text-xs font-bold text-[#1d1d1d] dark:text-white line-clamp-2">
                      {formData.name || 'Item Name'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {formData.cocoa_percentage ? `${formData.cocoa_percentage}g` : '500g'} • {formData.origin || 'Imported'}
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

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-500 space-y-1.5">
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                    <Check size={13} className="text-[#108474]" />
                    Image saved into /images/products
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                    <Check size={13} className="text-[#108474]" />
                    Instant MySQL DB Persistence
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                    <Check size={13} className="text-[#108474]" />
                    Real-time storefront catalog refresh
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
                disabled={loading || isUploading}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus size={16} />
                <span>
                  {loading
                    ? 'Publishing to Storefront...'
                    : isUploading
                    ? 'Uploading Photo...'
                    : 'Publish Item to Storefront'}
                </span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
