import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoImg from '../image/logo.jpg';

export function CartDrawer({ onProceedToCheckout }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    discountPercent,
    taxAmount,
    shippingFee,
    totalAmount,
    promoCode,
    promoError,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_GOAL = 1999;
  const neededForFreeShipping = Math.max(0, FREE_SHIPPING_GOAL - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_GOAL) * 100));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    applyPromoCode(inputCode);
    setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#181818] border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#fee000] flex-shrink-0 bg-white">
              <img src={logoImg} alt="Yahya Traders" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1d1d] dark:text-white">Your Shopping Bag</h3>
              <p className="text-[11px] text-neutral-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-3.5 bg-[#fbfbfb] dark:bg-[#1e1e1e] border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
              <Truck size={14} className="text-[#fee000]" />
              {neededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#1d1d1d] dark:text-[#fee000]">₹{neededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-[#108474]">FREE Shipping</strong>
                </span>
              ) : (
                <span className="text-[#108474] font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  You qualify for FREE Delivery!
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-neutral-500">{shippingPercent}%</span>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#fee000] h-full rounded-full transition-all duration-500"
              style={{ width: `${shippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fee000] mx-auto shadow-sm bg-white">
                <img src={logoImg} alt="Yahya Traders" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-base font-bold text-[#1d1d1d] dark:text-white">Your bag is empty</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                Explore our royal Medina dates, California almonds, imported Swiss chocolates, and thoughtful gift boxes.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-xs font-bold shadow-sm transition"
              >
                Shop Yahya Traders Harvest
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-[#fdfdfd] dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800"
              >
                {/* Thumbnail */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                  <img
                    src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#1d1d1d] dark:text-white line-clamp-1">
                        {item.name}
                      </h5>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition p-0.5"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#108474] font-medium">
                      {item.origin || 'Yahya Traders Select'}
                    </span>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full bg-white dark:bg-[#1f1f1f]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-full"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-neutral-900 dark:text-white min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-full"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-extrabold text-xs sm:text-sm text-[#1d1d1d] dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Order Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-[#fbfbfb] dark:bg-[#1a1a1a] space-y-3">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Coupon: YAHYA10"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202020] text-neutral-800 dark:text-white uppercase focus:outline-none focus:border-[#fee000]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#1d1d1d] dark:bg-neutral-700 hover:bg-black text-white text-xs font-bold transition"
              >
                Apply
              </button>
            </form>

            {promoError && (
              <p className="text-[11px] text-red-500 font-medium -mt-1">{promoError}</p>
            )}

            {promoCode && (
              <div className="flex items-center justify-between text-xs text-[#108474] bg-[#e6f4f1] dark:bg-[#108474]/20 px-3 py-1 rounded-full font-semibold">
                <span>Code '{promoCode}' active ({discountPercent}% OFF)</span>
                <button onClick={removePromoCode} className="text-xs font-bold hover:underline">Remove</button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#108474] font-semibold">
                  <span>Yahya Traders Promo Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (GST 5%)</span>
                <span className="text-neutral-800 dark:text-neutral-200">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping (Aroma-Lock Pack)</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#108474] font-bold">FREE Delivery</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#1d1d1d] dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span>Grand Total</span>
                <span className="text-lg font-black text-[#1d1d1d] dark:text-white">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Express Checkout</span>
              <ArrowRight size={17} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <ShieldCheck size={13} className="text-[#108474]" />
              <span>Razorpay 256-bit Encrypted Checkout • COD Available</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
