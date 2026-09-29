import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Truck,
  Check,
  Search,
  Save,
  Filter,
  ArrowUpRight,
  Download,
  UploadCloud,
  Eye,
  RefreshCw,
  X,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Printer,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Layers,
  Store,
  ArrowLeft,
  ChevronDown,
  Calendar,
  Sparkles,
  Scale,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import logoImg from '../image/logo.jpg';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard({ isOpen, onClose, onRefreshProducts, onOpenAddItem, onProductCreated }) {
  const { user, logout } = useAuth();

  // Navigation tab: 'overview' | 'orders' | 'products' | 'customers' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState('30d');

  // Selected Order for Details Drawer & Printable Invoice
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState(null);

  // Inline Product Editing State
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', weight: '', stock: '' });
  const [savingProductId, setSavingProductId] = useState(null);

  // Product Delete Confirmation
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: 1,
    brand: 'Yahiya Traders Select',
    short_desc: '',
    description: '',
    price: '',
    stock: 50,
    origin: 'Imported Selection',
    cocoa_percentage: 500,
    is_featured: false,
    image_url: ''
  });
  const [adminFile, setAdminFile] = useState(null);
  const [adminPreviewUrl, setAdminPreviewUrl] = useState('');
  const [adminUploading, setAdminUploading] = useState(false);
  const [adminUploadError, setAdminUploadError] = useState('');
  const adminFileInputRef = useRef(null);

  // Mail Connection Test State
  const [mailTestStatus, setMailTestStatus] = useState(null);
  const [mailTesting, setMailTesting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [mRes, oRes, cRes, pRes] = await Promise.all([
        api.getAdminMetrics().catch(() => ({ metrics: null })),
        api.getAllOrders().catch(() => ({ orders: [] })),
        api.getCategories().catch(() => ({ categories: [] })),
        api.getProducts({}).catch(() => ({ products: [] }))
      ]);

      setMetrics(mRes.metrics || null);
      setOrders(oRes.orders || []);
      setCategories(cRes.categories || []);
      setProducts(pRes.products || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Failed to refresh data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Derived Customers List from Orders
  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach(order => {
      const email = order.customer_email || 'guest@store.com';
      if (!map.has(email)) {
        map.set(email, {
          name: order.customer_name || 'Customer',
          email: email,
          phone: order.customer_phone || 'N/A',
          city: order.shipping_address ? (order.shipping_address.city || 'Standard Zone') : 'Standard Zone',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.created_at || order.order_date || 'Recent',
          recentOrderNumber: order.order_number
        });
      }
      const c = map.get(email);
      c.totalOrders += 1;
      c.totalSpent += Number(order.total_amount || 0);
      if (order.created_at && new Date(order.created_at) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = order.created_at;
        c.recentOrderNumber = order.order_number;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const query = orderSearch.toLowerCase();
      const matchesSearch =
        !query ||
        (order.order_number && order.order_number.toLowerCase().includes(query)) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(query)) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(query)) ||
        (order.customer_phone && order.customer_phone.includes(query));

      const isWa = String(order.payment_id || '').startsWith('wa_');
      let matchesStatus = true;
      if (orderStatusFilter === 'whatsapp') {
        matchesStatus = isWa;
      } else if (orderStatusFilter !== 'all') {
        matchesStatus = (order.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const query = productSearch.toLowerCase();
      const matchesSearch =
        !query ||
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        (product.origin && product.origin.toLowerCase().includes(query));

      const matchesCategory =
        productCategoryFilter === 'all' ||
        String(product.category_id) === String(productCategoryFilter);

      let matchesStock = true;
      if (productStockFilter === 'low') matchesStock = Number(product.stock) < 25 && Number(product.stock) > 0;
      else if (productStockFilter === 'out') matchesStock = Number(product.stock) <= 0;
      else if (productStockFilter === 'instock') matchesStock = Number(product.stock) >= 25;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    const query = customerSearch.toLowerCase();
    if (!query) return customers;
    return customers.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.city.toLowerCase().includes(query)
    );
  }, [customers, customerSearch]);

  // Calculate Order Statistics
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const whatsapp = orders.filter(o => String(o.payment_id || '').startsWith('wa_')).length;

    const totalRevenue = orders
      .filter(o => o.payment_status === 'paid' || o.payment_status === 'PAID' || o.status === 'delivered')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const aov = total > 0 ? Math.round(totalRevenue / total) : 0;

    return { total, pending, processing, shipped, delivered, whatsapp, totalRevenue, aov };
  }, [orders]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Inline Product Quick Edit
  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setEditForm({
      price: product.price,
      weight: product.cocoa_percentage || 500,
      stock: product.stock || 50
    });
  };

  const handleSaveProductEdit = async (productId) => {
    setSavingProductId(productId);
    try {
      const payload = {
        price: Number(editForm.price),
        cocoa_percentage: Number(editForm.weight),
        stock: Number(editForm.stock)
      };
      const res = await api.updateProduct(productId, payload);
      if (res && res.product) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, ...res.product } : p))
        );
        setEditingProductId(null);
        showToast('Item price, weight & stock updated!', 'success');
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
    } finally {
      setSavingProductId(null);
    }
  };

  // Quick Restock helper
  const handleQuickRestock = async (productId, addAmount) => {
    const current = products.find(p => p.id === productId);
    if (!current) return;
    const newStock = Number(current.stock || 0) + addAmount;
    try {
      const res = await api.updateProduct(productId, { stock: newStock });
      if (res && res.product) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p))
        );
        showToast(`Restocked ${current.name} (+${addAmount} units)`, 'success');
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      showToast('Failed to restock item', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeletingProductId(productToDelete.id);
    try {
      await api.deleteProduct(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      showToast(`"${productToDelete.name}" deleted from catalog`, 'success');
      setProductToDelete(null);
      if (onRefreshProducts) onRefreshProducts();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeletingProductId(null);
    }
  };

  // File select for new product
  const handleAdminFileSelect = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setAdminUploadError('Please choose a valid image (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setAdminUploadError('Image size exceeds 15MB limit');
      return;
    }

    setAdminUploadError('');
    setAdminFile(file);
    setAdminPreviewUrl(URL.createObjectURL(file));
    setAdminUploading(true);

    try {
      const res = await api.uploadProductImage(file);
      if (res && res.imageUrl) {
        setNewProduct(prev => ({ ...prev, image_url: res.imageUrl }));
        showToast('Image uploaded and saved to /images/products/', 'success');
      }
    } catch (err) {
      setAdminUploadError(err.message || 'Failed to upload image');
    } finally {
      setAdminUploading(false);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }
    if (!newProduct.price || Number(newProduct.price) <= 0) {
      showToast('Please enter a valid price in ₹ INR', 'error');
      return;
    }
    if (adminUploading) {
      showToast('Please wait for image upload to complete', 'error');
      return;
    }
    if (!newProduct.image_url) {
      showToast('Please upload a product photo', 'error');
      return;
    }

    try {
      const res = await api.createProduct({
        ...newProduct,
        name: newProduct.name.trim(),
        brand: newProduct.brand.trim() || 'Yahiya Traders Select',
        category_id: Number(newProduct.category_id),
        price: Number(newProduct.price),
        stock: newProduct.stock ? Number(newProduct.stock) : 50,
        cocoa_percentage: newProduct.cocoa_percentage ? Number(newProduct.cocoa_percentage) : 500,
        origin: newProduct.origin.trim() || 'Imported Selection',
        short_desc: newProduct.short_desc.trim() || 'Authentic premium selection from Yahiya Traders.',
        description: newProduct.description.trim() || 'Hand-sorted, certified pure harvest with sealed aroma lock.',
        images: [newProduct.image_url]
      });

      setShowAddModal(false);
      showToast(`✓ "${newProduct.name}" created and published!`, 'success');
      // Reset form
      setNewProduct({
        name: '',
        category_id: categories[0]?.id || 1,
        brand: 'Yahiya Traders Select',
        short_desc: '',
        description: '',
        price: '',
        stock: 50,
        origin: 'Imported Selection',
        cocoa_percentage: 500,
        is_featured: false,
        image_url: ''
      });
      setAdminFile(null);
      setAdminPreviewUrl('');
      loadData(true);
      if (onRefreshProducts) onRefreshProducts();
      if (onProductCreated && res?.product) onProductCreated(res.product);
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  // Export Orders to CSV
  const handleExportOrdersCSV = () => {
    if (!orders.length) {
      showToast('No orders to export', 'error');
      return;
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Total Amount (INR)',
      'Payment Status',
      'Payment Method',
      'Order Status',
      'Shipping City',
      'Items Count'
    ];

    const rows = orders.map(o => [
      `"${o.order_number || ''}"`,
      `"${o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : ''}"`,
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.customer_email || ''}"`,
      `"${o.customer_phone || ''}"`,
      Number(o.total_amount || 0),
      `"${o.payment_status || 'PAID'}"`,
      `"${String(o.payment_id || '').startsWith('wa_') ? 'WhatsApp' : 'Razorpay/Online'}"`,
      `"${o.status || 'pending'}"`,
      `"${(o.shipping_address?.city || 'Standard').replace(/"/g, '""')}"`,
      Array.isArray(o.items) ? o.items.length : 1
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Yahiya_Traders_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV successfully!', 'success');
  };

  // Test Mail Connection
  const handleTestMail = async () => {
    setMailTesting(true);
    setMailTestStatus(null);
    try {
      const res = await api.testMailConnection();
      setMailTestStatus({
        success: true,
        message: 'SMTP Mailer server connected and ready for customer notifications!'
      });
      showToast('Mailer connection verified!', 'success');
    } catch (err) {
      setMailTestStatus({
        success: false,
        message: err.message || 'Mailer test failed. Check SMTP configuration in .env.'
      });
      showToast('Mailer test failed', 'error');
    } finally {
      setMailTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/75 backdrop-blur-md flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] animate-bounceIn">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-bold text-white border ${
            toast.type === 'error'
              ? 'bg-rose-600 border-rose-500'
              : 'bg-emerald-600 border-emerald-500'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Admin Dashboard Shell */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] dark:bg-[#181311] text-[#1d1d1d] dark:text-[#f3eee9] overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="h-16 sm:h-18 px-3 sm:px-6 bg-white dark:bg-[#201815] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 flex-shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              aria-label="Toggle sidebar"
            >
              <Layers size={19} />
            </button>

            {/* Store Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-[#fee000] shadow-sm bg-white flex-shrink-0">
                <img src={logoImg} alt="Yahiya Traders Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-[#1d1d1d] dark:text-white">
                    Yahiya Traders
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#fee000] text-[#1d1d1d]">
                    <ShieldCheck size={11} /> Admin Suite
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Store Operational & Connected</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh Data Button */}
            <button
              onClick={() => loadData(false)}
              disabled={refreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#108474]' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Add New Item Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-[#fee000] hover:bg-[#f5d600] active:scale-[0.98] text-[#1d1d1d] text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Plus size={16} />
              <span className="hidden md:inline">Add Harvest Item</span>
              <span className="md:hidden">Add</span>
            </button>

            {/* View Live Storefront Button (Leaves admin back to store) */}
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#108474] hover:bg-[#0c6b5e] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              title="Return to Customer Storefront"
            >
              <Store size={15} />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            {/* Close Admin Button */}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Close dashboard"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Body (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Sidebar */}
          <aside className={`fixed lg:static top-16 sm:top-18 bottom-0 left-0 z-30 w-64 bg-white dark:bg-[#1f1714] border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}>
            {/* Sidebar Navigation Links */}
            <div className="p-3 sm:p-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Store Management
              </div>

              {/* Navigation Items */}
              {[
                { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
                { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending').length },
                { id: 'products', label: 'Catalog & Stock', icon: Package, count: products.length },
                { id: 'customers', label: 'Customer Directory', icon: Users, count: customers.length },
                { id: 'analytics', label: 'Sales & Trends', icon: TrendingUp },
                { id: 'settings', label: 'System & Mailer', icon: ShieldCheck }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#108474] text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={17} className={isActive ? 'text-white' : 'text-neutral-400'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-amber-400 text-neutral-950' : 'bg-rose-500 text-white'
                      }`}>
                        {item.badge} new
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span className={`text-[11px] font-semibold ${isActive ? 'text-emerald-100' : 'text-neutral-400'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Admin User Footer Card */}
            <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-[#fee000] text-neutral-900 flex items-center justify-center font-black text-xs flex-shrink-0">
                  YT
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black truncate text-neutral-900 dark:text-white">
                    {user?.name || 'Yahiya Admin'}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {user?.email || 'admin@yahiyatraders.com'}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 px-1">
                <span>DB: Connected</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
              </div>
            </div>
          </aside>

          {/* Backdrop for mobile sidebar */}
          {mobileSidebarOpen && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-25"
            />
          )}

          {/* Main Dashboard Content Area */}
          <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
            
            {/* Loading state banner */}
            {loading && !refreshing && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw size={28} className="animate-spin text-[#108474]" />
                  <p className="text-xs font-bold text-neutral-500">Loading store metrics & orders...</p>
                </div>
              </div>
            )}

            {!loading && (
              <>
                {/* ========================================================= */}
                {/* TAB 1: OVERVIEW & REAL-TIME METRICS                       */}
                {/* ========================================================= */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Welcome Ribbon */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2a1d18] via-[#3a2822] to-[#1e1512] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#4a352c]">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fee000]/20 text-[#fee000] text-[11px] font-black uppercase tracking-wider mb-2">
                          <Sparkles size={12} /> Executive Store Dashboard
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                          Welcome back, Yahiya Administration
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                          Here is your store summary for dates, nuts, dry fruits, and gourmet confections across India.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                          onClick={handleExportOrdersCSV}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/15"
                        >
                          <Download size={14} />
                          <span>Export CSV</span>
                        </button>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="px-4 py-2 rounded-xl bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={15} />
                          <span>+ New Product</span>
                        </button>
                      </div>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Gross Revenue */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Gross Sales</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <IndianRupee size={16} />
                          </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                          ₹ {(metrics?.totalSales || orderStats.totalRevenue).toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-600">
                          <ArrowUpRight size={13} />
                          <span>Verified Razorpay & WhatsApp settlements</span>
                        </div>
                      </div>

                      {/* Total Orders */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Orders</span>
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <ShoppingBag size={16} />
                          </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                          {orders.length}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500">
                          <span className="text-amber-600 font-bold">{orderStats.pending} pending</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">{orderStats.delivered} completed</span>
                        </div>
                      </div>

                      {/* Average Order Value (AOV) */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Avg Order Value</span>
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <TrendingUp size={16} />
                          </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                          ₹ {orderStats.aov.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-2">
                          {customers.length} total recorded customers
                        </p>
                      </div>

                      {/* Low Stock Watch */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Low Stock Alert</span>
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                            <AlertTriangle size={16} />
                          </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                          {products.filter(p => Number(p.stock) < 25).length}
                        </p>
                        <p className="text-[11px] text-rose-500 font-bold mt-2">
                          Batches requiring harvest restock (&lt;25 units)
                        </p>
                      </div>
                    </div>

                    {/* Visual Sales Graph & Order Pipeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Visual Revenue Activity Bar Chart */}
                      <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                              <BarChart3 size={16} className="text-[#108474]" />
                              <span>Sales & Orders Overview</span>
                            </h3>
                            <p className="text-xs text-neutral-400">Store fulfillment volume across active periods</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                            Real-time Sync
                          </span>
                        </div>

                        {/* Interactive SVG Bar Trend Graph */}
                        <div className="h-44 sm:h-52 w-full pt-4 flex items-end justify-between gap-2 px-2 border-b border-neutral-100 dark:border-neutral-800">
                          {['Ajwa Dates', 'California Almonds', 'Medjool Reserve', 'Cashews King', 'Pistachios', 'Dark Truffles', 'Pecan Halves'].map((label, idx) => {
                            const heights = [78, 92, 60, 85, 45, 95, 70];
                            const revs = ['₹18,400', '₹24,800', '₹14,500', '₹22,100', '₹11,900', '₹28,600', '₹16,700'];
                            const h = heights[idx % heights.length];
                            return (
                              <div key={label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                                {/* Tooltip */}
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition duration-150 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-bold whitespace-nowrap shadow-lg pointer-events-none z-10">
                                  {label}: {revs[idx]}
                                </div>
                                <div
                                  style={{ height: `${h}%` }}
                                  className="w-full max-w-[42px] bg-gradient-to-t from-[#108474] to-[#14b8a6] group-hover:from-[#fee000] group-hover:to-[#ffd000] rounded-t-lg transition duration-200"
                                />
                                <span className="text-[10px] text-neutral-400 font-semibold truncate max-w-[60px] text-center">
                                  {label.split(' ')[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#108474]"></span> Top Performing Category Lines
                          </span>
                          <span>Updated Just Now</span>
                        </div>
                      </div>

                      {/* Order Stage Distribution Progress */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <Truck size={16} className="text-amber-500" />
                          <span>Fulfillment Stages</span>
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-amber-600">Pending Confirmation</span>
                              <span>{orderStats.pending}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                style={{ width: `${orders.length ? (orderStats.pending / orders.length) * 100 : 0}%` }}
                                className="h-full bg-amber-500 rounded-full"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-blue-600">Packaging / Processing</span>
                              <span>{orderStats.processing}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                style={{ width: `${orders.length ? (orderStats.processing / orders.length) * 100 : 0}%` }}
                                className="h-full bg-blue-500 rounded-full"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-purple-600">In Cold-Chain Transit</span>
                              <span>{orderStats.shipped}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                style={{ width: `${orders.length ? (orderStats.shipped / orders.length) * 100 : 0}%` }}
                                className="h-full bg-purple-500 rounded-full"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-emerald-600">Delivered & Verified</span>
                              <span>{orderStats.delivered}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                style={{ width: `${orders.length ? (orderStats.delivered / orders.length) * 100 : 0}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Manage All {orders.length} Orders</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Low Stock Restock Watchlist (Inline Quick Restock) */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            <span>Low Stock Watchlist (&lt;25 units available)</span>
                          </h3>
                          <p className="text-xs text-neutral-400">One-click quick restock triggers instantaneous catalog sync</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('products')}
                          className="text-xs font-bold text-[#108474] hover:underline"
                        >
                          View Full Catalog
                        </button>
                      </div>

                      {products.filter(p => Number(p.stock) < 25).length === 0 ? (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                          <CheckCircle size={16} />
                          <span>All items are healthy! No inventory is critically low.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                          {products
                            .filter(p => Number(p.stock) < 25)
                            .slice(0, 6)
                            .map(item => (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-950/50 bg-rose-50/40 dark:bg-rose-950/10 flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-neutral-900 dark:text-white truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-[11px] text-rose-600 font-bold mt-0.5">
                                    {item.stock} units remaining
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={() => handleQuickRestock(item.id, 25)}
                                    className="px-2 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-black hover:bg-neutral-100 transition cursor-pointer"
                                  >
                                    +25
                                  </button>
                                  <button
                                    onClick={() => handleQuickRestock(item.id, 50)}
                                    className="px-2 py-1 rounded-lg bg-[#fee000] text-neutral-950 text-[10px] font-black hover:bg-[#f5d600] transition cursor-pointer"
                                  >
                                    +50
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: ORDERS MANAGEMENT & FULFILLMENT                    */}
                {/* ========================================================= */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <ShoppingBag size={20} className="text-[#108474]" />
                          <span>Orders & Shipment Fulfillment ({filteredOrders.length})</span>
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Inspect shipping details, print slips, update cold-chain transit stages, and export to CSV.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExportOrdersCSV}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold shadow-2xs hover:bg-neutral-100 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download size={14} />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter Pills & Search */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
                      {/* Search */}
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search by Order ID (YT-...), Customer Name, Email, or Phone..."
                          className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white focus:outline-none focus:border-[#108474]"
                        />
                      </div>

                      {/* Status Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'pending', label: 'Pending' },
                          { id: 'processing', label: 'Processing' },
                          { id: 'shipped', label: 'Shipped' },
                          { id: 'delivered', label: 'Delivered' },
                          { id: 'whatsapp', label: 'WhatsApp' }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => setOrderStatusFilter(st.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              orderStatusFilter === st.id
                                ? 'bg-[#108474] text-white shadow-2xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#201815] shadow-2xs">
                      <table className="w-full text-left text-xs text-neutral-800 dark:text-neutral-200">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-[10px] font-black tracking-wider">
                          <tr>
                            <th className="p-3.5">Order ID</th>
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Customer</th>
                            <th className="p-3.5">Amount</th>
                            <th className="p-3.5">Payment</th>
                            <th className="p-3.5">Fulfillment Stage</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-10 text-center text-neutral-400 text-xs">
                                No orders matching current filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map(order => {
                              const isWa = String(order.payment_id || '').startsWith('wa_');
                              return (
                                <tr key={order.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition">
                                  <td className="p-3.5">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="font-black text-[#108474] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>{order.order_number}</span>
                                      <Eye size={12} />
                                    </button>
                                  </td>
                                  <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                                  </td>
                                  <td className="p-3.5">
                                    <p className="font-bold text-neutral-900 dark:text-white">{order.customer_name || 'Guest Customer'}</p>
                                    <p className="text-[11px] text-neutral-400 truncate max-w-[160px]">{order.customer_email || 'N/A'}</p>
                                  </td>
                                  <td className="p-3.5 font-black text-neutral-900 dark:text-white whitespace-nowrap">
                                    ₹ {Number(order.total_amount || 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isWa
                                        ? 'bg-emerald-500/15 text-emerald-600'
                                        : 'bg-blue-500/15 text-blue-600'
                                    }`}>
                                      {isWa ? 'WhatsApp Order' : (order.payment_status || 'PAID')}
                                    </span>
                                  </td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <select
                                      value={order.status || 'pending'}
                                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                      className="text-xs font-bold px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#108474] cursor-pointer"
                                    >
                                      <option value="pending">🟡 Pending</option>
                                      <option value="processing">🔵 Processing (Packing)</option>
                                      <option value="shipped">🟣 Shipped (Cold-Chain)</option>
                                      <option value="delivered">🟢 Delivered</option>
                                    </select>
                                  </td>
                                  <td className="p-3.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                                        title="View Full Details"
                                      >
                                        <Eye size={14} />
                                      </button>
                                      <button
                                        onClick={() => setPrintInvoiceOrder(order)}
                                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                                        title="Print Packing Slip / Invoice"
                                      >
                                        <Printer size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: PRODUCTS & CATALOG MANAGEMENT                      */}
                {/* ========================================================= */}
                {activeTab === 'products' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <Package size={20} className="text-[#108474]" />
                          <span>Catalog & Stock Management ({filteredProducts.length})</span>
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Edit net packaging weight, pricing in ₹, inventory units, or add new harvest lines.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 rounded-xl bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                      >
                        <Plus size={16} />
                        <span>+ Add New Harvest Item</span>
                      </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
                      {/* Search */}
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products by title, origin, or SKU..."
                          className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white focus:outline-none focus:border-[#108474]"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="flex items-center gap-2">
                        <select
                          value={productCategoryFilter}
                          onChange={(e) => setProductCategoryFilter(e.target.value)}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>

                        {/* Stock Filter */}
                        <select
                          value={productStockFilter}
                          onChange={(e) => setProductStockFilter(e.target.value)}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                        >
                          <option value="all">All Stock Levels</option>
                          <option value="low">⚠️ Low Stock (&lt;25)</option>
                          <option value="out">❌ Out of Stock (0)</option>
                          <option value="instock">✅ Healthy Stock (&gt;=25)</option>
                        </select>
                      </div>
                    </div>

                    {/* Products Table with Inline Price & Weight Editor */}
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#201815] shadow-2xs">
                      <table className="w-full text-left text-xs text-neutral-800 dark:text-neutral-200">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-[10px] font-black tracking-wider">
                          <tr>
                            <th className="p-3.5">Harvest Item</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Pack Weight</th>
                            <th className="p-3.5">Price (₹)</th>
                            <th className="p-3.5">Inventory Units</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {filteredProducts.map(p => {
                            const isEditing = editingProductId === p.id;
                            const isSaving = savingProductId === p.id;

                            return (
                              <React.Fragment key={p.id}>
                                <tr className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition ${isEditing ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''}`}>
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                                        <img
                                          src={p.images && p.images[0] ? p.images[0] : (p.image_url || '/images/products/california-almonds.jpg')}
                                          alt={p.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => { e.currentTarget.src = '/images/products/california-almonds.jpg'; }}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{p.name}</p>
                                        <p className="text-[11px] text-neutral-400">ID #{p.id} • {p.origin || 'Imported'}</p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#108474]/15 text-[#108474]">
                                      {p.category_name || categories.find(c => c.id === p.category_id)?.name || 'Harvest'}
                                    </span>
                                  </td>

                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                                      <Scale size={11} className="text-[#108474]" />
                                      {p.cocoa_percentage || 500}g
                                    </span>
                                  </td>

                                  <td className="p-3.5 whitespace-nowrap font-black text-neutral-900 dark:text-white text-sm">
                                    ₹ {Number(p.price).toLocaleString('en-IN')}
                                  </td>

                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                                      Number(p.stock) <= 10
                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                                        : Number(p.stock) < 25
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    }`}>
                                      {p.stock} units
                                    </span>
                                  </td>

                                  <td className="p-3.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => isEditing ? setEditingProductId(null) : handleStartEdit(p)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                          isEditing
                                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800'
                                            : 'bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d]'
                                        }`}
                                      >
                                        <Edit3 size={13} />
                                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                      </button>

                                      <button
                                        onClick={() => setProductToDelete(p)}
                                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 dark:text-rose-400 transition cursor-pointer"
                                        title="Delete product"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Inline Editor Panel */}
                                {isEditing && (
                                  <tr className="bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60">
                                    <td colSpan={6} className="p-4">
                                      <div className="p-4 rounded-xl bg-white dark:bg-[#1a1310] border border-amber-300 dark:border-amber-700/60 shadow-md space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                                            <Edit3 size={14} className="text-[#108474]" />
                                            <span>Quick Edit for <strong className="underline">{p.name}</strong></span>
                                          </h4>
                                          <span className="text-[10px] text-neutral-400">Values immediately sync with DB and storefront</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                          {/* Price */}
                                          <div>
                                            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                              Price (₹ INR) *
                                            </label>
                                            <input
                                              type="number"
                                              value={editForm.price}
                                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                              className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                                            />
                                          </div>

                                          {/* Weight & Presets */}
                                          <div>
                                            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                              Net Weight (grams) *
                                            </label>
                                            <input
                                              type="number"
                                              value={editForm.weight}
                                              onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                              className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000] mb-1"
                                            />
                                            <div className="flex items-center gap-1">
                                              <span className="text-[10px] text-neutral-400">Presets:</span>
                                              {[100, 250, 500, 1000].map(w => (
                                                <button
                                                  key={w}
                                                  type="button"
                                                  onClick={() => setEditForm({ ...editForm, weight: w })}
                                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                                    Number(editForm.weight) === w
                                                      ? 'bg-[#108474] text-white'
                                                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                                  }`}
                                                >
                                                  {w >= 1000 ? `${w/1000}kg` : `${w}g`}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Stock */}
                                          <div>
                                            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                              Stock Units Available *
                                            </label>
                                            <input
                                              type="number"
                                              value={editForm.stock}
                                              onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                              className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                          <button
                                            type="button"
                                            onClick={() => setEditingProductId(null)}
                                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => handleSaveProductEdit(p.id)}
                                            className="px-4 py-1.5 rounded-lg bg-[#108474] hover:bg-[#0c6b5e] text-white text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                          >
                                            <Save size={13} />
                                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 4: CUSTOMER DIRECTORY                                 */}
                {/* ========================================================= */}
                {activeTab === 'customers' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <Users size={20} className="text-[#108474]" />
                          <span>Customer Directory ({filteredCustomers.length})</span>
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Verified purchasers across India with lifetime spend and direct WhatsApp contact.
                        </p>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                      <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search customers by name, email, phone, or city..."
                          className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white focus:outline-none focus:border-[#108474]"
                        />
                      </div>
                    </div>

                    {/* Customers Table */}
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#201815] shadow-2xs">
                      <table className="w-full text-left text-xs text-neutral-800 dark:text-neutral-200">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-[10px] font-black tracking-wider">
                          <tr>
                            <th className="p-3.5">Customer Name</th>
                            <th className="p-3.5">Contact Email</th>
                            <th className="p-3.5">Phone</th>
                            <th className="p-3.5">City / Zone</th>
                            <th className="p-3.5">Orders</th>
                            <th className="p-3.5">Total Spent</th>
                            <th className="p-3.5 text-right">Support Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {filteredCustomers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-neutral-400 text-xs">
                                No customer records found.
                              </td>
                            </tr>
                          ) : (
                            filteredCustomers.map((c, i) => (
                              <tr key={i} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#108474]/15 text-[#108474] font-black flex items-center justify-center text-xs">
                                      {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-neutral-900 dark:text-white">{c.name}</span>
                                  </div>
                                </td>
                                <td className="p-3.5 text-neutral-500">{c.email}</td>
                                <td className="p-3.5 text-neutral-600 dark:text-neutral-300 font-medium">{c.phone}</td>
                                <td className="p-3.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
                                    <MapPin size={11} className="text-[#108474]" /> {c.city}
                                  </span>
                                </td>
                                <td className="p-3.5 font-black">{c.totalOrders}</td>
                                <td className="p-3.5 font-black text-[#108474]">
                                  ₹ {c.totalSpent.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3.5 text-right">
                                  {c.phone && c.phone !== 'N/A' ? (
                                    <a
                                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20this%20is%20Yahiya%20Traders%20concerning%20your%20order.`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold transition"
                                    >
                                      <Phone size={12} />
                                      <span>WhatsApp</span>
                                    </a>
                                  ) : (
                                    <span className="text-neutral-400 text-[11px]">Direct Order</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 5: SALES ANALYTICS & REVENUE TRENDS                   */}
                {/* ========================================================= */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <TrendingUp size={20} className="text-[#108474]" />
                          <span>Store Analytics & Revenue Insights</span>
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Performance breakdown across payment gateways, product categories, and sales channels.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {['7d', '30d', 'all'].map(r => (
                          <button
                            key={r}
                            onClick={() => setAnalyticsRange(r)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              analyticsRange === r
                                ? 'bg-[#108474] text-white shadow-2xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                            }`}
                          >
                            {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Analytics Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                        <span className="text-xs font-bold text-neutral-500 uppercase">Average Order Size</span>
                        <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                          ₹ {orderStats.aov.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-bold mt-1">High conversion basket</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                        <span className="text-xs font-bold text-neutral-500 uppercase">WhatsApp Checkout Share</span>
                        <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                          {orders.length ? Math.round((orderStats.whatsapp / orders.length) * 100) : 0}%
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1">{orderStats.whatsapp} WhatsApp direct orders</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                        <span className="text-xs font-bold text-neutral-500 uppercase">Delivery Completion Rate</span>
                        <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                          {orders.length ? Math.round((orderStats.delivered / orders.length) * 100) : 0}%
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1">Verified cold-chain deliveries</p>
                      </div>
                    </div>

                    {/* Category Breakdown Table */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
                      <h3 className="text-sm font-black text-neutral-900 dark:text-white">
                        Category Inventory & Value Breakdown
                      </h3>

                      <div className="space-y-3">
                        {categories.map(cat => {
                          const catProducts = products.filter(p => p.category_id === cat.id);
                          const totalCatStock = catProducts.reduce((sum, p) => sum + Number(p.stock || 0), 0);
                          const totalCatValue = catProducts.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0);

                          return (
                            <div key={cat.id} className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{cat.name}</h4>
                                <p className="text-[11px] text-neutral-400">{catProducts.length} published SKUs • {totalCatStock} total units in storage</p>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-xs font-black text-[#108474]">
                                  Inventory Value: ₹ {totalCatValue.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 6: SYSTEM, MAILER & STORE SETTINGS                    */}
                {/* ========================================================= */}
                {activeTab === 'settings' && (
                  <div className="max-w-4xl space-y-6">
                    <div>
                      <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck size={20} className="text-[#108474]" />
                        <span>System, Mailer & Store Settings</span>
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Check server SMTP dispatch status, store profile information, and database synchronization.
                      </p>
                    </div>

                    {/* Mailer Connection Test Card */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Mail size={18} />
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-neutral-900 dark:text-white">
                              Transactional Email Dispatch (SMTP)
                            </h3>
                            <p className="text-[11px] text-neutral-400">
                              Sends instant order confirmations and shipment status emails to customers.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleTestMail}
                          disabled={mailTesting}
                          className="px-3.5 py-2 rounded-xl bg-[#108474] hover:bg-[#0c6b5e] text-white text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={13} className={mailTesting ? 'animate-spin' : ''} />
                          <span>{mailTesting ? 'Testing...' : 'Test Connection'}</span>
                        </button>
                      </div>

                      {mailTestStatus && (
                        <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                          mailTestStatus.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300'
                        }`}>
                          {mailTestStatus.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                          <span>{mailTestStatus.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Store Profile Information */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#201815] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
                      <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider">
                        Storefront Profile & Contact Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-500 font-bold mb-1">Brand Name</label>
                          <input
                            type="text"
                            disabled
                            value="Yahiya Traders"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 font-bold mb-1">Support WhatsApp</label>
                          <input
                            type="text"
                            disabled
                            value="+91 80562 25895"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 font-bold mb-1">Currency</label>
                          <input
                            type="text"
                            disabled
                            value="INR (₹ Indian Rupee)"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 font-bold mb-1">Fulfillment Packaging</label>
                          <input
                            type="text"
                            disabled
                            value="Insulated Food-Safe Sealed Poly-Pouch"
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Admin Logout */}
                    <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-rose-700 dark:text-rose-300">
                          Sign Out of Administrator Portal
                        </h4>
                        <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
                          Terminates current admin session token on this device.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DRAWER: ORDER DETAILS                                     */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#1f1714] h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 dark:border-neutral-800 animate-slideLeft">
            {/* Drawer Top */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#108474]">
                  Order Fulfillment Details
                </span>
                <h3 className="text-base font-black text-neutral-900 dark:text-white">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Scroll Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Order Status Ribbon */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">Current Stage</span>
                  <p className="text-xs font-black capitalize text-neutral-900 dark:text-white">
                    {selectedOrder.status || 'Pending'}
                  </p>
                </div>
                <select
                  value={selectedOrder.status || 'pending'}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-xs font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="font-black text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
                  Customer Information
                </h4>
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
                  <p className="font-bold text-neutral-900 dark:text-white">{selectedOrder.customer_name || 'Guest'}</p>
                  <p className="text-neutral-500">{selectedOrder.customer_email || 'No email provided'}</p>
                  <p className="text-neutral-600 dark:text-neutral-300 font-medium">Phone: {selectedOrder.customer_phone || 'N/A'}</p>
                  
                  {selectedOrder.shipping_address && (
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                      <p>{typeof selectedOrder.shipping_address === 'string' ? selectedOrder.shipping_address : [selectedOrder.shipping_address.addressLine || selectedOrder.shipping_address.address, selectedOrder.shipping_address.city, selectedOrder.shipping_address.state, selectedOrder.shipping_address.postalCode || selectedOrder.shipping_address.pincode].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="font-black text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
                  Ordered Harvest Items ({selectedOrder.items?.length || 1})
                </h4>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                            <img
                              src={it.image_url || '/images/products/california-almonds.jpg'}
                              alt={it.product_name || 'Item'}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = '/images/products/california-almonds.jpg'; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-900 dark:text-white truncate">{it.product_name || 'Harvest Item'}</p>
                            <p className="text-[11px] text-neutral-400">Qty: {it.quantity} × ₹ {Number(it.unit_price || 0)}</p>
                          </div>
                        </div>
                        <span className="font-black text-neutral-900 dark:text-white">
                          ₹ {(Number(it.unit_price || 0) * Number(it.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="font-bold text-neutral-900 dark:text-white">Standard Order Package</p>
                      <p className="text-[11px] text-neutral-400">Total: ₹ {Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Payment Gateway</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {String(selectedOrder.payment_id || '').startsWith('wa_') ? 'WhatsApp Direct Bill' : 'Razorpay / Prepaid'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600">FREE Delivery</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Grand Total</span>
                  <span className="text-[#108474]">₹ {Number(selectedOrder.total_amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <button
                onClick={() => setPrintInvoiceOrder(selectedOrder)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Packing Slip</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-[#108474] text-white font-bold text-xs hover:bg-[#0c6b5e] transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINTABLE PACKING SLIP / INVOICE PREVIEW            */}
      {/* ========================================================= */}
      {printInvoiceOrder && (
        <div className="fixed inset-0 z-70 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 lg:p-8 animate-fadeIn">
          {/* Print & Action Bar */}
          <div className="w-full max-w-3xl my-2 sm:my-4 space-y-3">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="flex items-center justify-between bg-neutral-900/90 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-neutral-700 print:hidden">
              <button
                onClick={() => setPrintInvoiceOrder(null)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-300 hidden sm:inline">
                  Invoice & Packing Slip • {printInvoiceOrder.order_number}
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setPrintInvoiceOrder(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                  aria-label="Close invoice"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet (Letterhead / Tax Invoice) */}
            <div
              id="printable-invoice"
              className="w-full bg-white text-neutral-950 p-6 sm:p-10 rounded-2xl shadow-2xl space-y-6 border border-neutral-200 print:border-none print:shadow-none print:p-0 print:m-0"
            >
              {/* Header Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-neutral-900 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#fee000] shadow-sm bg-white flex-shrink-0">
                    <img src={logoImg} alt="Yahiya Traders" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-neutral-950">YAHIYA TRADERS</h2>
                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                      Royal Saudi Dates, Colossal Cashews & Gourmet Confections
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Main Bazaar, Tenkarai, Tamil Nadu 625601 • WhatsApp: +91 80562 25895
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Email: sales@yahiyatraders.com • www.yahiyatraders.com
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0 bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="inline-block px-3 py-1 rounded bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider mb-2">
                    Tax Invoice & Packing Slip
                  </div>
                  <p className="text-xs font-bold text-neutral-500">Order Reference:</p>
                  <p className="text-base font-black text-neutral-950 tracking-wide">{printInvoiceOrder.order_number}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Date: <strong className="text-neutral-900 font-bold">{printInvoiceOrder.created_at ? new Date(printInvoiceOrder.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}</strong>
                  </p>
                  <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                    Payment: {String(printInvoiceOrder.payment_id || '').startsWith('wa_') ? 'WhatsApp Direct Bill' : (printInvoiceOrder.payment_status || 'PAID (Online)')}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping 2-Column Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Bill To */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="font-black uppercase text-[10px] text-neutral-500 tracking-wider block mb-1">
                    Customer / Recipient:
                  </span>
                  <p className="font-black text-sm text-neutral-950">{printInvoiceOrder.customer_name || 'Valued Customer'}</p>
                  <p className="text-neutral-600 font-medium">{printInvoiceOrder.customer_email || 'No email provided'}</p>
                  <p className="text-neutral-700 font-bold">Contact: {printInvoiceOrder.customer_phone || 'N/A'}</p>
                </div>

                {/* Ship To */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="font-black uppercase text-[10px] text-neutral-500 tracking-wider block mb-1">
                    Delivery / Shipping Destination:
                  </span>
                  <p className="font-bold text-neutral-900 leading-relaxed">
                    {(() => {
                      const addr = printInvoiceOrder.shipping_address;
                      if (!addr) return 'Standard Zone, Tamil Nadu';
                      if (typeof addr === 'string') return addr;
                      const parts = [
                        addr.addressLine || addr.address,
                        addr.city,
                        addr.state || 'Tamil Nadu',
                        addr.postalCode || addr.pincode
                      ].filter(Boolean);
                      return parts.join(', ') || 'Standard Zone, Tamil Nadu';
                    })()}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Insulated cold-chain safe packaging with aroma seal.
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-neutral-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 border-b border-neutral-300 font-black text-[11px] text-neutral-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 w-10 text-center">#</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Rate (₹)</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {Array.isArray(printInvoiceOrder.items) && printInvoiceOrder.items.length > 0 ? (
                      printInvoiceOrder.items.map((it, idx) => {
                        const cleanName = (it.product_name || it.name || 'Harvest Item')
                          .replace(/\s*\(([0-9]+(?:\.[0-9]+)?(?:g|kg|G|KG))\)\s*\(([0-9]+(?:\.[0-9]+)?(?:g|kg|G|KG))\)/i, ' ($2)');
                        const qty = Number(it.quantity || 1);
                        const rate = Number(it.unit_price || it.price || 0);
                        const lineTotal = Number(it.total_price || (qty * rate));

                        return (
                          <tr key={idx} className="hover:bg-neutral-50/50">
                            <td className="p-3 text-center text-neutral-400 font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-neutral-900">
                              {cleanName}
                            </td>
                            <td className="p-3 text-center font-black text-neutral-900">{qty}</td>
                            <td className="p-3 text-right font-medium text-neutral-700">₹ {rate.toFixed(2)}</td>
                            <td className="p-3 text-right font-black text-neutral-950">₹ {lineTotal.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="p-3 text-center text-neutral-400">1</td>
                        <td className="p-3 font-bold text-neutral-900">Store Harvest Fulfillment Package</td>
                        <td className="p-3 text-center font-black">1</td>
                        <td className="p-3 text-right">₹ {Number(printInvoiceOrder.total_amount).toFixed(2)}</td>
                        <td className="p-3 text-right font-black">₹ {Number(printInvoiceOrder.total_amount).toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary & Financials */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
                <div className="text-xs text-neutral-500 max-w-sm space-y-1">
                  <p className="font-bold text-neutral-800">Quality & Freshness Guarantee:</p>
                  <p>All items are sorted and packaged under certified hygienic standards. Keep stored in cool, sealed environment.</p>
                  <p className="text-[10px] text-neutral-400">For support or inquiries, please contact: +91 80562 25895</p>
                </div>

                <div className="w-full sm:w-72 p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-neutral-900">₹ {Number(printInvoiceOrder.subtotal || printInvoiceOrder.total_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Cold-Chain Packaging:</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping Charges:</span>
                    <span className="font-bold text-emerald-700">FREE Delivery</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t-2 border-neutral-900">
                    <span>Grand Total:</span>
                    <span className="text-base text-neutral-950 font-black">
                      ₹ {Number(printInvoiceOrder.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature & Legal Notice */}
              <div className="pt-6 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-center sm:text-left text-[11px] text-neutral-400">
                  <p className="font-bold text-neutral-700">Thank you for ordering with Yahiya Traders!</p>
                  <p>© 2026 Data Infolenz. All rights reserved.</p>
                </div>

                <div className="text-center sm:text-right">
                  <div className="w-40 border-b border-neutral-400 pb-1 mx-auto sm:ml-auto">
                    <span className="font-serif italic text-sm text-neutral-700 font-bold">Yahiya Traders</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mt-1">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="flex items-center justify-end gap-2 pt-2 print:hidden">
              <button
                onClick={() => setPrintInvoiceOrder(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100 shadow-sm cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD HARVEST ITEM                                   */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-70 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#1f1714] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-[#108474]" />
                <span>Add New Harvest Item to Storefront</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Saudi Ajwa Dates (500g)"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Category *</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="750"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Stock Units</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={newProduct.cocoa_percentage}
                    onChange={(e) => setNewProduct({ ...newProduct, cocoa_percentage: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Harvest Origin</label>
                  <input
                    type="text"
                    placeholder="Saudi Arabia / California"
                    value={newProduct.origin}
                    onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <label className="block font-bold text-neutral-700 dark:text-neutral-300">
                  Upload Product Image *
                </label>
                <input
                  ref={adminFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleAdminFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!adminPreviewUrl && !newProduct.image_url ? (
                  <div
                    onClick={() => adminFileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-[#108474] transition"
                  >
                    <UploadCloud size={20} className="text-[#108474]" />
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                      Click to choose image file (Saved in /images/products)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-800 border">
                    <div className="flex items-center gap-2">
                      <img
                        src={adminPreviewUrl || newProduct.image_url}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
                        {adminFile?.name || 'Image Ready'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-neutral-100 dark:bg-neutral-700"
                    >
                      Change
                    </button>
                  </div>
                )}
                {adminUploadError && (
                  <p className="text-rose-600 font-bold">{adminUploadError}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Item Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Fresh hand-sorted harvest with sealed aroma lock..."
                  className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminUploading}
                  className="px-5 py-2 rounded-xl bg-[#108474] hover:bg-[#0c6b5e] text-white font-bold shadow-xs transition disabled:opacity-50"
                >
                  {adminUploading ? 'Uploading Image...' : 'Publish to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-70 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#1f1714] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white">Delete Item From Catalog?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to permanently delete <strong>{productToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingProductId !== null}
                onClick={handleDeleteProduct}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
              >
                {deletingProductId !== null ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
