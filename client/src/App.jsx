import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminModal } from './components/AdminModal';
import { AddItemModal } from './components/AddItemModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { OurStory } from './components/OurStory';
import { Footer } from './components/Footer';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { CategoryVarietyHero } from './components/CategoryVarietyHero';
import { Sparkles, Filter, RefreshCcw, ArrowUpDown, ArrowLeft, Plus } from 'lucide-react';
import logoImg from './image/logo.jpg';

export function App() {
  const { toastMessage, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Navigation State
  const [activeTab, setActiveTab] = useState('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all'); // 'all' | 'snack' (<=300g) | 'classic' (350-600g) | 'reserve' (>=1000g)
  const [sortOption, setSortOption] = useState('default');
  const [selectedVarietyId, setSelectedVarietyId] = useState(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Sync tab navigation with categories
  useEffect(() => {
    if (activeTab === 'shop') {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(activeTab);
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.categories) setCategories(res.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minCocoa = null;
      let maxCocoa = null;

      if (selectedWeight === 'snack') {
        maxCocoa = 300;
      } else if (selectedWeight === 'classic') {
        minCocoa = 350;
        maxCocoa = 600;
      } else if (selectedWeight === 'reserve') {
        minCocoa = 900;
      }

      const res = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption,
        minCocoa,
        maxCocoa
      });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedWeight, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedWeight('all');
    setSortOption('default');
    setSelectedVarietyId(null);
    setSearchQuery('');
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setSelectedProduct(null);
    handleResetFilters();
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    setSelectedProduct(prev => (prev && prev.id === updatedProduct.id ? { ...prev, ...updatedProduct } : prev));
  };

  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    fetchProducts();
    setSelectedProduct(newProduct);
  };

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedVarietyId(null);
    setActiveTab(categorySlug === 'all' ? 'shop' : categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFooterSelectItem = async (categorySlug, productId) => {
    setSearchQuery('');
    setSelectedWeight('all');
    setSelectedVarietyId(productId || null);
    setActiveTab(categorySlug);
    setSelectedCategory(categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (productId) {
      try {
        const res = await api.getProductBySlug(productId);
        if (res && res.product) {
          setSelectedProduct(res.product);
        }
      } catch (err) {
        console.error('Failed to retrieve item from footer click:', err);
      }
    }
  };

  const handleOpenTrackingFromNav = () => {
    if (!trackedOrder) {
      setTrackedOrder({
        order_number: 'YT-894291',
        customer_name: 'Verified Customer',
        status: 'shipped',
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        total_amount: 2850.00
      });
    }
  };

  const isFrontPage = selectedCategory === 'all' && !searchQuery && activeTab === 'shop';
  const currentCategoryObj = categories.find(c => c.slug === selectedCategory);
  const displayedProducts = selectedVarietyId
    ? products.filter(p => p.id === selectedVarietyId)
    : products;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-[#1d1d1d] dark:text-[#f3f4f6]">
      
      {/* Global Toast Message */}
      <Toast message={toastMessage} />

      {/* Header Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onOpenTracking={handleOpenTrackingFromNav}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'story') {
            setSelectedCategory(tab === 'shop' ? 'all' : tab);
          }
          setSelectedVarietyId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Quick Action Banner on Front Page */}
      {isFrontPage && isAdmin && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#108474] flex-shrink-0 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                👑 Admin Logged In: You can publish new harvest items across any category.
              </span>
            </div>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-4 py-2 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>+ Add New Harvest Item</span>
            </button>
          </div>
        </div>
      )}

      {/* Front Page: Dedicated Sliding Banner Photos of Dates, Nuts, Dry Fruits */}
      {isFrontPage && (
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('categories');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* Front Page: All Front Page replaced by the 10 categories images showcase */}
      {isFrontPage && (
        <div id="categories">
          <CategoryShowcase onSelectCategory={handleCategorySelect} />
        </div>
      )}

      {/* Our Story View (if selected) */}
      {activeTab === 'story' && <OurStory />}

      {/* Dedicated Category Products View (Shown when a category is selected or searched) */}
      {!isFrontPage && activeTab !== 'story' && (
        <main id="catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Back Navigation Bar & Category Fast-Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-[#fee000] text-neutral-800 hover:text-[#1d1d1d] dark:bg-neutral-800 dark:hover:bg-[#fee000] dark:text-neutral-200 dark:hover:text-[#1d1d1d] text-xs font-extrabold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft size={15} />
              <span>Back to Home Page</span>
            </button>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#fee000] text-[#1d1d1d] shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Variety Photo Hero Showcase for the Selected Category */}
          {currentCategoryObj && !searchQuery && (
            <CategoryVarietyHero
              category={currentCategoryObj}
              products={products}
              selectedProductId={selectedVarietyId}
              onSelectProductVariety={(id) => {
                if (selectedVarietyId === id) {
                  setSelectedVarietyId(null);
                } else {
                  setSelectedVarietyId(id);
                  if (id) {
                    const el = document.getElementById(`product-${id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }
              }}
            />
          )}

          {/* Section Heading & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#108474] dark:text-[#14b8a6] mb-1">
                <Sparkles size={14} />
                <span>100% Sourced Globally • Certified Fresh</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1d1d1d] dark:text-white tracking-tight">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : categories.find(c => c.slug === selectedCategory)?.name || 'Curated Yahya Traders Collection'}
              </h2>
            </div>

            {/* Quick Count & Reset Filters */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold">Showing {displayedProducts.length} varieties</span>
              
              {isAdmin && (
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#108474] hover:bg-[#0d6e61] text-white font-black text-xs shadow-sm transition cursor-pointer"
                  title="Add new harvest item to store"
                >
                  <Plus size={14} />
                  <span>+ Add New Item</span>
                </button>
              )}

              {(selectedCategory !== 'all' || selectedWeight !== 'all' || searchQuery || selectedVarietyId) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[#1d1d1d] dark:text-[#fee000] hover:underline font-bold cursor-pointer"
                >
                  <RefreshCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Single Variety Filter Notification */}
          {selectedVarietyId && (
            <div className="mb-6 p-4 rounded-2xl bg-[#fee000]/15 dark:bg-[#fee000]/10 border border-[#fee000]/50 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#108474]"></span>
                <span className="font-bold text-[#1d1d1d] dark:text-neutral-100">
                  Selected Variety: <span className="underline font-extrabold">{products.find(p => p.id === selectedVarietyId)?.name}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedVarietyId(null)}
                className="px-4 py-1.5 rounded-full bg-[#1d1d1d] text-white dark:bg-[#fee000] dark:text-[#1d1d1d] font-extrabold hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                Show All {currentCategoryObj?.name || ''} Varieties
              </button>
            </div>
          )}

          {/* Pack Size & Sort Filters */}
          <div className="mb-8 p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Pack Size Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <Filter size={13} className="text-[#108474]" />
                Pack Size:
              </span>
              <button
                onClick={() => setSelectedWeight('all')}
                className={`px-3 py-1 rounded-full transition font-semibold cursor-pointer ${
                  selectedWeight === 'all'
                    ? 'bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d]'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                All Sizes
              </button>
              <button
                onClick={() => setSelectedWeight('snack')}
                className={`px-3 py-1 rounded-full transition font-semibold cursor-pointer ${
                  selectedWeight === 'snack'
                    ? 'bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d]'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                Snack Pouch (≤300g)
              </button>
              <button
                onClick={() => setSelectedWeight('classic')}
                className={`px-3 py-1 rounded-full transition font-semibold cursor-pointer ${
                  selectedWeight === 'classic'
                    ? 'bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d]'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                Classic Pack (500g)
              </button>
              <button
                onClick={() => setSelectedWeight('reserve')}
                className={`px-3 py-1 rounded-full transition font-semibold cursor-pointer ${
                  selectedWeight === 'reserve'
                    ? 'bg-[#1d1d1d] text-white dark:bg-white dark:text-[#1d1d1d]'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                Family / Bulk Pack (≥1kg)
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <ArrowUpDown size={12} />
                Sort By:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#fee000]"
              >
                <option value="default">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Ratings (5★)</option>
              </select>
            </div>

          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 animate-pulse p-4 space-y-4">
                  <div className="h-56 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fee000] mx-auto shadow-sm bg-white">
                <img src={logoImg} alt="Yahya Traders" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-[#1d1d1d] dark:text-white">
                No matching harvest found
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                We couldn't find items matching your search or filters. Try clearing your search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#fee000] text-[#1d1d1d] text-xs font-bold hover:bg-[#f5d600] transition cursor-pointer"
              >
                Back to All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={setSelectedProduct}
                />
              ))}
            </div>
          )}

        </main>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setSelectedProduct(null)}
          onReturnHome={handleReturnHome}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Express Checkout Modal with Razorpay */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderPlaced={(order) => {
            setTrackedOrder(order);
          }}
        />
      )}

      {/* Order Tracking Modal */}
      {trackedOrder && (
        <OrderTrackingModal
          order={trackedOrder}
          onClose={() => setTrackedOrder(null)}
        />
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onRefreshProducts={fetchProducts}
          onOpenAddItem={() => {
            setIsAdminOpen(false);
            setIsAddItemOpen(true);
          }}
        />
      )}

      {/* Add New Item Modal */}
      {isAddItemOpen && (
        <AddItemModal
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          categories={categories}
          onProductCreated={handleProductCreated}
        />
      )}

      {/* Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectItem={handleFooterSelectItem}
        onOpenTracking={handleOpenTrackingFromNav}
        onSelectCategory={handleCategorySelect}
      />

    </div>
  );
}
