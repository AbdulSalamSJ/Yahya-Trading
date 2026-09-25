import { db } from '../db/connection.js';
import { sendOrderConfirmationEmail } from '../utils/mailer.js';

export async function createOrder(req, res) {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      subtotal,
      taxAmount,
      shippingFee,
      discountAmount,
      totalAmount,
      promoCode,
      paymentId,
      razorpayOrderId
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    if (!customerEmail || !customerName || !shippingAddress) {
      return res.status(400).json({ message: 'Customer details and shipping address are required' });
    }

    const userId = req.user ? req.user.id : null;

    const mappedItems = (items || []).map(item => {
      const prodId = Number(item.id || item.product_id || 1);
      const prodName = item.name || item.product_name || 'Gourmet Selection';
      const uPrice = Number(item.price ?? item.unit_price ?? 0);
      const qty = Number(item.quantity || 1);
      const tPrice = Number(item.total_price ?? (uPrice * qty));
      const img = item.image_url || (item.images && item.images[0]) || '';
      return {
        product_id: prodId,
        product_name: prodName,
        quantity: qty,
        unit_price: uPrice,
        total_price: tPrice,
        image_url: img
      };
    });

    const order = await db.createOrder({
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || '',
      subtotal: Number(subtotal),
      tax_amount: Number(taxAmount || 0),
      shipping_fee: Number(shippingFee || 0),
      discount_amount: Number(discountAmount || 0),
      total_amount: Number(totalAmount),
      promo_code: promoCode || null,
      payment_status: 'paid',
      payment_id: paymentId || 'pay_manual_' + Date.now(),
      razorpay_order_id: razorpayOrderId || null,
      shipping_address: shippingAddress,
      items: mappedItems
    });

    // Send order confirmation email (non-blocking for speedy client response)
    sendOrderConfirmationEmail(order)
      .then(info => {
        if (info) {
          console.log(`[Mailer] Order confirmation email for #${order.order_number} sent to ${order.customer_email} (id: ${info.messageId})`);
        }
      })
      .catch(err => {
        console.error(`[Mailer] Failed to dispatch order confirmation email for #${order.order_number}:`, err.message);
      });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: err.message || 'Failed to place order' });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await db.getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error('getUserOrders error:', err);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
}

export async function getOrderByNumber(req, res) {
  try {
    const { orderNumber } = req.params;
    const order = await db.getOrderByNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    console.error('getOrderByNumber error:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
}
