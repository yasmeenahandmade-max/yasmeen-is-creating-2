import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names with clsx (Tailwind-friendly)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price in JOD
 */
export function formatPrice(price: number | string, locale: string = 'en'): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (locale === 'ar') {
    return `${num.toFixed(2)} دينار`;
  }
  return `${num.toFixed(2)} JOD`;
}

/**
 * Generate a URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = 'YC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get localized field value
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: string
): string {
  const localeSuffix = locale === 'ar' ? 'Ar' : 'En';
  const key = `${field}${localeSuffix}` as keyof T;
  return (item[key] as string) || (item[`${field}En` as keyof T] as string) || '';
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
