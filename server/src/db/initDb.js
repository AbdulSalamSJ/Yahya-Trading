import { migrateAllToDatabase } from './migrateAllToDb.js';
import { initDatabase, db } from './connection.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('--- Initializing & Migrating Yahiya Traders Database ---');
await migrateAllToDatabase();
await initDatabase();
const products = await db.getProducts();
const orders = await db.getAllOrders();
console.log(`✓ Database ready. Products: ${products.length} | Orders: ${orders.length}`);
process.exit(0);
