import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderByNumber
} from '../controllers/orderController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/track/:orderNumber', getOrderByNumber);

export default router;
