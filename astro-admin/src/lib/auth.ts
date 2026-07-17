const AUTH_STORAGE_KEY = 'astro_admin_authenticated'

const ALLOWED_EMAIL = 'info@astro-forniture.it'
const ALLOWED_PASSWORD = '151Astro!'

export function isAllowedCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ALLOWED_EMAIL && password === ALLOWED_PASSWORD
}

export function setAuthenticated(isAuthenticated: boolean) {
  localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? 'true' : 'false')
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
