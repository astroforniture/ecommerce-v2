import { getSupabaseBrowserClient } from './src/lib/supabaseClient'
import { clearAdminAuthenticated, setAdminAuthenticated } from './src/lib/adminAuth'

function normalizeRole(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toUpperCase()
}

async function hasAdminRoleInDatabase(userId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return false

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) return false
  return normalizeRole((data as { role?: unknown } | null)?.role) === 'ADMIN'
}

/**
 * App-level middleware for admin pages in SPA mode.
 * Returns true only when the user has a Supabase session and ADMIN role.
 */
export async function canAccessAdminRoute(): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return false

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    clearAdminAuthenticated()
    return false
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    clearAdminAuthenticated()
    return false
  }

  const user = userData.user
  const metadataRole = normalizeRole(user.user_metadata?.role ?? user.app_metadata?.role)
  const byMetadata = metadataRole === 'ADMIN'
  const byDatabase = await hasAdminRoleInDatabase(user.id)

  const allowed = byMetadata || byDatabase
  if (allowed) setAdminAuthenticated()
  else clearAdminAuthenticated()
  return allowed
}
