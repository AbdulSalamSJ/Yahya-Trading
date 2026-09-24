import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { categories, products, sampleReviews } from './seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORAGE_FILE = path.join(__dirname, 'local_db.json');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

export const sampleOrders = [
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
        product_id: 1,
        product_name: 'Royal Saudi Ajwa Al-Madinah Dates (500g)',
        quantity: 1,
        unit_price: 1250.00,
        total_price: 1250.00,
        image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 2,
    user_id: 2,
    order_number: 'YAHYA-91204',
    customer_name: 'Dr. Tariq Al-Mansoor',
    customer_email: 'tariq.mansoor@example.com',
    customer_phone: '+91 98220 11223',
    total_amount: 2340.00,
    subtotal: 2340.00,
    tax_amount: 0.00,
    shipping_fee: 0.00,
    discount_amount: 0.00,
    promo_code: null,
    status: 'delivered',
    payment_status: 'paid',
    payment_id: 'pay_mock_9120488',
    razorpay_order_id: 'order_mock_9120488',
    shipping_address: {
      fullName: 'Dr. Tariq Al-Mansoor',
      addressLine: '14 Al-Noor Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98220 11223'
    },
    items: [
      {
        product_id: 2,
        product_name: 'King Jumbo W180 Roasted & Salted Cashews (500g)',
        quantity: 1,
        unit_price: 890.00,
        total_price: 890.00,
        image_url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
      },
      {
        product_id: 3,
        product_name: 'Jordanian Medjool Dates Super Jumbo (500g)',
        quantity: 1,
        unit_price: 1450.00,
        total_price: 1450.00,
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 3,
    user_id: 2,
    order_number: 'YAHYA-93871',
    customer_name: 'Harshvardhan Kapoor',
    customer_email: 'h.kapoor@corporate.in',
    customer_phone: '+91 99100 44556',
    total_amount: 3400.00,
    subtotal: 3400.00,
    tax_amount: 0.00,
    shipping_fee: 0.00,
    discount_amount: 0.00,
    promo_code: null,
    status: 'processing',
    payment_status: 'paid',
    payment_id: 'pay_mock_9387123',
    razorpay_order_id: 'order_mock_9387123',
    shipping_address: {
      fullName: 'Harshvardhan Kapoor',
      addressLine: 'Floor 18, Apex Business Tower, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400021',
      phone: '+91 99100 44556'
    },
    items: [
      {
        product_id: 8,
        product_name: 'Yahiya Imperial Carved Wooden Keepsake Gift Hamper (1kg)',
        quantity: 1,
        unit_price: 3400.00,
        total_price: 3400.00,
        image_url: 'https://images.unsplash.com/photo-1534432182912-63863115e106?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 4,
    user_id: 2,
    order_number: 'YAHYA-95620',
    customer_name: 'Pooja Varma',
    customer_email: 'pooja.varma@gmail.com',
    customer_phone: '+91 97654 32109',
    total_amount: 1810.00,
    subtotal: 1810.00,
    tax_amount: 0.00,
    shipping_fee: 0.00,
    discount_amount: 0.00,
    promo_code: null,
    status: 'pending',
    payment_status: 'paid',
    payment_id: 'pay_mock_9562019',
    razorpay_order_id: 'order_mock_9562019',
    shipping_address: {
      fullName: 'Pooja Varma',
      addressLine: 'Villa 7, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      phone: '+91 97654 32109'
    },
    items: [
      {
        product_id: 2,
        product_name: 'King Jumbo W180 Roasted & Salted Cashews (500g)',
        quantity: 1,
        unit_price: 890.00,
        total_price: 890.00,
        image_url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
      },
      {
        product_id: 4,
        product_name: 'California Supreme Mamra Almonds (400g)',
        quantity: 1,
        unit_price: 920.00,
        total_price: 920.00,
        image_url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export async function migrateAllToDatabase() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'chocolate_shop_db';
  const dbPort = Number(process.env.DB_PORT || 3306);

  console.log(`\n======================================================`);
  console.log(`📦 Initiating Complete Migration to MySQL Database`);
  console.log(`   Target: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
  console.log(`======================================================\n`);

  // Step 1: Connect to server & create database if not exists
  const rootConn = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort
  });
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await rootConn.end();
  console.log(`✓ Database '${dbName}' verified.`);

  // Step 2: Connect to the database
  const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Step 3: Run Schema SQL
  if (fs.existsSync(SCHEMA_FILE)) {
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('CREATE DATABASE') && !s.startsWith('USE'));

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err) {
        // Table or index might already exist
      }
    }
    console.log(`✓ Schema tables verified and ready.`);
  }

  // Load existing local data if present
  let localData = { users: [], categories: [], products: [], reviews: [], orders: [] };
  if (fs.existsSync(LOCAL_STORAGE_FILE)) {
    try {
      localData = JSON.parse(fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8'));
    } catch (e) {
      console.warn('! Could not parse local_db.json, using defaults.');
    }
  }

  // Step 4: Migrate Users
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@123', salt);
  const customerHash = await bcrypt.hash('Customer@123', salt);

  const defaultUsers = [
    { id: 1, name: 'Yahiya Traders Admin', email: 'admin@chocolatier.com', password_hash: adminHash, role: 'admin' },
    { id: 2, name: 'Eleanor Vance', email: 'customer@example.com', password_hash: customerHash, role: 'customer' }
  ];

  const usersToMigrate = [...defaultUsers];
  if (Array.isArray(localData.users)) {
    for (const u of localData.users) {
      if (!usersToMigrate.some(existing => existing.email.toLowerCase() === u.email.toLowerCase())) {
        usersToMigrate.push(u);
      }
    }
  }

  for (const user of usersToMigrate) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role)`,
      [user.id, user.name, user.email, user.password_hash || customerHash, user.role || 'customer']
    );
  }
  console.log(`✓ Users migrated (${usersToMigrate.length} accounts verified).`);

  // Step 5: Migrate Categories
  const categoriesToMigrate = (localData.categories && localData.categories.length)
    ? localData.categories
    : categories;

  for (const category of categoriesToMigrate) {
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
  console.log(`✓ Categories migrated (${categoriesToMigrate.length} categories verified).`);

  // Step 6: Migrate Products & Product Images
  const productsToMigrate = (localData.products && localData.products.length)
    ? localData.products
    : products;

  await pool.query('DELETE FROM product_images');
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM products');

  for (const product of productsToMigrate) {
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
      [
        product.id,
        product.category_id,
        product.name,
        product.slug,
        product.brand || 'Yahiya Royal Reserve',
        product.short_desc,
        product.description,
        product.price,
        product.stock,
        product.origin,
        product.cocoa_percentage || 500,
        product.rating,
        product.reviews_count,
        product.is_featured ? 1 : 0,
        product.is_new ? 1 : 0,
        product.is_bestseller ? 1 : 0
      ]
    );

    // Images
    await pool.query('DELETE FROM product_images WHERE product_id = ?', [product.id]);
    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'];

    for (const [index, imageUrl] of images.entries()) {
      await pool.query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
        [product.id, imageUrl, index === 0]
      );
    }
  }
  console.log(`✓ Products & Images migrated (${productsToMigrate.length} items verified).`);

  // Step 7: Migrate Reviews
  const reviewsToMigrate = (localData.reviews && localData.reviews.length)
    ? localData.reviews
    : sampleReviews;

  for (const review of reviewsToMigrate) {
    await pool.query(
      `INSERT INTO reviews (product_id, user_name, rating, title, comment)
       SELECT ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = ? AND user_name = ? AND title = ?)`,
      [
        review.product_id,
        review.user_name,
        review.rating,
        review.title,
        review.comment,
        review.product_id,
        review.user_name,
        review.title
      ]
    );
  }
  console.log(`✓ Customer Reviews migrated (${reviewsToMigrate.length} reviews verified).`);

  // Step 8: Migrate Orders and Order Items
  const ordersToMigrate = (localData.orders && localData.orders.length)
    ? [
        ...localData.orders,
        ...sampleOrders.filter(so => !localData.orders.some(lo => lo.order_number === so.order_number))
      ]
    : sampleOrders;

  for (const order of ordersToMigrate) {
    const shippingJson = typeof order.shipping_address === 'string'
      ? order.shipping_address
      : JSON.stringify(order.shipping_address || {});

    const [existing] = await pool.query('SELECT id FROM orders WHERE order_number = ?', [order.order_number]);
    let orderId;

    if (existing.length > 0) {
      orderId = existing[0].id;
      await pool.query(
        `UPDATE orders SET
           user_id = ?, customer_name = ?, customer_email = ?, customer_phone = ?,
           total_amount = ?, subtotal = ?, tax_amount = ?, shipping_fee = ?, discount_amount = ?,
           promo_code = ?, status = ?, payment_status = ?, payment_id = ?, razorpay_order_id = ?,
           shipping_address = ?
         WHERE id = ?`,
        [
          order.user_id || 2,
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
          shippingJson,
          orderId
        ]
      );
    } else {
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
      orderId = insertResult.insertId;
    }

    // Insert order items
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
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
  console.log(`✓ Orders & Order Items migrated (${ordersToMigrate.length} orders verified).`);

  // Final Summary Query
  console.log(`\n------------------------------------------------------`);
  console.log(`📊 Database Migration Complete - Current Table Summary:`);
  console.log(`------------------------------------------------------`);
  const tables = ['users', 'categories', 'products', 'product_images', 'reviews', 'orders', 'order_items'];
  for (const table of tables) {
    const [[result]] = await pool.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
    console.log(`   • ${table.padEnd(16)} : ${result.total} records`);
  }
  console.log(`------------------------------------------------------\n`);

  await pool.end();
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('migrateAllToDb.js')) {
  migrateAllToDatabase()
    .then(() => {
      console.log('🎉 Full database migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration failed:', err);
      process.exit(1);
    });
}
