// =============================================
// Shared TypeScript types for the application
// =============================================

export type Locale = 'en' | 'ar';

// Bilingual fields helper
export type BilingualField = {
  en: string;
  ar: string;
};

// Category (used across store, blog, crafts, freebies)
export type CategoryType = 'CRAFT' | 'STORE' | 'BLOG' | 'FREEBIE';

export type Category = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  iconImageUrl?: string;
  type: CategoryType;
  sortOrder: number;
};

// Product
export type ProductType = 'PHYSICAL' | 'DIGITAL';

export type Product = {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  categoryId: string;
  category?: Category;
  productType: ProductType;
  stockQuantity: number;
  digitalFileUrl?: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
};

// Cart
export type CartItem = {
  product: Product;
  quantity: number;
};

// Order
export type PaymentMethod = 'CLIQ' | 'COD';
export type PaymentStatus = 'PENDING' | 'CONFIRMED';
export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  createdAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  titleEn: string;
  titleAr: string;
  quantity: number;
  price: number;
};

// Blog Post
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export type BlogPost = {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  contentEn?: string;
  contentAr?: string;
  excerptEn?: string;
  excerptAr?: string;
  featuredImage?: string;
  categoryId: string;
  category?: Category;
  authorId: string;
  status: PostStatus;
  publishDate?: string;
  createdAt: string;
};

// Featured Artist
export type FeaturedArtist = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  bioEn?: string;
  bioAr?: string;
  craftSpecialty?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  portfolioLinks?: { label: string; url: string }[];
  interviewContentEn?: string;
  interviewContentAr?: string;
  podcastEmbedUrl?: string;
  socialLinks?: Record<string, string>;
  isPublished: boolean;
  isFeatured: boolean;
};

// Freebie
export type Freebie = {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  fileUrl: string;
  previewImageUrl?: string;
  categoryId: string;
  category?: Category;
  fileType: string;
  downloadCount: number;
  isPublished: boolean;
};

// Special Request
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'QUOTED' | 'ACCEPTED' | 'COMPLETED' | 'DECLINED';

export type SpecialRequest = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  categoryId?: string;
  category?: Category;
  description: string;
  referenceImages: string[];
  budget?: string;
  deadline?: string;
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
};

// Subscriber
export type SubscriberSource = 'NEWSLETTER' | 'FREEBIE';

export type Subscriber = {
  id: string;
  email: string;
  source: SubscriberSource;
  sourceDetail?: string;
  subscribedAt: string;
};

// Place to Buy
export type PlaceToBuy = {
  id: string;
  nameEn: string;
  nameAr: string;
  logoImageUrl?: string;
  addressEn?: string;
  addressAr?: string;
  externalLink?: string;
  sortOrder: number;
};

// Site Setting
export type SiteSetting = {
  id: string;
  key: string;
  valueEn?: string;
  valueAr?: string;
  type: 'text' | 'image' | 'color' | 'url';
};

// Admin user
export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'ORDER_MANAGER';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
};

// Notification
export type NotificationType = 'NEW_ORDER' | 'NEW_REQUEST' | 'NEW_SUBSCRIBER' | 'NEW_MESSAGE';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};
