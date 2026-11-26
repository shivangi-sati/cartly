import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import { useStore } from './context/StoreContext.jsx'

export default function App() {
  const { cartCount, wishlist } = useStore()
  const location = useLocation()

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center gap-5">
        <Link to="/" className="text-3xl font-bold">Cartly</Link>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link to="/orders" className="hover:underline">Orders</Link>
          <Link to="/wishlist" className="rounded-full bg-slate-200 px-3 py-1 dark:bg-slate-800">
            Wishlist: {wishlist.length}
          </Link>
          <Link to="/cart" className="rounded-full bg-blue-600 px-3 py-1 text-white">
            Cart: {cartCount}
          </Link>
        </nav>
      </header>

      <main key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route
            path="*"
            element={
              <p>
                Page not found. <Link to="/" className="text-blue-600 underline">Go home</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
