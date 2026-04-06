'use client';

import { Link } from '@/i18n/navigation';

type AboutData = {
  titleEn: string | null; titleAr: string | null;
  contentEn: string | null; contentAr: string | null;
  imageUrl: string | null;
};

type Props = {
  data: AboutData | null;
  locale: string;
};

export function HomeAboutSection({ data, locale }: Props) {
  const isAr = locale === 'ar';
  if (!data) return null;

  const title = isAr ? (data.titleAr || 'عن ياسمين') : (data.titleEn || 'About Yasmeen');
  const content = isAr ? data.contentAr : data.contentEn;

  return (
    <section className="section-spacing">
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          {data.imageUrl && (
            <div className="relative">
              <div className="aspect-[4/5] rounded-brand overflow-hidden shadow-card">
                <img src={data.imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 rtl:-right-auto rtl:-left-4 w-32 h-32 border-2 border-brand-rose/20 rounded-brand -z-10" />
            </div>
          )}

          {/* Content */}
          <div className={!data.imageUrl ? 'lg:col-span-2 max-w-2xl mx-auto text-center' : ''}>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-brand-rose mb-3">
              {isAr ? 'قصتنا' : 'Our Story'}
            </p>
            <h2 className="text-heading font-display tracking-wider uppercase text-brand-charcoal mb-6">
              {title}
            </h2>
            {content && (
              <div className="text-sm text-brand-charcoal/60 leading-relaxed mb-8 [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: content }} />
            )}
            <Link href="/about" className="btn-secondary text-xs">
              {isAr ? 'اقرأ المزيد' : 'Read More'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
