// ===== Auth Models =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// ===== User Models =====
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// ===== Product Models =====
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  images: string[];
  thumbnail?: string;
  stock: number;
  unit?: string;
  weight?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  flashDealEndsAt?: string;
  isActive: boolean;
  deliveryTime: string;
  createdAt: string;
}

// ===== Cart Models =====
export interface CartItem {
  product: Product;
  quantity: number;
}

// ===== Order Models =====
export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  statusHistory: { status: string; timestamp: string; note: string }[];
  couponCode?: string;
  couponDiscount: number;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// ===== API Response =====
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// ===== Search =====
export interface SearchHistory {
  _id: string;
  query: string;
  resultCount: number;
  createdAt: string;
}

// ===== App Config =====
export interface AppConfig {
  appName: string;
  logo: {
    text: string;
    icon: string;
    imageUrl: string | null;
    tagline: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

// ===== Admin Analytics =====
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  last7Days: { _id: string; count: number; revenue: number }[];
  ordersByStatus: { _id: string; count: number }[];
  topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
}
