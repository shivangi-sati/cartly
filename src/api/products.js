export async function fetchProducts(limit = 12, signal) {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`)
  const data = await res.json()
  return data.products
}

export async function fetchProductById(id, signal) {
  const res = await fetch(`https://dummyjson.com/products/${id}`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`)
  return res.json()
}