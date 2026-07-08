export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  origin: string;
  target?: string;
  price: number;
  discountPrice: number | null;
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  size?: string;
  glassMaterial?: boolean; // true = Sapphire, false = Hardened
  caseMaterial?: boolean; // true = Premium steel, false = alloy
  waterResistance?: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  membership: "MEMBER" | "VIP";
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  address?: string;
  avatar?: string;
  history?: Order[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  warrantyCode?: string;
  userEmail?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalOriginal: number;
  totalDiscounted: number;
  discountRate: number; // 0, 0.05, 0.1
  status: string;
  note?: string;
  createdAt: string;
}
