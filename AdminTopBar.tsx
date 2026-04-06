'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { roleLabels, roleColors } from '@/lib/admin-auth';
import clsx from 'clsx';
import type { UserRole } from '@prisma/client';

type Notification = {
  id: string; type: string; title: string; message: string;
  link: string | null; isRead: boolean; createdAt: string;
};

type Props = {
  user: {
    id: string; email: string; name: string;
    role: UserRole; avatarUrl: string | null;
  };
  locale: string;
};

const typeIcons: Record<string, string> = {
  NEW_ORDER: '🛒', NEW_REQUEST: '✉️', NEW_SUBSCRIBER: '📬', NEW_MESSAGE: '💬',
};

function timeAgo(date: string, isAr: boolean): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isAr ? 'الآن' : 'Just now';
  if (mins < 60) return isAr ? `${mins} د` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isAr ? `${hrs} س` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return isAr ? `${days} ي` : `${days}d ago`;
}

export function AdminTopBar({ user, locale }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isAr = locale === 'ar';

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setNotiOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
      if (data.unreadCount !== undefined) setUnreadCount(data.unreadCount);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/admin/notifications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotiClick = async (n: Notification) => {
    if (!n.isRead) {
      await fetch('/api/admin/notifications', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id }),
      });
      setUnreadCount(Math.max(0, unreadCount - 1));
      setNotifications(notifications.map((x) => x.id === n.id ? { ...x, isRead: true } : x));
    }
    if (n.link) { setNotiOpen(false); router.push(`/${locale}${n.link}`); }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const roleLabel = isAr ? roleLabels[user.role].ar : roleLabels[user.role].en;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-brand-charcoal/8">
      <div className="flex items-center justify-between h-16 px-5 sm:px-8">
        <div className="flex items-center gap-4 lg:gap-0">
          <div className="w-8 lg:hidden" />
          <h2 className="text-sm font-medium text-brand-charcoal/70 tracking-wide">{isAr ? 'لوحة الإدارة' : 'Admin Panel'}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative" ref={notiRef}>
            <button onClick={() => { setNotiOpen(!notiOpen); setMenuOpen(false); }}
              className="relative p-2 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors rounded-md hover:bg-brand-charcoal/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-brand-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notiOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-white border border-brand-charcoal/10 rounded-brand shadow-elevated animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-charcoal/8">
                  <h3 className="text-xs font-semibold text-brand-charcoal tracking-wide">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-brand-rose hover:underline">{isAr ? 'قراءة الكل' : 'Mark all read'}</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-xs text-brand-charcoal/30">{isAr ? 'لا توجد إشعارات' : 'No notifications'}</p>
                  ) : (
                    notifications.slice(0, 15).map((n) => (
                      <button key={n.id} onClick={() => handleNotiClick(n)}
                        className={clsx('w-full text-left rtl:text-right px-4 py-3 hover:bg-brand-cream/50 transition-colors border-b border-brand-charcoal/5 last:border-0',
                          !n.isRead && 'bg-brand-rose/3')}>
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm mt-0.5">{typeIcons[n.type] || '📌'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={clsx('text-xs truncate', !n.isRead ? 'font-semibold text-brand-charcoal' : 'text-brand-charcoal/70')}>{n.title}</p>
                            <p className="text-[10px] text-brand-charcoal/40 truncate mt-0.5">{n.message}</p>
                            <p className="text-[9px] text-brand-charcoal/25 mt-1">{timeAgo(n.createdAt, isAr)}</p>
                          </div>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-rose flex-shrink-0 mt-1.5" />}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => { setMenuOpen(!menuOpen); setNotiOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-brand-charcoal/5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-rose/15 flex items-center justify-center text-brand-rose text-xs font-semibold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-brand-charcoal leading-tight">{user.name}</p>
                <p className="text-[11px] text-brand-charcoal/40 leading-tight">{roleLabel}</p>
              </div>
              <svg className={clsx('w-4 h-4 text-brand-charcoal/30 transition-transform duration-200 hidden sm:block', menuOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white border border-brand-charcoal/10 rounded-md shadow-elevated py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-brand-charcoal/8">
                  <p className="text-sm font-medium text-brand-charcoal truncate">{user.name}</p>
                  <p className="text-xs text-brand-charcoal/40 truncate mt-0.5">{user.email}</p>
                  <span className={clsx('inline-block mt-2 px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase rounded-full', roleColors[user.role])}>{roleLabel}</span>
                </div>
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
