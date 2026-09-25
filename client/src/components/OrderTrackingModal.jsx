import React from 'react';
import { X, CheckCircle, Package, Truck, Clock, MapPin, Sparkles } from 'lucide-react';

export function OrderTrackingModal({ order, onClose }) {
  if (!order) return null;

  const stages = [
    { key: 'placed', label: 'Order Confirmed', desc: 'Harvest batch verified at packing facility' },
    { key: 'processing', label: 'Weighing & Nitrogen Sealing', desc: 'Hand-sorted and vacuum packed' },
    { key: 'shipped', label: 'Dispatched with Express Courier', desc: 'In transit with aroma-lock security' },
    { key: 'delivered', label: 'Delivered Farm-Fresh', desc: 'Ready for wholesome natural snacking' }
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EBE0D8] dark:border-[#3E2F29] bg-[#FDF8F5] dark:bg-[#1C1412] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#388E3C] bg-[#388E3C]/10 px-2.5 py-0.5 rounded-full mb-1">
              <CheckCircle size={13} />
              <span>Order Received Successfully</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3E2723] dark:text-[#F5EFEA]">
              Order #{order.order_number}
            </h3>
            <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline Stages */}
        <div className="p-6 sm:p-8">
          <h4 className="font-serif text-sm font-bold text-[#3E2723] dark:text-[#F5EFEA] mb-6">
            Harvest Preparation & Delivery Timeline
          </h4>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EBE0D8] dark:before:bg-[#3E2F29]">
            {stages.map((stg, idx) => {
              const isPassed = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={stg.key} className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isPassed
                      ? 'bg-[#795548] text-white ring-4 ring-[#EFEBE9] dark:ring-[#3E2F29]'
                      : 'bg-[#EBE0D8] dark:bg-[#3E2F29] text-[#A1887F]'
                  }`}>
                    {isPassed ? <CheckCircle size={14} /> : idx + 1}
                  </div>

                  <div>
                    <h5 className={`font-serif text-sm font-bold ${
                      isCurrent
                        ? 'text-[#795548] dark:text-[#A1887F]'
                        : isPassed
                        ? 'text-[#3E2723] dark:text-[#F5EFEA]'
                        : 'text-[#6D4C41]/60 dark:text-[#C8B8B0]/60'
                    }`}>
                      {stg.label}
                    </h5>
                    <p className="text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
                      {stg.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items in this Order */}
          <div className="mt-8 pt-6 border-t border-[#EBE0D8] dark:border-[#3E2F29]">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-[#6D4C41] dark:text-[#C8B8B0] mb-3">
              Harvest Items ({order.items?.length || 0})
            </h5>

            <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-[#3E2723] dark:text-[#F5EFEA]">{item.product_name}</p>
                      <p className="text-[11px] text-[#6D4C41] dark:text-[#C8B8B0]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#795548] dark:text-[#A1887F]">
                    ₹ {(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address and Payment Info */}
          <div className="mt-6 pt-4 border-t border-[#EBE0D8] dark:border-[#3E2F29] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
            <div>
              <p className="font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#795548]" />
                Dispatch Address
              </p>
              <p>{order.shipping_address?.fullName || order.customer_name}</p>
              <p>{order.shipping_address?.addressLine}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}</p>
            </div>

            <div>
              <p className="font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">Payment Verification</p>
              <p>Reference: <span className="font-mono text-[#795548]">{order.payment_id}</span></p>
              <p>Total Paid: <span className="font-bold text-[#795548] dark:text-[#A1887F]">₹ {Number(order.total_amount).toLocaleString('en-IN')}</span></p>
              <p className="text-[11px] text-[#388E3C] font-semibold mt-0.5">
                {String(order.payment_id).startsWith('wa_') ? '✓ WhatsApp Order Verified' : '✓ Verified Payment'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
