import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import type { UserRole } from '@prisma/client';

export type AdminSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string | null;
  };
} | null;

/**
 * Get the current admin user from the session.
 * Returns null if not authenticated or not an admin.
 */
export async function getAdminSession(): Promise<AdminSession> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    // Look up the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) return null;

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Check if the user has one of the allowed roles.
 */
export function hasRole(
  session: AdminSession,
  allowedRoles: UserRole[]
): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.user.role);
}

/**
 * Role hierarchy for display
 */
export const roleLabels: Record<UserRole, { en: string; ar: string }> = {
  SUPER_ADMIN: { en: 'Super Admin', ar: 'مدير أعلى' },
  EDITOR: { en: 'Editor', ar: 'محرر' },
  ORDER_MANAGER: { en: 'Order Manager', ar: 'مدير طلبات' },
};

export const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-brand-rose/15 text-brand-rose',
  EDITOR: 'bg-brand-forest/15 text-brand-forest',
  ORDER_MANAGER: 'bg-brand-sky/30 text-brand-charcoal',
};
