import type { OfficeProduct } from '../types/officeProduct'
import { roundMoney2 } from '../lib/cartMerchandiseIvato'

const VAT_MULTIPLIER = 1.22

function ivatoToImponible(unitIvato: number): number {
  return roundMoney2(unitIvato / VAT_MULTIPLIER)
}

/** Prodotti economici fissi per l'upsell nel pannello carrello (salva-spedizione). */
export const FREE_SHIPPING_DRAWER_UPSELL_PRODUCTS: readonly OfficeProduct[] = [
  {
    id: 'AF-UPSELL-BUSTE-FORATE-A4',
    name: 'Buste forate trasparenti conf. 100 - A4',
    brand: 'Blasetti',
    producerCode: 'AF-UPSELL-BUSTE-FORATE-A4',
    category: 'Cancelleria',
    subcategory: 'Buste',
    mainFeatures: { Formato: 'A4', Confezione: '100 pz' },
    imageUrl: 'https://odmultimedia.eu/immagini/MD/39542.jpg',
    price: ivatoToImponible(4.5),
  },
  {
    id: 'AF-UPSELL-PENNA-BIANCHETTO',
    name: 'Penna Correttore a bianchetto',
    brand: 'Papermate',
    producerCode: 'AF-UPSELL-PENNA-BIANCHETTO',
    category: 'Cancelleria',
    subcategory: 'Correttori',
    mainFeatures: { Tipologia: 'Correttore a bianchetto' },
    imageUrl: 'https://odmultimedia.eu/immagini/MD/28908.jpg',
    price: ivatoToImponible(3.2),
  },
  {
    id: 'AF-UPSELL-EVIDENZIATORI-4PZ',
    name: 'Evidenziatori fluorescenti - conf. 4 pz',
    brand: 'Stabilo',
    producerCode: 'AF-UPSELL-EVIDENZIATORI-4PZ',
    category: 'Cancelleria',
    subcategory: 'Evidenziatori',
    mainFeatures: { Confezione: '4 pezzi' },
    imageUrl: 'https://odmultimedia.eu/immagini/MD/60421.jpg',
    price: ivatoToImponible(4.9),
  },
] as const

export function getFreeShippingDrawerUpsellProducts(
  cartProductIds: ReadonlySet<string>,
  limit = 3,
): OfficeProduct[] {
  return FREE_SHIPPING_DRAWER_UPSELL_PRODUCTS.filter(
    (product) => !cartProductIds.has(product.id),
  ).slice(0, limit)
}
