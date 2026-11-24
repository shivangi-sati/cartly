import { describe, expect, it } from 'vitest'
import { calculateTotals, filterProducts, formatPrice, sortProducts } from './catalog.js'

const products = [
  { id: 1, title: 'Alpha', category: 'shoes', price: 100, rating: 4.5 },
  { id: 2, title: 'Beta', category: 'bags', price: 250, rating: 3.8 },
  { id: 3, title: 'Gamma', category: 'shoes', price: 50, rating: 4.9 },
]

describe('filterProducts', () => {
  it('returns all products when no filters are set', () => {
    expect(filterProducts(products)).toHaveLength(3)
  })

  it('filters by category', () => {
    expect(filterProducts(products, { category: 'shoes' }).map((p) => p.id)).toEqual([1, 3])
  })

  it('filters by price range inclusive of boundaries', () => {
    expect(filterProducts(products, { min: 100, max: 250 }).map((p) => p.id)).toEqual([1, 2])
  })

  it('filters by minimum rating', () => {
    expect(filterProducts(products, { rating: 4 }).map((p) => p.id)).toEqual([1, 3])
  })

  it('combines filters', () => {
    expect(filterProducts(products, { category: 'shoes', max: 100, rating: 4 }).map((p) => p.id)).toEqual([1, 3])
  })

  it('handles empty and invalid input', () => {
    expect(filterProducts([])).toEqual([])
    expect(filterProducts(null)).toEqual([])
  })
})

describe('sortProducts', () => {
  it('sorts by price ascending without mutating the input', () => {
    const result = sortProducts(products, 'price-asc')
    expect(result.map((p) => p.price)).toEqual([50, 100, 250])
    expect(products[0].id).toBe(1)
  })

  it('sorts by price descending', () => {
    expect(sortProducts(products, 'price-desc').map((p) => p.price)).toEqual([250, 100, 50])
  })

  it('sorts by rating for the default', () => {
    expect(sortProducts(products).map((p) => p.id)).toEqual([3, 1, 2])
  })

  it('sorts by title', () => {
    expect(sortProducts(products, 'title').map((p) => p.title)).toEqual(['Alpha', 'Beta', 'Gamma'])
  })
})

describe('calculateTotals', () => {
  const cart = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 },
  ]

  it('calculates subtotal and cart count', () => {
    expect(calculateTotals(cart)).toMatchObject({ subtotal: 250, discount: 0, total: 250, cartCount: 3 })
  })

  it('applies SAVE10 coupon case-insensitively', () => {
    expect(calculateTotals(cart, 'save10')).toMatchObject({ subtotal: 250, discount: 25, total: 225 })
  })

  it('ignores an invalid coupon', () => {
    expect(calculateTotals(cart, 'WRONG').total).toBe(250)
  })

  it('handles an empty cart', () => {
    expect(calculateTotals()).toEqual({ subtotal: 0, discount: 0, total: 0, cartCount: 0 })
  })

  it('never returns a negative total', () => {
    expect(calculateTotals([], 'SAVE10').total).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats with two decimals', () => {
    expect(formatPrice(99.9)).toBe('$99.90')
    expect(formatPrice('5')).toBe('$5.00')
  })
})
