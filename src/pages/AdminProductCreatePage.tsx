import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PackagePlus } from 'lucide-react'
import { insertOfficeProductAdmin } from '../api/officeProductsAdmin'
import { logoutAdmin } from '../lib/adminAuth'

const envToken = (import.meta.env.VITE_OFFICE_INSERT_TOKEN as string | undefined)?.trim() ?? ''

export function AdminProductCreatePage() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(envToken)
  const [id, setId] = useState('')
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('STARLINE')
  const [category, setCategory] = useState('Buste e cartelline')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [parentSku, setParentSku] = useState('')
  const [colorName, setColorName] = useState('')

  const mutation = useMutation({
    mutationFn: insertOfficeProductAdmin,
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['office-products'] })
        queryClient.invalidateQueries({ queryKey: ['office-products-showcase'] })
      }
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = price.trim() === '' ? undefined : Number.parseFloat(price.replace(',', '.'))
    mutation.mutate({
      token,
      id,
      sku: sku.trim() || id.trim(),
      name,
      brand,
      category,
      imageUrl,
      description: description.trim() || undefined,
      price: priceNum !== undefined && Number.isFinite(priceNum) ? priceNum : undefined,
      parentSku: parentSku.trim() || undefined,
      colorName: colorName.trim() || undefined,
    })
  }

  const last = mutation.data

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <PackagePlus className="size-6 text-brand-700" />
            Nuovo prodotto office
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                window.location.href = '/admin/login'
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-semibold">Configurazione una tantum (Supabase)</p>
          <p className="mt-1 text-xs leading-relaxed">
            Dopo aver applicato la migrazione <code className="rounded bg-amber-100/80 px-1">008_office_product_admin_insert_rpc.sql</code>
            , inserisci il token nel database:{' '}
            <code className="break-all rounded bg-amber-100/80 px-1 text-[11px]">
              insert into public.office_product_insert_tokens (id, token) values (1, &apos;...&apos;) on conflict (id) do
              update set token = excluded.token;
            </code>{' '}
            Poi imposta la stessa stringa in <code className="rounded bg-amber-100/80 px-1">VITE_OFFICE_INSERT_TOKEN</code> nel file
            <code className="rounded bg-amber-100/80 px-1"> .env</code> (oppure incollala nel campo sotto).
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Token inserimento DB</span>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              placeholder="Stesso valore di office_product_insert_tokens"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">ID articolo (chiave primaria)</span>
              <input
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="es. STL7413"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">SKU / codice produttore</span>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Vuoto = uguale all&apos;ID"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Marca</span>
              <input
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Nome</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Categoria</span>
              <input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">URL immagine</span>
              <input
                required
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="https://..."
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Descrizione (opzionale)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Prezzo (IVA escl., opzionale)</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                placeholder="es. 4,50"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Parent SKU (varianti)</span>
              <input
                value={parentSku}
                onChange={(e) => setParentSku(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-slate-700">Nome colore (varianti)</span>
              <input
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
          </div>

          {mutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {(mutation.error as Error)?.message ?? 'Errore di rete'}
            </p>
          ) : null}
          {last && !last.ok ? (
            <p className="text-sm text-red-700" role="alert">
              {last.error}
            </p>
          ) : null}
          {last?.ok ? (
            <p className="text-sm font-medium text-emerald-800" role="status">
              Salvato. ID: {last.id}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {mutation.isPending ? 'Salvataggio…' : 'Salva prodotto'}
          </button>
        </form>
      </div>
    </main>
  )
}
