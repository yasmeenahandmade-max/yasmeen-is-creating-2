'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';

type Product = {
  id: string; titleEn: string; titleAr: string; slug: string;
  price: number; productType: 'PHYSICAL' | 'DIGITAL';
  stockQuantity: number; images: string[]; isFeatured: boolean;
  category?: { nameEn: string; nameAr: string; slug: string };
};
type Category = { id: string; nameEn: string; nameAr: string; slug: string };

export default function StorePage({ params }: { params: { locale: string } }) {
  const t = useTranslations('store');
  const tc = useTranslations('common');
  const isAr = params.locale === 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const fetchStore = useCallback(async () => {
    const url = activeFilter ? `/api/store?category=${activeFilter}` : '/api/store';
    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      if (data.categories) setCategories(data.categories);
    } catch {} finally { setLoading(false); }
  }, [activeFilter]);

  useEffect(() => { fetchStore(); }, [fetchStore]);

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, titleEn: p.titleEn, titleAr: p.titleAr, price: p.price, productType: p.productType, images: p.images, slug: p.slug });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="section-spacing">
      <div className="container-brand">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-brand-rose mb-3">{t('subtitle')}</p>
          <h1 className="text-heading font-display tracking-wider uppercase text-brand-charcoal mb-4">{t('title')}</h1>
          <div className="w-12 h-px bg-brand-rose mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => { setActiveFilter(''); setLoading(true); }}
            className={clsx('px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-full transition-all',
              !activeFilter ? 'bg-brand-charcoal text-white' : 'bg-brand-blush/50 text-brand-charcoal/60 hover:bg-brand-blush')}>
            {tc('all')}
          </button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => { setActiveFilter(c.slug); setLoading(true); }}
              className={clsx('px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-full transition-all',
                activeFilter === c.slug ? 'bg-brand-charcoal text-white' : 'bg-brand-blush/50 text-brand-charcoal/60 hover:bg-brand-blush')}>
              {isAr ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-sm text-brand-charcoal/40">{tc('loading')}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-sm text-brand-charcoal/40">{tc('noResults')}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <div key={p.id} className="card-brand group">
                <Link href={`/store/${p.slug}`} className="block relative aspect-square overflow-hidden bg-brand-blush/20">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={isAr ? p.titleAr : p.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-charcoal/15 text-sm">No image</div>
                  )}
                  {p.isFeatured && <span className="absolute top-2 left-2 rtl:left-auto rtl:right-2 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase bg-brand-rose text-white rounded-full">{tc('featured')}</span>}
                  {p.productType === 'DIGITAL' && <span className="absolute top-2 right-2 rtl:right-auto rtl:left-2 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase bg-brand-forest text-white rounded-full">{t('digitalProduct')}</span>}
                </Link>
                <div className="p-4">
                  <p className="text-[10px] text-brand-rose tracking-wider uppercase mb-1">{isAr ? p.category?.nameAr : p.category?.nameEn}</p>
                  <Link href={`/store/${p.slug}`}><h3 className="text-sm font-medium text-brand-charcoal mb-2 font-body line-clamp-2 hover:text-brand-rose transition-colors">{isAr ? p.titleAr : p.titleEn}</h3></Link>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-brand-charcoal">{formatPrice(p.price, params.locale)}</p>
                    {p.productType === 'PHYSICAL' && p.stockQuantity <= 0 ? (
                      <span className="text-[10px] text-red-400 tracking-wider uppercase">{t('outOfStock')}</span>
                    ) : (
                      <button onClick={() => handleAdd(p)}
                        className={clsx('p-2 rounded-full transition-all', addedId === p.id ? 'bg-green-500 text-white' : 'bg-brand-blush text-brand-charcoal hover:bg-brand-rose hover:text-white')}>
                        {addedId === p.id ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
