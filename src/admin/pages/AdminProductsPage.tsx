import { type FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";

import { fetchOfficeProductStocks } from "../../api/officeProductsSupabase";
import { useOfficeCatalog } from "../../hooks/useOfficeCatalog";
import {
  deleteProductRow,
  insertProductRow,
  updateProductRow,
} from "../api/productsTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import type { OfficeProduct } from "../../types/officeProduct";
import { ProductForm, type ProductFormValue } from "../components/ProductForm";

const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [queryText, setQueryText] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<OfficeProduct | null>(null);
  const [deleting, setDeleting] = useState<OfficeProduct | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [stock, setStock] = useState("");
  const [newColor, setNewColor] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const { products, isLoading, isError, error, refetch } = useOfficeCatalog(null, null);
  const stocksQuery = useQuery({
    queryKey: ["office-products-stocks"],
    queryFn: fetchOfficeProductStocks,
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.description ?? ""].some((s) =>
        s.toLowerCase().includes(q),
      ),
    );
  }, [products, queryText]);

  const stockById = stocksQuery.data ?? new Map<string, number>();

  const createMutation = useMutation({
    mutationFn: insertProductRow,
    onSuccess: async (res) => {
      if (!res.ok) {
        setCreateError(res.error ?? "Errore salvataggio prodotto");
        return;
      }
      setCreateError("");
      setCreateOpen(false);
      resetCreateForm();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["office-products"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-showcase"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-stocks"] }),
      ]);
      await refetch();
    },
    onError: (err) => {
      setCreateError((err as Error)?.message ?? "Errore salvataggio prodotto");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      value,
    }: {
      id: string;
      value: ProductFormValue;
    }) =>
      updateProductRow(id, {
        name: value.name,
        category: value.category,
        description: value.description,
        price: value.price,
        stock: value.stock,
        imageUrl: value.images[0]?.trim() || null,
      }),
    onSuccess: async (res) => {
      if (!res.ok) {
        setEditError(res.error ?? "Aggiornamento non riuscito");
        return;
      }
      setEditError("");
      setEditing(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["office-products"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-showcase"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-stocks"] }),
      ]);
      await refetch();
    },
    onError: (err) => {
      setEditError((err as Error)?.message ?? "Errore aggiornamento");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductRow,
    onSuccess: async (res) => {
      if (!res.ok) {
        setDeleteError(res.error ?? "Eliminazione non riuscita");
        return;
      }
      setDeleteError("");
      setDeleting(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["office-products"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-showcase"] }),
        queryClient.invalidateQueries({ queryKey: ["office-products-stocks"] }),
      ]);
      await refetch();
    },
    onError: (err) => {
      setDeleteError((err as Error)?.message ?? "Errore eliminazione");
    },
  });

  function resetCreateForm() {
    setName("");
    setDescription("");
    setSku("");
    setCategory("");
    setImageUrl("");
    setBasePrice("");
    setStock("");
    setNewColor("");
    setColors([]);
    setCreateError("");
  }

  function addColor() {
    const next = newColor.trim();
    if (!next) return;
    if (colors.includes(next)) return;
    setColors((prev) => [...prev, next]);
    setNewColor("");
  }

  function removeColor(color: string) {
    setColors((prev) => prev.filter((c) => c !== color));
  }

  function handleCreateSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number.parseFloat(basePrice.replace(",", "."));
    const stockNum = Number.parseInt(stock, 10);

    createMutation.mutate({
      sku: sku.trim(),
      name: name.trim(),
      category: category.trim(),
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      price: Number.isFinite(price) ? price : undefined,
      stock: Number.isFinite(stockNum) ? stockNum : undefined,
      colors,
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Prodotti</h1>
          <p className="mt-1 text-sm text-slate-600">
            Lettura e scrittura solo sulla tabella Supabase <code className="text-xs">products</code>.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Aggiungi Prodotto
        </Button>
      </header>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Catalogo</CardTitle>
            <CardDescription>
              {isLoading ? "Caricamento…" : `${filtered.length} prodotti`}
            </CardDescription>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="pl-9"
              placeholder="Cerca per nome, categoria, descrizione…"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prodotto</TableHead>
                  <TableHead className="text-right">Prezzo</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}>
                          <div className="h-8 animate-pulse rounded bg-slate-100" aria-hidden />
                        </TableCell>
                      </TableRow>
                    ))
                  : filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex min-w-[300px] items-center gap-3">
                            <div className="size-12 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{p.name}</p>
                              <Badge variant="default" className="mt-1">
                                {p.category}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900">
                          {typeof p.price === "number" ? eur.format(p.price) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {stockById.get(p.id) ?? "N/D"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" aria-label="Azioni riga prodotto">
                                <MoreHorizontal className="mr-1 size-4" />
                                Azioni
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => setEditing(p)}>
                                Modifica
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-700 focus:text-red-700"
                                onSelect={() => {
                                  setDeleteError("");
                                  setDeleting(p);
                                }}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Elimina
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {isError ? (
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-red-700" role="alert">
                {(error as Error)?.message ?? "Errore caricamento prodotti"}
              </p>
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                Riprova
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifica prodotto</DialogTitle>
            <DialogDescription>
              Aggiornamento righe in <code className="text-xs">public.products</code>.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <>
              <ProductForm
                defaultValue={{
                  id: editing.id,
                  name: editing.name,
                  category: editing.category,
                  description: editing.description ?? "",
                  price: editing.price ?? 0,
                  stock: stockById.get(editing.id) ?? 0,
                  images: editing.imageUrl ? [editing.imageUrl] : [],
                }}
                isSubmitting={updateMutation.isPending}
                onCancel={() => {
                  setEditError("");
                  setEditing(null);
                }}
                onSubmit={(value) => {
                  setEditError("");
                  updateMutation.mutate({ id: editing.id, value });
                }}
                submitLabel="Salva modifiche"
              />
              {editError ? (
                <p className="text-sm font-medium text-red-700" role="alert">
                  {editError}
                </p>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteError("");
            setDeleting(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina prodotto</DialogTitle>
            <DialogDescription>
              Elimina la riga da <code className="text-xs">public.products</code>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Vuoi eliminare{" "}
              <span className="font-semibold text-slate-900">
                {deleting?.name ?? ""}
              </span>
              ?
            </p>
            {deleteError ? (
              <p className="text-sm font-medium text-red-700" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Annulla
              </Button>
              <Button
                variant="destructive"
                disabled={!deleting || deleteMutation.isPending}
                onClick={() => deleting && deleteMutation.mutate(deleting.id)}
              >
                {deleteMutation.isPending ? "Eliminazione…" : "Elimina"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aggiungi Prodotto</DialogTitle>
            <DialogDescription>
              Inserimento in <code className="text-xs">public.products</code> (varianti colore in <code className="text-xs">variants</code> JSON).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Dati Base</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="p-name">Nome</Label>
                  <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="p-description">Descrizione</Label>
                  <Textarea
                    id="p-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrizione prodotto"
                  />
                </div>
                <div>
                  <Label htmlFor="p-price">Prezzo base</Label>
                  <Input
                    id="p-price"
                    inputMode="decimal"
                    placeholder="es. 12,90"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="p-stock">Stock</Label>
                  <Input
                    id="p-stock"
                    inputMode="numeric"
                    placeholder="es. 100"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="p-sku">SKU</Label>
                  <Input id="p-sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="p-category">Categoria</Label>
                  <Input
                    id="p-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="p-image">Immagine (URL)</Label>
                  <Input
                    id="p-image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Varianti Colore</h3>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Aggiungi colore (es. Blu)"
                />
                <Button type="button" variant="outline" onClick={addColor}>
                  Aggiungi colore
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.length === 0 ? (
                  <p className="text-sm text-slate-500">Nessun colore aggiunto.</p>
                ) : (
                  colors.map((color) => (
                    <Badge key={color} variant="default" className="inline-flex items-center gap-1">
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="rounded-full p-0.5 hover:bg-slate-800/20"
                        aria-label={`Rimuovi colore ${color}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </section>

            {createError ? <p className="text-sm font-medium text-red-700">{createError}</p> : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Annulla
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvataggio..." : "Salva prodotto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

