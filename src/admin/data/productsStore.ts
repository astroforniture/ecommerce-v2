import { z } from "zod";

export const adminProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().finite().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).default([]),
  category: z.string().min(1),
});

export type AdminProduct = z.infer<typeof adminProductSchema>;

const storageKey = "admin_products_v1";

function cuidLike() {
  // Good enough for client-side demo CRUD.
  return `c_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function readAll(): AdminProduct[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = z.array(adminProductSchema).safeParse(parsed);
    return list.success ? list.data : [];
  } catch {
    return [];
  }
}

function writeAll(items: AdminProduct[]) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

export function ensureAdminProductsSeeded() {
  const existing = readAll();
  if (existing.length > 0) return;
  writeAll([
    {
      id: cuidLike(),
      name: "Sedia Ergonomica Pro",
      description: "Sedia ergonomica con supporto lombare regolabile.",
      price: 199.9,
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
      ],
      category: "Arredo Ufficio",
    },
    {
      id: cuidLike(),
      name: "Lampada LED Minimal",
      description: "Lampada da tavolo LED dimmerabile a basso consumo.",
      price: 59.5,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c"],
      category: "Illuminazione",
    },
  ]);
}

export async function listAdminProducts(): Promise<AdminProduct[]> {
  ensureAdminProductsSeeded();
  return readAll().sort((a, b) => a.name.localeCompare(b.name));
}

export type CreateAdminProductInput = Omit<AdminProduct, "id">;

export async function createAdminProduct(
  input: CreateAdminProductInput,
): Promise<AdminProduct> {
  const items = readAll();
  const created: AdminProduct = adminProductSchema.parse({
    ...input,
    id: cuidLike(),
  });
  items.unshift(created);
  writeAll(items);
  return created;
}

export type UpdateAdminProductInput = Partial<Omit<AdminProduct, "id">>;

export async function updateAdminProduct(
  id: string,
  patch: UpdateAdminProductInput,
): Promise<AdminProduct> {
  const items = readAll();
  const idx = items.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Prodotto non trovato.");
  const next = adminProductSchema.parse({ ...items[idx], ...patch, id });
  items[idx] = next;
  writeAll(items);
  return next;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const items = readAll();
  writeAll(items.filter((p) => p.id !== id));
}

