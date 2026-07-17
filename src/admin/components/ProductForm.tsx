import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import type { AdminProduct } from "../data/productsStore";

const formSchema = z.object({
  name: z.string().min(2, "Inserisci un nome (min 2 caratteri)."),
  category: z.string().min(2, "Inserisci una categoria."),
  description: z.string().min(10, "Inserisci una descrizione (min 10 caratteri)."),
  price: z
    .string()
    .min(1, "Inserisci un prezzo.")
    .refine(
      (v) => {
        const n = Number.parseFloat(v.replace(",", "."));
        return Number.isFinite(n) && n >= 0;
      },
      "Prezzo non valido.",
    ),
  stock: z
    .string()
    .min(1, "Inserisci la giacenza.")
    .refine(
      (v) => {
        const n = Number.parseInt(v, 10);
        return Number.isFinite(n) && n >= 0;
      },
      "Stock non valido.",
    ),
  imagesText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export type ProductFormValue = Omit<AdminProduct, "id">;

export function ProductForm({
  defaultValue,
  onCancel,
  onSubmit,
  submitLabel = "Salva",
  className,
  isSubmitting,
}: {
  defaultValue?: Partial<AdminProduct>;
  onCancel?: () => void;
  onSubmit: (value: ProductFormValue) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  isSubmitting?: boolean;
}) {
  const defaults = useMemo<FormValues>(
    () => ({
      name: defaultValue?.name ?? "",
      category: defaultValue?.category ?? "",
      description: defaultValue?.description ?? "",
      price:
        defaultValue?.price !== undefined
          ? String(defaultValue.price).replace(".", ",")
          : "",
      stock: defaultValue?.stock !== undefined ? String(defaultValue.stock) : "0",
      imagesText: (defaultValue?.images ?? []).join("\n"),
    }),
    [defaultValue],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const errors = form.formState.errors;

  return (
    <form
      className={cn("grid gap-4", className)}
      onSubmit={form.handleSubmit((values) => {
        const parsed = formSchema.parse(values);
        const price = Number.parseFloat(parsed.price.replace(",", "."));
        const stock = Number.parseInt(parsed.stock, 10);
        const images = (parsed.imagesText ?? "")
          .trim()
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        const invalidUrl = images.find((u) => !/^https?:\/\//i.test(u));
        if (invalidUrl) {
          form.setError("imagesText", {
            type: "validate",
            message: "Ogni riga deve essere un URL http/https valido.",
          });
          return;
        }

        onSubmit({
          name: parsed.name,
          category: parsed.category,
          description: parsed.description,
          price,
          stock,
          images,
        });
      })}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Es. Lampada LED" {...form.register("name")} />
        {errors.name ? (
          <p className="text-xs font-medium text-red-700">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          placeholder="Es. Illuminazione"
          {...form.register("category")}
        />
        {errors.category ? (
          <p className="text-xs font-medium text-red-700">
            {errors.category.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Descrizione del prodotto…"
          {...form.register("description")}
        />
        {errors.description ? (
          <p className="text-xs font-medium text-red-700">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Prezzo (EUR)</Label>
          <Input id="price" inputMode="decimal" placeholder="es. 59,90" {...form.register("price")} />
          {errors.price ? (
            <p className="text-xs font-medium text-red-700">{errors.price.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" inputMode="numeric" {...form.register("stock")} />
          {errors.stock ? (
            <p className="text-xs font-medium text-red-700">{errors.stock.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="imagesText">Immagini (1 URL per riga)</Label>
        <Textarea
          id="imagesText"
          rows={3}
          placeholder="https://...\nhttps://..."
          {...form.register("imagesText")}
        />
        {errors.imagesText ? (
          <p className="text-xs font-medium text-red-700">
            {errors.imagesText.message as string}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Opzionale. Se vuoto, il prodotto verrà creato senza immagini.
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

