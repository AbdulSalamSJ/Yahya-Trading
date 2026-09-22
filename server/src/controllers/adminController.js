import { db } from '../db/connection.js';
import { sendOrderStatusEmail, verifyMailConnection } from '../utils/mailer.js';

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
