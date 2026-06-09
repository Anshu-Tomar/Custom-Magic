# ⚡ BlinkZone — Gen-Z E-Commerce (Blinkit Clone)

> A production-ready, full-stack e-commerce app with a modern Gen-Z UI — neon gradients, glassmorphism, dark mode, blazing fast.

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | Angular 14 + Tailwind CSS 3 |
| **State Management** | NgRx (Store + Effects) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose ORM |
| **Auth** | JWT (Access + Refresh tokens) |
| **API Style** | REST |
| **Deployment** | Docker + Docker Compose |

---

## 📁 Project Structure

```
blinkzone/
├── frontend/                          # Angular 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/            # AuthGuard, GuestGuard
│   │   │   │   ├── interceptors/      # JWT interceptor (auto-refresh)
│   │   │   │   ├── models/            # TypeScript interfaces
│   │   │   │   ├── services/          # Auth, Product, Cart, Order, Search, Admin
│   │   │   │   └── store/             # NgRx auth + cart reducers
│   │   │   ├── features/
│   │   │   │   ├── home/              # Homepage with hero, categories, flash deals
│   │   │   │   ├── auth/              # Login + Register (JWT)
│   │   │   │   ├── products/          # Product list (filters/pagination) + detail
│   │   │   │   ├── cart/              # Cart with coupon support
│   │   │   │   ├── checkout/          # 3-step checkout (address → payment → confirm)
│   │   │   │   ├── user-dashboard/    # Profile, Orders, Search History, Addresses
│   │   │   │   └── admin/             # Dashboard analytics, Products CRUD, Orders mgmt, Users
│   │   │   └── shared/
│   │   │       └── components/        # Navbar, Footer, Toast, ProductCard, Skeleton, StarRating
│   │   ├── assets/
│   │   │   └── config/
│   │   │       └── app-config.json    # ← Configure logo, app name, colors HERE
│   │   ├── environments/
│   │   │   ├── environment.ts         # Dev (localhost:5000)
│   │   │   └── environment.prod.ts    # Production (/api)
│   │   ├── styles.css                 # Tailwind + Gen-Z custom CSS (glassmorphism, neon)
│   │   └── index.html
│   ├── tailwind.config.js             # Neon color palette, custom animations
│   ├── angular.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                           # Node.js + Express API
│   ├── config/
│   │   └── database.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js          # Register, Login, Refresh, Logout, Me
│   │   ├── productController.js       # CRUD, categories, search
│   │   ├── orderController.js         # Place, list, get, cancel
│   │   ├── adminController.js         # Dashboard analytics, order mgmt, user mgmt
│   │   ├── searchController.js        # Search + history
│   │   └── userController.js          # Profile, password, addresses
│   ├── middleware/
│   │   ├── auth.js                    # protect + adminOnly middleware
│   │   ├── errorHandler.js            # Global error handling
│   │   └── upload.js                  # Multer image upload
│   ├── models/
│   │   ├── User.js                    # User schema (bcrypt, addresses)
│   │   ├── Product.js                 # Product schema (text index, flash deal)
│   │   ├── Order.js                   # Order + OrderItems + status history
│   │   ├── SearchHistory.js           # User search history
│   │   └── Coupon.js                  # Discount coupons
│   ├── routes/
│   │   ├── auth.js                    # POST /register, /login, /refresh, /logout
│   │   ├── products.js                # GET/POST/PUT/DELETE /products
│   │   ├── orders.js                  # POST/GET /orders
│   │   ├── search.js                  # GET /search, /search/history
│   │   ├── admin.js                   # GET /admin/dashboard, /orders, /users
│   │   ├── users.js                   # GET/PUT /users/profile, /addresses
│   │   └── coupons.js                 # POST /coupons/validate, CRUD
│   ├── utils/
│   │   └── seed.js                    # Database seeder (products + users + coupons)
│   ├── server.js                      # Express app entry point
│   ├── .env.example                   # Environment template
│   └── Dockerfile
│
└── docker-compose.yml                 # Full-stack Docker deployment
```

---

## 🚀 Quick Start

### Option A — Local Development

#### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET

npm install
npm run seed       # Seeds DB with products, admin, test user
npm run dev        # Starts on http://localhost:5000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
ng serve           # Starts on http://localhost:4200
```

---

### Option B — Docker (Recommended)
```bash
# From project root
docker-compose up --build

# App runs at:
# Frontend → http://localhost
# Backend  → http://localhost:5000
# MongoDB  → localhost:27017
```

---

## 🔐 Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@blinkit.com | Admin@123 |
| **User** | user@blinkit.com | User@123 |

---

## 🎨 Logo Configuration

Edit `frontend/src/assets/config/app-config.json`:

```json
{
  "appName": "BlinkZone",
  "logo": {
    "text": "BlinkZone",
    "icon": "⚡",
    "imageUrl": null,
    "tagline": "10-min delivery"
  }
}
```

- Set `imageUrl` to a path like `"assets/images/logo.png"` to use an image logo
- Leave `imageUrl: null` to use the text + icon logo
- Change `icon`, `text`, `tagline` freely — no code changes needed

---

## 🛍️ Features at a Glance

### 🏠 Home Page
- Animated hero with neon gradient background + floating orbs
- Real-time product search with instant dropdown results
- Horizontal category scroll with active filter highlighting
- Flash deals section with live countdown timer
- Featured products grid with skeleton loading states
- Promotional banners and app download CTA

### 🔐 Authentication
- JWT access token (15 min) + refresh token (7 days)
- Auto-refresh via HTTP interceptor — transparent to user
- Role-based routing (User / Admin guards)
- Password hashing with bcrypt (12 rounds)
- LocalStorage persistence with NgRx sync

### 👤 User Dashboard
- **Profile**: Edit name, phone; change password
- **Addresses**: Add/edit/delete multiple saved addresses
- **Order History**: Status timeline, progress bar, cancel option
- **Search History**: View/delete individual items or clear all

### 📦 Product System
- Listing with filters: category, search, price range, sort
- Pagination with page numbers
- Detail page with image gallery, ratings, related products
- Quantity controls inline on cards (no page refresh)
- Real stock tracking — disables add-to-cart when out of stock

### 🛒 Cart & Checkout
- Persistent cart (localStorage + NgRx)
- Coupon validation (percent / flat discount)
- Price breakdown: subtotal, 5% tax, free delivery above ₹500
- 3-step checkout: Address → Payment → Review & Confirm
- Pre-fills from user's saved default address

### ⚙️ Admin Panel
- **Dashboard**: Total users/products/orders/revenue cards, order status breakdown bar chart, top-selling products, last 7-day activity chart
- **Products**: Full CRUD with image upload, featured/flash deal toggles, stock management
- **Orders**: List with status filter, inline status update dropdown
- **Users**: List with activate/deactivate toggle

---

## 🌐 API Reference

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login user
POST   /api/auth/refresh      Refresh access token
POST   /api/auth/logout       Logout (clears refresh token)
GET    /api/auth/me           Get current user
```

### Products
```
GET    /api/products          List (filters: category, search, featured, flashDeal, page, limit, sort)
GET    /api/products/categories  All categories
GET    /api/products/:id      Single product
POST   /api/products          Create (Admin only, multipart/form-data)
PUT    /api/products/:id      Update (Admin only)
DELETE /api/products/:id      Soft delete (Admin only)
```

### Orders
```
POST   /api/orders            Place order
GET    /api/orders            My orders (paginated)
GET    /api/orders/:id        Single order
PATCH  /api/orders/:id/cancel Cancel order
```

### Search
```
GET    /api/search?q=query    Search products (saves to history if logged in)
GET    /api/search/history    User's search history
DELETE /api/search/history    Clear all history
DELETE /api/search/history/:id Delete one item
```

### Admin
```
GET    /api/admin/dashboard        Analytics stats
GET    /api/admin/orders           All orders (filter by status)
PATCH  /api/admin/orders/:id/status Update order status
GET    /api/admin/users            All users
PATCH  /api/admin/users/:id/toggle Toggle user active status
```

### Coupons
```
POST   /api/coupons/validate   Validate + calculate discount
GET    /api/coupons            List all (Admin)
POST   /api/coupons            Create (Admin)
DELETE /api/coupons/:id        Delete (Admin)
```

---

## 🎨 Gen-Z Design System

### Colors
```css
--neon-green:  #39FF14   /* Primary CTA, prices, success states */
--neon-cyan:   #00FFFF   /* Links, search, secondary accents */
--neon-purple: #BF5FFF   /* Admin, badges, flash deals */
--neon-pink:   #FF6EC7   /* Revenue, special highlights */
--dark-bg:     #0A0A0F   /* Page background */
--card-bg:     #12121A   /* Glass card base */
```

### Typography
- **Display / Headings**: Syne (Black, Bold)
- **Body**: DM Sans (Regular, Medium)
- **Monospace / Codes**: JetBrains Mono

### Components
- **Glassmorphism cards**: `backdrop-filter: blur(20px)` + `rgba(255,255,255,0.03)` background
- **Neon buttons**: Gradient from green→cyan with glow box-shadow
- **Skeleton loaders**: Shimmer animation on all loading states
- **Micro-interactions**: Scale on hover, slide-in animations, bounce-in for cart badge
- **Countdown timer**: Block-style purple timer for flash deals

---

## 🎟️ Demo Coupon Codes

| Code | Type | Value | Min Order |
|---|---|---|---|
| `GENZ10` | 10% off | Up to ₹100 | ₹199 |
| `NEWUSER` | Flat ₹50 off | — | ₹299 |
| `FLASH20` | 20% off | Up to ₹200 | ₹499 |

---

## 🔧 Environment Variables (Backend)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blinkit_genz
JWT_SECRET=your_super_secret_jwt_key         # Change in production!
JWT_REFRESH_SECRET=your_refresh_secret       # Change in production!
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Description |
|---|---|
| `< 640px` | Mobile-first single column |
| `640px+` | 2-column product grids |
| `768px+` | Side-by-side cart/checkout |
| `1024px+` | Sidebar filters, 3-column grids, admin sidebar |

---

## 🚀 Deployment Checklist

- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random strings
- [ ] Set `NODE_ENV=production`
- [ ] Configure `MONGODB_URI` to your Atlas or production DB
- [ ] Update `environment.prod.ts` `apiUrl` if deploying to a custom domain
- [ ] Run `ng build` to generate optimized production bundle
- [ ] Run seed script on production DB: `npm run seed`
- [ ] Set up HTTPS (Nginx with Let's Encrypt or Cloudflare proxy)

---

## 🔑 Key Architectural Decisions

1. **JWT Refresh Flow**: Access tokens expire in 15 minutes. The `JwtInterceptor` automatically catches 401 errors, calls `/auth/refresh`, retries the original request — completely transparent.

2. **Cart Persistence**: Cart lives in `localStorage` and is synced to NgRx on load. No server-side cart — keeps it fast and serverless-friendly.

3. **Configurable Logo**: Logo metadata lives in `assets/config/app-config.json`, loaded via `APP_INITIALIZER` before the app bootstraps. Zero code change to rebrand.

4. **Soft Delete**: Products are never hard-deleted. `isActive: false` hides them from all queries while preserving order history integrity.

5. **Search History**: Only saved when user is authenticated. Search is debounced 300ms in the navbar with `distinctUntilChanged` to avoid hammering the API.
