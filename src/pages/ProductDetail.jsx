import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products.js'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const { addToCart, toggleWishlist, wishlist } = useStore()

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    fetchProductById(id, controller.signal)
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Failed to fetch product')
        setLoading(false)
      })

    return () => controller.abort()
  }, [id, retry])

  if (loading) return <p>Loading product...</p>

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => setRetry((n) => n + 1)}
          className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!product) return null

  const isSaved = wishlist.some((item) => item.id === product.id)

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
        />

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {product.category} {product.brand && `· ${product.brand}`}
          </p>
          <h2 className="mt-2 text-3xl font-bold">{product.title}</h2>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-1 text-amber-600">⭐ {product.rating}</p>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{product.description}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => addToCart(product)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add to cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {isSaved ? '♥ Saved' : '♡ Save to wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
