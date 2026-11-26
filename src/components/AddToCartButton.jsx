import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function AddToCartButton({ product, compact = false }) {
  const { cart, addToCart } = useStore()
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(0), 900)
    return () => clearTimeout(timer)
  }, [flash])

  const quantity =
    cart.find((item) => String(item.id) === String(product.id))?.quantity ?? 0
  const added = flash > 0
  const sizing = compact ? 'w-full px-3 py-2 text-sm' : 'px-6 py-3'

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product)
        setFlash((n) => n + 1)
      }}
      aria-live="polite"
      aria-label={`Add to cart${quantity ? `, ${quantity} already in cart` : ''}`}
      className={`${sizing} inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-white shadow-md transition-all duration-150 ease-out active:scale-95 active:shadow-inner ${
        added
          ? 'bg-green-600 shadow-green-600/30'
          : 'bg-blue-600 shadow-blue-600/25 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
      }`}
    >
      <span>{added ? '✓ Added to cart' : 'Add to cart'}</span>
      {quantity > 0 && (
        <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold leading-tight">
          {quantity} in cart
        </span>
      )}
    </button>
  )
}
