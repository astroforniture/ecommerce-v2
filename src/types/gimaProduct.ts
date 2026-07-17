export interface GimaProduct {
  id: string // Sara uguale al codice
  code: string
  name: string
  category: string
  sellingUnit: string
  medicalType: string
  rdm: string
  cnd: string
  ean: string
  imageUrl: string
  description?: string
  price?: number
}
