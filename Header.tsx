'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, localeNames } from '@/i18n/config';
import Image from 'next/image';
import clsx from 'clsx';
import { useCartStore } from '@/lib/cart-store';

function CartButton() {
  const count = useCartStore((s) => s.getCount());
  return (
    <Link
      href="/store/cart"
      className="relative p-2 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
      aria-label="Cart"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}

type HeaderProps = {
  locale: Locale;
};

const navLinks = [
  { href: '/',          key: 'home' },
  { href: '/store',     key: 'store' },
  { href: '/blog',      key: 'blog' },
  { href: '/crafts',    key: 'crafts' },
  { href: '/artists',   key: 'artists' },
  { href: '/freebies',  key: 'freebies' },
  { href: '/request',   key: 'request' },
  { href: '/about',     key: 'about' },
  { href: '/contact',   key: 'contact' },
] as const;

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-sky/20">
      <div className="container-brand">
        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative group">
            <Image
              src="/images/logo.png"
              alt="Yasmeen — Handmade Creations"
              width={160}
              height={40}
              className="h-9 w-auto transition-opacity duration-300 group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={clsx(
                    'px-3.5 py-2 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 rounded-brand',
                    isActive
                      ? 'text-brand-rose'
                      : 'text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-blush/50'
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Language + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase
                         border border-brand-sky/40 rounded-full
                         text-brand-charcoal/70 hover:text-brand-charcoal hover:border-brand-rose/50
                         transition-all duration-200"
              aria-label="Switch language"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {locale === 'en' ? 'العربية' : 'EN'}
            </button>

            {/* Cart icon with count badge */}
            <CartButton />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={clsx(
          'lg:hidden fixed inset-0 top-[4.5rem] z-40 transition-all duration-300',
          mobileOpen ? 'visible' : 'invisible'
        )}
      >
        {/* Backdrop */}
        <div
          className={clsx(
            'absolute inset-0 bg-brand-charcoal/20 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <nav
          className={clsx(
            'absolute top-0 right-0 rtl:right-auto rtl:left-0 w-72 h-full',
            'bg-brand-cream shadow-elevated',
            'flex flex-col py-6 px-6',
            'transition-transform duration-300 ease-out',
            mobileOpen
              ? 'translate-x-0'
              : 'translate-x-full rtl:-translate-x-full'
          )}
        >
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'py-3 text-sm font-medium tracking-[0.12em] uppercase',
                  'border-b border-brand-sky/15 transition-colors duration-200',
                  isActive
                    ? 'text-brand-rose'
                    : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                )}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
