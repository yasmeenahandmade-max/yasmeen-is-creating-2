'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/config';
import Image from 'next/image';

type FooterProps = {
  locale: Locale;
};

const quickLinks = [
  { href: '/store',    key: 'store' },
  { href: '/blog',     key: 'blog' },
  { href: '/artists',  key: 'artists' },
  { href: '/freebies', key: 'freebies' },
  { href: '/request',  key: 'request' },
  { href: '/about',    key: 'about' },
] as const;

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-white/80">
      {/* Main footer */}
      <div className="container-brand py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo-white.png"
              alt="Yasmeen"
              width={140}
              height={36}
              className="h-8 w-auto mb-4 opacity-90"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {locale === 'ar'
                ? 'إبداعات يدوية فريدة من قلب الأردن. ريزن، حياكة، كروشيه، رسم، والمزيد.'
                : 'Unique handcrafted creations from the heart of Jordan. Resin, knitting, crochet, drawing, and more.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
              {t('footer.getInTouch')}
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@yasmeeniscreating.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  hello@yasmeeniscreating.com
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
              {t('footer.followUs')}
            </h4>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/yasmeeniscreating"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           text-white/60 hover:bg-brand-rose hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@yasmeeniscreating"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           text-white/60 hover:bg-brand-rose hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 tracking-wider">
            &copy; {year} Yasmeen — Handmade Creations. {t('footer.rights')}
          </p>
          <p className="text-xs text-white/20 tracking-wider">
            {locale === 'ar' ? 'صُنع بحب في الأردن' : 'Made with love in Jordan'} ♥
          </p>
        </div>
      </div>
    </footer>
  );
}
