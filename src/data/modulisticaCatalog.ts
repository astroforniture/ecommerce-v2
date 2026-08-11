import type { OfficeProduct } from '../types/officeProduct'

export const MODULISTICA_CATEGORY = 'Modulistica' as const
export const MODULISTICA_CATEGORY_NORM = 'modulistica'

/** Macro-categorie Edipro (hub pulito, senza micro-sottocategorie ridondanti). */
export const MODULISTICA_SUB_ALBERGHI = 'Alberghi e Ristoranti' as const
export const MODULISTICA_SUB_CONDOMINIO = 'Condominio ed Edilizia' as const
export const MODULISTICA_SUB_CONTABILITA = 'Contabilità IVA e Generale' as const
export const MODULISTICA_SUB_MAGAZZINO = 'Magazzino e Trasporto' as const
export const MODULISTICA_SUB_STAMPATI_FISCALI = 'Stampati Fiscali' as const

/** Alias legacy → macro ufficiali (URL, DB, migration precedenti). */
const MODULISTICA_SUBCATEGORY_ALIASES: Record<string, string> = {
  'alberghi ristoranti': MODULISTICA_SUB_ALBERGHI,
  'alberghi e ristoranti': MODULISTICA_SUB_ALBERGHI,
  'condominio ed edilizia': MODULISTICA_SUB_CONDOMINIO,
  'condominio, edilizia e registri': MODULISTICA_SUB_CONDOMINIO,
  'contabilità, cassa e fatture': MODULISTICA_SUB_CONTABILITA,
  'contabilita, cassa e fatture': MODULISTICA_SUB_CONTABILITA,
  'contabilità iva e generale': MODULISTICA_SUB_CONTABILITA,
  'contabilita iva e generale': MODULISTICA_SUB_CONTABILITA,
  'ricevute sportive e varie': MODULISTICA_SUB_STAMPATI_FISCALI,
  'registri contabili e cassa': MODULISTICA_SUB_CONTABILITA,
  'registri fiscali e iva': MODULISTICA_SUB_CONTABILITA,
  'registri fiscali e beni usati': MODULISTICA_SUB_CONTABILITA,
  'schede contabili e maste': MODULISTICA_SUB_CONTABILITA,
  'magazzino e trasporto': MODULISTICA_SUB_MAGAZZINO,
  'magazzino e trasporti': MODULISTICA_SUB_MAGAZZINO,
  'buoni di consegna e tentata vendita': MODULISTICA_SUB_MAGAZZINO,
  'documenti di trasporto (ddt)': MODULISTICA_SUB_MAGAZZINO,
  'documenti di trasporto': MODULISTICA_SUB_MAGAZZINO,
  'documenti di trasporto e tentata vendita': MODULISTICA_SUB_MAGAZZINO,
  'buoni di consegna e ricevute': MODULISTICA_SUB_MAGAZZINO,
  'ricevute fiscali e fatture': MODULISTICA_SUB_STAMPATI_FISCALI,
  'stampati fiscali': MODULISTICA_SUB_STAMPATI_FISCALI,
}

export const MODULISTICA_SUBCATEGORIES = [
  MODULISTICA_SUB_ALBERGHI,
  MODULISTICA_SUB_CONDOMINIO,
  MODULISTICA_SUB_CONTABILITA,
  MODULISTICA_SUB_MAGAZZINO,
  MODULISTICA_SUB_STAMPATI_FISCALI,
] as const

export type ModulisticaSubcategory = (typeof MODULISTICA_SUBCATEGORIES)[number]

/** Cover hub Modulistica (macro padre). */
export const MODULISTICA_HUB_COVER_IMAGE_URL = '/cancelleria-penne.jpg'

/** Cover tile per ciascuna macro-categoria (foto prodotto rappresentativa). */
export const MODULISTICA_SUBCATEGORY_COVER_IMAGE: Record<ModulisticaSubcategory, string> = {
  [MODULISTICA_SUB_ALBERGHI]: '/images/d06c153f-a63e-428c-ada0-6a10dfb17f4a.jpg',
  [MODULISTICA_SUB_CONDOMINIO]: '/images/298dec2f-59c6-4cf3-b8a1-c27af2d613ab.jpg',
  [MODULISTICA_SUB_CONTABILITA]: '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg',
  [MODULISTICA_SUB_MAGAZZINO]: '/images/2534e81f-339e-4485-8400-f3367285121e.jpg',
  [MODULISTICA_SUB_STAMPATI_FISCALI]: '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg',
}

/** Slug path `/modulistica/:slug` → etichetta sottocategoria. */
export const MODULISTICA_SUBCATEGORY_SLUGS: Record<string, ModulisticaSubcategory> = {
  'alberghi-e-ristoranti': MODULISTICA_SUB_ALBERGHI,
  'condominio-ed-edilizia': MODULISTICA_SUB_CONDOMINIO,
  'contabilita-iva-e-generale': MODULISTICA_SUB_CONTABILITA,
  'magazzino-e-trasporto': MODULISTICA_SUB_MAGAZZINO,
  'stampati-fiscali': MODULISTICA_SUB_STAMPATI_FISCALI,
}

/** Pretty URL hub (`/modulistica`) e listing sottocategoria. */
export function modulisticaCategoryHref(subcategory?: string): string {
  const sub = subcategory?.trim()
  if (!sub) return '/modulistica'
  const canonical = canonicalizeModulisticaSubcategory(sub)
  const slug = Object.entries(MODULISTICA_SUBCATEGORY_SLUGS).find(([, label]) => label === canonical)?.[0]
  if (slug) return `/modulistica/${slug}`
  const params = new URLSearchParams()
  params.set('category', MODULISTICA_CATEGORY)
  params.set('subcategory', sub)
  return `/office-products?${params.toString()}`
}

/** URL interno OfficePage (query) usato dai redirect `/modulistica`. */
export function modulisticaOfficeProductsHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', MODULISTICA_CATEGORY)
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

export function modulisticaSubcategoryFromSlug(
  slug: string | null | undefined,
): ModulisticaSubcategory | null {
  const key = (slug ?? '').trim().toLowerCase()
  if (!key) return null
  return MODULISTICA_SUBCATEGORY_SLUGS[key] ?? null
}

export function canonicalizeModulisticaSubcategory(
  subcategory: string | null | undefined,
): string {
  const raw = (subcategory ?? '').trim()
  if (!raw) return ''
  const mapped = MODULISTICA_SUBCATEGORY_ALIASES[raw.toLowerCase()]
  if (mapped) return mapped
  for (const official of MODULISTICA_SUBCATEGORIES) {
    if (official.localeCompare(raw, 'it', { sensitivity: 'base' }) === 0) return official
  }
  return raw
}

export type ModulisticaCatalogItem = {
  sku: string
  name: string
  subcategory: ModulisticaSubcategory
  ean?: string
  brand: string
  format?: string
  imageUrl?: string
  description: string
}

/** Catalogo ufficiale Modulistica (SKU / EAN come da listino Edipro). */
export const MODULISTICA_CATALOG: readonly ModulisticaCatalogItem[] = [
  // Alberghi e Ristoranti
  {
    sku: 'E 5911',
    name: 'Blocco comande - 25x3 fogli autoricalcanti - 17 x 9,9 cm - Edipro',
    subcategory: MODULISTICA_SUB_ALBERGHI,
    ean: '8023328591106',
    brand: 'Edipro',
    format: '17 x 9,9 cm',
    imageUrl: '/images/E5911.jpg',
    description:
      'Blocco comande Edipro a 25×3 fogli autoricalcanti, formato 17 × 9,9 cm. Ideale per alberghi e ristoranti.',
  },
  {
    sku: 'E 5913',
    name: 'Blocco comande - 2 copie autoricalcanti - 17 x 9,9 cm - Edipro',
    subcategory: MODULISTICA_SUB_ALBERGHI,
    ean: '8023328591304',
    brand: 'Edipro',
    format: '17 x 9,9 cm',
    imageUrl: '/images/d06c153f-a63e-428c-ada0-6a10dfb17f4a.jpg',
    description:
      'Blocco comande Edipro a 2 copie autoricalcanti, formato 17 × 9,9 cm.',
  },
  // Condominio ed Edilizia
  {
    sku: 'E 5504 C',
    name: 'Blocco ricevuta d’affitto 50×2 autoricalcante – Formato 9,9×17',
    subcategory: MODULISTICA_SUB_CONDOMINIO,
    ean: '8023328550417',
    brand: 'Edipro',
    format: '9,9 x 17 cm',
    imageUrl: '/images/298dec2f-59c6-4cf3-b8a1-c27af2d613ab.jpg',
    description:
      'Blocco ricevuta d’affitto Edipro 50×2 autoricalcante, formato 9,9 × 17 cm. Per condominio e edilizia.',
  },
  {
    sku: 'E 2529',
    name: 'Verbale assemblea condominio 96 pagine – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONDOMINIO,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/c3febc55-30f2-46b3-a8a9-832277f0f492.jpg',
    description:
      'Verbale assemblea di condominio Edipro, 96 pagine, formato 31 × 24,5 cm.',
  },
  {
    sku: 'E 5563 C',
    name: 'Blocco ricevuta generica 50×2 autoricalcante – Formato 9,9×17',
    subcategory: MODULISTICA_SUB_CONDOMINIO,
    ean: '8023328556310',
    brand: 'Edipro',
    format: '9,9 x 17 cm',
    imageUrl: '/images/6a8681b7-1de7-41c7-8029-404fd446c481.jpg',
    description:
      'Blocco ricevuta generica Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.',
  },
  {
    sku: 'E 2104 A',
    name: 'Registro prima nota IVA corrispettivi 13×2 (1 anno) autoricalcante – Formato 29,7×23',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328210410',
    brand: 'Edipro',
    format: '29,7 x 23 cm',
    imageUrl: '/images/792ed7ed-83b7-494d-bff4-16ac1c9d1d47.jpg',
    description:
      'Registro prima nota IVA corrispettivi Edipro 13×2 (1 anno) autoricalcante, formato 29,7 × 23 cm.',
  },
  {
    sku: 'E 2102 A',
    name: 'Registro prima nota IVA corrispettivi 25×2 (2 anni) autoricalcante – Formato 29,7×23',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328210212',
    brand: 'Edipro',
    format: '29,7 x 23 cm',
    imageUrl: '/images/8f0739b7-da7e-4e04-803a-4965a5e9162d.jpg',
    description:
      'Registro prima nota IVA corrispettivi Edipro 25×2 (2 anni) autoricalcante, formato 29,7 × 23 cm.',
  },
  {
    sku: 'E 2108',
    name: 'Registro dei corrispettivi per mancato o irregolare funzionamento registratori di cassa – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/222fc477-e9ee-4642-9d17-8833d55d9f9d.jpg',
    description:
      'Registro dei corrispettivi Edipro per mancato o irregolare funzionamento dei registratori di cassa, formato 31 × 24,5 cm.',
  },
  // Contabilità IVA e Generale
  {
    sku: 'E 5349',
    name: 'Blocco prima nota cassa 100 fogli uso mano – Formato 14,8×22',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328534905',
    brand: 'Edipro',
    format: '14,8 x 22 cm',
    imageUrl: '/images/86e56334-f38d-4d6e-b0aa-2ef9b6fc565a.jpg',
    description:
      'Blocco prima nota cassa Edipro 100 fogli uso mano, formato 14,8 × 22 cm.',
  },
  {
    sku: 'E 5349 A',
    name: 'Blocco prima nota cassa 50×2 autoricalcante – Formato 14,8×22',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328534912',
    brand: 'Edipro',
    format: '14,8 x 22 cm',
    imageUrl: '/images/c2cfacd0-627a-4182-a211-497694042b2a.jpg',
    description:
      'Blocco prima nota cassa Edipro 50×2 autoricalcante, formato 14,8 × 22 cm.',
  },
  {
    sku: 'E 5350',
    name: 'Blocco prima nota cassa 50×2 autoricalcante (cassa-banca) – Formato 22×29,7',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328535001',
    brand: 'Edipro',
    format: '22 x 29,7 cm',
    imageUrl: '/images/f8291f0e-e4a5-43e8-964b-583c72260f0a.jpg',
    description:
      'Blocco prima nota cassa Edipro 50×2 autoricalcante (cassa-banca), formato 22 × 29,7 cm.',
  },
  {
    sku: 'E 5356',
    name: 'Blocco prima nota cassa 100 fogli uso mano (entrata – uscita – IVA) – Formato 29,7×22',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328535605',
    brand: 'Edipro',
    format: '29,7 x 22 cm',
    imageUrl: '/images/8ccdad5c-d9b7-4310-b271-c0044ef12a1c.jpg',
    description:
      'Blocco prima nota cassa Edipro 100 fogli uso mano (entrata – uscita – IVA), formato 29,7 × 22 cm.',
  },
  {
    sku: 'E 5356 A',
    name: 'Blocco prima nota cassa 50×2 autoricalcante (entrate – uscite - IVA) – Formato 29,7×22',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328535612',
    brand: 'Edipro',
    format: '29,7 x 22 cm',
    imageUrl: '/images/92c5e4d1-0e14-4191-8a5d-6fad90ab6ad3.jpg',
    description:
      'Blocco prima nota cassa Edipro 50×2 autoricalcante (entrate – uscite - IVA), formato 29,7 × 22 cm.',
  },
  {
    sku: 'E 5359 A',
    name: 'Blocco prima nota cassa 50×2 autoricalcante (entrate – uscite) – Formato 29,7×22',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328535919',
    brand: 'Edipro',
    format: '29,7 x 22 cm',
    imageUrl: '/images/ee4bb8de-1d14-4b04-b9fd-ff408aed5277.jpg',
    description:
      'Blocco prima nota cassa Edipro 50×2 autoricalcante (entrate – uscite), formato 29,7 × 22 cm.',
  },
  {
    sku: 'E4033',
    name: 'Scadenzario effetti passivi con spirale e indici plastificati 36 fogli – Formato 24×17',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/718ff514-7368-4dc4-85c2-0055ca641fbf.jpg',
    description:
      'Scadenzario effetti passivi Edipro con spirale e indici plastificati, 36 fogli, formato 24 × 17 cm.',
  },
  // Stampati Fiscali
  {
    sku: 'E 5567 C',
    name: 'Blocco ricevuta di pagamento per attività sportive 50×2 autoricalcante – Formato 9,9×17',
    subcategory: MODULISTICA_SUB_STAMPATI_FISCALI,
    ean: '8023328556716',
    brand: 'Edipro',
    format: '9,9 x 17 cm',
    imageUrl: '/images/E5567C.jpg',
    description:
      'Blocco ricevuta di pagamento per attività sportive Edipro 50×2 autoricalcante, formato 9,9 × 17 cm.',
  },
  {
    sku: 'E 5275 CN',
    name: 'Ricevuta Sanitaria 50x2 autoricalcanti - Formato 9,9x17',
    subcategory: MODULISTICA_SUB_STAMPATI_FISCALI,
    ean: '8023328527518',
    brand: 'Edipro',
    format: '9,9 x 17 cm',
    imageUrl: '/images/e67b1190-6a40-443a-b831-8a4fdcddcb62.jpg',
    description:
      'Ricevuta sanitaria Edipro 50×2 autoricalcanti, formato 9,9 × 17 cm.',
  },
  // Contabilità IVA e Generale — registri contabili
  {
    sku: 'E4034',
    name: 'Scadenzario effetti attivi con spirale e indici plastificati 36 fogli – Formato 24×17',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/26586a3f-bcdc-47a9-8522-879efc5ee053.jpg',
    description:
      'Scadenzario effetti attivi Edipro con spirale e indici plastificati, 36 fogli, formato 24 × 17 cm.',
  },
  {
    sku: 'E2656',
    name: 'Registro dare/avere/saldo 96 pagine – Formato 17×12',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '17 x 12 cm',
    imageUrl: '/images/6dd78a36-4f78-4b7f-874d-1b343db3ed31.jpg',
    description: 'Registro dare/avere/saldo Edipro, 96 pagine, formato 17 × 12 cm.',
  },
  {
    sku: 'E2666',
    name: 'Registro due colonne 96 pagine – Formato 24×17',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/E2666.jpg',
    description: 'Registro due colonne Edipro, 96 pagine, formato 24 × 17 cm.',
  },
  {
    sku: 'E2686',
    name: 'Registro cassa entrate/uscite 96 pagine – Formato 24×17',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/8016ed36-fec6-4814-9ee1-a52d9f4de98a.jpg',
    description: 'Registro cassa entrate/uscite Edipro, 96 pagine, formato 24 × 17 cm.',
  },
  {
    sku: 'E2769',
    name: 'Registro 3 colonne 96 pagine – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/55037817-9ba0-4a46-ab8e-bd40cd82a800.jpg',
    description: 'Registro 3 colonne Edipro, 96 pagine, formato 31 × 24,5 cm.',
  },
  // Contabilità IVA e Generale — registri fiscali
  {
    sku: 'E2172',
    name: 'Giornale degli affari 96 pagine – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/5ba2c8ee-973b-4456-96b3-aac779f14a2c.jpg',
    description: 'Giornale degli affari Edipro, 96 pagine, formato 31 × 24,5 cm.',
  },
  {
    sku: 'E2103',
    name: 'Registro IVA corrispettivi 15 pagine numerate – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/5fb4c36a-99b6-415e-966e-86f40125e00d.jpg',
    description:
      'Registro IVA corrispettivi Edipro, 15 pagine numerate, formato 31 × 24,5 cm.',
  },
  {
    sku: 'E2117',
    name: 'Registro acquisti beni usati 23 pagine numerate – Formato 31×24,5',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    brand: 'Edipro',
    format: '31 x 24,5 cm',
    imageUrl: '/images/ec49d2be-fc99-4a91-8e29-55278111be90.jpg',
    description:
      'Registro acquisti beni usati Edipro, 23 pagine numerate, formato 31 × 24,5 cm.',
  },
  // Contabilità IVA e Generale — schede
  {
    sku: 'E 3399',
    name: 'Schede - 2 colonne - 24 x 17 cm (verticale) - Edipro - conf. 100 pezzi',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328339906',
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/0f73bb8f-8dbc-4b0a-bed3-69a6b148ad4f.jpg',
    description:
      'Schede contabili Edipro a 2 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3369',
    name: 'Schede - 3 colonne - 17 x 24 cm orizzontale - Edipro - conf. 100 pezzi',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328336905',
    brand: 'Edipro',
    format: '17 x 24 cm',
    imageUrl: '/images/67e70187-52d7-4788-bd05-54495c728c0c.jpg',
    description:
      'Schede contabili Edipro a 3 colonne, formato 17 × 24 cm orizzontale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3259',
    name: 'Schede - 3 colonne - 15 x 21 cm orizzontale - Edipro - conf. 100 pezzi',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328325909',
    brand: 'Edipro',
    format: '15 x 21 cm',
    imageUrl: '/images/80e3b5c6-de8e-4d92-bcb9-5dfe75970e79.jpg',
    description:
      'Schede contabili Edipro a 3 colonne, formato 15 × 21 cm orizzontale, confezione da 100 pezzi.',
  },
  {
    sku: 'E 3406',
    name: 'Schede - 3 colonne - 24 x 17 cm verticale - Edipro - conf. 100 pezzi',
    subcategory: MODULISTICA_SUB_CONTABILITA,
    ean: '8023328340605',
    brand: 'Edipro',
    format: '24 x 17 cm',
    imageUrl: '/images/9754b9bb-7d4e-4967-a8dd-a99dde182fe8.jpg',
    description:
      'Schede contabili Edipro a 3 colonne, formato 24 × 17 cm verticale, confezione da 100 pezzi.',
  },
  // Stampati Fiscali — ricevute fiscali / fatture
  {
    sku: 'E 5348 C',
    name: 'Blocco fattura/ricevuta fiscale barbiere 50×2 autoricalcante – Formato 22×9,9',
    subcategory: MODULISTICA_SUB_STAMPATI_FISCALI,
    ean: '8023328534813',
    brand: 'Edipro',
    format: '22 x 9,9 cm',
    imageUrl: '/images/ad8ad89c-fa28-4b8f-bee6-9be1d057cd55.jpg',
    description:
      'Blocco fattura/ricevuta fiscale barbiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.',
  },
  {
    sku: 'E 5342 C',
    name: 'Blocco fattura/ricevuta fiscale parrucchiere 50×2 autoricalcante – Formato 22×9,9',
    subcategory: MODULISTICA_SUB_STAMPATI_FISCALI,
    ean: '8023328534219',
    brand: 'Edipro',
    format: '22 x 9,9 cm',
    imageUrl: '/images/dc4d3188-fbf5-4645-b85c-0ed980e37de4.jpg',
    description:
      'Blocco fattura/ricevuta fiscale parrucchiere Edipro 50×2 autoricalcante, formato 22 × 9,9 cm.',
  },
  {
    sku: 'E 5340 C',
    name: 'Blocco fattura/ricevuta fiscale generica 50×2 autoricalcante – Formato 22×14,8',
    subcategory: MODULISTICA_SUB_STAMPATI_FISCALI,
    ean: '8023328534011',
    brand: 'Edipro',
    format: '22 x 14,8 cm',
    imageUrl: '/images/82aed2d3-b9a7-4813-8183-2abd6fee6add.jpg',
    description:
      'Blocco fattura/ricevuta fiscale generica Edipro 50×2 autoricalcante, formato 22 × 14,8 cm.',
  },
] as const

function toOfficeProduct(item: ModulisticaCatalogItem): OfficeProduct {
  const features: Record<string, string> = {
    Tipologia: item.subcategory,
    Marchio: item.brand,
  }
  if (item.format) features.Formato = item.format
  if (item.ean) features.EAN = item.ean

  return {
    id: item.sku,
    name: item.name,
    brand: item.brand,
    producerCode: item.sku,
    category: MODULISTICA_CATEGORY,
    subcategory: item.subcategory,
    format: item.format,
    ean: item.ean,
    mainFeatures: features,
    imageUrl: item.imageUrl?.trim() || MODULISTICA_HUB_COVER_IMAGE_URL,
    description: item.description,
    price: 0,
  }
}

export function buildModulisticaOfficeProducts(subcategory?: string): OfficeProduct[] {
  const expected = canonicalizeModulisticaSubcategory(subcategory)
  return MODULISTICA_CATALOG.filter((item) => {
    if (!expected) return true
    return item.subcategory === expected
  }).map(toOfficeProduct)
}

export function matchesModulisticaSubcategoryFilter(
  product: { subcategory?: string | null },
  subcategory: string,
): boolean {
  const expected = canonicalizeModulisticaSubcategory(subcategory)
  if (!expected) return true
  const actual = canonicalizeModulisticaSubcategory(product.subcategory)
  return actual === expected
}

export function isModulisticaProduct(
  product: Pick<OfficeProduct, 'id' | 'producerCode' | 'category' | 'name'> | null | undefined,
): boolean {
  if (!product) return false
  const cat = (product.category ?? '').trim().toLowerCase()
  if (cat === MODULISTICA_CATEGORY_NORM) return true
  const sku = String(product.producerCode || product.id || '').trim().toUpperCase()
  return MODULISTICA_CATALOG.some((item) => item.sku.toUpperCase() === sku)
}

export function resolveModulisticaProductByCatalogKey(key: string): OfficeProduct | null {
  const k = key.trim().toUpperCase()
  if (!k) return null
  const item = MODULISTICA_CATALOG.find((p) => p.sku.toUpperCase() === k)
  return item ? toOfficeProduct(item) : null
}

export function mergeModulisticaListingProducts(
  fromCatalog: OfficeProduct[],
  subcategory?: string,
): OfficeProduct[] {
  const expected = canonicalizeModulisticaSubcategory(subcategory)
  const synthetic = buildModulisticaOfficeProducts(expected || undefined)
  const fromDb = fromCatalog
    .filter((p) => {
      const cat = normalizeModulisticaCategory(p.category)
      if (cat !== MODULISTICA_CATEGORY) return false
      if (expected) return matchesModulisticaSubcategoryFilter(p, expected)
      return true
    })
    .map((p) => {
      const sku = String(p.producerCode || p.id || '').trim().toUpperCase()
      const catalogItem = MODULISTICA_CATALOG.find((item) => item.sku.toUpperCase() === sku)
      const catalogImage = catalogItem?.imageUrl?.trim()
      const dbImage = (p.imageUrl ?? '').trim()
      const useCatalogImage =
        Boolean(catalogImage) &&
        (!dbImage ||
          dbImage === MODULISTICA_HUB_COVER_IMAGE_URL ||
          dbImage.endsWith('/cancelleria-penne.jpg'))

      return {
        ...p,
        subcategory: canonicalizeModulisticaSubcategory(p.subcategory) || p.subcategory,
        imageUrl: useCatalogImage ? catalogImage! : p.imageUrl,
        ean: p.ean || catalogItem?.ean,
        format: p.format || catalogItem?.format,
      }
    })
  const dbSkus = new Set(
    fromDb.map((p) => String(p.producerCode || p.id || '').trim().toUpperCase()).filter(Boolean),
  )
  const missing = synthetic.filter((p) => !dbSkus.has(p.id.toUpperCase()))
  return [...missing, ...fromDb]
}

function normalizeModulisticaCategory(raw: string): string {
  const t = raw.trim()
  if (t.localeCompare(MODULISTICA_CATEGORY, 'it', { sensitivity: 'base' }) === 0) {
    return MODULISTICA_CATEGORY
  }
  return t
}
