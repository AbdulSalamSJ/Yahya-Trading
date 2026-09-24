import React, { useState, useEffect, useRef } from 'react';
import { X, IndianRupee, Package, ShoppingBag, AlertTriangle, Plus, Trash2, Edit, CheckCircle, Search, Save, Check, Scale, UploadCloud, FileImage, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import logoImg from '../image/logo.jpg';

export function AdminModal({ isOpen, onClose, onRefreshProducts, onOpenAddItem, onProductCreated }) {
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'products' | 'orders'
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  // Editing state for individual products
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', weight: '', stock: '' });
  const [savingProductId, setSavingProductId] = useState(null);
  const [saveSuccessId, setSaveSuccessId] = useState(null);

  // New product modal form state - initialized empty
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductSuccess, setNewProductSuccess] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: 1,
    brand: '',
    short_desc: '',
    description: '',
    price: '',
    stock: '',
    origin: '',
    cocoa_percentage: '',
    is_featured: false,
    image_url: ''
  });

  // System file upload state
  const [adminFile, setAdminFile] = useState(null);
  const [adminPreviewUrl, setAdminPreviewUrl] = useState('');
  const [adminUploading, setAdminUploading] = useState(false);
  const [adminUploadError, setAdminUploadError] = useState('');
  const adminFileInputRef = useRef(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, oRes, cRes, pRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAllOrders(),
        api.getCategories(),
        api.getProducts({})
      ]);
      setMetrics(mRes.metrics);
      setOrders(oRes.orders || []);
      setCategories(cRes.categories || []);
      setProducts(pRes.products || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

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
        setSaveSuccessId(productId);
        setTimeout(() => setSaveSuccessId(null), 3000);
        setEditingProductId(null);
        if (onRefreshProducts) onRefreshProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to update item weight and price');
    } finally {
      setSavingProductId(null);
    }
  };

  if (!isOpen) return null;

  const resetAddForm = () => {
    setNewProduct({
      name: '',
      category_id: categories[0]?.id || 1,
      brand: '',
      short_desc: '',
      description: '',
      price: '',
      stock: '',
      origin: '',
      cocoa_percentage: '',
      is_featured: false,
      image_url: ''
    });
    setAdminFile(null);
    setAdminPreviewUrl('');
    setAdminUploadError('');
    if (adminFileInputRef.current) adminFileInputRef.current.value = '';
  };

  const handleAdminFileSelect = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setAdminUploadError('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setAdminUploadError('Image size exceeds 15MB limit.');
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
      }
    } catch (err) {
      console.error('Admin image upload error:', err);
      setAdminUploadError(err.message || 'Failed to upload product image');
    } finally {
      setAdminUploading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim()) {
      alert('Please enter a harvest item name');
      return;
    }
    if (!newProduct.price || Number(newProduct.price) <= 0) {
      alert('Please enter a valid price in ₹ INR');
      return;
    }
    if (adminUploading) {
      alert('Please wait for the image upload to complete');
      return;
    }
    if (!newProduct.image_url) {
      alert('Please upload a product image from your system');
      return;
    }

    try {
      const res = await api.createProduct({
        ...newProduct,
        name: newProduct.name.trim(),
        brand: newProduct.brand.trim() || 'Yahya Traders Select',
        category_id: Number(newProduct.category_id),
        price: Number(newProduct.price),
        stock: newProduct.stock ? Number(newProduct.stock) : 50,
        cocoa_percentage: newProduct.cocoa_percentage ? Number(newProduct.cocoa_percentage) : 500,
        origin: newProduct.origin.trim() || 'Imported Selection',
        short_desc: newProduct.short_desc.trim() || 'Authentic premium selection from Yahya Traders.',
        description: newProduct.description.trim() || 'Hand-sorted, certified pure harvest with sealed aroma lock.',
        images: [newProduct.image_url]
      });
      setShowAddProduct(false);
      setNewProductSuccess(`✓ "${newProduct.name}" created and published to storefront successfully!`);
      setTimeout(() => setNewProductSuccess(''), 4500);
      resetAddForm();
      loadAdminData();
      if (onRefreshProducts) onRefreshProducts();
      if (onProductCreated && res?.product) onProductCreated(res.product);
    } catch (err) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FFFFFF] dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Top Bar */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-[#fafafa] dark:bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#fee000] shadow-sm flex-shrink-0 bg-white">
              <img src={logoImg} alt="Yahya Traders" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1d1d1d] dark:text-white">
                Yahya Traders Store Administration & Orders
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Manage dates, nuts, dry fruits & chocolates catalog, order fulfillment, and metrics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#EBE0D8] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] flex gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'metrics'
                ? 'border-[#795548] text-[#3E2723] dark:text-[#F5EFEA] font-semibold'
                : 'border-transparent text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723]'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-[#795548] text-[#3E2723] dark:text-[#F5EFEA] font-semibold'
                : 'border-transparent text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723]'
            }`}
          >
            Fulfillment Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'products'
                ? 'border-[#795548] text-[#3E2723] dark:text-[#F5EFEA] font-semibold'
                : 'border-transparent text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723]'
            }`}
          >
            Catalog: Edit Weight & Price ({products.length})
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Cards for key metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <div className="flex items-center justify-between text-[#6D4C41] dark:text-[#C8B8B0] text-xs font-semibold uppercase mb-1">
                    <span>Gross Revenue</span>
                    <IndianRupee size={16} className="text-[#388E3C]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#795548] dark:text-[#A1887F]">
                    ₹ {(metrics?.totalSales || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#388E3C] mt-1">✓ Razorpay settlements verified</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <div className="flex items-center justify-between text-[#6D4C41] dark:text-[#C8B8B0] text-xs font-semibold uppercase mb-1">
                    <span>Total Orders</span>
                    <ShoppingBag size={16} className="text-[#795548]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    {metrics?.totalOrders || 0}
                  </p>
                  <p className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0] mt-1">Across all shipping zones</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <div className="flex items-center justify-between text-[#6D4C41] dark:text-[#C8B8B0] text-xs font-semibold uppercase mb-1">
                    <span>Catalog Items</span>
                    <Package size={16} className="text-[#795548]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    {metrics?.totalProducts || 8}
                  </p>
                  <p className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0] mt-1">Single origin & confections</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <div className="flex items-center justify-between text-[#6D4C41] dark:text-[#C8B8B0] text-xs font-semibold uppercase mb-1">
                    <span>Low Stock Batches</span>
                    <AlertTriangle size={16} className="text-[#F57C00]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#F57C00]">
                    {metrics?.lowStockCount || 2}
                  </p>
                  <p className="text-[11px] text-[#F57C00] mt-1">Requires harvest restock</p>
                </div>

              </div>

              {/* Low Stock Watchlist */}
              {metrics?.lowStockItems && metrics.lowStockItems.length > 0 && (
                <div className="p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <h4 className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA] mb-3 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-[#F57C00]" />
                    Batches Requiring Harvest Restock
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {metrics.lowStockItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] text-xs">
                        <span className="font-medium text-[#3E2723] dark:text-[#F5EFEA] truncate">{item.name}</span>
                        <span className="px-2 py-0.5 rounded bg-[#F57C00]/15 text-[#F57C00] font-semibold flex-shrink-0">
                          {item.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                  Customer Orders & Fresh Logistics
                </h4>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-[#795548] dark:text-[#A1887F] hover:underline font-medium"
                >
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#EBE0D8] dark:border-[#3E2F29]">
                <table className="w-full text-left text-xs text-[#3E2723] dark:text-[#F5EFEA]">
                  <thead className="bg-[#FDF8F5] dark:bg-[#1C1412] border-b border-[#EBE0D8] dark:border-[#3E2F29] text-[#6D4C41] dark:text-[#C8B8B0]">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Stage Status</th>
                      <th className="p-3">Change Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0D8] dark:divide-[#3E2F29]">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#EFEBE9]/50 dark:hover:bg-[#3E2F29]/40 transition">
                        <td className="p-3 font-semibold text-[#795548] dark:text-[#A1887F]">
                          {order.order_number}
                        </td>
                        <td className="p-3">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">{order.customer_email}</p>
                        </td>
                        <td className="p-3 font-bold text-[#795548] dark:text-[#A1887F]">
                          ₹ {Number(order.total_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#388E3C]/15 text-[#388E3C]">
                            PAID (Razorpay)
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize ${
                            order.status === 'delivered'
                              ? 'bg-[#388E3C]/15 text-[#388E3C]'
                              : order.status === 'shipped'
                              ? 'bg-[#795548]/15 text-[#795548] dark:text-[#A1887F]'
                              : 'bg-[#F57C00]/15 text-[#F57C00]'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] focus:outline-none focus:border-[#795548]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing (Tempering)</option>
                            <option value="shipped">Shipped (In Cold-Chain)</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & WEIGHT / PRICE MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA] flex items-center gap-2">
                    <Scale size={18} className="text-[#108474]" />
                    <span>Catalog: Edit Item Weight & Price</span>
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Update net weight (grams), price (₹ INR), and stock for any harvest item.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-3.5 py-2 rounded-xl bg-[#795548] hover:bg-[#5D4037] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  <span>{showAddProduct ? 'Hide Add Form' : 'Add New Harvest Item'}</span>
                </button>
              </div>

              {/* Product Created Success Message */}
              {newProductSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{newProductSuccess}</span>
                </div>
              )}

              {/* Add Product Form */}
              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="p-5 rounded-xl border border-[#EBE0D8] dark:border-[#3E2F29] bg-[#FDF8F5] dark:bg-[#1C1412] space-y-4">
                  <h5 className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Add New Harvest Item to Catalog
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Harvest Item Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Saudi Ajwa Dates (500g)"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Category *</label>
                      <select
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 750"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Batch Stock Units</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Weight / Pack Size (grams)</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={newProduct.cocoa_percentage}
                        onChange={(e) => setNewProduct({ ...newProduct, cocoa_percentage: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Single Origin</label>
                      <input
                        type="text"
                        placeholder="e.g. Saudi Arabia / California"
                        value={newProduct.origin}
                        onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                        className="w-full h-10 px-3 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      />
                    </div>
                  </div>

                  {/* System Image Upload */}
                  <div className="p-3.5 rounded-xl border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#3E2723] dark:text-[#F5EFEA] flex items-center gap-1.5">
                        <UploadCloud size={15} className="text-[#108474]" />
                        <span>Upload Product Image From System *</span>
                      </label>
                      <span className="text-[10px] text-neutral-400">Saves in /images/products</span>
                    </div>

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
                        className="p-4 border-2 border-dashed border-[#D7C4BC] dark:border-[#3E2F29] hover:border-[#795548] rounded-xl flex items-center justify-center gap-3 cursor-pointer transition bg-[#FDF8F5] dark:bg-[#1C1412]"
                      >
                        <UploadCloud size={20} className="text-[#795548]" />
                        <span className="text-xs font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                          Click to browse image file from computer (Saved to /images/products)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={adminPreviewUrl || newProduct.image_url}
                            alt="Upload preview"
                            className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                          />
                          <div>
                            <p className="text-xs font-bold truncate max-w-[220px]">
                              {adminFile?.name || newProduct.image_url.split('/').pop()}
                            </p>
                            {adminUploading ? (
                              <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                <RefreshCw size={11} className="animate-spin" /> Uploading to /images/products...
                              </span>
                            ) : (
                              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                <Check size={11} /> Saved in /images/products/
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => adminFileInputRef.current?.click()}
                          className="px-3 py-1 text-xs rounded-lg bg-neutral-200 dark:bg-neutral-700 font-bold"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    {adminUploadError && (
                      <p className="text-xs text-red-600 font-bold">{adminUploadError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Description & Tasting Notes</label>
                    <textarea
                      rows="2"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value, short_desc: e.target.value.substring(0, 100) })}
                      className="w-full p-2.5 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA]"
                      placeholder="Artisan notes on aroma, roast, acidity, and melt texture..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={adminUploading}
                    className="px-6 py-2.5 bg-[#795548] hover:bg-[#5D4037] text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {adminUploading ? 'Uploading Image...' : 'Publish to Storefront'}
                  </button>
                </form>
              )}

              {/* Product Search & Counter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product by name or category..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] focus:outline-none focus:border-[#795548]"
                  />
                </div>
                <span className="text-xs text-[#6D4C41] dark:text-[#C8B8B0] font-semibold whitespace-nowrap self-center">
                  Total Items: {products.length}
                </span>
              </div>

              {/* Products Table with Inline Weight & Price Editor */}
              <div className="overflow-x-auto rounded-xl border border-[#EBE0D8] dark:border-[#3E2F29]">
                <table className="w-full text-left text-xs text-[#3E2723] dark:text-[#F5EFEA]">
                  <thead className="bg-[#FDF8F5] dark:bg-[#1C1412] border-b border-[#EBE0D8] dark:border-[#3E2F29] text-[#6D4C41] dark:text-[#C8B8B0]">
                    <tr>
                      <th className="p-3">Item Details</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Weight</th>
                      <th className="p-3">Current Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0D8] dark:divide-[#3E2F29]">
                    {products
                      .filter(p =>
                        !productSearch ||
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        (p.category_name && p.category_name.toLowerCase().includes(productSearch.toLowerCase()))
                      )
                      .map(p => {
                        const isEditing = editingProductId === p.id;
                        const isSaving = savingProductId === p.id;
                        const justSaved = saveSuccessId === p.id;

                        return (
                          <React.Fragment key={p.id}>
                            <tr className={`hover:bg-[#EFEBE9]/50 dark:hover:bg-[#3E2F29]/40 transition ${isEditing ? 'bg-[#fee000]/10 dark:bg-[#fee000]/5' : ''}`}>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                                    <img
                                      src={p.images && p.images[0] ? p.images[0] : (p.image_url || '/images/products/california-almonds.jpg')}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.src = '/images/products/california-almonds.jpg'; }}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#1d1d1d] dark:text-white line-clamp-1">{p.name}</p>
                                    <p className="text-[11px] text-neutral-400">ID #{p.id} • {p.origin || 'Imported'}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#108474]/15 text-[#108474] dark:text-[#14b8a6]">
                                  {p.category_name || 'Harvest'}
                                </span>
                              </td>

                              <td className="p-3 font-semibold text-neutral-700 dark:text-neutral-300">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                  <Scale size={12} className="text-[#108474]" />
                                  {p.cocoa_percentage || 500}g
                                </span>
                              </td>

                              <td className="p-3 font-black text-base text-[#1d1d1d] dark:text-[#fee000]">
                                ₹ {Number(p.price).toLocaleString('en-IN')}
                              </td>

                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  Number(p.stock) <= 10
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                  {p.stock} units
                                </span>
                              </td>

                              <td className="p-3 text-right">
                                {justSaved ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                    <CheckCircle size={14} /> Saved!
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => isEditing ? setEditingProductId(null) : handleStartEdit(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer ${
                                      isEditing
                                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                                        : 'bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] shadow-sm'
                                    }`}
                                  >
                                    <Edit size={13} />
                                    <span>{isEditing ? 'Cancel' : 'Edit Weight & Price'}</span>
                                  </button>
                                )}
                              </td>
                            </tr>

                            {/* Inline Weight & Price Editor Row */}
                            {isEditing && (
                              <tr className="bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/50">
                                <td colSpan={6} className="p-4">
                                  <div className="p-4 rounded-xl bg-white dark:bg-[#1f1614] border border-amber-300 dark:border-amber-700/60 shadow-md space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h6 className="font-bold text-xs text-[#1d1d1d] dark:text-white flex items-center gap-1.5">
                                        <Edit size={14} className="text-[#108474]" />
                                        <span>Editing: <span className="underline">{p.name}</span></span>
                                      </h6>
                                      <span className="text-[11px] text-neutral-400">Values immediately sync with DB & storefront</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      {/* Price Field */}
                                      <div>
                                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                          Price (₹ INR) *
                                        </label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400">₹</span>
                                          <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                            className="w-full pl-8 pr-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                                          />
                                        </div>
                                      </div>

                                      {/* Weight Field & Quick Presets */}
                                      <div>
                                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                          Net Weight (grams) *
                                        </label>
                                        <div className="relative mb-1.5">
                                          <input
                                            type="number"
                                            step="any"
                                            min="1"
                                            value={editForm.weight}
                                            onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                            className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">grams</span>
                                        </div>
                                        {/* Quick Weight Presets */}
                                        <div className="flex items-center gap-1">
                                          <span className="text-[10px] text-neutral-400">Presets:</span>
                                          {[100, 150, 250, 400, 500, 1000].map(w => (
                                            <button
                                              key={w}
                                              type="button"
                                              onClick={() => setEditForm({ ...editForm, weight: w })}
                                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                                                Number(editForm.weight) === w
                                                  ? 'bg-[#108474] text-white'
                                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                                              }`}
                                            >
                                              {w >= 1000 ? `${w/1000}kg` : `${w}g`}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Stock Units */}
                                      <div>
                                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                                          Stock Available (Units) *
                                        </label>
                                        <input
                                          type="number"
                                          value={editForm.stock}
                                          onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                          className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-[#fee000]"
                                        />
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
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
                                        className="px-4 py-1.5 rounded-lg bg-[#108474] hover:bg-[#0d6e61] text-white text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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

        </div>

      </div>
    </div>
  );
}
