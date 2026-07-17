const ADMIN_AUTH_KEY = 'astro_admin_auth'
const ADMIN_USER_FALLBACK = 'MMJ2026'
const ADMIN_PASS_FALLBACK = 'Astro151!'

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === '1'
}

export function loginAdmin(username: string, password: string): boolean {
  const expectedUser = (import.meta.env.VITE_ADMIN_USERNAME ?? ADMIN_USER_FALLBACK).trim()
  const expectedPass = (import.meta.env.VITE_ADMIN_PASSWORD ?? ADMIN_PASS_FALLBACK).trim()
  if (!expectedUser || !expectedPass) return false
  if (username.trim() !== expectedUser) return false
  if (password.trim() !== expectedPass) return false
  sessionStorage.setItem(ADMIN_AUTH_KEY, '1')
  return true
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY)
}

export function setAdminAuthenticated(): void {
  sessionStorage.setItem(ADMIN_AUTH_KEY, '1')
}

export function clearAdminAuthenticated(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY)
}
