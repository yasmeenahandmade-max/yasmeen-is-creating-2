'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BilingualInput } from '@/components/ui/BilingualInput';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatDate } from '@/lib/utils';
import clsx from 'clsx';

type Post = {
  id: string; titleEn: string; titleAr: string; slug: string;
  contentEn: string | null; contentAr: string | null;
  excerptEn: string | null; excerptAr: string | null;
  featuredImage: string | null; categoryId: string;
  status: 'DRAFT' | 'PUBLISHED'; publishDate: string | null;
  metaTitleEn: string | null; metaTitleAr: string | null;
  metaDescEn: string | null; metaDescAr: string | null;
  createdAt: string;
  category?: { nameEn: string; nameAr: string };
  author?: { name: string };
};
type Category = { id: string; nameEn: string; nameAr: string };

export default function BlogAdminPage({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaTitleAr, setMetaTitleAr] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');
  const [metaDescAr, setMetaDescAr] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const url = filterStatus ? `/api/admin/blog?status=${filterStatus}` : '/api/admin/blog';
      const res = await fetch(url);
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch {} finally { setLoading(false); }
  }, [filterStatus]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories?type=BLOG');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {}
  }, []);

  useEffect(() => { fetchPosts(); fetchCategories(); }, [fetchPosts, fetchCategories]);

  const resetForm = () => {
    setTitleEn(''); setTitleAr(''); setContentEn(''); setContentAr('');
    setExcerptEn(''); setExcerptAr(''); setFeaturedImage(null);
    setCategoryId(''); setStatus('DRAFT');
    setMetaTitleEn(''); setMetaTitleAr(''); setMetaDescEn(''); setMetaDescAr('');
    setEditing(null); setError('');
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    setTitleEn(p.titleEn); setTitleAr(p.titleAr);
    setContentEn(p.contentEn || ''); setContentAr(p.contentAr || '');
    setExcerptEn(p.excerptEn || ''); setExcerptAr(p.excerptAr || '');
    setFeaturedImage(p.featuredImage); setCategoryId(p.categoryId);
    setStatus(p.status);
    setMetaTitleEn(p.metaTitleEn || ''); setMetaTitleAr(p.metaTitleAr || '');
    setMetaDescEn(p.metaDescEn || ''); setMetaDescAr(p.metaDescAr || '');
    setView('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');

    const payload: Record<string, any> = {
      titleEn, titleAr,
      contentEn: contentEn || null, contentAr: contentAr || null,
      excerptEn: excerptEn || null, excerptAr: excerptAr || null,
      featuredImage, categoryId, status,
      metaTitleEn: metaTitleEn || null, metaTitleAr: metaTitleAr || null,
      metaDescEn: metaDescEn || null, metaDescAr: metaDescAr || null,
    };

    try {
      const method = editing ? 'PATCH' : 'POST';
      if (editing) payload.id = editing.id;
      const res = await fetch('/api/admin/blog', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setView('list'); resetForm(); fetchPosts();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/blog?id=${deleteId}`, { method: 'DELETE' });
    setDeleteId(null); fetchPosts();
  };

  const toggleStatus = async (p: Post) => {
    await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, status: p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }),
    });
    fetchPosts();
  };

  // --- FORM VIEW ---
  if (view === 'form') {
    return (
      <>
        <AdminPageHeader
          title={editing ? (isAr ? 'تعديل المقال' : 'Edit Post') : (isAr ? 'مقال جديد' : 'New Post')}
          action={<button onClick={() => { setView('list'); resetForm(); }} className="btn-secondary text-xs">{isAr ? '← العودة' : '← Back'}</button>}
        />
        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-brand text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-brand shadow-soft p-6 space-y-5">
                <BilingualInput label={isAr ? 'العنوان' : 'Title'} valueEn={titleEn} valueAr={titleAr} onChangeEn={setTitleEn} onChangeAr={setTitleAr} required />
                <BilingualInput label={isAr ? 'المقتطف' : 'Excerpt'} valueEn={excerptEn} valueAr={excerptAr} onChangeEn={setExcerptEn} onChangeAr={setExcerptAr} type="textarea" rows={2} placeholderEn="Short summary shown in listings" placeholderAr="ملخص قصير يظهر في القوائم" />
              </div>

              {/* Content editors */}
              <div className="bg-white rounded-brand shadow-soft p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
                    {isAr ? 'المحتوى (EN)' : 'Content (EN)'}
                  </label>
                  <RichTextEditor value={contentEn} onChange={setContentEn} minHeight="min-h-[300px]" placeholder="Write your blog post in English..." />
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
                    {isAr ? 'المحتوى (AR)' : 'Content (AR)'}
                  </label>
                  <RichTextEditor value={contentAr} onChange={setContentAr} minHeight="min-h-[300px]" placeholder="اكتب مقالك بالعربية..." />
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-brand shadow-soft p-6 space-y-4">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-brand-charcoal/40">SEO</h4>
                <BilingualInput label={isAr ? 'عنوان الميتا' : 'Meta Title'} valueEn={metaTitleEn} valueAr={metaTitleAr} onChangeEn={setMetaTitleEn} onChangeAr={setMetaTitleAr} placeholderEn="Custom SEO title (optional)" placeholderAr="عنوان مخصص لمحركات البحث" />
                <BilingualInput label={isAr ? 'وصف الميتا' : 'Meta Description'} valueEn={metaDescEn} valueAr={metaDescAr} onChangeEn={setMetaDescEn} onChangeAr={setMetaDescAr} type="textarea" rows={2} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-brand shadow-soft p-6 space-y-4">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'النشر' : 'Publishing'}</h4>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-1.5">{isAr ? 'الحالة' : 'Status'}</label>
                  <div className="flex gap-2">
                    {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setStatus(s)}
                        className={clsx('flex-1 py-2.5 text-xs font-medium tracking-wider uppercase rounded-brand border transition-all',
                          status === s ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'bg-white text-brand-charcoal/50 border-brand-sky/40 hover:border-brand-charcoal/30')}>
                        {s === 'DRAFT' ? (isAr ? 'مسودة' : 'Draft') : (isAr ? 'نشر' : 'Publish')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-1.5">{isAr ? 'التصنيف' : 'Category'}</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-brand" required>
                    <option value="">{isAr ? 'اختر تصنيفاً' : 'Select category'}</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-brand shadow-soft p-6">
                <ImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  folder="blog"
                  label={isAr ? 'الصورة الرئيسية' : 'Featured Image'}
                  hint="1200×630px recommended"
                  aspectRatio="aspect-[16/9]"
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary text-xs w-full disabled:opacity-50">
                {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : editing ? (isAr ? 'تحديث المقال' : 'Update Post') : (isAr ? 'إنشاء المقال' : 'Create Post')}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }

  // --- LIST VIEW ---
  return (
    <>
      <AdminPageHeader
        title={isAr ? 'المقالات' : 'Blog Posts'}
        description={isAr ? `${posts.length} مقال` : `${posts.length} posts`}
        action={<button onClick={() => { resetForm(); setView('form'); }} className="btn-primary text-xs">{isAr ? 'مقال جديد' : 'New Post'}</button>}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        {['', 'DRAFT', 'PUBLISHED'].map((s) => (
          <button key={s} onClick={() => { setFilterStatus(s); setLoading(true); }}
            className={clsx('px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-full transition-all',
              filterStatus === s ? 'bg-brand-charcoal text-white' : 'bg-brand-blush/50 text-brand-charcoal/60 hover:bg-brand-blush')}>
            {s === '' ? (isAr ? 'الكل' : 'All') : s === 'DRAFT' ? (isAr ? 'مسودة' : 'Draft') : (isAr ? 'منشور' : 'Published')}
          </button>
        ))}
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-brand shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-brand-charcoal/40">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-brand-charcoal/40 mb-3">{isAr ? 'لا توجد مقالات' : 'No posts yet'}</p>
            <button onClick={() => { resetForm(); setView('form'); }} className="btn-soft text-xs">{isAr ? 'أضف أول مقال' : 'Write your first post'}</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-charcoal/8">
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'المقال' : 'Post'}</th>
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'الكاتب' : 'Author'}</th>
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="text-left rtl:text-right px-6 py-3 text-[11px] font-medium tracking-wider uppercase text-brand-charcoal/40"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-brand-charcoal/5 hover:bg-brand-cream/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded bg-brand-blush/20 flex-shrink-0 overflow-hidden">
                          {p.featuredImage ? <img src={p.featuredImage} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-brand-charcoal/10 text-[9px]">No img</span>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-charcoal truncate max-w-[250px]">{p.titleEn}</p>
                          <p className="text-[11px] text-brand-charcoal/30 truncate max-w-[250px] font-arabic" dir="rtl">{p.titleAr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="badge-brand text-[10px]">{isAr ? p.category?.nameAr : p.category?.nameEn}</span></td>
                    <td className="px-6 py-4 text-xs text-brand-charcoal/50">{p.author?.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(p)} className={clsx('px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full transition-colors',
                        p.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100')}>
                        {p.status === 'PUBLISHED' ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-charcoal/40">{formatDate(p.publishDate || p.createdAt, params.locale)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-brand-charcoal/30 hover:text-brand-charcoal rounded hover:bg-brand-charcoal/5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-brand-charcoal/20 hover:text-red-500 rounded hover:bg-red-50">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal open={!!deleteId} title={isAr ? 'حذف المقال' : 'Delete Post'} message={isAr ? 'هل أنت متأكد؟ لا يمكن التراجع.' : 'Are you sure? This cannot be undone.'} confirmLabel={isAr ? 'حذف' : 'Delete'} cancelLabel={isAr ? 'إلغاء' : 'Cancel'} variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}
