# Yahiya Traders — Premium Nuts, Cashews & Royal Dates Platform
### Built with React, Node.js, Express, MySQL 8, and Razorpay

An elegant, luxury nuts, colossal cashews, and authentic royal dates e-commerce boutique with the signature **Warm Earth & Harvest Design Specification**.

> **Brand Tagline**: *"Healthy living starts with natural snacking"*

---

## 🌰 Harvest Design System Highlights
- **Palette**: Deep Roasted Walnut (`#3E2723`), Milk Caramel / Date Amber (`#6D4C41`), Warm Beige Cream (`#FDF8F5`), Roasted Cashew Gold Accent (`#795548`), Wood-Fired Dark Hover (`#5D4037`), Fresh Green (`#388E3C`), Amber Harvest (`#F57C00`), Alert Red (`#D32F2F`).
- **Dark Mode**: Velvety dark background (`#1C1412`), Roasted Surface (`#271E1B`), Soft Warm Harvest Text (`#F5EFEA`).
- **Typography**: Inter (body) paired with classic serif Lora for luxury confections and royal harvest headings.
- **Card Spacing**: 8px grid, subtle soft shadows `0 1px 2px rgba(62, 39, 35, 0.06), 0 4px 12px rgba(62, 39, 35, 0.08)`, 14px border radius.

---

## 🚀 Quick Start

### 1. Start Both Frontend & Backend
In PowerShell:
```powershell
# Terminal 1: Start Backend API (Port 5000)
cd server
node src/server.js

# Terminal 2: Start React Frontend (Port 3000)
cd client
npm.cmd run dev
```

The application is live at: **http://localhost:3000**
Backend API is at: **http://localhost:5000**

---

## 🗄️ MySQL Database & Catalog
The server connects directly to your local MySQL 8 instance with automatic fallback to an embedded local JSON store (`server/src/db/local_db.json`).

### Categories:
1. **Royal & Exotic Dates** (`dates`): Authentic Saudi Ajwa of Medina, Jordan Super Medjool, Mabroom.
2. **Artisanal Cashews** (`cashews`): King Jumbo W180 wood-roasted, salted, and spiced.
3. **Heritage Nuts & Almonds** (`nuts-almonds`): California Mamra almonds, Iranian Saffron pistachios, Kashmiri walnuts.
4. **Stuffed & Roasted Blends** (`gourmet-blends`): Almond-stuffed Medjool dates, chocolate-dipped cashews.
5. **Festive Gift Hampers** (`gift-hampers`): Carved dark walnut keepsake gift boxes.

### Migrate / Re-initialize Database:
```powershell
# Migrate all tables, products, categories, reviews, and fulfillment orders
npm run db:migrate

# Or re-initialize and seed:
npm run db:init
```

---

## 💳 Razorpay Payment Integration
- **Dual Mode**:
  - **Interactive Sandbox Simulation**: Ready out-of-the-box for instant testing without needing API keys.
  - **Live / Test Keys**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `server/.env` to switch to real Razorpay checkout popups.

---

## 👤 Test Accounts
- **Yahiya Traders Admin**:
  - Email: `admin@chocolatier.com`
  - Password: `Admin@123`
  - Features: Metrics dashboard, harvest inventory management, batch order status updates.
- **Customer**:
  - Email: `customer@example.com`
  - Password: `Customer@123`
