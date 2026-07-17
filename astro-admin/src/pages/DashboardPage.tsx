import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const currency = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const asNumber = (value: unknown) => (typeof value === 'number' ? value : 0)
const monthLabelFormatter = new Intl.DateTimeFormat('it-IT', { month: 'short' })

type QuarterlyPoint = {
  key: string
  label: string
  total: number
}

function buildLastQuarterRevenueTrend(rows: Array<{ created_at: string | null; total_amount: number }>) {
  const now = new Date()
  const months: QuarterlyPoint[] = []

  for (let i = 2; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: monthLabelFormatter.format(date),
      total: 0,
    })
  }

  const totalsByMonth = new Map(months.map((point) => [point.key, 0]))

  rows.forEach((row) => {
    if (!row.created_at) return
    const parsed = new Date(row.created_at)
    if (Number.isNaN(parsed.getTime())) return
    const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
    if (!totalsByMonth.has(key)) return
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + row.total_amount)
  })

  return months.map((point) => ({
    ...point,
    total: Math.round((totalsByMonth.get(point.key) ?? 0) * 100) / 100,
  }))
}

export function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null)
  const [ordersToManage, setOrdersToManage] = useState<number | null>(null)
  const [latestOrderToManageDate, setLatestOrderToManageDate] = useState<string | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null)
  const [quarterRevenueTrend, setQuarterRevenueTrend] = useState<QuarterlyPoint[]>([])
  const [isLoadingKpis, setIsLoadingKpis] = useState(true)

  useEffect(() => {
    const loadDashboardKpis = async () => {
      setIsLoadingKpis(true)
      setLatestOrderToManageDate(null)

      const customersPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const ordersPromise = supabase
        .from('orders')
        .select('id, status, created_at, total_amount')

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

      const monthlyRevenuePromise = supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', startOfMonth)
        .lt('created_at', startOfNextMonth)

      const [customersResult, ordersResult, monthlyRevenueResult] = await Promise.all([
        customersPromise,
        ordersPromise,
        monthlyRevenuePromise,
      ])

      if (customersResult.error || ordersResult.error || monthlyRevenueResult.error) {
        console.error('Dashboard KPI load error', {
          customersError: customersResult.error,
          ordersError: ordersResult.error,
          monthlyRevenueError: monthlyRevenueResult.error,
        })
        setTotalCustomers(0)
        setOrdersToManage(0)
        setMonthlyRevenue(0)
        setQuarterRevenueTrend([])
        setIsLoadingKpis(false)
        return
      }

      const ordersRows = (ordersResult.data ?? []) as Array<Record<string, unknown>>
      const ordersToManageRows = ordersRows.filter((row) => {
        const status = String(row.status ?? '').trim().toLowerCase()
        return status !== 'consegnato' && status !== 'annullato'
      })

      const latestOrderDate = ordersToManageRows
        .map((row) => String(row.created_at ?? ''))
        .filter((value) => value.length > 0)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

      const computedMonthlyRevenue = (monthlyRevenueResult.data ?? []).reduce((acc, row) => {
        const amount = asNumber(row.total_amount)
        return acc + amount
      }, 0)

      setTotalCustomers(customersResult.count ?? 0)
      setOrdersToManage(ordersToManageRows.length)
      setLatestOrderToManageDate(latestOrderDate ?? null)
      setMonthlyRevenue(computedMonthlyRevenue)
      const trendRows = ordersRows.map((row) => ({
        created_at: String(row.created_at ?? '') || null,
        total_amount: asNumber(row.total_amount),
      }))
      setQuarterRevenueTrend(buildLastQuarterRevenueTrend(trendRows))
      setIsLoadingKpis(false)
    }

    loadDashboardKpis()
    const onOrderStatusChanged = () => {
      void loadDashboardKpis()
    }
    window.addEventListener('orders-status-changed', onOrderStatusChanged)

    return () => {
      window.removeEventListener('orders-status-changed', onOrderStatusChanged)
    }
  }, [])

  const kpiCards = useMemo(
    () => [
      { title: 'Totale Clienti', value: totalCustomers == null ? '-' : String(totalCustomers) },
      {
        title: 'Ordini da gestire',
        value: ordersToManage == null ? '-' : String(ordersToManage),
        note: latestOrderToManageDate
          ? `Ultimo: ${new Date(latestOrderToManageDate).toLocaleDateString('it-IT')}`
          : 'Nessun ordine aperto',
      },
      {
        title: 'Fatturato Totale (Mese Corrente)',
        value: monthlyRevenue == null ? '-' : currency.format(monthlyRevenue),
      },
    ],
    [latestOrderToManageDate, monthlyRevenue, ordersToManage, totalCustomers],
  )

  return (
    <section className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard Astro Admin</h1>
          <p>Panoramica operativa del gestionale Astro Forniture.</p>
        </div>
      </header>

      <section className="kpi-grid">
        {kpiCards.map((card) => (
          <article key={card.title} className="card kpi-card">
            <p>{card.title}</p>
            <strong>{card.value}</strong>
            {'note' in card && card.note ? <small>{card.note}</small> : null}
          </article>
        ))}
      </section>

      {isLoadingKpis ? <p className="kpi-status">Caricamento contatori in corso...</p> : null}

      <article className="card">
        <h2>Andamento Fatturato (Ultimo Trimestre)</h2>
        <p>Totale mensile aggregato da `orders.total_amount`.</p>
        <div className="chart">
          {quarterRevenueTrend.map((point) => (
            <div
              key={point.key}
              className="bar"
              style={{
                height: `${Math.max(8, point.total / 50)}px`,
              }}
              aria-label={`${point.label}: ${point.total}`}
              title={`${point.label}: ${currency.format(point.total)}`}
            />
          ))}
        </div>
        <div className="trend-legend">
          {quarterRevenueTrend.map((point) => (
            <span key={`legend-${point.key}`}>
              {point.label}: {currency.format(point.total)}
            </span>
          ))}
        </div>
      </article>
    </section>
  )
}
