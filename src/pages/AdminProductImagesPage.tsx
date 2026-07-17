import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImageUp } from 'lucide-react'
import {
  fetchProductsMissingImages,
  syncProductsImagesAdmin,
} from '../api/productsImagesAdmin'
import { logoutAdmin } from '../lib/adminAuth'

const envToken = (import.meta.env.VITE_OFFICE_INSERT_TOKEN as string | undefined)?.trim() ?? ''

export function AdminProductImagesPage() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(envToken)
  const [applyOd, setApplyOd] = useState(true)
  const [regex, setRegex] = useState('^STL[0-9]+')

  const missingQuery = useQuery({
    queryKey: ['admin-products-missing-images'],
    queryFn: () => fetchProductsMissingImages(300),
    staleTime: 15_000,
  })

  const syncMutation = useMutation({
    mutationFn: syncProductsImagesAdmin,
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-products-missing-images'] })
        queryClient.invalidateQueries({ queryKey: ['office-products'] })
        queryClient.invalidateQueries({ queryKey: ['office-products-showcase'] })
      }
    },
  })

  const missing = missingQuery.data ?? []

  let odRegex: RegExp | null = null
  try {
    odRegex = new RegExp(regex)
  } catch {
    odRegex = null
  }

  const previewSql = missing
    .filter((r) => {
      if (!r.sku || !odRegex) return false
      return odRegex.test(r.sku.trim())
    })
    .map(
      (r) =>
        `UPDATE public.products SET image_url = 'https://odmultimedia.eu/immagini/HD/${r.sku!.trim().replace(/'/g, "''")}.jpg' WHERE id = '${String(r.id).replace(/'/g, "''")}';`,
    )
    .join('\n')

  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-brand-50/50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <ImageUp className="size-6 text-brand-700" />
            Immagini prodotti
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-700">
            Nel repository gli URL noti sono nelle migrazioni{' '}
            <code className="rounded bg-slate-100 px-1 text-xs">005</code> (STL2005) e{' '}
            <code className="rounded bg-slate-100 px-1 text-xs">007</code> (STL7413), con pattern{' '}
            <code className="rounded bg-slate-100 px-1 text-xs break-all">
              https://odmultimedia.eu/immagini/HD/&lt;SKU&gt;.jpg
            </code>
            . La funzione qui sotto copia prima da <code className="rounded bg-slate-100 px-1 text-xs">office_products</code> se la tabella esiste, poi applica lo stesso pattern agli SKU che rispettano la regex (predefinito: codici Starline <code className="rounded bg-slate-100 px-1 text-xs">STL…</code>).
          </p>

          <label className="mt-5 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Token (stesso di inserimento prodotti)</span>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>

          <label className="mt-3 flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={applyOd}
              onChange={(e) => setApplyOd(e.target.checked)}
              className="rounded border-slate-300 text-brand-700"
            />
            Applica URL OD Multimedia per SKU senza immagine dopo il passo office_products
          </label>

          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Regex SKU per OD (PostgreSQL ~)</span>
            <input
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            {!odRegex ? (
              <span className="mt-1 block text-xs text-red-700">Regex non valida per l&apos;anteprima SQL.</span>
            ) : null}
          </label>

          <button
            type="button"
            disabled={syncMutation.isPending || !token.trim()}
            onClick={() =>
              syncMutation.mutate({
                token,
                applyOdMultimedia: applyOd,
                odSkuRegex: regex,
              })
            }
            className="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
          >
            {syncMutation.isPending ? 'Aggiornamento…' : 'Sincronizza immagini nel database'}
          </button>

          {syncMutation.data && !syncMutation.data.ok ? (
            <p className="mt-3 text-sm text-red-700" role="alert">
              {syncMutation.data.error}
            </p>
          ) : null}
          {syncMutation.data?.ok ? (
            <p className="mt-3 text-sm font-medium text-emerald-800" role="status">
              Aggiornati da office_products: {syncMutation.data.updated_from_office_products ?? 0}
              {' · '}
              URL OD Multimedia: {syncMutation.data.updated_od_multimedia_urls ?? 0}
            </p>
          ) : null}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Prodotti senza immagine ({missingQuery.isPending ? '…' : missing.length})
            </h2>
            {missingQuery.isPending ? (
              <p className="mt-2 text-sm text-slate-500">Caricamento…</p>
            ) : missing.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">Nessun record con image_url vuoto.</p>
            ) : (
              <ul className="mt-2 max-h-48 overflow-auto text-sm text-slate-700">
                {missing.slice(0, 40).map((r) => (
                  <li key={r.id} className="border-b border-slate-50 py-1">
                    <span className="font-mono text-xs text-slate-500">{r.sku ?? r.id}</span>
                    {' — '}
                    {r.name ?? '—'}
                  </li>
                ))}
                {missing.length > 40 ? (
                  <li className="py-2 text-xs text-slate-500">… e altri {missing.length - 40}</li>
                ) : null}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <h3 className="text-sm font-semibold text-amber-950">Senza RPC: SQL manuale</h3>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              Puoi incollare in SQL Editor il file{' '}
              <code className="rounded bg-amber-100 px-1">scripts/sync-product-images.sql</code> oppure solo gli UPDATE
              generati per gli SKU che matchano la regex:
            </p>
            <textarea
              readOnly
              value={previewSql || '-- Nessun prodotto nella lista corrisponde alla regex con SKU valorizzato.'}
              rows={8}
              className="mt-2 w-full resize-y rounded-lg border border-amber-200 bg-white p-2 font-mono text-[11px] text-slate-800"
            />
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(previewSql)}
              className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100"
            >
              Copia UPDATE (anteprima)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
