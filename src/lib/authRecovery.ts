/** Parsing parametri Auth (hash o query) per recovery / errori reset password. */

export type AuthCallbackInfo = {
  isRecovery: boolean
  errorCode: string | null
  errorMessage: string | null
  isOtpExpired: boolean
}

function readParam(search: URLSearchParams, hash: URLSearchParams, key: string): string | null {
  return search.get(key) || hash.get(key) || null
}

export function parseAuthCallbackFromLocation(
  search = typeof window !== 'undefined' ? window.location.search : '',
  hash = typeof window !== 'undefined' ? window.location.hash : '',
): AuthCallbackInfo {
  const searchParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const hashRaw = hash.startsWith('#') ? hash.slice(1) : hash
  const hashParams = new URLSearchParams(hashRaw)

  const type = (readParam(searchParams, hashParams, 'type') || '').toLowerCase()
  const error = (readParam(searchParams, hashParams, 'error') || '').toLowerCase()
  const errorCode = (
    readParam(searchParams, hashParams, 'error_code') ||
    readParam(searchParams, hashParams, 'error') ||
    ''
  ).toLowerCase()
  const errorDescription = readParam(searchParams, hashParams, 'error_description')

  const hasTokens =
    Boolean(readParam(searchParams, hashParams, 'access_token')) &&
    Boolean(readParam(searchParams, hashParams, 'refresh_token'))
  const hasCode = Boolean(readParam(searchParams, hashParams, 'code'))

  const isRecovery = type === 'recovery' || hasTokens || (hasCode && type === 'recovery')
  const isOtpExpired =
    errorCode.includes('otp_expired') ||
    error.includes('otp_expired') ||
    (errorDescription || '').toLowerCase().includes('expired')

  return {
    isRecovery: isRecovery && !error && !errorCode,
    errorCode: errorCode || error || null,
    errorMessage: errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : null,
    isOtpExpired,
  }
}

export const OTP_EXPIRED_USER_MESSAGE =
  'Il link è scaduto, richiedine uno nuovo'
