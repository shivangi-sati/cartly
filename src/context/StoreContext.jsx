import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { calculateTotals } from '../utils/catalog.js'

const StoreContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('cartly-cart', []))
  const [wishlist, setWishlist] = useState(() => readStorage('cartly-wishlist', []))
  const [coupon, setCoupon] = useState(() => localStorage.getItem('cartly-coupon') || '')
  const [orders, setOrders] = useState(() => readStorage('cartly-orders', []))

  useEffect(() => {
    localStorage.setItem('cartly-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('cartly-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('cartly-coupon', coupon)
  }, [coupon])

  useEffect(() => {
    localStorage.setItem('cartly-orders', JSON.stringify(orders))
  }, [orders])

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...items,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (id, quantity) => {
    setCart((items) =>
      quantity <= 0
        ? items.filter((item) => item.id !== id)
        : items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (id) => {
    setCart((items) => items.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setCoupon('')
  }

  const toggleWishlist = (product) => {
    setWishlist((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    )
  }

  const placeOrder = (shipping) => {
    const totals = calculateTotals(cart, coupon)
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      ...totals,
      shipping,
      placedAt: new Date().toISOString(),
    }
    setOrders((previous) => [order, ...previous])
    setCart([])
    setCoupon('')
    return order
  }

  const totals = calculateTotals(cart, coupon)

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      coupon,
      orders,
      ...totals,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      setCoupon,
      placeOrder,
    }),
    [cart, wishlist, coupon, orders],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
