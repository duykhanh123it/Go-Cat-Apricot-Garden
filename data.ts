
import { Product } from './types';

export const products: Product[] = [
  {
    id: 'GC-BNS-001',
    name: 'Mai Lão Cổ Thụ 50 Năm',
    price: 50000000,
    rentPrice: 5000000,
    category: 'Mai Bonsai',
    height: '1m8',
    width: '1m',
    age: 50,
    image: '/BS106.jpg',
    thumbnails: [
      '/BS106.jpg',
      '/BS106.jpg',
      '/BS106.jpg',
      '/BS106.jpg',
    ],

    description: 'Mai lão quý hiếm, dáng độc đáo, trên 50 năm tuổi. Thân cổ kính, hoa nở đồng loạt tạo nên vẻ đẹp rực rỡ cho ngày Tết.'
  },
  {
    id: 'GC-BNS-002',
    name: 'Mai Bonsai Nghệ Thuật',
    price: 35000000,
    rentPrice: 4000000,
    category: 'Mai Bonsai',
    height: '1m2',
    width: '0.8m',
    age: 20,
    image: '/BS107.jpg',
    thumbnails: [],
    description: 'Chậu cảnh mini tinh tế, phù hợp không gian nhỏ.'
  },
  {
    id: 'GC-T-001',
    name: 'Mai Vàng Rực Rỡ',
    price: 15000000,
    rentPrice: 2000000,
    category: 'Mai Tán',
    height: '2m',
    width: '1.5m',
    age: 10,
    image: '/BS124.jpg',
    thumbnails: [],
    description: 'Hoa nở đồng loạt, màu vàng tươi sáng.'
  },
  {
    id: 'GC-BNS-003',
    name: 'Mai Chiếu Thủy Dáng Đẹp',
    price: 25000000,
    rentPrice: 3000000,
    category: 'Mai Bonsai',
    height: '1m',
    width: '0.6m',
    age: 15,
    image: '/bs149.jpg',
    thumbnails: [],
    description: 'Dáng đẹp tự nhiên, thân cổ kính độc đáo.'
  },
  {
    id: 'GC-T-002',
    name: 'Mai Vàng Nguyên Bản',
    price: 12000000,
    rentPrice: 1500000,
    category: 'Mai Tán',
    height: '1m5',
    width: '1m2',
    age: 8,
    image: '/BS360.jpg',
    thumbnails: [],
    description: 'Giữ trọn vẻ đẹp tự nhiên của cây mai miền Nam.'
  }
];
