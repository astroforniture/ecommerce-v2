import {
  CARTA_SUBCATEGORY_A3,
  CARTA_SUBCATEGORY_A4,
  CARTA_SUBCATEGORY_TERMICA,
  cartaCategoryHref,
  cartucceTonerCategoryHref,
  PRODOTTI_IGIENE_CATEGORY,
  prodottiIgieneCategoryHref,
  SICUREZZA_CATEGORY,
} from '../lib/officeCategories'
import {
  IGIENE_SUBCATEGORIES,
  prodottiIgieneSubcategoryHref,
} from '../lib/prodottiIgieneSubcategories'
import {
  SICUREZZA_SUBCATEGORIES,
  sicurezzaCategoryHref,
} from '../lib/sicurezzaCatalog'
import {
  MODULISTICA_SUBCATEGORIES,
  modulisticaCategoryHref,
} from './modulisticaCatalog'
import {
  MACCHINE_SUB_CASSE_DITRON_LABEL,
  macchineUfficioCasseDitronListingPath,
} from './casseDitronProducts'
import {
  MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
  macchineUfficioDistruggiDocumentiListingPath,
} from './distruggidocumentiProducts'
import {
  MACCHINE_SUB_ETICHETTATRICI_LABEL,
  macchineUfficioEtichettatriciListingPath,
} from './macchineEtichettatrici'
import { macchineUfficioHubPath } from '../lib/macchineUfficioRoutes'
import { SERVIZI_NAV_ITEMS } from './serviziCatalog'
import {
  CANCELLERIA_SUB_BUSTE,
  CANCELLERIA_VIEW_BUSTE,
  cancelleriaBusteListingPath,
} from './sacbollBuste'
import {
  CANCELLERIA_SUB_SHOPPER,
  CANCELLERIA_VIEW_SHOPPER,
  cancelleriaShopperHubPath,
} from './shopperCancelleria'
import { cancelleriaPileListingPath } from './pileProducts'
import { cancelleriaQuaderniListingPath } from './quaderniProducts'
import { cancelleriaTimbriListingPath } from '../lib/timbroAziendeFarmacieProduct'

export type MegaMenuPreviewSource =
  | { kind: 'office-subcategory'; category: string; subcategory: string }
  | { kind: 'cancelleria-hub'; hub: string }
  | { kind: 'macchine'; catalog: 'distruggi' | 'etichettatrici' | 'casse' | 'hub' }
  | { kind: 'category'; category: string }
  | { kind: 'none' }

export type MegaMenuSubItem = {
  id: string
  label: string
  href: string
  preview: MegaMenuPreviewSource
}

export type MegaMenuCategory = {
  id: string
  label: string
  href: string
  subs: MegaMenuSubItem[]
}

const ARCHIVIO_RACCOGLITORI_SUBCATEGORY = 'Raccoglitori Archivio' as const

/** Sottocategorie Mega Menu Archivio (etichetta UI → sottocategoria filtro/URL). */
const ARCHIVIO_MEGA_SUBS: ReadonlyArray<{ label: string; subcategory: string }> = [
  { label: 'Scatole Archivio', subcategory: 'Scatole Archivio' },
  { label: 'Raccoglitori', subcategory: ARCHIVIO_RACCOGLITORI_SUBCATEGORY },
  { label: 'Cartelle archivio con lacci', subcategory: 'Cartelle archivio con lacci' },
  { label: 'Cartelline in carta', subcategory: 'Cartelline in carta' },
  { label: 'Buste Trasparenti', subcategory: 'Buste Trasparenti' },
]

function archivioHref(subcategory?: string): string {
  const params = new URLSearchParams()
  params.set('category', 'Archivio')
  if (subcategory?.trim()) params.set('subcategory', subcategory.trim())
  return `/office-products?${params.toString()}`
}

function cancelleriaHubHref(hub: string): string {
  return `/office-products?category=Cancelleria&cancelleriaView=${encodeURIComponent(hub)}`
}

const CANCELLERIA_SUBS: MegaMenuSubItem[] = [
  {
    id: 'canc-nastri',
    label: 'Nastri adesivi',
    href: cancelleriaHubHref('nastri'),
    preview: { kind: 'cancelleria-hub', hub: 'nastri' },
  },
  {
    id: 'canc-scrittura',
    label: 'Penne, Pennarelli e Matite',
    href: cancelleriaHubHref('scrittura'),
    preview: { kind: 'cancelleria-hub', hub: 'scrittura' },
  },
  {
    id: 'canc-cucitrici',
    label: 'Cucitrici',
    href: cancelleriaHubHref('cucitrici'),
    preview: { kind: 'cancelleria-hub', hub: 'cucitrici' },
  },
  {
    id: 'canc-evidenziatori',
    label: 'Evidenziatori',
    href: cancelleriaHubHref('evidenziatori'),
    preview: { kind: 'cancelleria-hub', hub: 'evidenziatori' },
  },
  {
    id: 'canc-calcolatrici',
    label: 'Calcolatrici',
    href: cancelleriaHubHref('calcolatrici'),
    preview: { kind: 'cancelleria-hub', hub: 'calcolatrici' },
  },
  {
    id: 'canc-pile',
    label: 'Pile',
    href: cancelleriaPileListingPath(),
    preview: { kind: 'cancelleria-hub', hub: 'pile' },
  },
  {
    id: 'canc-quaderni',
    label: 'Quaderni',
    href: cancelleriaQuaderniListingPath(),
    preview: { kind: 'cancelleria-hub', hub: 'quaderni' },
  },
  {
    id: 'canc-timbri',
    label: 'Timbri',
    href: cancelleriaTimbriListingPath(),
    preview: { kind: 'cancelleria-hub', hub: 'timbri' },
  },
  {
    id: 'canc-buste',
    label: CANCELLERIA_SUB_BUSTE,
    href: cancelleriaBusteListingPath(),
    preview: { kind: 'cancelleria-hub', hub: CANCELLERIA_VIEW_BUSTE },
  },
  {
    id: 'canc-shopper',
    label: CANCELLERIA_SUB_SHOPPER,
    href: cancelleriaShopperHubPath(),
    preview: { kind: 'cancelleria-hub', hub: CANCELLERIA_VIEW_SHOPPER },
  },
]

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    id: 'archivio',
    label: 'Archivio ufficio',
    href: archivioHref(),
    subs: ARCHIVIO_MEGA_SUBS.map(({ label, subcategory }) => ({
      id: `arch-${subcategory}`,
      label,
      href: archivioHref(subcategory),
      preview: { kind: 'office-subcategory', category: 'Archivio', subcategory },
    })),
  },
  {
    id: 'cancelleria',
    label: 'Cancelleria',
    href: '/office-products?category=Cancelleria',
    subs: CANCELLERIA_SUBS,
  },
  {
    id: 'modulistica',
    label: 'Modulistica',
    href: modulisticaCategoryHref(),
    subs: MODULISTICA_SUBCATEGORIES.map((label) => ({
      id: `mod-${label}`,
      label,
      href: modulisticaCategoryHref(label),
      preview: { kind: 'office-subcategory', category: 'Modulistica', subcategory: label },
    })),
  },
  {
    id: 'macchine',
    label: 'Macchine per Ufficio',
    href: macchineUfficioHubPath(),
    subs: [
      {
        id: 'mac-hub',
        label: 'Panoramica',
        href: macchineUfficioHubPath(),
        preview: { kind: 'macchine', catalog: 'hub' },
      },
      {
        id: 'mac-distruggi',
        label: MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
        href: macchineUfficioDistruggiDocumentiListingPath(),
        preview: { kind: 'macchine', catalog: 'distruggi' },
      },
      {
        id: 'mac-etichettatrici',
        label: MACCHINE_SUB_ETICHETTATRICI_LABEL,
        href: macchineUfficioEtichettatriciListingPath(),
        preview: { kind: 'macchine', catalog: 'etichettatrici' },
      },
      {
        id: 'mac-casse',
        label: MACCHINE_SUB_CASSE_DITRON_LABEL,
        href: macchineUfficioCasseDitronListingPath(),
        preview: { kind: 'macchine', catalog: 'casse' },
      },
    ],
  },
  {
    id: 'carta',
    label: 'Carta',
    href: cartaCategoryHref(),
    subs: [
      {
        id: 'carta-a4',
        label: CARTA_SUBCATEGORY_A4,
        href: cartaCategoryHref(CARTA_SUBCATEGORY_A4),
        preview: {
          kind: 'office-subcategory',
          category: 'Carta',
          subcategory: CARTA_SUBCATEGORY_A4,
        },
      },
      {
        id: 'carta-a3',
        label: CARTA_SUBCATEGORY_A3,
        href: cartaCategoryHref(CARTA_SUBCATEGORY_A3),
        preview: {
          kind: 'office-subcategory',
          category: 'Carta',
          subcategory: CARTA_SUBCATEGORY_A3,
        },
      },
      {
        id: 'carta-termica',
        label: CARTA_SUBCATEGORY_TERMICA,
        href: cartaCategoryHref(CARTA_SUBCATEGORY_TERMICA),
        preview: {
          kind: 'office-subcategory',
          category: 'Carta',
          subcategory: CARTA_SUBCATEGORY_TERMICA,
        },
      },
    ],
  },
  {
    id: 'cartucce',
    label: 'Cartucce & Toner',
    href: cartucceTonerCategoryHref(),
    subs: [
      {
        id: 'cartucce-all',
        label: 'Tutti i prodotti',
        href: cartucceTonerCategoryHref(),
        preview: { kind: 'category', category: 'Cartucce & Toner' },
      },
    ],
  },
  {
    id: 'igiene',
    label: PRODOTTI_IGIENE_CATEGORY,
    href: prodottiIgieneCategoryHref(),
    subs: [
      {
        id: 'igiene-all',
        label: 'Tutti i prodotti',
        href: prodottiIgieneCategoryHref(),
        preview: { kind: 'category', category: PRODOTTI_IGIENE_CATEGORY },
      },
      ...IGIENE_SUBCATEGORIES.map((subcategory) => ({
        id: `igiene-${subcategory}`,
        label: subcategory,
        href: prodottiIgieneSubcategoryHref(subcategory),
        preview: {
          kind: 'office-subcategory' as const,
          category: PRODOTTI_IGIENE_CATEGORY,
          subcategory,
        },
      })),
    ],
  },
  {
    id: 'sicurezza',
    label: SICUREZZA_CATEGORY,
    href: sicurezzaCategoryHref(),
    subs: [
      {
        id: 'sicurezza-all',
        label: 'Tutti i prodotti',
        href: sicurezzaCategoryHref(),
        preview: { kind: 'category', category: SICUREZZA_CATEGORY },
      },
      ...SICUREZZA_SUBCATEGORIES.map((subcategory) => ({
        id: `sicurezza-${subcategory}`,
        label: subcategory,
        href: sicurezzaCategoryHref(subcategory),
        preview: {
          kind: 'office-subcategory' as const,
          category: SICUREZZA_CATEGORY,
          subcategory,
        },
      })),
    ],
  },
  {
    id: 'servizi',
    label: 'Servizi',
    href: '/servizi/timbri-personalizzati',
    subs: SERVIZI_NAV_ITEMS.map((item) => ({
      id: `srv-${item.href}`,
      label: item.label,
      href: item.href,
      preview: { kind: 'none' },
    })),
  },
]
