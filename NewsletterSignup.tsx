'use client';

import { useState } from 'react';

type Props = { locale: string };

export function NewsletterSignup({ locale }: Props) {
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess(true); setEmail('');
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="bg-brand-forest overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

      <div className="container-brand py-16 sm:py-20 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-display tracking-wider uppercase text-white mb-3">
            {isAr ? 'ابقَ على اطلاع' : 'Stay in the Loop'}
          </h2>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            {isAr
              ? 'احصل على آخر التحديثات عن الإبداعات الجديدة وورش العمل والمجانيات.'
              : 'Get updates on new creations, workshops, and freebies delivered to your inbox.'
            }
          </p>

          {success ? (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 rounded-brand">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm text-white font-medium">
                {isAr ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-brand text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                required
              />
              <button type="submit" disabled={submitting}
                className="px-8 py-3.5 bg-white text-brand-forest text-xs font-medium tracking-widest uppercase rounded-brand hover:bg-brand-blush transition-colors disabled:opacity-50 flex-shrink-0">
                {submitting ? '...' : (isAr ? 'اشترك' : 'Subscribe')}
              </button>
            </form>
          )}
          {error && <p className="text-xs text-red-300 mt-3">{error}</p>}
        </div>
      </div>
    </section>
  );
}
