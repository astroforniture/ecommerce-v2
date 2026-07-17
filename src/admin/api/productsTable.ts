import { getSupabaseBrowserClient } from "../../lib/supabaseClient";

export type CreateProductRowInput = {
  sku: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  brand?: string;
  colors: string[];
};

export type UpdateProductRowInput = {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

function variantsFromColorLabels(colors: string[]): unknown | null {
  const labels = colors.map((c) => c.trim()).filter(Boolean);
  if (!labels.length) return null;
  return labels.map((label) => ({ label }));
}

/**
 * Solo tabella `public.products` (backoffice). Nessun altro schema/tabella.
 */
export async function insertProductRow(
  input: CreateProductRowInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase non configurato (env mancanti)." };
  }

  const sku = input.sku.trim();
  const name = input.name.trim();
  const category = input.category.trim();
  if (!sku || !name || !category) {
    return { ok: false, error: "SKU, nome e categoria sono obbligatori." };
  }

  const row = {
    sku,
    name,
    category,
    description: input.description?.trim() || null,
    price:
      input.price !== undefined && Number.isFinite(input.price)
        ? input.price
        : null,
    stock:
      input.stock !== undefined && Number.isFinite(input.stock)
        ? Math.max(0, Math.floor(input.stock))
        : null,
    image_url: input.imageUrl?.trim() || null,
    brand: (input.brand?.trim() || "STARLINE") || null,
    variants: variantsFromColorLabels(input.colors),
  };

  const res = await supabase.from("products").insert(row).select("id").single();
  if (res.error) {
    return { ok: false, error: res.error.message };
  }
  const id = res.data?.id;
  if (id == null) {
    return { ok: false, error: "Nessun id restituito dall'inserimento." };
  }
  return { ok: true, id: String(id) };
}

export async function updateProductRow(
  id: string,
  input: UpdateProductRowInput,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase non configurato (env mancanti)." };
  }

  const payload = {
    name: input.name.trim(),
    category: input.category.trim(),
    description: input.description.trim() || null,
    price: Number.isFinite(input.price) ? input.price : null,
    stock: Math.max(0, Math.floor(input.stock)),
    image_url: input.imageUrl?.trim() || null,
  };

  const res = await supabase.from("products").update(payload).eq("id", id);
  if (res.error) {
    return { ok: false, error: res.error.message };
  }
  return { ok: true };
}

export async function deleteProductRow(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Supabase non configurato (env mancanti)." };
  }

  const res = await supabase.from("products").delete().eq("id", id);
  if (res.error) {
    return { ok: false, error: res.error.message };
  }
  return { ok: true };
}
