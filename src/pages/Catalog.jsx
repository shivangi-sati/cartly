
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { fetchProducts } from '../api/products';
import { formatPrice, filterProducts, sortProducts } from '../utils/catalog';
import { useDebounce } from '../hooks/useDebounce.js';
import AddToCartButton from '../components/AddToCartButton.jsx';
import Dropdown from '../components/Dropdown.jsx';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const min = searchParams.get('min') || '';
  const max = searchParams.get('max') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || 'popular';

  // Update URL parameters
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next, { replace: true });
  };

  // Debounced search state
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 300);
  const skipDebounceRef = useRef(false);

  // Keep the input in sync when the URL changes (Back button / Clear filters)
  useEffect(() => {
    skipDebounceRef.current = true;
    setSearchInput(q);
  }, [q]);

  // Write the debounced value into the URL
  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    if (debouncedSearch !== q) {
      const next = new URLSearchParams(searchParams);
      if (debouncedSearch) next.set('q', debouncedSearch);
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }
  }, [debouncedSearch, q, searchParams, setSearchParams]);

  // Fetch Products
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError('');

    fetchProducts(12, controller.signal)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;

        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [retry]);

  // Derive Categories
  const categories = [
    ...new Set(products.map(p => p.category))
  ].sort();

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat })),
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4', label: '4+' },
    { value: '4.5', label: '4.5+' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title: A-Z' },
  ];

  // Filter and Sort Products
  const visible = useMemo(() => {
    const filtered = filterProducts(products, {
      category,
      min,
      max,
      rating
    }).filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );

    return sortProducts(filtered, sort);
  }, [products, category, min, max, rating, q, sort]);

  // Loading State
  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="h-40 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="mt-6 text-center">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => setRetry(n => n + 1)}
          className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Success State
  return (
    <div className="mt-6">

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap gap-3">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        />

        {/* Category */}
        <Dropdown
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={value => updateParam('category', value)}
          className="min-w-[11rem]"
        />

        {/* Minimum Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={min}
          onChange={e => updateParam('min', e.target.value)}
          className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        />

        {/* Maximum Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={max}
          onChange={e => updateParam('max', e.target.value)}
          className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        />

        {/* Rating */}
        <Dropdown
          label="Rating"
          value={rating}
          options={ratingOptions}
          onChange={value => updateParam('rating', value)}
          className="min-w-[9rem]"
        />

        {/* Sorting */}
        <Dropdown
          label="Sort by"
          value={sort}
          options={sortOptions}
          onChange={value => updateParam('sort', value)}
          className="min-w-[11rem]"
        />

      </div>

      {/* Empty State */}
      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No products match your filters.
          </h3>

          <button
            onClick={() => setSearchParams({})}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Clear filters
          </button>
        </div>
      ) : (

        /* Product Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {visible.map(product => (
            <article
              key={product.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
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

              <p className="text-sm text-amber-600">
                ⭐ {product.rating}
              </p>

              <p className="mt-1 text-xs uppercase text-slate-500">
                {product.category}
              </p>

              <div className="mt-3">
                <AddToCartButton product={product} compact />
              </div>
            </article>
          ))}

        </div>
      )}

    </div>
  );
};

export default Catalog;
