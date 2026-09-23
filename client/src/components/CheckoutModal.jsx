import React, { useState } from 'react';
import { X, Check, ShieldCheck, CreditCard, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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
    paymentMethod: 'razorpay'
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStepNotice, setPaymentStepNotice] = useState('');

  React.useEffect(() => {
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

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentStepNotice('Initiating secure Razorpay checkout...');

    try {
      // 1. Create payment order on server
      const paymentOrder = await api.createPaymentOrder({
        amount: totalAmount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });

      // If Razorpay SDK is available and using real keys
      if (!paymentOrder.isSandbox && window.Razorpay && paymentOrder.key !== 'rzp_test_placeholder') {
        const rzp = new window.Razorpay({
          key: paymentOrder.key,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: 'Yahya Traders',
          description: 'Premium Dates, Dry Fruits & Chocolates',
          order_id: paymentOrder.id,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#fee000'
          },
          handler: async function (response) {
            // Verify payment
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isSandbox: false
            });
            await finalizeOrder(response.razorpay_payment_id, response.razorpay_order_id);
          }
        });
        rzp.open();
        setIsProcessing(false);
        return;
      }

      // Sandbox Simulator Flow (Interactive & instant for demo without live keys required)
      setPaymentStepNotice('Simulating Razorpay 256-bit bank handshake...');
      setTimeout(async () => {
        const verifyRes = await api.verifyPayment({
          razorpay_order_id: paymentOrder.id,
          razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).substring(2, 10),
          isSandbox: true
        });

        await finalizeOrder(verifyRes.payment_id, paymentOrder.id);
      }, 1200);

    } catch (err) {
      console.error('Payment Error:', err);
      setPaymentStepNotice('Payment error: ' + (err.message || 'Please try again'));
      setIsProcessing(false);
    }
  };

  const finalizeOrder = async (paymentId, razorpayOrderId) => {
    try {
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        items: cartItems,
        subtotal,
        taxAmount,
        shippingFee,
        discountAmount,
        totalAmount,
        promoCode,
        paymentId,
        razorpayOrderId
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      triggerCelebration();
      onOrderPlaced(res.order);
      onClose();
    } catch (err) {
      console.error('Order Finalization Error:', err);
      setPaymentStepNotice('Order creation failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header with Progress Steps */}
        <div className="p-5 sm:p-6 border-b border-[#EBE0D8] dark:border-[#3E2F29] bg-[#FDF8F5] dark:bg-[#1C1412] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      />
                      {errors.city && <p className="text-[11px] text-[#D32F2F] mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
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

              {/* STEP 3: Razorpay Payment Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Payment Method
                  </h4>

                  <div className="p-4 rounded-xl border-2 border-[#795548] bg-[#FDF8F5] dark:bg-[#201715] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CreditCard size={20} className="text-[#795548] dark:text-[#A1887F]" />
                        <span className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                          Razorpay Secure Gateway
                        </span>
                      </div>
                      <span className="text-[11px] bg-[#388E3C]/15 text-[#388E3C] px-2 py-0.5 rounded font-semibold">
                        UPI • Cards • NetBanking
                      </span>
                    </div>
                    <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                      Accepts Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, and NetBanking.
                    </p>
                  </div>

                  {paymentStepNotice && (
                    <div className="p-3 rounded-lg bg-[#795548]/10 text-[#795548] dark:text-[#A1887F] text-xs font-medium animate-pulse">
                      {paymentStepNotice}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#6D4C41] dark:text-[#C8B8B0] pt-2">
                    <ShieldCheck size={16} className="text-[#388E3C]" />
                    <span>256-bit PCI-DSS Level 1 Encrypted Transaction</span>
                  </div>
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
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="px-7 py-3 rounded-xl bg-[#795548] hover:bg-[#5D4037] active:scale-95 text-white text-sm font-bold shadow-choco-card hover:shadow-choco-card-hover transition-all flex items-center gap-2"
                  >
                    <span>{isProcessing ? 'Authorizing...' : `Pay ₹ ${totalAmount.toLocaleString('en-IN')}`}</span>
                    <ShieldCheck size={16} />
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
                    <div key={item.id} className="flex justify-between text-xs">
                      <div className="flex-1 pr-2">
                        <span className="font-medium text-[#3E2723] dark:text-[#F5EFEA] line-clamp-1">{item.name}</span>
                        <span className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">Qty: {item.quantity}</span>
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

      </div>
    </div>
  );
}
