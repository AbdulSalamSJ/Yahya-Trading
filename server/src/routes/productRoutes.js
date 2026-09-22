import express from 'express';
import {
  getCategories,
  getProducts,
  getProductBySlug,
  addProductReview
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/:slug/reviews', optionalAuth, addProductReview);

export default router;
