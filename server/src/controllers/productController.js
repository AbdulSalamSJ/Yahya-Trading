import { db } from '../db/connection.js';

export async function getCategories(req, res) {
  try {
    const categories = await db.getCategories();
    res.json({ categories });
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

export async function getProducts(req, res) {
  try {
    const { category, minCocoa, maxCocoa, search, featured, sort } = req.query;
    const products = await db.getProducts({
      categorySlug: category,
      minCocoa,
      maxCocoa,
      search,
      featured: featured === 'true',
      sort
    });
    res.json({ products, count: products.length });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const product = await db.getProductBySlugOrId(slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await db.getProductReviews(product.id);
    res.json({ product, reviews });
  } catch (err) {
    console.error('getProductBySlug error:', err);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
}

export async function addProductReview(req, res) {
  try {
    const { slug } = req.params;
    const { rating, title, comment, userName } = req.body;

    const product = await db.getProductBySlugOrId(slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const reviewerName = req.user ? req.user.name : (userName || 'Anonymous Connoisseur');

    const review = await db.addReview({
      product_id: product.id,
      user_name: reviewerName,
      rating: Number(rating),
      title: title || 'Exceptional chocolate experience',
      comment: comment || ''
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('addProductReview error:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
}
