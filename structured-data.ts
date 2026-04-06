const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yasmeeniscreating.com';

type ProductLdProps = {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  slug: string;
  inStock: boolean;
  category: string;
};

export function productJsonLd({
  name, description, price, currency = 'JOD',
  image, slug, inStock, category,
}: ProductLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url: `${SITE_URL}/en/store/${slug}`,
    category,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/en/store/${slug}`,
    },
  };
}

type BreadcrumbItem = { name: string; url: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

type ArticleLdProps = {
  title: string;
  description: string;
  image: string;
  slug: string;
  publishDate: string;
  author: string;
};

export function articleJsonLd({
  title, description, image, slug, publishDate, author,
}: ArticleLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url: `${SITE_URL}/en/blog/${slug}`,
    datePublished: publishDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Yasmeen — Handmade Creations',
      url: SITE_URL,
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Yasmeen — Handmade Creations',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: 'Unique handcrafted creations from the heart of Jordan',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    sameAs: [
      'https://instagram.com/yasmeeniscreating',
      'https://youtube.com/@yasmeeniscreating',
    ],
  };
}
