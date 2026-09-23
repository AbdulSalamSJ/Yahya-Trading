import express from 'express';
import {
  getMetrics,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  testMailConnection,
  uploadProductImageMiddleware,
  handleUploadProductImage
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/metrics', getMetrics);
router.post('/products', createProduct);
router.post('/upload-image', uploadProductImageMiddleware, handleUploadProductImage);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/mail/status', testMailConnection);

export default router;
