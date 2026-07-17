import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'

type ProductRow = {
  id: string
  name: string
  sku: string
  price: number
}

function asText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : 0
}

const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

export function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)

  const loadProducts = async () => {
    setIsLoading(true)
    setError('')
    const { data, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (productsError) {
      setError("Impossibile caricare i prodotti dalla tabella 'products'.")
      setProducts([])
      setIsLoading(false)
      return
    }

    const parsed = (data ?? []).map((row) => {
      const record = row as Record<string, unknown>
      return {
        id: asText(record.id),
        name: asText(record.name),
        sku: asText(record.sku),
        price: asNumber(record.price),
      }
    })

    setProducts(parsed.filter((product) => product.id))
    setIsLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError('')
    const payload = {
      name: name.trim(),
      sku: sku.trim() || null,
      price: Number.parseFloat(price) || 0,
    }

    const { error: insertError } = await supabase.from('products').insert(payload)
    if (insertError) {
      setError(`Inserimento prodotto fallito: ${insertError.message}`)
      setSaving(false)
      return
    }

    setName('')
    setSku('')
    setPrice('')
    setSaving(false)
    await loadProducts()
  }

  return (
    <section className="clients-page">
      <header className="page-header">
        <div>
          <h1>Prodotti</h1>
          <p>Gestione prodotti con inserimento rapido su Supabase.</p>
        </div>
      </header>

      <article className="card">
        <h2>Nuovo prodotto</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="product-name">Nome</label>
          <input
            id="product-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="product-sku">SKU</label>
          <input id="product-sku" value={sku} onChange={(event) => setSku(event.target.value)} />

          <label htmlFor="product-price">Prezzo</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Salvataggio...' : 'Carica articolo'}
          </button>
        </form>
      </article>

      <article className="card">
        <h2>Catalogo prodotti (ultimi 50)</h2>
        {error ? <p className="auth-error">{error}</p> : null}
        {isLoading ? <p className="table-empty">Caricamento prodotti in corso...</p> : null}

        {!isLoading && (
          <div className="table-wrap">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>SKU</th>
                  <th>Prezzo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name || 'n/d'}</td>
                    <td>{product.sku || 'n/d'}</td>
                    <td>{currency.format(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}
