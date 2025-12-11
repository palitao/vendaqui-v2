
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum PageView {
  HOME = 'HOME',
  AUTH = 'AUTH',
  PRODUCT_LIST = 'PRODUCT_LIST',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  DASHBOARD_CUSTOMER = 'DASHBOARD_CUSTOMER',
  DASHBOARD_SELLER = 'DASHBOARD_SELLER',
  DASHBOARD_ADMIN = 'DASHBOARD_ADMIN',
  PLANS = 'PLANS',
  AI_STUDIO = 'AI_STUDIO',
  SELLER_PROFILE = 'SELLER_PROFILE'
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  description: string;
  stock: number;
  isPromoted?: boolean;
  reviewsList?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  paymentMethod: string;
  items: CartItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number; // Cashback
  loyaltyPoints: number; // Fidelidade
  wishlist: string[]; // IDs of products
}

export type NotificationType = 'ORDER' | 'MESSAGE' | 'SYSTEM' | 'PROMO';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  time: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido';
  date: string;
  messages: { sender: 'User' | 'Support', text: string }[];
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: string;
  riskScore: number; // 0-100 (High is bad)
  status: 'Approved' | 'Flagged' | 'Rejected';
}
