import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Footer from './components/Footer'
import { SiteHeader } from './components/layout/SiteHeader'
import { CartQuickView } from './components/cart/CartQuickView'
import { CartDrawerProvider } from './context/CartDrawerContext'
import { AdminRoute } from './components/auth/AdminRoute'
import { AdminLayout } from './admin/AdminLayout'
import { AdminHomePage } from './admin/pages/AdminHomePage'
import { AdminProductsPage } from './admin/pages/AdminProductsPage'
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage'
import { AdminOrderDetailPage } from './admin/pages/AdminOrderDetailPage'
import { AdminCustomersPage } from './admin/pages/AdminCustomersPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { CookiePolicyPage } from './pages/CookiePolicyPage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { AstroMedicalPage } from './pages/AstroMedicalPage'
import { CartucceTonerPage } from './pages/CartucceTonerPage'
import { DistruggidocumentiPage } from './pages/DistruggidocumentiPage'
import {
  MacchineCasseDitronPage,
  MacchineDistruggiDocumentiPage,
  MacchineEtichettatriciPage,
  MacchineUfficioHubPage,
  MacchineUfficioLayout,
} from './pages/MacchineUfficioPage'
import { MACCHINE_UFFICIO_BASE_PATH } from './lib/macchineUfficioRoutes'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { OfficePage } from './pages/OfficePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { BindingServicePage } from './pages/BindingServicePage'
import { TermsSalesPage } from './pages/TermsSalesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountProfilePage } from './pages/AccountProfilePage'
import { CategoryPromoWidget } from './components/promo/CategoryPromoWidget'
import { CookieConsentBanner } from './components/cookies/CookieConsentBanner'
import { SiteSeoDefaults } from './components/seo/SiteSeoDefaults'

function PlaceholderPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Pagina in costruzione</h1>
      <p className="mt-3 text-muted">
        Questa sezione del catalogo sara collegata alle prossime milestone.
      </p>
    </main>
  )
}

function LegacyCategoryRoute() {
  const { slug = '' } = useParams<{ slug: string }>()
  const s = slug.trim().toLowerCase()
  if (s === 'astro-medical') return <AstroMedicalPage />
  if (s === 'distruggidocumenti') return <DistruggidocumentiPage />
  if (s === 'cartucce-toner' || s === 'cartucce-e-toner' || s === 'toner') return <CartucceTonerPage />
  if (s === 'cancelleria') return <Navigate to="/office-products?category=Cancelleria" replace />
  if (s === 'carta') return <Navigate to="/office-products?category=Carta" replace />
  if (s === 'archivio') return <Navigate to="/office-products?category=Archivio" replace />
  if (s === 'macchine-ufficio' || s === 'macchine-per-ufficio')
    return <Navigate to={MACCHINE_UFFICIO_BASE_PATH} replace />
  return <PlaceholderPage />
}

function MacchineUfficioLegacyRedirect() {
  const location = useLocation()
  const rest = location.pathname.replace(/^\/macchine-ufficio/, '')
  return <Navigate to={`${MACCHINE_UFFICIO_BASE_PATH}${rest}${location.search}`} replace />
}

export default function App() {
  return (
    <>
    <Routes>
      <Route element={<StorefrontLayout />}>
        {/* FORCE_REBUILD_2026_04_29: refresh router and homepage layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/catalogo" element={<PlaceholderPage />} />
        <Route path="/categoria/:slug" element={<LegacyCategoryRoute />} />
        <Route path="/contatti-toner" element={<PlaceholderPage />} />
        <Route path={MACCHINE_UFFICIO_BASE_PATH} element={<MacchineUfficioLayout />}>
          <Route index element={<MacchineUfficioHubPage />} />
          <Route path="distruggi-documenti" element={<MacchineDistruggiDocumentiPage />} />
          <Route path="etichettatrici" element={<MacchineEtichettatriciPage />} />
          <Route path="casse-ditron" element={<MacchineCasseDitronPage />} />
        </Route>
        <Route path="/macchine-ufficio/*" element={<MacchineUfficioLegacyRedirect />} />
        <Route path="/distruggidocumenti" element={<DistruggidocumentiPage />} />
        <Route path="/cartucce-toner" element={<CartucceTonerPage />} />
        <Route path="/office-products" element={<OfficePage />} />
        <Route path="/office" element={<OfficePage />} />
        <Route
          path="/cancelleria/buste"
          element={<Navigate to="/office-products?category=Cancelleria" replace />}
        />
        <Route
          path="/cancelleria"
          element={<Navigate to="/office-products?category=Cancelleria" replace />}
        />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/servizi/rilegature" element={<BindingServicePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/profile" element={<AccountProfilePage />} />
        <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
        <Route path="/termini-condizioni-vendita" element={<TermsSalesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <CookieConsentBanner />
    </>
  )
}

function StorefrontLayout() {
  return (
    <CartDrawerProvider>
      <SiteSeoDefaults />
      <SiteHeader />
      <Outlet />
      <CategoryPromoWidget />
      <Footer />
      <CartQuickView />
    </CartDrawerProvider>
  )
}

function LandingPage() {
  return <HomePage />
}
