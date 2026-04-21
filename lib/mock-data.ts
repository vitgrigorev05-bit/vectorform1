// Mock-данные для демонстрации без базы данных

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'GUEST' | 'CUSTOMER' | 'AUTHOR' | 'PARTNER' | 'ADMIN';
}

export interface Model3D {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  authorId: string;
  price: number | null;
  isFree: boolean;
  fileFormat: string;
  fileSize: number;
  dimensions: { width: number; height: number; depth: number };
  volume: number;
  thumbnailUrl: string;
  previewImages: string[];
  tags: string[];
  downloadCount: number;
  rating: number;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface ModelCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export const mockUsers: User[] = [
  { id: '1', email: 'customer@demo.com', name: 'Иван Иванов', role: 'CUSTOMER' },
  { id: '2', email: 'author@demo.com', name: 'ДизайнСтудия', role: 'AUTHOR' },
  { id: '3', email: 'partner@demo.com', name: '3DPrintPro', role: 'PARTNER' },
  { id: '4', email: 'admin@demo.com', name: 'Администратор', role: 'ADMIN' },
];

export const mockCategories: ModelCategory[] = [
  { id: '1', name: 'Украшения', slug: 'jewelry', description: 'Ювелирные изделия и бижутерия', icon: '💍' },
  { id: '2', name: 'Аксессуары', slug: 'accessories', description: 'Чехлы, брелоки, аксессуары', icon: '📱' },
  { id: '3', name: 'Fashion-дизайн', slug: 'fashion', description: 'Модные изделия и одежда', icon: '👗' },
  { id: '4', name: 'Игрушки', slug: 'toys', description: 'Игрушки и развлечения', icon: '🎮' },
  { id: '5', name: 'Домашние предметы', slug: 'home', description: 'Предметы для дома и интерьера', icon: '🏠' },
  { id: '6', name: 'Инженерные детали', slug: 'engineering', description: 'Технические детали и прототипы', icon: '⚙️' },
  { id: '7', name: 'Арт-объекты', slug: 'art', description: 'Художественные объекты и скульптуры', icon: '🎨' },
  { id: '8', name: 'Подарки', slug: 'gifts', description: 'Подарки и сувениры', icon: '🎁' },
];

export const mockModels: Model3D[] = [
  {
    id: '1',
    title: 'Кольцо с геометрическим узором',
    description: 'Современное кольцо с уникальным геометрическим узором, идеально для 3D-печати из различных материалов.',
    shortDescription: 'Геометрическое кольцо для 3D-печати',
    categoryId: '1',
    authorId: '2',
    price: 24.99,
    isFree: false,
    fileFormat: 'STL',
    fileSize: 12.5,
    dimensions: { width: 25, height: 25, depth: 8 },
    volume: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    previewImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800',
    ],
    tags: ['ювелирка', 'мода', 'геометрия', 'кольцо'],
    downloadCount: 1245,
    rating: 4.8,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Декоративная ваза',
    description: 'Современная декоративная ваза с уникальным дизайном, отлично подходит для 3D-печати в качестве предмета интерьера.',
    shortDescription: 'Декоративная ваза для интерьера',
    categoryId: '5',
    authorId: '2',
    price: 0,
    isFree: true,
    fileFormat: 'OBJ',
    fileSize: 45.2,
    dimensions: { width: 120, height: 180, depth: 120 },
    volume: 320,
    thumbnailUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
    previewImages: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
      'https://images.unsplash.com/photo-1581783342308-f792ca11df53?w=800',
    ],
    tags: ['интерьер', 'декор', 'ваза', 'дом'],
    downloadCount: 2890,
    rating: 4.5,
    isPublished: true,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Кастомизированный чехол для телефона',
    description: 'Уникальный чехол для телефона с возможностью кастомизации под разные модели.',
    shortDescription: 'Чехол для телефона с кастомизацией',
    categoryId: '2',
    authorId: '2',
    price: 14.99,
    isFree: false,
    fileFormat: 'STL',
    fileSize: 8.7,
    dimensions: { width: 80, height: 160, depth: 15 },
    volume: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400',
    previewImages: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    ],
    tags: ['чехол', 'гаджеты', 'персонализация', 'аксессуар'],
    downloadCount: 876,
    rating: 4.9,
    isPublished: true,
    isFeatured: true,
  },
];

export function getUsers(): User[] {
  return mockUsers;
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(u => u.email === email);
}

export function getCategories(): ModelCategory[] {
  return mockCategories;
}

export function getModels(): Model3D[] {
  return mockModels;
}

export function getModelById(id: string): Model3D | undefined {
  return mockModels.find(m => m.id === id);
}

export function getModelsByCategory(categorySlug: string): Model3D[] {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return mockModels.filter(m => m.categoryId === category.id);
}

export function searchModels(query: string): Model3D[] {
  const lowerQuery = query.toLowerCase();
  return mockModels.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.description.toLowerCase().includes(lowerQuery) ||
    m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}