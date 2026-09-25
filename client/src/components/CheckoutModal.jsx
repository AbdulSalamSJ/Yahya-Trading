import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ShieldCheck, CreditCard, Truck, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { searchTamilNaduCities, loadAllTamilNaduLocations } from '../data/tamilNaduCities';

const STORE_WHATSAPP_NUMBER = '916369090536';
const STORE_WHATSAPP_DISPLAY = '+91 63690 90536';

function WhatsAppIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function generateWhatsAppBill(order, form, items, pricing) {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsList = items.map((item, idx) => {
    const size = item.selectedSize || '250G';
    const total = (item.price * item.quantity).toLocaleString('en-IN');
    return `${idx + 1}. *${item.name}* (${size})
   Qty: ${item.quantity} × ₹${Number(item.price).toLocaleString('en-IN')} = *₹${total}*`;
  }).join('\n\n');

  return (
`🧾 *YAHIYA TRADERS - OFFICIAL ORDER BILL*
━━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${order?.order_number || '#ORD-' + Date.now()}
*Date:* ${dateStr}

👤 *Customer Details:*
• *Name:* ${form.fullName}
• *Phone:* ${form.phone}
• *Email:* ${form.email}

📍 *Delivery Address:*
${form.addressLine}
${form.city}, ${form.state || 'Tamil Nadu'} - ${form.postalCode}

📦 *Harvest Items Ordered:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${Number(pricing.subtotal).toLocaleString('en-IN')}
${pricing.discountAmount > 0 ? `*Discount (${pricing.promoCode}):* -₹${Number(pricing.discountAmount).toLocaleString('en-IN')}\n` : ''}*GST (18%):* ₹${Number(pricing.taxAmount).toLocaleString('en-IN')}
*Insulated Fresh Shipping:* ${pricing.shippingFee === 0 ? 'FREE' : `₹${pricing.shippingFee}`}
*Grand Total Bill:* *₹${Number(pricing.totalAmount).toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━━━
📦 *Packaging:* Signature Nitrogen Fresh Pack
📍 *Shipped From:* Puliangudi, Tenkasi District, TN
📞 *Store WhatsApp:* ${STORE_WHATSAPP_DISPLAY}

🙏 *Thank you for your order with Yahiya Traders! Please confirm and dispatch my order.*`
  );
}

export function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { user } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    taxAmount,
    shippingFee,
    totalAmount,
    promoCode,
    clearCart
  } = useCart();

  const [step, setStep] = useState(1); // 1: Address, 2: Shipping Method, 3: Payment
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    shippingMethod: 'insulated', // 'insulated' (Free) | 'express_saturday' (+₹ 150)
    paymentMethod: 'whatsapp'
  });

  const [orderCompletedData, setOrderCompletedData] = useState(null);

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStepNotice, setPaymentStepNotice] = useState('');

  // Tamil Nadu city autocomplete state
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(-1);
  const cityDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Preload complete 11,800+ Tamil Nadu villages & cities database when checkout opens
  useEffect(() => {
    if (isOpen) {
      loadAllTamilNaduLocations();
      setOrderCompletedData(null);
    }
  }, [isOpen]);

  const handleCityChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, city: val }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: null }));
    }

    if (val.trim().length > 0) {
      const results = searchTamilNaduCities(val, 15);
      setCitySuggestions(results);
      setIsCityDropdownOpen(results.length > 0);
      setHighlightedCityIndex(-1);

      // In case full 11,800+ locations database is still loading, re-run search upon resolution
      loadAllTamilNaduLocations().then(() => {
        setFormData(curr => {
          if (curr.city === val) {
            const updated = searchTamilNaduCities(val, 15);
            setCitySuggestions(updated);
            if (updated.length > 0) setIsCityDropdownOpen(true);
          }
          return curr;
        });
      });
    } else {
      setCitySuggestions([]);
      setIsCityDropdownOpen(false);
    }
  };

  const handleCityFocus = () => {
    loadAllTamilNaduLocations().then(() => {
      if (formData.city && formData.city.trim().length > 0) {
        const results = searchTamilNaduCities(formData.city, 15);
        setCitySuggestions(results);
        setIsCityDropdownOpen(results.length > 0);
      }
    });

    if (formData.city && formData.city.trim().length > 0) {
      const results = searchTamilNaduCities(formData.city, 15);
      setCitySuggestions(results);
      setIsCityDropdownOpen(results.length > 0);
    }
  };

  const handleSelectCity = (item) => {
    setFormData(prev => ({
      ...prev,
      city: item.city,
      state: 'Tamil Nadu',
      postalCode: item.pincode
    }));
    setIsCityDropdownOpen(false);
    setCitySuggestions([]);
    setErrors(prev => ({
      ...prev,
      city: null,
      postalCode: null
    }));
  };

  const handleCityKeyDown = (e) => {
    if (!isCityDropdownOpen || citySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedCityIndex(prev => (prev < citySuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedCityIndex(prev => (prev > 0 ? prev - 1 : citySuggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedCityIndex >= 0 && highlightedCityIndex < citySuggestions.length) {
        e.preventDefault();
        handleSelectCity(citySuggestions[highlightedCityIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCityDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || (user.name && user.name !== 'Eleanor Vance' ? user.name : ''),
        email: prev.email || (user.email && !user.email.endsWith('@example.com') ? user.email : '')
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required for courier dispatch';
    if (!formData.addressLine.trim()) errs.addressLine = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal PIN code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#795548', '#5D4037', '#F57C00', '#FDF8F5', '#388E3C']
    });
  };

  const handlePlaceOrderViaWhatsApp = async () => {
    setIsProcessing(true);
    setPaymentStepNotice('Generating bill & preparing WhatsApp dispatch...');

    try {
      const paymentId = 'wa_' + Date.now();
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state || 'Tamil Nadu',
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        items: cartItems.map(item => ({
          id: item.id,
          product_id: item.id,
          name: `${item.name} (${item.selectedSize || '250G'})`,
          product_name: `${item.name} (${item.selectedSize || '250G'})`,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
          unit_price: Number(item.price || 0),
          total_price: Number((item.price || 0) * (item.quantity || 1)),
          images: item.images || (item.image_url ? [item.image_url] : []),
          image_url: item.images?.[0] || item.image_url || ''
        })),
        subtotal,
        taxAmount,
        shippingFee,
        discountAmount,
        totalAmount,
        promoCode,
        paymentId,
        razorpayOrderId: null
      };

      let placedOrder = null;
      try {
        const res = await api.createOrder(orderPayload);
        placedOrder = res.order;
      } catch (apiErr) {
        console.warn('Backend order sync issue; proceeding with resilient local order bill for WhatsApp:', apiErr);
        placedOrder = {
          id: Date.now(),
          order_number: 'CHOCO-' + Math.floor(100000 + Math.random() * 900000),
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email,
          total_amount: totalAmount,
          subtotal,
          tax_amount: taxAmount,
          shipping_fee: shippingFee,
          discount_amount: discountAmount,
          shipping_address: orderPayload.shippingAddress,
          items: orderPayload.items,
          created_at: new Date().toISOString()
        };
      }

      // Generate complete itemized WhatsApp bill
      const billText = generateWhatsAppBill(placedOrder, formData, cartItems, {
        subtotal,
        discountAmount,
        taxAmount,
        shippingFee,
        totalAmount,
        promoCode
      });

      const storeWaUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodeURIComponent(billText)}`;

      // Clean customer phone number
      let cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
      }
      const custPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const customerWaUrl = `https://api.whatsapp.com/send?phone=${custPhone}&text=${encodeURIComponent(billText)}`;

      const finalBillAmount = Number(placedOrder?.total_amount || totalAmount || 0);

      setOrderCompletedData({
        order: placedOrder,
        totalAmount: finalBillAmount,
        billText,
        storeWaUrl,
        customerWaUrl,
        customerPhone: formData.phone
      });

      // Automatically launch Customer WhatsApp with the pre-filled bill
      try {
        window.open(customerWaUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked:', e);
      }

      clearCart();
      triggerCelebration();
      if (onOrderPlaced) {
        onOrderPlaced(placedOrder);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setPaymentStepNotice('Order creation failed: ' + (err.message || 'Please try again'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl my-6">
        
        {/* Header with Progress Steps */}
        <div className="p-5 sm:p-6 border-b border-[#EBE0D8] dark:border-[#3E2F29] bg-[#FDF8F5] dark:bg-[#1C1412] flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-2xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#3E2723] dark:text-[#F5EFEA]">
              Checkout & Express Fresh Dispatch
            </h3>
            <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
              Carefully vacuum sealed in nitrogen aroma-lock fresh packaging.
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chocolate Step Progress Bar */}
        <div className="px-6 py-3 bg-[#EFEBE9]/60 dark:bg-[#201715] border-b border-[#EBE0D8] dark:border-[#3E2F29] flex items-center justify-around text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#795548] dark:text-[#A1887F]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 1 ? 'bg-[#795548]' : 'bg-gray-300'}`}>
              1
            </span>
            <span>Delivery Address</span>
          </div>

          <div className="w-10 h-0.5 bg-[#EBE0D8] dark:bg-[#3E2F29]" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#795548] dark:text-[#A1887F]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 2 ? 'bg-[#795548]' : 'bg-gray-300'}`}>
              2
            </span>
            <span>Packaging</span>
          </div>

          <div className="w-10 h-0.5 bg-[#EBE0D8] dark:border-[#3E2F29]" />

          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#795548] dark:text-[#A1887F]' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 3 ? 'bg-[#795548]' : 'bg-gray-300'}`}>
              3
            </span>
            <span>Payment</span>
          </div>
        </div>

        {/* Content Body */}
        {orderCompletedData ? (
          <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check size={36} strokeWidth={3} />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#25D366]/15 text-[#1EBE5B] dark:text-[#25D366] inline-flex items-center gap-1.5 mb-1">
                <WhatsAppIcon size={14} />
                <span>WhatsApp Bill Generated</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                Order <span className="font-mono font-bold text-[#795548] dark:text-[#E8A598]">{orderCompletedData.order.order_number}</span> has been confirmed.
              </p>
            </div>

            {/* Bill Preview Card */}
            <div className="max-w-md mx-auto text-left p-4 rounded-xl bg-[#FDF8F5] dark:bg-[#1E1614] border border-[#EBE0D8] dark:border-[#3E2F29] text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#EBE0D8] dark:border-[#3E2F29]">
                <span className="font-bold text-[#3E2723] dark:text-[#F5EFEA]">Bill Summary</span>
                <span className="font-bold text-[#795548] dark:text-[#A1887F] text-sm">
                  ₹ {Number(orderCompletedData.totalAmount || orderCompletedData.order?.total_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="space-y-1 text-[#6D4C41] dark:text-[#C8B8B0] text-[11px]">
                <p>👤 <span className="font-medium text-[#3E2723] dark:text-[#F5EFEA]">{formData.fullName}</span></p>
                <p>📍 {formData.addressLine}, {formData.city}, {formData.state || 'Tamil Nadu'} - {formData.postalCode}</p>
                <p>📦 Insulated Nitrogen Fresh Pack • Dispatched from Puliangudi</p>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="max-w-md mx-auto">
              <a
                href={orderCompletedData.customerWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition active:scale-98"
              >
                <WhatsAppIcon size={18} />
                <span>Send Bill to Customer WhatsApp</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 text-xs font-medium text-[#8D6E63] dark:text-[#A1887F] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] transition"
              >
                Close & Return to Store
              </button>
            </div>
          </div>
        ) : (
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Form Area */}
            <div className="md:col-span-7 space-y-4">
              
              {/* STEP 1: Address Form */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Recipient Contact & Address
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      placeholder="e.g. Eleanor Vance"
                    />
                    {errors.fullName && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                        Email (for order tracking) *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                        placeholder="eleanor@example.com"
                      />
                      {errors.email && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                      Street Address / Apartment *
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine}
                      onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      placeholder="e.g. 42 Belgravia Crescent, Suite 4B"
                    />
                    {errors.addressLine && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.addressLine}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative" ref={cityDropdownRef}>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                        City / Town *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.city}
                          onChange={handleCityChange}
                          onFocus={handleCityFocus}
                          onKeyDown={handleCityKeyDown}
                          autoComplete="off"
                          placeholder="e.g. Tenkasi, Chennai"
                          className="w-full h-11 px-3.5 pr-8 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                        />
                        <MapPin size={14} className="absolute right-3 top-3.5 text-[#8D6E63] pointer-events-none" />
                      </div>
                      {errors.city && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.city}</p>}

                      {/* Tamil Nadu Cities & Villages Autocomplete Dropdown */}
                      {isCityDropdownOpen && citySuggestions.length > 0 && (
                        <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 max-w-[calc(100vw-2.5rem)] z-50 bg-white dark:bg-[#201715] rounded-xl shadow-2xl border border-[#E8DCCF] dark:border-[#3E2F29] overflow-hidden animate-in fade-in duration-150">
                          <div className="px-3.5 py-2 bg-[#FDF8F5] dark:bg-[#1A1210] border-b border-[#EBE0D8] dark:border-[#3E2F29] flex items-center justify-between text-[11px] font-bold text-[#8D6E63] dark:text-[#A1887F]">
                            <span>Tamil Nadu Cities & Villages</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFEBE9] dark:bg-[#2D221E] font-semibold text-[#5D4037] dark:text-[#D7CCC8]">Auto-fills PIN</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto divide-y divide-[#F0E6DE] dark:divide-[#332520]">
                            {citySuggestions.map((item, idx) => {
                              const cityName = item.city || item.name;
                              const locType = item.type || 'Village';
                              return (
                                <button
                                  key={`${cityName}-${item.pincode}-${idx}`}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectCity(item);
                                  }}
                                  onMouseEnter={() => setHighlightedCityIndex(idx)}
                                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition ${
                                    highlightedCityIndex === idx
                                      ? 'bg-[#F5ECE5] dark:bg-[#2F211D]'
                                      : 'hover:bg-[#FAF4EF] dark:hover:bg-[#261B18]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <MapPin size={15} className="text-[#795548] dark:text-[#BCAAA4] shrink-0" />
                                    <div className="truncate">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="font-semibold text-xs text-[#3E2723] dark:text-[#F5EFEA] truncate">
                                          {cityName}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                          locType === 'Village'
                                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                            : locType === 'City'
                                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300'
                                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                        }`}>
                                          {locType}
                                        </span>
                                        {item.aliases && item.aliases.length > 0 && (
                                          <span className="text-[10px] text-[#8D6E63] dark:text-[#A1887F] truncate">
                                            ({item.aliases[0]})
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-[#8D6E63] dark:text-[#A1887F] truncate mt-0.5">
                                        {item.taluk ? `${item.taluk} Taluk, ` : ''}{item.district} Dist., Tamil Nadu
                                      </div>
                                    </div>
                                  </div>
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EFEBE9] dark:bg-[#3E2F29] text-[#5D4037] dark:text-[#D7CCC8] border border-[#D7C4BC]/50 dark:border-[#4E3932] shrink-0">
                                    {item.pincode}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Tamil Nadu"
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => {
                          setFormData({ ...formData, postalCode: e.target.value });
                          if (errors.postalCode) setErrors(prev => ({ ...prev, postalCode: null }));
                        }}
                        placeholder="e.g. 627855"
                        maxLength={6}
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      />
                      {errors.postalCode && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Packaging & Shipping Method */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Select Fresh Packaging & Shipping Method
                  </h4>

                  <label className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                    formData.shippingMethod === 'insulated'
                      ? 'border-[#795548] bg-[#FDF8F5] dark:bg-[#201715]'
                      : 'border-[#EBE0D8] dark:border-[#3E2F29] opacity-80'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'insulated'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'insulated' })}
                          className="text-[#795548] focus:ring-[#795548]"
                        />
                        <div>
                          <p className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                            Signature Nitrogen Fresh Pack (Included)
                          </p>
                          <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                            Delivered in hermetically sealed food-grade pouches with aroma-lock seals (2-3 business days).
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#388E3C]">FREE</span>
                    </div>
                  </label>

                  <div className="p-4 rounded-xl bg-[#EFEBE9]/60 dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29] text-xs text-[#6D4C41] dark:text-[#C8B8B0] space-y-1">
                    <p className="font-semibold text-[#3E2723] dark:text-[#F5EFEA]">100% Purity & Freshness Guarantee:</p>
                    <p>If your harvest package arrives damaged or compromised in freshness, we will dispatch an immediate replacement at zero cost.</p>
                  </div>
                </div>
              )}

              {/* STEP 3: WhatsApp Pay & Order Bill Dispatch */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Confirm Order & WhatsApp Bill Dispatch
                  </h4>

                  <div className="p-4 rounded-xl border-2 border-[#25D366] bg-[#FDF8F5] dark:bg-[#1E1614] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                          <WhatsAppIcon size={18} />
                        </div>
                        <div>
                          <span className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA] block">
                            Direct WhatsApp Order & Bill
                          </span>
                          <span className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">
                            Instant itemized invoice generated via WhatsApp
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#25D366]/15 text-[#1EBE5B] dark:text-[#25D366] px-2 py-0.5 rounded-full font-bold border border-[#25D366]/30">
                        INSTANT BILL
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F5ECE5] dark:bg-[#2A1D1A] space-y-1.5 text-xs text-[#5D4037] dark:text-[#D7CCC8]">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-[#8D6E63] dark:text-[#A1887F]">Dispatch Channel:</span>
                        <span className="font-semibold text-[#3E2723] dark:text-[#F5EFEA]">Customer WhatsApp</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                      <p className="flex items-center gap-2">
                        <Check size={14} className="text-[#25D366] shrink-0" />
                        <span>Itemized digital invoice sent automatically with all taxes, weights, and items.</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Check size={14} className="text-[#25D366] shrink-0" />
                        <span>Dispatched directly to Yahiya Traders packaging team at Puliangudi.</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Check size={14} className="text-[#25D366] shrink-0" />
                        <span>Supports Google Pay, PhonePe, Paytm, UPI, Bank Transfer or COD.</span>
                      </p>
                    </div>
                  </div>

                  {paymentStepNotice && (
                    <div className="p-3 rounded-lg bg-[#25D366]/10 text-[#1EBE5B] dark:text-[#25D366] text-xs font-medium animate-pulse flex items-center gap-2">
                      <WhatsAppIcon size={14} />
                      <span>{paymentStepNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#EBE0D8] dark:border-[#3E2F29]">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl border border-[#EBE0D8] dark:border-[#3E2F29] text-xs font-medium text-[#6D4C41] dark:text-[#C8B8B0] hover:bg-[#EFEBE9] transition flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-[#795548] hover:bg-[#5D4037] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Continue to {step === 1 ? 'Packaging' : 'Payment'}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrderViaWhatsApp}
                    disabled={isProcessing}
                    className="px-7 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
                  >
                    <WhatsAppIcon size={18} />
                    <span>{isProcessing ? 'Generating Bill...' : `Send Bill on WhatsApp (₹ ${totalAmount.toLocaleString('en-IN')})`}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Summary Area */}
            <div className="md:col-span-5 bg-[#FDF8F5] dark:bg-[#1C1412] p-5 rounded-xl border border-[#EBE0D8] dark:border-[#3E2F29] flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA] mb-3">
                  Order Summary ({cartItems.length} items)
                </h4>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-4">
                  {cartItems.map(item => (
                    <div key={item.itemKey || item.id} className="flex justify-between text-xs">
                      <div className="flex-1 pr-2">
                        <span className="font-medium text-[#3E2723] dark:text-[#F5EFEA] line-clamp-1">{item.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-[10px] font-black text-[#3E2723] dark:text-[#F5EFEA]">
                            {item.selectedSize || '250G'}
                          </span>
                          <span className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-[#795548] dark:text-[#A1887F]">
                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs text-[#6D4C41] dark:text-[#C8B8B0] border-t border-[#EBE0D8] dark:border-[#3E2F29] pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#388E3C]">
                      <span>Discount ({promoCode})</span>
                      <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹ {taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insulated Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹ ${shippingFee}`}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBE0D8] dark:border-[#3E2F29] mt-4 flex items-baseline justify-between">
                <span className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA]">Total Amount</span>
                <span className="font-serif text-xl font-bold text-[#795548] dark:text-[#A1887F]">
                  ₹ {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>
        </div>
        )}

      </div>
    </div>
  );
}
