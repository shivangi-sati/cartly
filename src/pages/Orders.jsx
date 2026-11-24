import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

export default function Orders() {
  const { orders } = useStore()

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">No orders yet</h2>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Your orders</h2>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{order.id}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {new Date(order.placedAt).toLocaleString()} · {order.cartCount} items
              </p>
            </div>
            <p className="font-semibold">{formatPrice(order.total)}</p>
            <Link to={`/order/${order.id}`} className="text-blue-600 hover:underline">
              View
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
