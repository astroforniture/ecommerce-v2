import {
  getMacroLabelIt,
  type MedicalProduct,
} from '../data/medicalProducts'
import { getSupabaseBrowserClient } from '../lib/supabaseClient'
import type { GimaProduct } from '../types/gimaProduct'

type MedicalProductRow = {
  id_text: string
  code: string
  sku: string
  name: string
  category: string
  selling_unit: string
  medical_type: string
  rdm: string
  cnd: string
  ean: string
  description: string | null
  price: number | string | null
  macro_id: string
  gima_department_label: string
  image_url: string
  cta: string | null
}

function mapRowToGimaProduct(row: MedicalProductRow): GimaProduct {
  const raw =
    typeof row.price === 'string' ? Number.parseFloat(row.price) : row.price
  const parsedPrice = Number.isFinite(raw) ? Number(raw) : undefined
  return {
    id: row.id_text,
    code: row.code,
    name: row.name,
    category: row.category,
    sellingUnit: row.selling_unit,
    medicalType: row.medical_type,
    rdm: row.rdm,
    cnd: row.cnd,
    ean: row.ean,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    price: parsedPrice,
  }
}

function mapGimaToMedicalProduct(
  gima: GimaProduct,
  row: Pick<MedicalProductRow, 'macro_id' | 'gima_department_label' | 'cta'>,
): MedicalProduct {
  const macroLabel = getMacroLabelIt(row.macro_id) ?? row.macro_id
  const cta =
    row.cta === 'quote' || row.cta === 'buy' ? row.cta : undefined
  return {
    sku: gima.code,
    name: gima.name,
    fullDescription: gima.description ?? '',
    price: gima.price ?? 0,
    categoryPath: [macroLabel, row.gima_department_label],
    macroId: row.macro_id,
    imageUrl: gima.imageUrl,
    cta,
  }
}

export async function fetchMedicalProductsFromSupabase(): Promise<
  MedicalProduct[]
> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    throw new Error(
      'Supabase non configurato (mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)',
    )
  }

  const { data, error } = await supabase
    .from('medical_products')
    .select(
      'id_text,code,sku,name,category,selling_unit,medical_type,rdm,cnd,ean,description,price,macro_id,gima_department_label,image_url,cta',
    )
    .order('sku')

  if (error) throw error

  return (
    (data as MedicalProductRow[] | null)?.map((row) =>
      mapGimaToMedicalProduct(mapRowToGimaProduct(row), row),
    ) ?? []
  )
}

/** Una lista per ogni `macroId` noto; ignora prodotti con macro sconosciuta. */
export function bucketMedicalProductsByMacro(
  products: MedicalProduct[],
  knownMacroIds: readonly string[],
): Map<string, MedicalProduct[]> {
  const map = new Map<string, MedicalProduct[]>()
  for (const id of knownMacroIds) {
    map.set(id, [])
  }
  for (const p of products) {
    const mid = p.macroId
    if (!mid || !map.has(mid)) continue
    map.get(mid)!.push(p)
  }
  return map
}
