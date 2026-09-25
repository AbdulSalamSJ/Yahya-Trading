import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Package,
  Truck,
  Clock,
  MapPin,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../image/logo.jpg';

const STORE_WHATSAPP_NUMBER = '916369090536';

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

export function OrderTrackingModal({ order, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const stages = [
    {
      key: 'placed',
      title: 'Order Confirmed',
      badge: 'Batch Verified',
      desc: 'Harvest items verified and allocated at Puliangudi packaging facility.'
    },
    {
      key: 'processing',
      title: 'Weighing & Nitrogen Sealing',
      badge: 'Aroma-Lock Fresh',
      desc: 'Hand-sorted, precision weighed, and sealed with nitrogen aroma-lock packaging.'
    },
    {
      key: 'shipped',
      title: 'Dispatched with Express Courier',
      badge: 'In Transit',
      desc: 'Handed over to express courier logistics with real-time transit protection.'
    },
    {
      key: 'delivered',
      title: 'Delivered Farm-Fresh',
      badge: 'Ready to Enjoy',
      desc: 'Safely delivered to your doorstep ready for wholesome natural snacking.'
    }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 1;
    }
  };

  const currentIdx = getStageIndex(order.status);

  const shippingAddress = typeof order.shipping_address === 'string'
    ? (() => { try { return JSON.parse(order.shipping_address); } catch { return {}; } })()
    : (order.shipping_address || {});

  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalAmountNum = Number(order.total_amount || 0);

  const trackWaText = `Hello Yahiya Traders! I am tracking my order *#${order.order_number}* (Amount: ₹${totalAmountNum.toLocaleString('en-IN')}). Could you please update me on courier dispatch?`;
  const supportWaUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodeURIComponent(trackWaText)}`;

  const contentMarkup = (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1C1412]/95 backdrop-blur-md border-b border-[#EBE0D8] dark:border-[#3E2F29] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#fee000] shadow-sm flex-shrink-0 bg-white">
            <img src={logoImg} alt="Yahiya Traders" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3E2723] dark:text-[#F5EFEA] truncate">
                Order #{order.order_number}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0">
                <CheckCircle size={12} />
                <span>{order.status === 'delivered' ? 'Delivered' : order.status === 'shipped' ? 'In Transit' : 'Confirmed'}</span>
              </span>
            </div>
            <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0] truncate">
              Placed on {orderDate} • Yahiya Traders Express Tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            title={isFullscreen ? "Switch to Windowed Modal" : "Switch to Full Screen"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBE0D8] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-xs font-medium text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] hover:bg-[#F5ECE5] dark:hover:bg-[#2A1D1A] transition"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? "Windowed" : "Full Screen"}</span>
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#795548] hover:bg-[#5D4037] text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Return to Store</span>
          </button>
        </div>
      </header>

      {/* Main Full Screen Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex-1 space-y-6">
        
        {/* Order Hero Overview Banner */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#F5ECE5] via-[#FAF4EF] to-[#FDF8F5] dark:from-[#241916] dark:via-[#1F1513] dark:to-[#1A1210] border border-[#E8DCCF] dark:border-[#3E2F29] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Order Tracking Active</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#3E2723] dark:text-[#F5EFEA]">
              Express Fresh Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-[#6D4C41] dark:text-[#C8B8B0] max-w-xl">
              Your premium harvest package is monitored live from our Puliangudi facility to your address with aroma-lock security.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#271E1B]/80 border border-[#EBE0D8] dark:border-[#3E2F29] text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#8D6E63] dark:text-[#A1887F] block">Total Bill</span>
              <span className="font-serif text-lg font-bold text-[#795548] dark:text-[#A1887F]">
                ₹ {totalAmountNum.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#271E1B]/80 border border-[#EBE0D8] dark:border-[#3E2F29] text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#8D6E63] dark:text-[#A1887F] block">Items</span>
              <span className="font-serif text-lg font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                {order.items?.length || 1} Pkgs
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white/80 dark:bg-[#271E1B]/80 border border-[#EBE0D8] dark:border-[#3E2F29] text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#8D6E63] dark:text-[#A1887F] block">Packaging</span>
              <span className="text-xs font-bold text-[#388E3C] block truncate mt-1">
                Nitrogen Sealed
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: Timeline & Harvest Items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Timeline Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1E1614] border border-[#EBE0D8] dark:border-[#3E2F29] shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EBE0D8] dark:border-[#3E2F29]">
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Harvest Preparation & Delivery Timeline
                  </h4>
                  <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                    Current step: <span className="font-bold text-[#795548] dark:text-[#D7CCC8]">{stages[currentIdx]?.title}</span>
                  </p>
                </div>
                <Truck size={20} className="text-[#795548] dark:text-[#A1887F]" />
              </div>

              <div className="relative pl-7 sm:pl-9 space-y-7 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EBE0D8] dark:before:bg-[#3E2F29]">
                {stages.map((stg, idx) => {
                  const isPassed = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stg.key} className="relative flex items-start gap-4">
                      <div className={`absolute -left-7 sm:-left-9 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isPassed
                          ? 'bg-[#795548] text-white ring-4 ring-[#EFEBE9] dark:ring-[#2D201C]'
                          : 'bg-[#EBE0D8] dark:bg-[#3E2F29] text-[#A1887F]'
                      }`}>
                        {isPassed ? <CheckCircle size={15} /> : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className={`font-serif text-sm sm:text-base font-bold ${
                            isCurrent
                              ? 'text-[#795548] dark:text-[#A1887F]'
                              : isPassed
                              ? 'text-[#3E2723] dark:text-[#F5EFEA]'
                              : 'text-[#6D4C41]/60 dark:text-[#C8B8B0]/60'
                          }`}>
                            {stg.title}
                          </h5>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#795548]/15 text-[#795548] dark:text-[#D7CCC8]">
                              {stg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0] mt-0.5 leading-relaxed">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Harvest Items Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1E1614] border border-[#EBE0D8] dark:border-[#3E2F29] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EBE0D8] dark:border-[#3E2F29]">
                <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA] flex items-center gap-2">
                  <Package size={17} className="text-[#795548]" />
                  <span>Harvest Items Ordered ({order.items?.length || 0})</span>
                </h4>
                <span className="text-xs text-[#8D6E63] dark:text-[#A1887F]">
                  Insulated Packaging
                </span>
              </div>

              <div className="divide-y divide-[#F0E6DE] dark:divide-[#332520]">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#EBE0D8] dark:border-[#3E2F29] shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#EFEBE9] dark:bg-[#2A1D1A] flex items-center justify-center text-[#795548] shrink-0">
                          <Package size={22} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#3E2723] dark:text-[#F5EFEA] truncate">
                          {item.product_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#F5ECE5] dark:bg-[#2D201C] text-[10px] font-bold text-[#5D4037] dark:text-[#D7CCC8]">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-xs text-[#8D6E63] dark:text-[#A1887F]">
                            ₹ {Number(item.unit_price || 0).toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-bold text-[#795548] dark:text-[#A1887F]">
                        ₹ {(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown Footer */}
              <div className="mt-4 pt-4 border-t border-[#EBE0D8] dark:border-[#3E2F29] space-y-1.5 text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {Number(order.subtotal || totalAmountNum).toLocaleString('en-IN')}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-[#388E3C] font-semibold">
                    <span>Discount</span>
                    <span>- ₹ {Number(order.discount_amount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹ {Number(order.tax_amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insulated Fresh Shipping</span>
                  <span className="text-[#388E3C] font-semibold">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EBE0D8] dark:border-[#3E2F29] font-bold text-sm text-[#3E2723] dark:text-[#F5EFEA]">
                  <span>Total Amount</span>
                  <span className="font-serif text-base text-[#795548] dark:text-[#A1887F]">
                    ₹ {totalAmountNum.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Dispatch Address, Payment & WhatsApp Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dispatch & Delivery Address Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1E1614] border border-[#EBE0D8] dark:border-[#3E2F29] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D8] dark:border-[#3E2F29]">
                <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA] flex items-center gap-2">
                  <MapPin size={17} className="text-[#795548]" />
                  <span>Delivery Address</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  Confirmed
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-[#6D4C41] dark:text-[#C8B8B0]">
                <p className="font-bold text-sm text-[#3E2723] dark:text-[#F5EFEA]">
                  {shippingAddress?.fullName || order.customer_name}
                </p>
                {shippingAddress?.phone && (
                  <p className="font-mono text-xs text-[#795548] dark:text-[#D7CCC8]">
                    📞 {shippingAddress.phone}
                  </p>
                )}
                <p className="pt-1">{shippingAddress?.addressLine || 'Address on file'}</p>
                <p className="font-medium text-[#3E2723] dark:text-[#F5EFEA]">
                  {shippingAddress?.city || 'Tamil Nadu'}{shippingAddress?.state ? `, ${shippingAddress.state}` : ''} - {shippingAddress?.postalCode || ''}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDF8F5] dark:bg-[#251A18] border border-[#EBE0D8] dark:border-[#3E2F29] text-[11px] text-[#8D6E63] dark:text-[#A1887F] flex items-center gap-2">
                <Truck size={14} className="text-[#795548] shrink-0" />
                <span>Dispatched directly from Puliangudi, Tenkasi District, TN</span>
              </div>
            </div>

            {/* Payment & Invoice Verification Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1E1614] border border-[#EBE0D8] dark:border-[#3E2F29] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D8] dark:border-[#3E2F29]">
                <h4 className="font-serif text-base font-bold text-[#3E2723] dark:text-[#F5EFEA] flex items-center gap-2">
                  <ShieldCheck size={17} className="text-[#388E3C]" />
                  <span>Payment Verification</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {order.payment_status?.toUpperCase() || 'PAID'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                <div className="flex justify-between items-center">
                  <span className="text-[#8D6E63] dark:text-[#A1887F]">Reference ID:</span>
                  <span className="font-mono font-bold text-[#3E2723] dark:text-[#F5EFEA] truncate max-w-[180px]">
                    {order.payment_id || 'pay_wa_' + order.order_number}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8D6E63] dark:text-[#A1887F]">Billing Channel:</span>
                  <span className="font-semibold text-[#3E2723] dark:text-[#F5EFEA]">WhatsApp Express Bill</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8D6E63] dark:text-[#A1887F]">Total Paid:</span>
                  <span className="font-serif font-bold text-sm text-[#795548] dark:text-[#A1887F]">
                    ₹ {totalAmountNum.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Live WhatsApp Support & Query Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#25D366]/10 dark:bg-[#25D366]/5 border border-[#25D366]/30 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                  <WhatsAppIcon size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                    Live WhatsApp Support
                  </h4>
                  <p className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">
                    Need real-time courier updates or assistance?
                  </p>
                </div>
              </div>

              <a
                href={supportWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <WhatsAppIcon size={16} />
                <span>Message Store on WhatsApp (+91 63690 90536)</span>
              </a>
            </div>

            {/* Purity Guarantee Badge Card */}
            <div className="p-5 rounded-2xl bg-[#FAF4EF] dark:bg-[#201715] border border-[#EBE0D8] dark:border-[#3E2F29] text-xs text-[#6D4C41] dark:text-[#C8B8B0] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#3E2723] dark:text-[#F5EFEA]">
                <Sparkles size={15} className="text-[#fee000]" />
                <span>100% Purity & Nitrogen Aroma-Lock</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Every batch of dates, tree nuts, and imported delicacies is vacuum packed with food-grade nitrogen to lock in fresh aroma and crunchiness until you unseal.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Sticky Bottom Return Bar */}
      <footer className="border-t border-[#EBE0D8] dark:border-[#3E2F29] bg-white/90 dark:bg-[#1C1412]/90 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#388E3C] shrink-0" />
          <span>Order #{order.order_number} is tracked live and verified by Yahiya Traders dispatch facility.</span>
        </div>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#795548] hover:bg-[#5D4037] text-white text-xs font-bold shadow-sm transition active:scale-98"
        >
          Return to Store & Browse More
        </button>
      </footer>
    </>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FDF8F5] dark:bg-[#140D0B] text-[#3E2723] dark:text-[#F5EFEA] flex flex-col animate-fadeIn min-h-screen">
        {contentMarkup}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {contentMarkup}
      </div>
    </div>
  );
}
