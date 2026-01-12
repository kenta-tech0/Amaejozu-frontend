export interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  shop: string;
  category: string;
  brand?: string;
  skinType?: string[];
  aiReason?: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
}
