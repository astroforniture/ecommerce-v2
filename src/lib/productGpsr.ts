import type { OfficeProduct } from '../types/officeProduct'

/** Campi GPSR opzionali mappabili da riga DB / JSON. */
export type GpsrSourceRow = {
  manufacturer_name?: string | null
  manufacturer_address?: string | null
  importer_name?: string | null
  importer_address?: string | null
  eu_responsible_name?: string | null
  eu_responsible_address?: string | null
  safety_warnings?: string | null
  gpsr?: unknown
  main_features?: unknown
}

function trimOrUndef(v: unknown): string | undefined {
  const s = String(v ?? '').trim()
  return s || undefined
}

function readGpsrObject(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  return raw as Record<string, unknown>
}

function fromMainFeatures(
  features: Record<string, string>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const hit = Object.entries(features).find(
      ([fk]) => fk.trim().localeCompare(k, 'it', { sensitivity: 'base' }) === 0,
    )
    if (hit?.[1]?.trim()) return hit[1].trim()
  }
  return undefined
}

/**
 * Estrae i campi GPSR da colonne dedicate, JSON `gpsr` o chiavi in `main_features`.
 */
export function parseGpsrFieldsFromRow(row: GpsrSourceRow | null | undefined): Partial<
  Pick<
    OfficeProduct,
    | 'manufacturerName'
    | 'manufacturerAddress'
    | 'importerName'
    | 'importerAddress'
    | 'euResponsibleName'
    | 'euResponsibleAddress'
    | 'safetyWarnings'
  >
> {
  if (!row) return {}

  const gpsr = readGpsrObject(row.gpsr)
  const features =
    row.main_features && typeof row.main_features === 'object' && !Array.isArray(row.main_features)
      ? Object.fromEntries(
          Object.entries(row.main_features as Record<string, unknown>).map(([k, v]) => [
            k,
            String(v ?? '').trim(),
          ]),
        )
      : {}

  const manufacturerName =
    trimOrUndef(row.manufacturer_name) ||
    trimOrUndef(gpsr?.manufacturer_name) ||
    trimOrUndef(gpsr?.manufacturerName) ||
    fromMainFeatures(features, ['Produttore', 'Manufacturer', 'Fabbricante'])

  const manufacturerAddress =
    trimOrUndef(row.manufacturer_address) ||
    trimOrUndef(gpsr?.manufacturer_address) ||
    trimOrUndef(gpsr?.manufacturerAddress) ||
    fromMainFeatures(features, ['Indirizzo produttore', 'Manufacturer address'])

  const importerName =
    trimOrUndef(row.importer_name) ||
    trimOrUndef(gpsr?.importer_name) ||
    trimOrUndef(gpsr?.importerName) ||
    fromMainFeatures(features, ['Importatore', 'Importer'])

  const importerAddress =
    trimOrUndef(row.importer_address) ||
    trimOrUndef(gpsr?.importer_address) ||
    trimOrUndef(gpsr?.importerAddress) ||
    fromMainFeatures(features, ['Indirizzo importatore', 'Importer address'])

  const euResponsibleName =
    trimOrUndef(row.eu_responsible_name) ||
    trimOrUndef(gpsr?.eu_responsible_name) ||
    trimOrUndef(gpsr?.euResponsibleName) ||
    fromMainFeatures(features, [
      'Responsabile UE',
      'Responsabile economico UE',
      'EU responsible person',
    ])

  const euResponsibleAddress =
    trimOrUndef(row.eu_responsible_address) ||
    trimOrUndef(gpsr?.eu_responsible_address) ||
    trimOrUndef(gpsr?.euResponsibleAddress) ||
    fromMainFeatures(features, [
      'Indirizzo responsabile UE',
      'EU responsible address',
    ])

  const safetyWarnings =
    trimOrUndef(row.safety_warnings) ||
    trimOrUndef(gpsr?.safety_warnings) ||
    trimOrUndef(gpsr?.safetyWarnings) ||
    fromMainFeatures(features, ['Avvertenze', 'Avvertenze di sicurezza', 'Safety warnings'])

  return {
    ...(manufacturerName ? { manufacturerName } : {}),
    ...(manufacturerAddress ? { manufacturerAddress } : {}),
    ...(importerName ? { importerName } : {}),
    ...(importerAddress ? { importerAddress } : {}),
    ...(euResponsibleName ? { euResponsibleName } : {}),
    ...(euResponsibleAddress ? { euResponsibleAddress } : {}),
    ...(safetyWarnings ? { safetyWarnings } : {}),
  }
}

/** Unisce GPSR da catalogo statico senza sovrascrivere valori già presenti sul prodotto. */
export function mergeGpsrFields(
  product: OfficeProduct,
  fromCatalog: Partial<OfficeProduct> | null | undefined,
): OfficeProduct {
  if (!fromCatalog) return product
  return {
    ...product,
    manufacturerName: product.manufacturerName || fromCatalog.manufacturerName,
    manufacturerAddress: product.manufacturerAddress || fromCatalog.manufacturerAddress,
    importerName: product.importerName || fromCatalog.importerName,
    importerAddress: product.importerAddress || fromCatalog.importerAddress,
    euResponsibleName: product.euResponsibleName || fromCatalog.euResponsibleName,
    euResponsibleAddress: product.euResponsibleAddress || fromCatalog.euResponsibleAddress,
    safetyWarnings: product.safetyWarnings || fromCatalog.safetyWarnings,
  }
}
