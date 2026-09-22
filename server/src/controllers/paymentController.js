import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance = null;
if (keyId && keySecret && keyId !== 'rzp_test_placeholder') {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  } catch (err) {
    console.warn('Razorpay initialization error, using sandbox simulator:', err.message);
  }
}

export async function createPaymentOrder(req, res) {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    // If real credentials are provided
    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
        isSandbox: false
      });
    }

    // Interactive Sandbox Simulator Mode
    const mockOrderId = 'order_choco_' + Math.random().toString(36).substring(2, 12);
    res.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency,
      key: keyId || 'rzp_test_mock_chocolatier',
      isSandbox: true,
      message: 'Running in Razorpay Sandbox Simulation mode.'
    });
  } catch (err) {
    console.error('createPaymentOrder error:', err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
}

export async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isSandbox
    } = req.body;

    if (isSandbox || !keySecret || keySecret === 'placeholder') {
      return res.json({
        success: true,
        verified: true,
        message: 'Sandbox payment verified successfully',
        payment_id: razorpay_payment_id || `pay_sim_${Date.now()}`
      });
    }

    // Real Razorpay signature check
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (err) {
    console.error('verifyPayment error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
}
