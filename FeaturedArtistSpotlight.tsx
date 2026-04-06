'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Artist = {
  id: string; nameEn: string; nameAr: string; slug: string;
  bioEn: string | null; bioAr: string | null;
  craftSpecialty: string | null;
  profileImageUrl: string | null; coverImageUrl: string | null;
};

type Props = { locale: string };

export function FeaturedArtistSpotlight({ locale }: Props) {
  const t = useTranslations('artists');
  const th = useTranslations('home');
  const tc = useTranslations('common');
  const isAr = locale === 'ar';
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetch('/api/artists?featured=true')
      .then((r) => r.json())
      .then((d) => { if (d.artists?.[0]) setArtist(d.artists[0]); });
  }, []);

  if (!artist) return null;

  const name = isAr ? artist.nameAr : artist.nameEn;
  const bio = isAr ? artist.bioAr : artist.bioEn;
  const bioText = bio ? bio.replace(/<[^>]*>/g, '') : '';

  return (
    <section className="section-spacing bg-brand-charcoal overflow-hidden">
      <div className="container-brand">
        <div className="text-center mb-14">
          <h2 className="text-heading font-display tracking-wider uppercase text-white mb-3">
            {th('featuredArtist')}
          </h2>
          <div className="w-12 h-px bg-brand-rose mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-brand overflow-hidden">
              {artist.profileImageUrl ? (
                <img src={artist.profileImageUrl} alt={name} className="w-full h-full object-cover" />
              ) : artist.coverImageUrl ? (
                <img src={artist.coverImageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-forest/30 flex items-center justify-center">
                  <span className="text-6xl font-display text-white/10">{artist.nameEn.charAt(0)}</span>
                </div>
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 rtl:-right-auto rtl:-left-4 w-24 h-24 border-2 border-brand-rose/30 rounded-brand" />
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-brand-rose mb-3">
              {t('specialty')}: {artist.craftSpecialty || '—'}
            </p>
            <h3 className="text-2xl sm:text-3xl font-display tracking-wider uppercase text-white mb-4">
              {name}
            </h3>
            {bioText && (
              <p className="text-sm text-white/50 leading-relaxed mb-8 line-clamp-4">
                {bioText}
              </p>
            )}
            <Link href={`/artists/${artist.slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-rose text-white text-xs font-medium tracking-widest uppercase rounded-brand hover:bg-brand-rose/80 transition-all">
              {tc('readMore')}
              <svg className="w-3.5 h-3.5 rtl-flip" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
