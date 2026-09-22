import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('choco_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('choco_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CHOCO10' || clean === 'COCOA10') {
      setDiscountPercent(10);
      setPromoCode(clean);
      setPromoError('');
      showToast('10% discount promo code applied!');
      return true;
    } else if (clean === 'SWEET20') {
      setDiscountPercent(20);
      setPromoCode(clean);
      setPromoError('');
      showToast('20% VIP connoisseur discount applied!');
      return true;
    } else {
      setPromoError('Invalid coupon code. Try "CHOCO10"');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    setPromoError('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = Math.round(discountedSubtotal * 0.18); // 18% GST
  const shippingFee = (subtotal >= 999 || subtotal === 0) ? 0 : 120;
  const totalAmount = discountedSubtotal + taxAmount + shippingFee;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        discountPercent,
        taxAmount,
        shippingFee,
        totalAmount,
        promoCode,
        promoError,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
