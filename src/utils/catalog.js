// 1. Filter Products
const filterProducts = (products, filters = {}) => {
  if (!Array.isArray(products)) return [];

  const { category = '', min = '', max = '', rating = '' } = filters;

  return products.filter(product => {
    if (category && product.category !== category) return false;

    if (min !== '' && min !== 0 && product.price < Number(min)) {
      return false;
    }

    if (max !== '' && max !== 0 && product.price > Number(max)) {
      return false;
    }

    if (rating !== '' && product.rating < Number(rating)) {
      return false;
    }

    return true;
  });
};
// 2. Sort Products
const sortProducts = (products, sort = 'popular') => {
  if (!Array.isArray(products)) return [];

  const sorted = [...products];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'rating':
    case 'popular':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'title':
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    default:
      return sorted.sort((a, b) => b.rating - a.rating);
  }
};
// 3. Calculate Totals
const calculateTotals = (cart = [], coupon = '') => {
  const subtotal = Number(
    cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ).toFixed(2)
  );

  const discount =
    coupon.trim().toUpperCase() === 'SAVE10'
      ? Number((subtotal * 0.10).toFixed(2))
      : 0;

  const total = Number(
    Math.max(0, subtotal - discount).toFixed(2)
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return { subtotal, discount, total, cartCount };
};

// 4. Format Price
const formatPrice = (value) => `$${Number(value).toFixed(2)}`

export { filterProducts, sortProducts, calculateTotals, formatPrice }