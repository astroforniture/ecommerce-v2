import type { LucideIcon } from 'lucide-react'
import { Briefcase, FileStack, FolderArchive, PenLine, Printer } from 'lucide-react'
import { CARTUCCE_TONER_COVER_IMAGE_URL } from './cartucceTonerProducts'
import { DISTRUGGIDOCUMENTI_COVER_IMAGE_URL } from './distruggidocumentiProducts'
import { CARTUCCE_TONER_CATEGORY, cartucceTonerCategoryHref } from '../lib/officeCategories'
import { macchineUfficioHubPath } from '../lib/macchineUfficioRoutes'

export type FeaturedCategorySpotlight = {
  id: string
  title: string
  description: string
  href: string
  imageUrl: string
  Icon: LucideIcon
}

export const FEATURED_CATEGORY_SPOTLIGHT_ROTATE_MS = 10_000
export const FEATURED_CATEGORY_SPOTLIGHT_FADE_MS = 400

/** Foto risme carta (banner home, categoria Carta). */
export const CARTA_CATEGORY_SPOTLIGHT_IMAGE_URL = '/carta-risme-evidenza.png'

/** Categorie principali in rotazione sul banner «Categoria in evidenza» (home). */
export const FEATURED_CATEGORY_SPOTLIGHTS: readonly FeaturedCategorySpotlight[] = [
  {
    id: 'cartucce-toner',
    title: CARTUCCE_TONER_CATEGORY,
    description:
      'Cartucce inkjet, toner laser e consumabili per stampanti e multifunzione. Originali e compatibili, con assistenza nella scelta del modello giusto.',
    href: cartucceTonerCategoryHref(),
    imageUrl: CARTUCCE_TONER_COVER_IMAGE_URL,
    Icon: Printer,
  },
  {
    id: 'carta',
    title: 'Carta',
    description:
      'Carta per fotocopie, risme per stampanti laser e inkjet, rotoli per plotter e moduli continui. Massima resa cromatica e spessori per ogni esigenza.',
    href: '/office-products?category=Carta',
    imageUrl: CARTA_CATEGORY_SPOTLIGHT_IMAGE_URL,
    Icon: FileStack,
  },
  {
    id: 'cancelleria',
    title: 'Cancelleria',
    description:
      "Penne, matite, evidenziatori, quaderni, blocchi note e piccoli accessori da scrivania. Tutto l'occorrente quotidiano per la produttività del tuo team.",
    href: '/office-products?category=Cancelleria',
    imageUrl: '/cancelleria-penne.jpg',
    Icon: PenLine,
  },
  {
    id: 'archivio',
    title: 'Archivio ufficio',
    description:
      "Raccoglitori, registratori con meccanismo a leva, faldoni, cartelline e scatole d'archivio. Organizza i tuoi documenti in modo ordinato e sicuro.",
    href: '/office-products?category=Archivio',
    imageUrl: 'https://odmultimedia.eu/immagini/MD/25630.jpg',
    Icon: FolderArchive,
  },
  {
    id: 'macchine-ufficio',
    title: 'Macchine per Ufficio',
    description:
      "Calcolatrici, distruggidocumenti, plastificatrici e rilegatrici professionali. Gli strumenti ideali per ottimizzare l'efficienza del tuo spazio di lavoro.",
    href: macchineUfficioHubPath(),
    imageUrl: DISTRUGGIDOCUMENTI_COVER_IMAGE_URL,
    Icon: Briefcase,
  },
] as const
