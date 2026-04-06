'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@/lib/utils';

type Post = {
  id: string; titleEn: string; titleAr: string; slug: string;
  excerptEn: string | null; excerptAr: string | null;
  featuredImage: string | null; publishDate: string | null;
  category?: { nameEn: string; nameAr: string };
  author?: { name: string };
};

type Props = {
  locale: string;
};

export function LatestPosts({ locale }: Props) {
  const t = useTranslations('blog');
  const tc = useTranslations('common');
  const th = useTranslations('home');
  const isAr = locale === 'ar';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((r) => r.json())
      .then((d) => { if (d.posts) setPosts(d.posts); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="section-spacing bg-white">
      <div className="container-brand">
        <div className="text-center mb-14">
          <h2 className="text-heading font-display tracking-wider uppercase text-brand-charcoal mb-3">
            {th('latestPosts')}
          </h2>
          <div className="w-12 h-px bg-brand-rose mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card-brand group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden bg-brand-blush/20">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={isAr ? post.titleAr : post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-charcoal/10">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge-brand text-[10px]">
                    {isAr ? post.category?.nameAr : post.category?.nameEn}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-base font-medium text-brand-charcoal mb-2 font-body line-clamp-2 group-hover:text-brand-rose transition-colors">
                    {isAr ? post.titleAr : post.titleEn}
                  </h3>
                </Link>
                <p className="text-sm text-brand-charcoal/50 line-clamp-2 mb-3">
                  {isAr ? post.excerptAr : post.excerptEn}
                </p>
                <div className="flex items-center justify-between text-xs text-brand-charcoal/30">
                  <span>{post.author?.name}</span>
                  {post.publishDate && <span>{formatDate(post.publishDate, locale)}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog" className="btn-secondary">
            {tc('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
