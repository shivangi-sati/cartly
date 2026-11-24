# Cartly

A frontend-only e-commerce storefront built with React, JavaScript, Tailwind CSS and React Router.
Products come from the [DummyJSON](https://dummyjson.com/) public API. The checkout is a demo — no
real authentication or payments are involved.

## Run locally

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build     # production build
npm test          # Vitest (16 tests)
npm run test:watch
npm run lint
```

## Features

- Product catalog with loading skeletons, error + retry, and empty states
- Debounced search, category/price/rating filters and sorting — all synced to the URL
- Product detail pages with add-to-cart and wishlist toggles
- Cart with quantity controls, `SAVE10` coupon and derived totals
- Wishlist page
- 3-step demo checkout (shipping → payment → review) with validation
- Order confirmation and order history
- Dark mode classes and localStorage persistence for cart, wishlist, coupon and orders

## Project structure

```
src/
  api/products.js          # API calls (fetch + AbortController signal)
  components/ui.jsx        # shared UI helpers
  context/StoreContext.jsx # cart, wishlist, coupon, orders, persistence
  hooks/useDebounce.js     # debounce hook for search
  pages/                   # Catalog, ProductDetail, Cart, Wishlist, Checkout, Orders
  utils/catalog.js         # pure filter/sort/totals/format functions
  utils/catalog.test.js    # 16 Vitest tests
```

## Decisions worth discussing

1. **URL as state for filters.** `useSearchParams` makes search/filter/sort shareable and keeps Back/Forward useful.
2. **AbortController on every fetch.** Prevents stale responses overwriting newer results and avoids
   setting state after unmount.
3. **Pure logic in `src/utils/catalog.js`.** Filtering, sorting, totals and price formatting are plain
   functions, so they are easy to test without mounting components.
4. **Graceful states are explicit.** Loading, error and empty branches exist on every data-driven screen.
5. **No fake auth or payments.** Checkout is clearly labelled a demo and collects no card details.
6. **Context, not Redux.** Cart/wishlist/orders are shared through React Context; the store model of
   Redux is familiar, but it was not needed at this scale.

## Testing

`npm test` runs 16 Vitest tests on the pure catalog utilities, including edge cases: empty input,
invalid coupon, case-insensitive coupon, boundary prices, no mutation during sort, and zero totals.
Component-level tests are not included yet.

## Possible next steps

TypeScript migration, component tests, a real backend/auth with Supabase, and payment integration in test mode.
