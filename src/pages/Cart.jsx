import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    coupon,
    setCoupon,
    subtotal,
    discount,
    total,
    cartCount,
  } = useStore()
  const [couponInput, setCouponInput] = useState(coupon)

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Add a few products to get started.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Your cart ({cartCount} items)</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <article
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {formatPrice(item.price)}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded border border-slate-300 dark:border-slate-700"
                    aria-label={`Decrease quantity of ${item.title}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded border border-slate-300 dark:border-slate-700"
                    aria-label={`Increase quantity of ${item.title}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Order summary</h3>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount (SAVE10)</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold dark:border-slate-700">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="coupon" className="text-sm font-medium">
              Coupon code
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="SAVE10"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                onClick={() => setCoupon(couponInput.trim())}
                className="rounded-lg bg-slate-800 px-4 py-2 text-white dark:bg-slate-200 dark:text-slate-900"
              >
                Apply
              </button>
            </div>
            {coupon && (
              <button
                onClick={() => {
                  setCoupon('')
                  setCouponInput('')
                }}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove coupon
              </button>
            )}
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
