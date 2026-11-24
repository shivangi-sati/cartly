import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore()

  if (wishlist.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Save products you like and find them here.
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
      <h2 className="text-2xl font-bold">Your wishlist ({wishlist.length})</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-40 w-full rounded-lg object-cover"
              />
              <h3 className="mt-3 font-semibold hover:text-blue-600">
                {product.title}
              </h3>
            </Link>

            <p className="text-slate-600 dark:text-slate-400">
              {formatPrice(product.price)}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add to cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
