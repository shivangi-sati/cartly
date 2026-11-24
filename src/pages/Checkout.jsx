import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/catalog.js'
import { useStore } from '../context/StoreContext.jsx'

const initialForm = {
  name: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  payment: 'demo',
}

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const { cart, subtotal, discount, total, placeOrder } = useStore()
  const navigate = useNavigate()

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: '' }))
  }

  const validateShipping = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Valid email is required'
    if (!form.address.trim()) next.address = 'Address is required'
    if (!form.city.trim()) next.city = 'City is required'
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = '6-digit pincode required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => {
    if (step === 1 && !validateShipping()) return
    setStep((current) => Math.min(current + 1, 3))
  }

  const submitOrder = () => {
    const order = placeOrder({
      name: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      payment: form.payment,
    })
    navigate(`/order/${order.id}`)
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">Nothing to check out</h2>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold">Checkout</h2>

      <div className="mt-5 flex gap-2 text-sm">
        {['Shipping', 'Payment', 'Review'].map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-4 py-1 ${
              step === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        {step === 1 && (
          <div className="space-y-4">
            {[
              ['name', 'Full name', 'text'],
              ['email', 'Email', 'email'],
              ['address', 'Address', 'text'],
              ['city', 'City', 'text'],
              ['pincode', 'PIN code', 'text'],
            ].map(([key, label, type]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium">
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  aria-invalid={Boolean(errors[key])}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                />
                {errors[key] && (
                  <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This is a demo checkout — no real payment is taken.
            </p>
            {[
              ['demo', 'Demo payment (no charge)'],
              ['cod', 'Cash on delivery'],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={form.payment === value}
                  onChange={(e) => update('payment', e.target.value)}
                />
                {label}
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold">Shipping to</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {form.name}, {form.address}, {form.city} — {form.pincode}
              </p>
              <p className="text-slate-600 dark:text-slate-400">{form.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Items ({cart.length})</h3>
              {cart.map((item) => (
                <p key={item.id} className="text-slate-600 dark:text-slate-400">
                  {item.title} × {item.quantity}
                </p>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
              <p>Subtotal: {formatPrice(subtotal)}</p>
              {discount > 0 && <p className="text-green-600">Discount: −{formatPrice(discount)}</p>}
              <p className="text-base font-bold">Total: {formatPrice(total)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep((current) => Math.max(current - 1, 1))}
          disabled={step === 1}
          className="rounded-lg border border-slate-300 px-5 py-2 disabled:opacity-40 dark:border-slate-700"
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submitOrder}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
          >
            Place order
          </button>
        )}
      </div>
    </div>
  )
}
