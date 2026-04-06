'use client';

import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

type Product = {
  id: string; titleEn: string; titleAr: string; slug: string;
  price: number; productType: 'PHYSICAL' | 'DIGITAL';
  images: string[]; isFeatured: boolean;
  category?: { nameEn: string; nameAr: string };
};

type Props = {
  products: Product[];
  locale: string;
};

export function FeaturedProducts({ products, locale }: Props) {
  const isAr = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const [addedId, setAddedId] = useState<string | null>(null);

  if (products.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, titleEn: p.titleEn, titleAr: p.titleAr, price: p.price, productType: p.productType, images: p.images, slug: p.slug });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="section-spacing">
      <div className="container-brand">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-brand-rose mb-2">
              {isAr ? 'منتقاة بعناية' : 'Handpicked'}
            </p>
            <h2 className="text-heading font-display tracking-wider uppercase text-brand-charcoal">
              {isAr ? 'منتجات مميزة' : 'Featured Products'}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-brand-sky/40 flex items-center justify-center text-brand-charcoal/30 hover:text-brand-charcoal hover:border-brand-charcoal/30 transition-all" aria-label="Scroll left">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-brand-sky/40 flex items-center justify-center text-brand-charcoal/30 hover:text-brand-charcoal hover:border-brand-charcoal/30 transition-all" aria-label="Scroll right">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable carousel */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 snap-x snap-mandatory">
          {products.map((p) => {
            const title = isAr ? p.titleAr : p.titleEn;
            return (
              <div key={p.id} className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start card-brand group">
                <Link href={`/store/${p.slug}`} className="block relative aspect-square overflow-hidden bg-brand-blush/20">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-charcoal/10">No image</div>
                  )}
                </Link>
                <div className="p-4">
                  <p className="text-[10px] text-brand-rose tracking-wider uppercase mb-1">
                    {isAr ? p.category?.nameAr : p.category?.nameEn}
                  </p>
                  <Link href={`/store/${p.slug}`}>
                    <h3 className="text-sm font-medium text-brand-charcoal mb-2 font-body line-clamp-1 group-hover:text-brand-rose transition-colors">{title}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-brand-charcoal">{formatPrice(p.price, locale)}</p>
                    <button onClick={() => handleAdd(p)}
                      className={`p-2 rounded-full transition-all ${addedId === p.id ? 'bg-green-500 text-white' : 'bg-brand-blush text-brand-charcoal hover:bg-brand-rose hover:text-white'}`}
                      aria-label="Add to cart">
                      {addedId === p.id ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/store" className="btn-secondary text-xs">
            {isAr ? 'عرض كل المنتجات' : 'View All Products'}
          </Link>
        </div>
      </div>
    </section>
  );
}
