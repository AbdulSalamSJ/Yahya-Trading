import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Share2,
  Check,
  Award,
  Sparkles,
  ChevronRight,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Home,
  Scale,
  DollarSign,
  Package,
  MapPin,
  Image,
  FileText,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import logoImg from '../image/logo.jpg';

export function ProductDetailModal({
  product: initialProduct,
  categories = [],
  onClose,
  onReturnHome,
  onProductUpdated,
  onBuyNow
}) {
  const { addToCart, totalItemsCount, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState(initialProduct);

  // Available categories for dropdown
  const [catList, setCatList] = useState(categories || []);

  // Primary image
  const [selectedImage, setSelectedImage] = useState(
    initialProduct?.images && initialProduct.images.length > 0 ? initialProduct.images[0] : ''
  );

  // Customer purchase state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('tasting'); // 'tasting' | 'ingredients' | 'reviews'
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', userName: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Admin "Edit All" Form State
  const [editForm, setEditForm] = useState({
    name: initialProduct?.name || '',
    category_id: initialProduct?.category_id || 1,
    brand: initialProduct?.brand || 'Yahya Traders Select',
    price: initialProduct?.price || '',
    cocoa_percentage: initialProduct?.cocoa_percentage || 500,
    stock: initialProduct?.stock || 50,
    origin: initialProduct?.origin || '',
    short_desc: initialProduct?.short_desc || '',
    description: initialProduct?.description || '',
    image_url: (initialProduct?.images && initialProduct.images[0]) || initialProduct?.image_url || '',
    is_featured: !!initialProduct?.is_featured
  });

  const [adminSaving, setAdminSaving] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  // 2-click back detector ref
  const lastBackClickRef = useRef(0);

  // Fetch categories if not passed
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCatList(categories);
    } else {
      api.getCategories()
        .then(res => {
          if (res?.categories) setCatList(res.categories);
        })
        .catch(console.error);
    }
  }, [categories]);

  // Sync state if initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setEditForm({
        name: initialProduct.name || '',
        category_id: initialProduct.category_id || 1,
        brand: initialProduct.brand || 'Yahya Traders Select',
        price: initialProduct.price || '',
        cocoa_percentage: initialProduct.cocoa_percentage || 500,
        stock: initialProduct.stock || 50,
        origin: initialProduct.origin || '',
        short_desc: initialProduct.short_desc || '',
        description: initialProduct.description || '',
        image_url: (initialProduct.images && initialProduct.images[0]) || initialProduct.image_url || '',
        is_featured: !!initialProduct.is_featured
      });
      if (initialProduct.images && initialProduct.images.length > 0) {
        setSelectedImage(initialProduct.images[0]);
      }
    }
  }, [initialProduct]);

  // Push history state for browser back button support
  useEffect(() => {
    window.history.pushState({ itemSelected: true, productId: product?.id }, '');

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleBack();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product?.id]);

  // Handle Back: single click returns to Home
const handleBack = (e) => {
  if (e) e.stopPropagation();
  if (onReturnHome) {
    onReturnHome();
  } else {
    onClose();
  }
};

  useEffect(() => {
    if (product?.slug) {
      setLoadingReviews(true);
      api.getProductBySlug(product.slug)
        .then(res => {
          if (res?.reviews) setReviews(res.reviews);
        })
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
  }, [product?.slug]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/california-almonds.jpg'];

  const currentPrice = Number(product.price);
  const regularPrice = Math.round(currentPrice * 1.18);
  const discountPercent = Math.round(((regularPrice - currentPrice) / regularPrice) * 100);

  // Customer handlers
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.comment) return;
    setIsSubmittingReview(true);
    try {
      const res = await api.addReview(product.slug, newReview);
      setReviews(prev => [res.review, ...prev]);
      setReviewSubmittedMsg('Thank you! Your verified review has been published.');
      setNewReview({ rating: 5, title: '', comment: '', userName: '' });
      setTimeout(() => setReviewSubmittedMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (onBuyNow) {
      onBuyNow();
    } else {
      setIsCartOpen(true);
    }
  };

  // Reset edit form back to initial product values
  const handleResetForm = () => {
    setEditForm({
      name: product.name || '',
      category_id: product.category_id || 1,
      brand: product.brand || 'Yahya Traders Select',
      price: product.price || '',
      cocoa_percentage: product.cocoa_percentage || 500,
      stock: product.stock || 50,
      origin: product.origin || '',
      short_desc: product.short_desc || '',
      description: product.description || '',
      image_url: (product.images && product.images[0]) || product.image_url || '',
      is_featured: !!product.is_featured
    });
    setAdminSuccessMsg('');
    setAdminErrorMsg('');
  };

  // Admin Save Handler: Updates all fields in MySQL and storefront
  const handleAdminSave = async (e) => {
    if (e) e.preventDefault();
    if (!editForm.name.trim()) {
      setAdminErrorMsg('Item name cannot be empty');
      return;
    }
    if (!editForm.price || Number(editForm.price) <= 0) {
      setAdminErrorMsg('Please enter a valid price');
      return;
    }

    setAdminSaving(true);
    setAdminErrorMsg('');
    setAdminSuccessMsg('');

    try {
      const payload = {
        name: editForm.name.trim(),
        category_id: Number(editForm.category_id),
        brand: editForm.brand || 'Yahya Traders Select',
        price: Number(editForm.price),
        cocoa_percentage: Number(editForm.cocoa_percentage),
        stock: Number(editForm.stock),
        origin: editForm.origin,
        short_desc: editForm.short_desc,
        description: editForm.description,
        is_featured: !!editForm.is_featured,
        images: editForm.image_url ? [editForm.image_url] : (product.images || [])
      };

      const res = await api.updateProduct(product.id, payload);
      if (res && res.product) {
        const updatedCat = catList.find(c => c.id === Number(editForm.category_id));
        const updated = {
          ...product,
          ...res.product,
          category_name: updatedCat ? updatedCat.name : product.category_name,
          price: Number(res.product.price),
          cocoa_percentage: Number(res.product.cocoa_percentage),
          images: res.product.images || (editForm.image_url ? [editForm.image_url] : product.images)
        };

        setProduct(updated);
        if (editForm.image_url) {
          setSelectedImage(editForm.image_url);
        }

        if (onProductUpdated) {
          onProductUpdated(updated);
        }

        setAdminSuccessMsg('✓ All item details saved successfully to database!');
        setTimeout(() => setAdminSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Admin update error:', err);
      setAdminErrorMsg(err.message || 'Failed to save item changes.');
    } finally {
      setAdminSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#121212] text-[#1d1d1d] dark:text-[#f3f4f6] flex flex-col animate-fadeIn">
      
      {/* 1. Top Full Screen Sticky Navigation Bar with Back Button */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Back Button & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-neutral-100 hover:bg-[#fee000] text-[#1d1d1d] dark:bg-neutral-800 dark:hover:bg-[#fee000] dark:text-neutral-100 dark:hover:text-[#1d1d1d] text-xs sm:text-sm font-extrabold transition-all shadow-sm cursor-pointer group flex-shrink-0"
              title="Click to return to Home page"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
              <button
                onClick={onReturnHome}
                className="hover:text-black dark:hover:text-white cursor-pointer transition font-bold flex items-center gap-1"
                title="Return to Home page"
              >
                <Home size={12} />
                <span>Home</span>
              </button>
              <ChevronRight size={12} className="text-neutral-400 flex-shrink-0" />
              <button
                onClick={onClose}
                className="hover:text-black dark:hover:text-white cursor-pointer transition font-medium"
              >
                {product.category_name || 'Category'}
              </button>
              <ChevronRight size={12} className="text-neutral-400 flex-shrink-0" />
              <span className="font-semibold text-[#1d1d1d] dark:text-white truncate">
                {product.name}
              </span>
            </div>
          </div>

          {/* Right Actions: Admin Status & Save, or Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-black">
                  <ShieldCheck size={14} className="text-amber-600" />
                  <span>Admin Mode: Edit All Enabled</span>
                </div>

                <button
                  type="button"
                  disabled={adminSaving}
                  onClick={handleAdminSave}
                  className="px-4 py-2 bg-[#108474] hover:bg-[#0d6e61] text-white text-xs font-black rounded-full shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Save all changes to database"
                >
                  <Save size={14} />
                  <span>{adminSaving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              </div>
            ) : (
              /* Regular Customer Cart Trigger */
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-3.5 py-1.5 sm:py-2 bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] font-bold rounded-full shadow-sm transition flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {totalItemsCount > 0 && (
                  <span className="bg-[#1d1d1d] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Close / Return X button */}
            <button
              onClick={handleBack}
              className="p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-full transition cursor-pointer"
              title="Close and return (click twice for Home)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Full Screen Product Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Top return banner with 2-click hint */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-[#fee000] transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back (Click 2× for Home)</span>
            </button>

            <span className="text-neutral-300 dark:text-neutral-700">•</span>

            <button
              onClick={onReturnHome}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white transition cursor-pointer"
            >
              <Home size={12} />
              <span>Direct to Home</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#108474] dark:text-[#14b8a6] font-bold">
            <Sparkles size={14} />
            <span>100% Certified Authentic • Yahya Traders Select</span>
          </div>
        </div>

        {/* Admin Notifications Banner */}
        {adminSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{adminSuccessMsg}</span>
            </div>
            <button
              onClick={() => setAdminSuccessMsg('')}
              className="text-xs text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {adminErrorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border-2 border-red-500/50 text-red-900 dark:text-red-100 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>{adminErrorMsg}</span>
            </div>
            <button
              onClick={() => setAdminErrorMsg('')}
              className="text-xs text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Admin Active Notification Strip */}
        {isAdmin && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0 font-black">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#1d1d1d] dark:text-white">
                  Admin Workspace: Edit All Item Details
                </h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                  Update title, category, weight, price, origin, stock, image, and description.
                  <span className="font-bold text-amber-700 dark:text-amber-400 ml-1">
                    (Add to Cart and Buy Now buttons are disabled for Admin)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                disabled={adminSaving}
                onClick={handleAdminSave}
                className="px-5 py-2 rounded-full bg-[#108474] hover:bg-[#0d6e61] text-white text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>{adminSaving ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Two-Column Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left: Large Image Showcase & Live Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 shadow-md">
              <img
                src={isAdmin && editForm.image_url ? editForm.image_url : (selectedImage || images[0])}
                alt={isAdmin ? editForm.name : product.name}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = '/images/products/california-almonds.jpg'; }}
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {discountPercent > 0 && !isAdmin && (
                  <span className="px-3 py-1 text-xs font-black uppercase tracking-wide rounded-full bg-[#fee000] text-[#1d1d1d] shadow">
                    Save {discountPercent}%
                  </span>
                )}
                {(isAdmin ? editForm.is_featured : product.is_featured) && (
                  <span className="px-3 py-1 text-xs font-black tracking-wide rounded-full bg-[#108474] text-white shadow">
                    ★ Featured Harvest
                  </span>
                )}
                {product.is_bestseller && (
                  <span className="px-3 py-1 text-xs font-bold tracking-wide rounded-full bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d] shadow">
                    Top Pick
                  </span>
                )}
              </div>

              {(isAdmin ? editForm.origin : product.origin) && (
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wide shadow-sm">
                  📍 {isAdmin ? editForm.origin : product.origin}
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images and not admin override */}
            {images.length > 1 && !isAdmin && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#fee000] shadow-md scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                <Truck size={20} className="text-[#108474] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1d] dark:text-white">24h Express Dispatch</h4>
                  <p className="text-[11px] text-neutral-500">Shipped with aroma-lock seal</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#108474] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1d] dark:text-white">100% Purity Certified</h4>
                  <p className="text-[11px] text-neutral-500">No preservatives or additives</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic View (Admin Edit Suite OR Regular Customer Storefront) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* ============================================================== */}
            {/* ADMIN MODE: EDIT ALL FIELDS (No Add to Bag, No Buy Now button) */}
            {/* ============================================================== */}
            {isAdmin ? (
              <form onSubmit={handleAdminSave} className="space-y-5 p-6 rounded-3xl bg-neutral-50 dark:bg-[#181818] border-2 border-amber-400/40 shadow-xl">
                
                {/* Header: Admin Editor Title */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Edit3 size={18} className="text-[#108474]" />
                    <h3 className="text-base font-black text-[#1d1d1d] dark:text-white">
                      Edit All Product Details
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    Product ID #{product.id}
                  </span>
                </div>

                {/* 1. Item Name */}
                <div>
                  <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                    Item Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. Royal Saudi Ajwa Al-Madinah Dates (500g)"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-sm font-black text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474] shadow-sm"
                  />
                </div>

                {/* 2. Category & Brand Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Store Category *
                    </label>
                    <select
                      value={editForm.category_id}
                      onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-xs font-bold text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                    >
                      {catList.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Brand / Label
                    </label>
                    <input
                      type="text"
                      value={editForm.brand}
                      onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                      placeholder="Yahya Traders Select"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-xs font-bold text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                    />
                  </div>
                </div>

                {/* 3. Price & Net Weight (with quick presets) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Price (₹ INR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-neutral-400">₹</span>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        required
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        placeholder="850"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-sm font-black text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                      />
                    </div>
                  </div>

                  {/* Net Weight */}
                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Net Weight (grams) *
                    </label>
                    <div className="relative mb-1.5">
                      <input
                        type="number"
                        step="10"
                        min="1"
                        required
                        value={editForm.cocoa_percentage}
                        onChange={(e) => setEditForm({ ...editForm, cocoa_percentage: e.target.value })}
                        placeholder="500"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-sm font-black text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
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
                          onClick={() => setEditForm({ ...editForm, cocoa_percentage: wt })}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition cursor-pointer ${
                            Number(editForm.cocoa_percentage) === wt
                              ? 'bg-[#108474] text-white'
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                          }`}
                        >
                          {wt >= 1000 ? `${wt/1000}kg` : `${wt}g`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Stock Units & Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Stock Available (Packs) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      placeholder="50"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-xs font-bold text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                      Harvest Origin / Country
                    </label>
                    <input
                      type="text"
                      value={editForm.origin}
                      onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                      placeholder="e.g. Al-Madinah, Saudi Arabia"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-xs font-bold text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                    />
                  </div>
                </div>

                {/* 5. Image URL */}
                <div>
                  <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    placeholder="/images/products/ajwa-dates.jpg or URL"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-xs font-mono text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Image preview updates automatically in the left column.</p>
                </div>

                {/* 6. Short Description */}
                <div>
                  <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                    Short Tagline / Summary
                  </label>
                  <textarea
                    rows="2"
                    value={editForm.short_desc}
                    onChange={(e) => setEditForm({ ...editForm, short_desc: e.target.value })}
                    placeholder="Short description displayed on cards and previews..."
                    className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                  ></textarea>
                </div>

                {/* 7. Full Description / Tasting Notes */}
                <div>
                  <label className="block text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                    Full Harvest Description & Tasting Profile
                  </label>
                  <textarea
                    rows="3"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Full detailed profile of harvest, aroma, textures, and health benefits..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-[#1d1d1d] dark:text-white focus:outline-none focus:border-[#108474]"
                  ></textarea>
                </div>

                {/* 8. Featured Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="edit_is_featured"
                    checked={editForm.is_featured}
                    onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#108474] focus:ring-[#108474] cursor-pointer"
                  />
                  <label htmlFor="edit_is_featured" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    Feature this harvest item in storefront highlights & bestsellers
                  </label>
                </div>

                {/* 9. Action Panel: ENABLE TO SAVE (No Add to Bag, No Buy Now Button) */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Primary Save Button */}
                    <button
                      type="submit"
                      disabled={adminSaving}
                      className="w-full sm:flex-1 py-4 px-6 rounded-full bg-[#108474] hover:bg-[#0d6e61] text-white text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save size={18} />
                      <span>{adminSaving ? 'Saving Changes to Database...' : 'Save All Changes to Database'}</span>
                    </button>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto py-4 px-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400">
                    🔒 Admin mode: Add to Cart and Buy Now buttons are disabled for administrative catalog edits.
                  </p>
                </div>

              </form>
            ) : (
              /* ============================================================== */
              /* REGULAR CUSTOMER VIEW: Title, Rating, Price, Add to Bag & Buy Now */
              /* ============================================================== */
              <>
                {/* Origin & Brand */}
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  <span className="text-[#108474] dark:text-[#14b8a6]">{product.origin || 'Sourced Globally'}</span>
                  <span>•</span>
                  <span>{product.brand || 'Yahya Traders Select'}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1d1d1d] dark:text-white tracking-tight leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center text-[#fee000]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        className={i < Math.floor(product.rating || 5) ? 'fill-[#fee000]' : 'text-neutral-300 dark:text-neutral-700'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                    {Number(product.rating || 4.9).toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    ({reviews.length || product.reviews_count || 28} verified reviews)
                  </span>
                </div>

                {/* Price & Savings */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-baseline gap-4 mb-4">
                  <div className="text-3xl sm:text-4xl font-black text-[#1d1d1d] dark:text-white">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-neutral-400 line-through">
                    MRP ₹{regularPrice.toLocaleString('en-IN')}
                  </div>
                  {discountPercent > 0 && (
                    <span className="px-3 py-1 rounded-full bg-[#fee000] text-[#1d1d1d] text-xs font-black">
                      Save {discountPercent}% OFF
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block w-full">
                    Inclusive of all taxes • Free shipping on orders above ₹499
                  </span>
                </div>

                {/* Pack Size / Weight Information */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Pack Size / Net Weight:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-[#1d1d1d] text-white dark:bg-[#fee000] dark:text-[#1d1d1d] text-xs font-black shadow-sm">
                      {product.cocoa_percentage >= 1000 ? `${product.cocoa_percentage / 1000}kg Luxury Pack` : `${product.cocoa_percentage}g Fresh Pack`}
                    </div>
                    <span className="text-xs text-neutral-500">Aroma-seal tamper-evident pouch</span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 10 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4f1] dark:bg-[#108474]/20 text-[#108474] dark:text-[#14b8a6] text-xs font-bold">
                      <Check size={14} />
                      In Stock ({product.stock} available) • Ready for 24h Express Dispatch
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold">
                      ⚠ Low Stock: Only {product.stock} packs left
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  {product.short_desc || product.description}
                </p>

                {/* Quantity Selector & Action Buttons (Add to Bag & Buy Now) */}
                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">Quantity:</span>
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-4 py-2 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition text-sm font-black rounded-l-full cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-black text-neutral-900 dark:text-white min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-4 py-2 text-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition text-sm font-black rounded-r-full cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA Buttons for Customers */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`w-full sm:flex-1 py-4 px-6 rounded-full text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        justAdded
                          ? 'bg-[#108474] text-white shadow-lg'
                          : 'bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] hover:shadow-lg'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check size={18} />
                          <span>Added to Bag Successfully!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          <span>Add {quantity} to Bag • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto py-4 px-7 rounded-full bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d] text-sm font-black hover:opacity-90 transition shadow cursor-pointer whitespace-nowrap"
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-4 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer self-center"
                      title="Share item link"
                    >
                      {copied ? <Check size={18} className="text-[#108474]" /> : <Share2 size={18} />}
                    </button>
                  </div>

                </div>
              </>
            )}

          </div>

        </div>

        {/* 3. Detailed Tabs Section: Harvest Story, Ingredients & Nutrition, Reviews */}
        <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-8 text-sm font-extrabold">
            <button
              onClick={() => setActiveTab('tasting')}
              className={`pb-3.5 border-b-2 transition cursor-pointer ${
                activeTab === 'tasting'
                  ? 'border-[#fee000] text-[#1d1d1d] dark:text-[#fee000]'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Harvest Profile & Sourcing
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3.5 border-b-2 transition cursor-pointer ${
                activeTab === 'ingredients'
                  ? 'border-[#fee000] text-[#1d1d1d] dark:text-[#fee000]'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Ingredients & Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 border-b-2 transition cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-[#fee000] text-[#1d1d1d] dark:text-[#fee000]'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'tasting' && (
              <div className="prose dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                <h3 className="text-xl font-black text-[#1d1d1d] dark:text-white">
                  {isAdmin ? editForm.name : product.name}
                </h3>
                <p>
                  {isAdmin ? editForm.description : product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 not-prose">
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800">
                    <h5 className="text-xs font-black uppercase text-neutral-400 mb-1">Harvest Region</h5>
                    <p className="text-sm font-black text-[#1d1d1d] dark:text-white">
                      {isAdmin ? editForm.origin : (product.origin || 'Single Origin Import')}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800">
                    <h5 className="text-xs font-black uppercase text-neutral-400 mb-1">Curing & Processing</h5>
                    <p className="text-sm font-black text-[#1d1d1d] dark:text-white">Traditional Sun-Dried & Cold Cleaned</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800">
                    <h5 className="text-xs font-black uppercase text-neutral-400 mb-1">Quality Standard</h5>
                    <p className="text-sm font-black text-[#1d1d1d] dark:text-white">100% Export Grade A+++</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-black text-[#1d1d1d] dark:text-white mb-2">Ingredients:</h4>
                  <p className="leading-relaxed">
                    100% Pure, Natural {product.name}. Zero added refined sugar, zero preservatives, zero artificial coloring or flavors.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-[#1f1f1f] text-neutral-700 dark:text-neutral-300 font-black uppercase">
                      <tr>
                        <th className="p-3">Nutritional Profile</th>
                        <th className="p-3">Per 100g Serving</th>
                        <th className="p-3">% Daily Recommended Value*</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      <tr>
                        <td className="p-3 font-bold">Energy</td>
                        <td className="p-3">282 kcal / 1180 kJ</td>
                        <td className="p-3">14%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Protein</td>
                        <td className="p-3">2.5g</td>
                        <td className="p-3">5%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Dietary Fiber</td>
                        <td className="p-3">8.0g</td>
                        <td className="p-3">32% (High Fiber)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Natural Carbohydrates</td>
                        <td className="p-3">75.0g</td>
                        <td className="p-3">25%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Total Fat</td>
                        <td className="p-3">0.4g</td>
                        <td className="p-3">&lt; 1% (Naturally Fat-Free)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Potassium & Magnesium</td>
                        <td className="p-3">696 mg</td>
                        <td className="p-3">20%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl font-black text-[#1d1d1d] dark:text-white mb-1">
                      {Number(product.rating || 4.9).toFixed(1)} <span className="text-sm font-normal text-neutral-400">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center sm:justify-start text-[#fee000] mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="fill-[#fee000]" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">Based on {reviews.length} authentic buyer experiences</p>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-[#108474]">✓ 98%</span> of buyers recommend this selection
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-[#108474]">✓ 100%</span> verified harvest packaging
                    </p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 text-xs">
                      No reviews yet for this harvest. Be the first to share your experience below!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#1d1d1d] dark:text-white">
                              {rev.user_name || 'Verified Buyer'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#108474]/15 text-[#108474]">
                              ✓ Verified Purchase
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(rev.created_at || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center text-[#fee000] gap-0.5">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={13} className="fill-[#fee000]" />
                          ))}
                        </div>

                        <h5 className="text-xs font-black text-[#1d1d1d] dark:text-white">
                          {rev.title}
                        </h5>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="p-6 rounded-3xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 space-y-4"
                >
                  <h4 className="text-sm font-black text-[#1d1d1d] dark:text-white">
                    Share Your Tasting & Harvest Review
                  </h4>

                  {reviewSubmittedMsg && (
                    <div className="p-3 rounded-xl bg-[#108474]/15 text-[#108474] text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{reviewSubmittedMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mansoor"
                        value={newReview.userName}
                        onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                        className="w-full px-4 py-2 text-xs rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 text-xs rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                      >
                        <option value="5">★★★★★ (5/5) Outstanding Grade-A</option>
                        <option value="4">★★★★☆ (4/5) Very Good</option>
                        <option value="3">★★★☆☆ (3/5) Average</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Incredible crunch and freshness"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Your Experience</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Describe aroma, taste, texture, and packaging..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] font-black rounded-full text-xs transition cursor-pointer shadow-sm"
                  >
                    {isSubmittingReview ? 'Submitting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom Return to Page Button */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-[#fee000] hover:text-[#1d1d1d] text-xs sm:text-sm font-extrabold transition shadow cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog (Click 2× for Home)</span>
          </button>

          <button
            onClick={onReturnHome}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1d1d1d] text-white dark:bg-[#fee000] dark:text-[#1d1d1d] text-xs sm:text-sm font-extrabold hover:opacity-90 transition shadow-md cursor-pointer"
          >
            <Home size={16} />
            <span>Direct to Home Page</span>
          </button>
        </div>

      </main>

    </div>
  );
}
