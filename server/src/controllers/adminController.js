import { db } from '../db/connection.js';
import { sendOrderStatusEmail, verifyMailConnection } from '../utils/mailer.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_DIR = path.resolve(__dirname, '../../../client/public/images/products');
const DIST_PRODUCTS_DIR = path.resolve(__dirname, '../../../client/dist/images/products');

if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PRODUCTS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const base = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'product';
    const timestamp = Date.now();
    cb(null, `${base}-${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed!'), false);
  }
};

export const uploadProductImageMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
}).single('image');

export async function handleUploadProductImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    try {
      if (fs.existsSync(DIST_PRODUCTS_DIR)) {
        fs.copyFileSync(
          path.join(PRODUCTS_DIR, req.file.filename),
          path.join(DIST_PRODUCTS_DIR, req.file.filename)
        );
      }
    } catch (copyErr) {
      console.warn('Could not mirror copy uploaded image to dist:', copyErr.message);
    }

    const relativeUrl = `/images/products/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Product image uploaded and saved in /images/products successfully',
      imageUrl: relativeUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('handleUploadProductImage error:', err);
    res.status(500).json({ message: 'Failed to upload product image', error: err.message });
  }
}


export async function getMetrics(req, res) {
  try {
    const metrics = await db.getAdminMetrics();
    res.json({ metrics });
  } catch (err) {
    console.error('getMetrics error:', err);
    res.status(500).json({ message: 'Failed to fetch admin metrics' });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      category_id,
      brand,
      short_desc,
      description,
      price,
      stock,
      origin,
      cocoa_percentage,
      is_featured,
      images
    } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = await db.createProduct({
      name,
      category_id: Number(category_id),
      brand: brand || 'Maison Cacao',
      short_desc: short_desc || '',
      description: description || '',
      price: Number(price),
      stock: Number(stock || 50),
      origin: origin || 'Ecuador',
      cocoa_percentage: Number(cocoa_percentage || 70),
      is_featured: !!is_featured,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80']
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updated = await db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await db.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await db.getAllOrders();
    res.json({ orders });
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await db.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send order status update email
    sendOrderStatusEmail(order, status).catch(err =>
      console.error('[Mailer] Failed to dispatch status update email:', err.message)
    );

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
}

export async function testMailConnection(req, res) {
  try {
    const result = await verifyMailConnection();
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
