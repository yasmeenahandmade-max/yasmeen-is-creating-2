import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/ui/JsonLd';
import { organizationJsonLd } from '@/lib/structured-data';
import '@/styles/globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yasmeeniscreating.com';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isAr = params.locale === 'ar';

  return {
    title: {
      template: isAr ? '%s | ياسمين — إبداعات يدوية' : '%s | Yasmeen — Handmade Creations',
      default: isAr ? 'ياسمين — إبداعات يدوية' : 'Yasmeen — Handmade Creations',
    },
    description: isAr
      ? 'إبداعات يدوية فريدة من قلب الأردن. ريزن، حياكة، كروشيه، رسم، والمزيد.'
      : 'Unique handcrafted creations from the heart of Jordan. Resin art, knitting, crochet, drawing, and more.',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${params.locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: isAr ? 'ياسمين — إبداعات يدوية' : 'Yasmeen — Handmade Creations',
      locale: isAr ? 'ar_JO' : 'en_US',
      images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/images/logo-icon.png',
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as Locale} />
          <main className="flex-1">
            {children}
          </main>
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
