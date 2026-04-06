import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yasmeeniscreating.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'ar'];

  // Static pages
  const staticPages = ['', '/store', '/blog', '/crafts', '/artists', '/freebies', '/request', '/about', '/contact'];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  );

  // Dynamic pages
  const [products, posts, artists, categories] = await Promise.all([
    prisma.product.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.featuredArtist.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { type: 'CRAFT' }, select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicEntries = locales.flatMap((locale) => [
    ...products.map((p) => ({
      url: `${SITE_URL}/${locale}/store/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/${locale}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...artists.map((a) => ({
      url: `${SITE_URL}/${locale}/artists/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/${locale}/crafts/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]);

  return [...staticEntries, ...dynamicEntries];
}
