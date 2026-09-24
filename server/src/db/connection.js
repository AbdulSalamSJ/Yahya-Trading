import mysql from 'mysql2/promise';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { categories, products, sampleReviews } from './seedData.js';
import { sampleOrders } from './migrateAllToDb.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool: PgPool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORAGE_FILE = path.join(__dirname, 'local_db.json');

let pool = null;
let isMySQL = false;
let pgPool = null;
let isPg = false;

let localDb = {
  users: [],
  categories: [],
  products: [],
  reviews: [],
  orders: []
};

// Unified database query function handling both PostgreSQL (Supabase) and MySQL
async function dbQuery(sql, params = []) {
  if (isPg && pgPool) {
    let i = 1;
    let pgSql = sql.replace(/\?/g, () => `$${i++}`);
    pgSql = pgSql.replace(/`(\w+)`/g, '"$1"');
    pgSql = pgSql.replace(/is_featured\s*=\s*1\b/gi, 'is_featured = true');
    const isInsert = /^\s*insert\s+/i.test(pgSql);
    if (isInsert && !/returning/i.test(pgSql)) {
      pgSql += ' RETURNING id';
    }
    const res = await pgPool.query(pgSql, params);
    const insertId = res.rows[0]?.id ? Number(res.rows[0].id) : null;
    return [res.rows, { insertId, affectedRows: res.rowCount }];
  } else if (isMySQL && pool) {
    return pool.query(sql, params);
  }
  throw new Error('No database connection available');
}

async function attachProductImages(rows) {
  if (!rows.length) return rows;
  const productIds = rows.map(product => product.id);
  const placeholders = productIds.map(() => '?').join(',');
  const [images] = await dbQuery(
    `SELECT product_id, image_url FROM product_images WHERE product_id IN (${placeholders}) ORDER BY is_primary DESC, id ASC`,
    productIds
  );
  const imagesByProduct = new Map();
  for (const image of images) {
    const productImages = imagesByProduct.get(image.product_id) || [];
    productImages.push(image.image_url);
    imagesByProduct.set(image.product_id, productImages);
  }
  return rows.map(product => ({ ...product, images: imagesByProduct.get(product.id) || [] }));
}

async function seedMySQLData() {
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@123', salt);
  const customerHash = await bcrypt.hash('Customer@123', salt);

  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, role)
     VALUES (1, ?, ?, ?, 'admin'), (2, ?, ?, ?, 'customer')
     ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password_hash = VALUES(password_hash)`,
    ['Yahiya Traders Admin', 'admin@yahiyatraders.com', adminHash,
      'Eleanor Vance', 'customer@example.com', customerHash]
  );

  // Keep all existing catalog items and newly added products intact (do not delete admin-created items)
  for (const category of categories) {
    await pool.query(
      `INSERT INTO categories (id, name, slug, description, image_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         slug = VALUES(slug),
         description = VALUES(description),
         image_url = VALUES(image_url),
         display_order = VALUES(display_order)`,
      [category.id, category.name, category.slug, category.description, category.image_url, category.display_order]
    );
  }

  for (const product of products) {
    await pool.query(
      `INSERT INTO products
       (id, category_id, name, slug, brand, short_desc, description, price, stock, origin,
        cocoa_percentage, rating, reviews_count, is_featured, is_new, is_bestseller)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         category_id = VALUES(category_id),
         name = VALUES(name),
         slug = VALUES(slug),
         brand = VALUES(brand),
         short_desc = VALUES(short_desc),
         description = VALUES(description),
         price = VALUES(price),
         stock = VALUES(stock),
         origin = VALUES(origin),
         cocoa_percentage = VALUES(cocoa_percentage),
         rating = VALUES(rating),
         reviews_count = VALUES(reviews_count),
         is_featured = VALUES(is_featured),
         is_new = VALUES(is_new),
         is_bestseller = VALUES(is_bestseller)`,
      [product.id, product.category_id, product.name, product.slug, product.brand, product.short_desc,
        product.description, product.price, product.stock, product.origin, product.cocoa_percentage,
        product.rating, product.reviews_count, product.is_featured, product.is_new, product.is_bestseller]
    );

    await pool.query('DELETE FROM product_images WHERE product_id = ?', [product.id]);
    for (const [index, imageUrl] of product.images.entries()) {
      await pool.query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
        [product.id, imageUrl, index === 0]
      );
    }
  }

  for (const review of sampleReviews) {
    await pool.query(
      `INSERT INTO reviews (product_id, user_name, rating, title, comment)
       SELECT ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = ? AND user_name = ? AND title = ?)`,
      [review.product_id, review.user_name, review.rating, review.title, review.comment,
        review.product_id, review.user_name, review.title]
    );
  }

  const [[ordersCount]] = await pool.query('SELECT COUNT(*) AS total FROM orders');
  if (ordersCount.total === 0) {
    for (const order of sampleOrders) {
      const shippingJson = typeof order.shipping_address === 'string'
        ? order.shipping_address
        : JSON.stringify(order.shipping_address || {});

      const [insertResult] = await pool.query(
        `INSERT INTO orders (
           user_id, order_number, customer_name, customer_email, customer_phone,
           total_amount, subtotal, tax_amount, shipping_fee, discount_amount,
           promo_code, status, payment_status, payment_id, razorpay_order_id, shipping_address
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.user_id || 2,
          order.order_number,
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.total_amount,
          order.subtotal || order.total_amount,
          order.tax_amount || 0.00,
          order.shipping_fee || 0.00,
          order.discount_amount || 0.00,
          order.promo_code || null,
          order.status || 'processing',
          order.payment_status || 'paid',
          order.payment_id || 'pay_mock_' + Math.floor(100000 + Math.random() * 900000),
          order.razorpay_order_id || 'order_mock_' + Math.floor(100000 + Math.random() * 900000),
          shippingJson
        ]
      );
      const orderId = insertResult.insertId;
      for (const item of (order.items || [])) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.product_name,
            item.quantity,
            item.unit_price,
            item.total_price || (item.quantity * item.unit_price),
            item.image_url || null
          ]
        );
      }
    }
  }
}

async function attachOrderItems(rows) {
  if (!rows.length) return rows;
  const orderIds = rows.map(order => order.id);
  const placeholders = orderIds.map(() => '?').join(',');
  const [items] = await dbQuery(
    `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
    orderIds
  );
  const itemsByOrder = new Map();
  for (const item of items) {
    const orderItems = itemsByOrder.get(item.order_id) || [];
    orderItems.push(item);
    itemsByOrder.set(item.order_id, orderItems);
  }
  return rows.map(order => ({ ...order, items: itemsByOrder.get(order.id) || [] }));
}

// Helper to save local db file
function saveLocalDb() {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local db:', err.message);
  }
}

// Load or seed local db
async function initLocalDb() {
  if (fs.existsSync(LOCAL_STORAGE_FILE)) {
    try {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      localDb = JSON.parse(data);
      console.log('✓ Loaded existing local data store.');
      return;
    } catch (e) {
      console.warn('Re-initializing local store...');
    }
  }

  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@123', salt);
  const customerHash = await bcrypt.hash('Customer@123', salt);

  localDb.users = [
    {
      id: 1,
      name: 'Yahiya Traders Admin',
      email: 'admin@yahiyatraders.com',
      password_hash: adminHash,
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 99,
      name: 'Yahiya Traders Admin Alias',
      email: 'admin@chocolatier.com',
      password_hash: adminHash,
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Eleanor Vance',
      email: 'customer@example.com',
      password_hash: customerHash,
      role: 'customer',
      created_at: new Date().toISOString()
    }
  ];

  localDb.categories = [...categories];
  localDb.products = [...products];
  localDb.reviews = [...sampleReviews];
  localDb.orders = [
    {
      id: 1,
      user_id: 2,
      order_number: 'YAHYA-89412',
      customer_name: 'Eleanor Vance',
      customer_email: 'customer@example.com',
      customer_phone: '+91 98765 43210',
      total_amount: 1250.00,
      subtotal: 1250.00,
      tax_amount: 0.00,
      shipping_fee: 0.00,
      discount_amount: 0.00,
      promo_code: null,
      status: 'shipped',
      payment_status: 'paid',
      payment_id: 'pay_mock_9823412',
      razorpay_order_id: 'order_mock_9823412',
      shipping_address: {
        fullName: 'Eleanor Vance',
        addressLine: '42 Belgravia Crescent',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        phone: '+91 98765 43210'
      },
      items: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          product_name: 'Royal Saudi Ajwa Al-Madinah Dates (500g)',
          quantity: 1,
          unit_price: 1250.00,
          total_price: 1250.00,
          image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
        }
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  saveLocalDb();
  console.log('✓ Initialized embedded store with Yahiya Traders nuts & dates catalog.');
}

export async function initDatabase() {
  // Priority 1: Supabase PostgreSQL (Cloud Database for production and shared development)
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('[YOUR-PASSWORD]')) {
    try {
      pgPool = new PgPool({
        connectionString: supabaseUrl,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000
      });
      const test = await pgPool.query('SELECT 1 + 1 AS result');
      if (test && test.rows) {
        isPg = true;
        console.log('✓ Connected to Supabase PostgreSQL database.');
        return;
      }
    } catch (err) {
      console.warn(`! Supabase connection failed (${err.message}). Trying fallback...`);
      pgPool = null;
      isPg = false;
    }
  }

  // Priority 2: Local MySQL Database
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'chocolate_shop_db';
  const dbPort = process.env.DB_PORT || 3306;

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const [test] = await pool.query('SELECT 1 + 1 AS result');
    if (test) {
      isMySQL = true;
      console.log(`✓ Connected to MySQL database (${dbName}) on port ${dbPort}`);
      await runMySQLMigrations();
      await seedMySQLData();
      console.log('✓ MySQL catalog and test accounts verified.');
      return;
    }
  } catch (err) {
    console.warn(`! MySQL connection skipped or failed (${err.code || err.message}).`);
    console.log('→ Using resilient embedded JSON store. (To use MySQL, set DB_PASSWORD in server/.env)');
    await initLocalDb();
  }
}

async function runMySQLMigrations() {
  if (!isMySQL) return;
  const sqlPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(sqlPath)) {
    const schema = fs.readFileSync(sqlPath, 'utf-8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('CREATE DATABASE') && !s.startsWith('USE'));

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (e) {
        // Table might exist
      }
    }
    console.log('✓ MySQL schema tables verified.');
  }
}

export const db = {
  isUsingMySQL: () => isMySQL,
  isUsingSupabase: () => isPg,
  isUsingDatabase: () => isPg || isMySQL,

  // Users
  findUserByEmail: async (email) => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    }
    return localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    }
    const u = localDb.users.find(u => u.id === Number(id));
    if (!u) return null;
    const { password_hash, ...safeUser } = u;
    return safeUser;
  },

  createUser: async ({ name, email, passwordHash, role = 'customer' }) => {
    if (isPg || isMySQL) {
      const [rows, result] = await dbQuery(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role]
      );
      const id = result.insertId || rows[0]?.id;
      return { id, name, email, role };
    }
    const newUser = {
      id: localDb.users.length ? Math.max(...localDb.users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password_hash: passwordHash,
      role,
      created_at: new Date().toISOString()
    };
    localDb.users.push(newUser);
    saveLocalDb();
    return { id: newUser.id, name, email, role };
  },

  // Categories
  getCategories: async () => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT * FROM categories ORDER BY display_order ASC');
      return rows;
    }
    return localDb.categories;
  },

  // Products
  getProducts: async ({ categorySlug, minCocoa, maxCocoa, search, featured, sort } = {}) => {
    if (isPg || isMySQL) {
      let query = `
        SELECT p.*, c.name AS category_name, c.slug AS category_slug 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (categorySlug && categorySlug !== 'all') {
        query += ' AND c.slug = ?';
        params.push(categorySlug);
      }
      if (minCocoa) {
        query += ' AND p.cocoa_percentage >= ?';
        params.push(Number(minCocoa));
      }
      if (maxCocoa) {
        query += ' AND p.cocoa_percentage <= ?';
        params.push(Number(maxCocoa));
      }
      if (search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (featured) {
        query += isPg ? ' AND p.is_featured = true' : ' AND p.is_featured = 1';
      }

      if (sort === 'price-low') query += ' ORDER BY p.price ASC';
      else if (sort === 'price-high') query += ' ORDER BY p.price DESC';
      else if (sort === 'rating') query += ' ORDER BY p.rating DESC';
      else query += ' ORDER BY p.id DESC';

      const [rows] = await dbQuery(query, params);
      return attachProductImages(rows);
    }

    let result = [...localDb.products];
    if (categorySlug && categorySlug !== 'all') {
      const cat = localDb.categories.find(c => c.slug === categorySlug);
      if (cat) {
        result = result.filter(p => p.category_id === cat.id);
      }
    }
    if (minCocoa) {
      result = result.filter(p => p.cocoa_percentage >= Number(minCocoa));
    }
    if (maxCocoa) {
      result = result.filter(p => p.cocoa_percentage <= Number(maxCocoa));
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s)
      );
    }
    if (featured) {
      result = result.filter(p => p.is_featured);
    }

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => b.id - a.id);

    return result.map(p => {
      const cat = localDb.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : 'Chocolates',
        category_slug: cat ? cat.slug : 'chocolates'
      };
    });
  },

  getProductBySlugOrId: async (identifier) => {
    const isId = !isNaN(Number(identifier));
    if (isPg || isMySQL) {
      const query = isId
        ? 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?'
        : 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?';
      const [rows] = await dbQuery(query, [identifier]);
      const productsWithImages = await attachProductImages(rows);
      return productsWithImages[0] || null;
    }

    const prod = localDb.products.find(p => isId ? p.id === Number(identifier) : p.slug === identifier);
    if (!prod) return null;
    const cat = localDb.categories.find(c => c.id === prod.category_id);
    return {
      ...prod,
      category_name: cat ? cat.name : 'Chocolates',
      category_slug: cat ? cat.slug : 'chocolates'
    };
  },

  createProduct: async (productData) => {
    let slug = (productData.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = 'harvest-item-' + Date.now();
    if (isPg || isMySQL) {
      const [existing] = await dbQuery('SELECT id FROM products WHERE slug = ?', [slug]);
      if (existing.length > 0) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      const [rows, result] = await dbQuery(
        `INSERT INTO products (category_id, name, slug, brand, short_desc, description, price, stock,
         origin, cocoa_percentage, rating, reviews_count, is_featured, is_new, is_bestseller)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 1, 0)`,
        [productData.category_id, productData.name, slug, productData.brand || 'Yahiya Traders Select', productData.short_desc || '',
          productData.description || '', productData.price, productData.stock || 50, productData.origin || 'Imported',
          productData.cocoa_percentage || 500, productData.rating || 5, productData.is_featured ? (isPg ? true : 1) : (isPg ? false : 0)]
      );
      const insertedId = result.insertId || rows[0]?.id;
      for (const [index, imageUrl] of (productData.images || []).entries()) {
        if (imageUrl) {
          await dbQuery(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [insertedId, imageUrl, index === 0]
          );
        }
      }
      return db.getProductBySlugOrId(insertedId);
    }
    const newProd = {
      ...productData,
      id: localDb.products.length ? Math.max(...localDb.products.map(p => p.id)) + 1 : 1,
      slug,
      rating: productData.rating || 5.0,
      reviews_count: 0,
      is_featured: !!productData.is_featured,
      is_new: true,
      is_bestseller: false,
      images: productData.images || ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'],
      created_at: new Date().toISOString()
    };
    localDb.products.push(newProd);
    saveLocalDb();
    return newProd;
  },

  updateProduct: async (id, updateData) => {
    if (isPg || isMySQL) {
      const allowedFields = ['name', 'category_id', 'brand', 'short_desc', 'description', 'price', 'stock',
        'origin', 'cocoa_percentage', 'is_featured'];
      const fields = allowedFields.filter(field => updateData[field] !== undefined);
      if (fields.length) {
        await dbQuery(
          `UPDATE products SET ${fields.map(field => `"${field}" = ?`).join(', ')} WHERE id = ?`,
          [...fields.map(field => (field === 'is_featured' && isPg) ? !!updateData[field] : updateData[field]), id]
        );
      }
      if (updateData.images && Array.isArray(updateData.images) && updateData.images.length) {
        await dbQuery('DELETE FROM product_images WHERE product_id = ?', [id]);
        for (const [index, imageUrl] of updateData.images.entries()) {
          if (imageUrl) {
            await dbQuery(
              'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
              [id, imageUrl, index === 0]
            );
          }
        }
      }
      return db.getProductBySlugOrId(id);
    }
    const index = localDb.products.findIndex(p => p.id === Number(id));
    if (index === -1) return null;
    localDb.products[index] = { ...localDb.products[index], ...updateData };
    saveLocalDb();
    return localDb.products[index];
  },

  deleteProduct: async (id) => {
    if (isPg || isMySQL) {
      const [, result] = await dbQuery('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    }
    const index = localDb.products.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    localDb.products.splice(index, 1);
    saveLocalDb();
    return true;
  },

  // Reviews
  getProductReviews: async (productId) => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery(
        `SELECT id, product_id, user_name, rating, title, comment, created_at FROM reviews
         WHERE product_id = ? ORDER BY created_at DESC`, [productId]
      );
      return rows;
    }
    return localDb.reviews.filter(r => r.product_id === Number(productId));
  },

  addReview: async ({ product_id, user_name, rating, title, comment }) => {
    if (isPg || isMySQL) {
      const [rows, result] = await dbQuery(
        'INSERT INTO reviews (product_id, user_name, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
        [product_id, user_name, rating, title, comment]
      );
      const insertedId = result.insertId || rows[0]?.id;
      await dbQuery(
        `UPDATE products p SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE product_id = p.id),
         reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) WHERE p.id = ?`, [product_id]
      );
      const [reviewRows] = await dbQuery('SELECT * FROM reviews WHERE id = ?', [insertedId]);
      return reviewRows[0];
    }
    const newRev = {
      id: localDb.reviews.length + 1,
      product_id: Number(product_id),
      user_name,
      rating: Number(rating),
      title,
      comment,
      date: 'Just now'
    };
    localDb.reviews.unshift(newRev);

    // Update product rating
    const prod = localDb.products.find(p => p.id === Number(product_id));
    if (prod) {
      const prodRevs = localDb.reviews.filter(r => r.product_id === Number(product_id));
      const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviews_count = prodRevs.length;
    }
    saveLocalDb();
    return newRev;
  },

  // Orders
  createOrder: async (orderData) => {
    const orderNumber = 'CHOCO-' + Math.floor(100000 + Math.random() * 900000);
    const shippingJson = typeof orderData.shipping_address === 'string'
      ? orderData.shipping_address
      : JSON.stringify(orderData.shipping_address || {});

    if (isPg && pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');
        const insertRes = await client.query(
          `INSERT INTO orders (user_id, order_number, customer_name, customer_email, customer_phone,
           total_amount, subtotal, tax_amount, shipping_fee, discount_amount, promo_code, payment_status,
           payment_id, razorpay_order_id, shipping_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
          [orderData.user_id || 1, orderNumber, orderData.customer_name, orderData.customer_email,
            orderData.customer_phone, orderData.total_amount, orderData.subtotal, orderData.tax_amount,
            orderData.shipping_fee, orderData.discount_amount, orderData.promo_code, orderData.payment_status,
            orderData.payment_id, orderData.razorpay_order_id, shippingJson]
        );
        const orderId = insertRes.rows[0].id;
        for (const item of orderData.items || []) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [orderId, item.product_id, item.product_name, item.quantity, item.unit_price,
              item.total_price, item.image_url]
          );
          await client.query(
            'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
            [item.quantity, item.product_id]
          );
        }
        await client.query('COMMIT');
        const [rows] = await dbQuery('SELECT * FROM orders WHERE id = ?', [orderId]);
        return (await attachOrderItems(rows))[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    if (isMySQL && pool) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const [result] = await connection.query(
          `INSERT INTO orders (user_id, order_number, customer_name, customer_email, customer_phone,
           total_amount, subtotal, tax_amount, shipping_fee, discount_amount, promo_code, payment_status,
           payment_id, razorpay_order_id, shipping_address)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderData.user_id, orderNumber, orderData.customer_name, orderData.customer_email,
            orderData.customer_phone, orderData.total_amount, orderData.subtotal, orderData.tax_amount,
            orderData.shipping_fee, orderData.discount_amount, orderData.promo_code, orderData.payment_status,
            orderData.payment_id, orderData.razorpay_order_id, shippingJson]
        );
        for (const item of orderData.items || []) {
          await connection.query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [result.insertId, item.product_id, item.product_name, item.quantity, item.unit_price,
              item.total_price, item.image_url]
          );
          await connection.query(
            'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
            [item.quantity, item.product_id, item.quantity]
          );
        }
        await connection.commit();
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
        return (await attachOrderItems(rows))[0];
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }

    const newOrder = {
      id: localDb.orders.length ? Math.max(...localDb.orders.map(o => o.id)) + 1 : 1,
      order_number: orderNumber,
      ...orderData,
      status: 'processing',
      created_at: new Date().toISOString()
    };
    localDb.orders.unshift(newOrder);

    // Deduct stock
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const prod = localDb.products.find(p => p.id === Number(item.product_id));
        if (prod && prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
        }
      }
    }
    saveLocalDb();
    return newOrder;
  },

  getOrdersByUser: async (userId) => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return attachOrderItems(rows);
    }
    return localDb.orders.filter(o => o.user_id === Number(userId));
  },

  getOrderByNumber: async (orderNumber) => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
      return (await attachOrderItems(rows))[0] || null;
    }
    return localDb.orders.find(o => o.order_number === orderNumber) || null;
  },

  getAllOrders: async () => {
    if (isPg || isMySQL) {
      const [rows] = await dbQuery('SELECT * FROM orders ORDER BY created_at DESC');
      return attachOrderItems(rows);
    }
    return localDb.orders;
  },

  updateOrderStatus: async (orderId, status) => {
    if (isPg || isMySQL) {
      const [, result] = await dbQuery('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
      if (!result.affectedRows) return null;
      const [rows] = await dbQuery('SELECT * FROM orders WHERE id = ?', [orderId]);
      return (await attachOrderItems(rows))[0];
    }
    const order = localDb.orders.find(o => o.id === Number(orderId));
    if (!order) return null;
    order.status = status;
    saveLocalDb();
    return order;
  },

  // Admin Metrics
  getAdminMetrics: async () => {
    if (isPg || isMySQL) {
      const [sales] = await dbQuery(
        `SELECT COALESCE(SUM(total_amount), 0) AS "totalSales", COUNT(*) AS "totalOrders"
         FROM orders WHERE payment_status = 'paid'`
      );
      const [productCount] = await dbQuery('SELECT COUNT(*) AS "totalProducts" FROM products');
      const [customerCount] = await dbQuery("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'");
      const [lowStock] = await dbQuery('SELECT COUNT(*) AS low_stock_count FROM products WHERE stock < 25');
      const [lowStockItems] = await dbQuery('SELECT * FROM products WHERE stock < 25 ORDER BY stock ASC');
      const [recentRows] = await dbQuery('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
      return {
        totalSales: Number(sales[0]?.totalSales || 0),
        totalOrders: Number(sales[0]?.totalOrders || 0),
        totalProducts: Number(productCount[0]?.totalProducts || 0),
        totalCustomers: Number(customerCount[0]?.total_customers || 0),
        lowStockCount: Number(lowStock[0]?.low_stock_count || 0),
        lowStockItems: await attachProductImages(lowStockItems),
        recentOrders: await attachOrderItems(recentRows)
      };
    }
    const totalSales = localDb.orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalOrders = localDb.orders.length;
    const totalProducts = localDb.products.length;
    const lowStockItems = localDb.products.filter(p => p.stock < 25);
    const recentOrders = localDb.orders.slice(0, 5);

    return {
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers: localDb.users.filter(u => u.role === 'customer').length,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      recentOrders
    };
  }
};
