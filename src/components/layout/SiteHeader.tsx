import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { ChevronDown, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { clearAdminAuthenticated } from '../../lib/adminAuth'
import { getSupabaseBrowserClient } from '../../lib/supabaseClient'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { GlobalSiteSearch } from './GlobalSiteSearch'
import { HeaderAnnouncementBar } from './HeaderAnnouncementBar'
import { OFFICE_GENERAL_SHOP_PATH } from '../../lib/isGeneralOfficeShopCatalogProduct'
import {
  CARTA_SUBCATEGORY_A3,
  CARTA_SUBCATEGORY_A4,
  cartaCategoryHref,
  cartucceTonerCategoryHref,
} from '../../lib/officeCategories'
import {
  MACCHINE_SUB_CASSE_DITRON_LABEL,
  macchineUfficioCasseDitronListingPath,
} from '../../data/casseDitronProducts'
import {
  MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL,
  macchineUfficioDistruggiDocumentiListingPath,
} from '../../data/distruggidocumentiProducts'
import {
  MACCHINE_SUB_ETICHETTATRICI_LABEL,
  macchineUfficioEtichettatriciListingPath,
} from '../../data/macchineEtichettatrici'
import { macchineUfficioHubPath } from '../../lib/macchineUfficioRoutes'
import { useCartDrawer } from '../../context/CartDrawerContext'

type HeaderNavLink = {
  type: 'link'
  label: string
  href: string
}

type HeaderNavDropdown = {
  type: 'dropdown'
  label: string
  items: Array<{ label: string; href: string }>
}

type HeaderNavItem = HeaderNavLink | HeaderNavDropdown

const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { type: 'link', label: 'Archivio ufficio', href: '/office-products?category=Archivio' },
  { type: 'link', label: 'Cancelleria', href: '/office-products?category=Cancelleria' },
  {
    type: 'dropdown',
    label: 'Macchine per Ufficio',
    items: [
      { label: 'Panoramica', href: macchineUfficioHubPath() },
      { label: MACCHINE_SUB_DISTRUGGI_DOCUMENTI_LABEL, href: macchineUfficioDistruggiDocumentiListingPath() },
      { label: MACCHINE_SUB_ETICHETTATRICI_LABEL, href: macchineUfficioEtichettatriciListingPath() },
      { label: MACCHINE_SUB_CASSE_DITRON_LABEL, href: macchineUfficioCasseDitronListingPath() },
    ],
  },
  {
    type: 'dropdown',
    label: 'Carta',
    items: [
      { label: CARTA_SUBCATEGORY_A4, href: cartaCategoryHref(CARTA_SUBCATEGORY_A4) },
      { label: CARTA_SUBCATEGORY_A3, href: cartaCategoryHref(CARTA_SUBCATEGORY_A3) },
    ],
  },
  { type: 'link', label: 'Cartucce & Toner', href: cartucceTonerCategoryHref() },
]

const HEADER_NAV_LINK_CLASS =
  'text-slate-900 transition hover:opacity-75 hover:underline hover:underline-offset-4'

export function SiteHeader() {
  const { totalItems } = useCart()
  const { openCartDrawer } = useCartDrawer()
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null
      setAuthUser(user)
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setAuthUser(user)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  function handleHeaderLoggedOut() {
    setAuthUser(null)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <HeaderAnnouncementBar />

      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <nav className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 sm:text-sm">
              <Link to={OFFICE_GENERAL_SHOP_PATH} className="transition hover:text-black">
                Shop
              </Link>
            </nav>

            <Link to="/" className="inline-flex items-center justify-center" aria-label="Astro Forniture">
              <img
                src="/logo-astro-forniture.png"
                alt="Astro Forniture"
                className="h-10 w-auto object-contain sm:h-11"
                loading="eager"
                decoding="async"
              />
            </Link>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <AccountMenuButton user={authUser} onLoggedOut={handleHeaderLoggedOut} />
              <HeaderCartButton totalItems={totalItems} onOpen={openCartDrawer} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="relative isolate z-[60] min-w-0 overflow-visible">
          <GlobalSiteSearch />
        </div>
      </div>

      <nav className="relative z-10 border-t border-slate-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-12 items-center justify-center gap-x-10 overflow-x-auto whitespace-nowrap py-3 text-sm font-semibold tracking-[0.03em] sm:gap-x-12 sm:text-[15px]">
            {HEADER_NAV_ITEMS.map((item) =>
              item.type === 'link' ? (
                <Link key={item.label} to={item.href} className={HEADER_NAV_LINK_CLASS}>
                  {item.label}
                </Link>
              ) : (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 ${HEADER_NAV_LINK_CLASS}`}
                      aria-haspopup="menu"
                      aria-label={`Menu ${item.label}`}
                    >
                      {item.label}
                      <ChevronDown className="size-4 opacity-70" aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[12rem]">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.label} asChild className="cursor-pointer">
                        <Link to={subItem.href}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

function AccountMenuButton({
  user,
  onLoggedOut,
}: {
  user: SupabaseUser | null
  onLoggedOut: () => void
}) {
  const navigate = useNavigate()
  const supabase = getSupabaseBrowserClient()

  async function handleLogout() {
    if (!supabase) {
      clearAdminAuthenticated()
      onLoggedOut()
      window.location.href = '/'
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      // Fallback: anche in caso di errore forziamo reset UI locale.
      console.error('Logout non completato su Supabase:', error.message)
    }
    clearAdminAuthenticated()
    onLoggedOut()
    window.location.href = '/'
  }

  if (!user) {
    return <HeaderIconButton label="Account" icon={<User className="size-5" />} to="/login" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          aria-label="Menu account"
        >
          <User className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => navigate('/account/profile')}>Il mio profilo</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/orders')}>I miei ordini</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleLogout()
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderCartButton({
  totalItems,
  onOpen,
}: {
  totalItems: number
  onOpen: () => void
}) {
  const badgeNode =
    totalItems > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold leading-4 text-white">
        {totalItems > 99 ? '99+' : totalItems}
      </span>
    ) : null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
      aria-label={`Carrello (${totalItems} articoli)`}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {badgeNode}
    </button>
  )
}

function HeaderIconButton({
  label,
  icon,
  to,
  badge,
}: {
  label: string
  icon: ReactNode
  to?: string
  badge?: number
}) {
  const classes =
    'relative flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-400 hover:text-slate-950'

  const badgeNode =
    typeof badge === 'number' && badge > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold leading-4 text-white">
        {badge > 99 ? '99+' : badge}
      </span>
    ) : null

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={label}>
        {icon}
        {badgeNode}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} aria-label={label}>
      {icon}
      {badgeNode}
    </button>
  )
}
