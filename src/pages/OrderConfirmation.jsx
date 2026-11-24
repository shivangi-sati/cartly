import { Link, useParams } from 'react-router-dom'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((item) => item.id === id)

  if (!order) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:underline">
          View all orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/40">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
          Order placed successfully!
        </h2>
        <p className="mt-1 text-green-700 dark:text-green-400">
          Order {order.id} · {new Date(order.placedAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold">Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className="mt-3 flex justify-between text-sm">
            <span>{item.title} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}

        <div className="mt-5 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
          <p className="flex justify-between">Subtotal: <span>{formatPrice(order.subtotal)}</span></p>
          {order.discount > 0 && (
            <p className="flex justify-between text-green-600">
              Discount: <span>−{formatPrice(order.discount)}</span>
            </p>
          )}
          <p className="mt-2 flex justify-between text-base font-bold">
            Total: <span>{formatPrice(order.total)}</span>
          </p>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Shipping to {order.shipping.name}, {order.shipping.city} — {order.shipping.pincode}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link>
        <Link to="/orders" className="text-blue-600 hover:underline">All orders</Link>
      </div>
    </div>
  )
}
