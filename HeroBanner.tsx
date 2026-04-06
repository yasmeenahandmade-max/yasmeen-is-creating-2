'use client';

import { Link } from '@/i18n/navigation';

type HeroData = {
  titleEn: string | null; titleAr: string | null;
  contentEn: string | null; contentAr: string | null;
  imageUrl: string | null;
  metadata: { ctaTextEn?: string; ctaTextAr?: string; ctaLink?: string } | null;
};

type Props = {
  data: HeroData | null;
  locale: string;
};

export function HeroBanner({ data, locale }: Props) {
  const isAr = locale === 'ar';

  const title = isAr ? (data?.titleAr || 'صُنع بحب') : (data?.titleEn || 'Handmade with Love');
  const subtitle = isAr ? (data?.contentAr || 'إبداعات يدوية فريدة من قلب الأردن') : (data?.contentEn || 'Unique handcrafted creations from the heart of Jordan');
  const ctaText = isAr ? (data?.metadata?.ctaTextAr || 'تصفّح المتجر') : (data?.metadata?.ctaTextEn || 'Explore the Store');
  const ctaLink = data?.metadata?.ctaLink || '/store';
  const bgImage = data?.imageUrl;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      {bgImage ? (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-charcoal/40" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-brand" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-brand-blush/40 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-brand-sage/20 blur-3xl" />
        </>
      )}

      <div className="container-brand relative z-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-brand-rose mb-4 animate-fade-in">
            {isAr ? 'إبداعات يدوية' : 'Handmade Creations'}
          </p>
          <h1 className={`font-display tracking-wider uppercase mb-6 animate-slide-up ${bgImage ? 'text-white text-4xl sm:text-5xl lg:text-6xl' : 'text-brand-charcoal text-hero'}`}>
            {title}
          </h1>
          <p className={`text-lg leading-relaxed mb-10 animate-slide-up stagger-2 ${bgImage ? 'text-white/80' : 'text-brand-charcoal/60'}`}>
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up stagger-3">
            <Link href={ctaLink} className={bgImage
              ? 'inline-flex items-center justify-center px-8 py-3.5 bg-white text-brand-charcoal text-sm font-medium tracking-widest uppercase rounded-brand hover:bg-brand-blush transition-all'
              : 'btn-primary'
            }>
              {ctaText}
            </Link>
            <Link href="/about" className={bgImage
              ? 'inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-white text-sm font-medium tracking-widest uppercase border border-white/50 rounded-brand hover:bg-white/10 transition-all'
              : 'btn-secondary'
            }>
              {isAr ? 'من نحن' : 'About Us'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
