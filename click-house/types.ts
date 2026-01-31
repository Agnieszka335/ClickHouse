import { Timestamp } from 'firebase/firestore';

declare global {
  interface Window {
    __app_id?: string;
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  icon: string;
  image: string;
}

export interface CartItem {
  id: string; // Firestore Doc ID
  productId: number;
  name: string;
  price: number;
  quantity: number;
  timestamp?: Timestamp | number;
}

export interface CMSData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBgUrl: string;
  productsTitle: string;
  customTitle: string;
  customBgUrl: string; // New
  aboutTitle: string; // New
  aboutBgUrl: string; // New
  contactTitle: string; // New
  contactBgUrl: string; // New
}

export type NotificationType = 'info' | 'success' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}