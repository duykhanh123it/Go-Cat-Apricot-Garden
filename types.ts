
export interface Product {
  id: string;
  name: string;
  price: number;
  rentPrice: number;
  category: 'Mai Tán' | 'Mai Bonsai';
  height: string;
  width: string;
  age: number;
  image: string;
  thumbnails: string[];
  description: string;
}

export type Page = 'home' | 'products' | 'detail' | 'booking' | 'contact';
