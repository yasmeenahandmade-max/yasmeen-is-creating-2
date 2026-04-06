'use client';

type Place = {
  id: string; nameEn: string; nameAr: string;
  logoImageUrl: string | null; addressEn: string | null; addressAr: string | null;
  externalLink: string | null;
};

type Props = {
  places: Place[];
  locale: string;
};

export function PlacesToBuyGrid({ places, locale }: Props) {
  const isAr = locale === 'ar';

  if (places.length === 0) return null;

  return (
    <section className="section-spacing">
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-brand-rose mb-2">
            {isAr ? 'منتجاتنا في' : 'Find Our Products At'}
          </p>
          <h2 className="text-heading font-display tracking-wider uppercase text-brand-charcoal mb-3">
            {isAr ? 'أين تجدنا' : 'Where to Find Us'}
          </h2>
          <div className="w-12 h-px bg-brand-rose mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {places.map((place) => {
            const name = isAr ? place.nameAr : place.nameEn;
            const address = isAr ? place.addressAr : place.addressEn;
            const Wrapper = place.externalLink ? 'a' : 'div';
            const linkProps = place.externalLink
              ? { href: place.externalLink, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Wrapper
                key={place.id}
                {...linkProps}
                className="bg-white rounded-brand p-6 flex flex-col items-center text-center shadow-soft hover:shadow-card transition-all duration-300 group cursor-pointer"
              >
                {/* Logo */}
                <div className="w-16 h-16 rounded-full bg-brand-blush/30 flex items-center justify-center mb-4 overflow-hidden">
                  {place.logoImageUrl ? (
                    <img src={place.logoImageUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-display text-brand-charcoal/15">{name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-brand-charcoal group-hover:text-brand-rose transition-colors mb-1">{name}</h3>
                {address && (
                  <p className="text-[10px] text-brand-charcoal/30">{address}</p>
                )}
                {place.externalLink && (
                  <span className="mt-2 text-[9px] text-brand-rose tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAr ? 'زيارة ↗' : 'Visit ↗'}
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
