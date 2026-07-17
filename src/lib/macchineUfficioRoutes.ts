/** Base canonica per il catalogo Macchine per Ufficio. */
export const MACCHINE_UFFICIO_BASE_PATH = '/prodotti/macchine-per-ufficio'

/** Percorso legacy (redirect in App). */
export const MACCHINE_UFFICIO_LEGACY_PATH = '/macchine-ufficio'

export function macchineUfficioHubPath(): string {
  return MACCHINE_UFFICIO_BASE_PATH
}

export function macchineUfficioSubcategoryPath(slug: string): string {
  return `${MACCHINE_UFFICIO_BASE_PATH}/${slug}`
}
