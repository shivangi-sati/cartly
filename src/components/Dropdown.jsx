import { useEffect, useId, useRef, useState } from 'react'

export default function Dropdown({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selected = options.find((option) => String(option.value) === String(value))
  const display = selected?.label ?? label

  useEffect(() => {
    if (!open) return

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      rootRef.current?.querySelector('button')?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const focusItem = (index) => {
    const items = Array.from(listRef.current?.querySelectorAll('[role="option"]') ?? [])
    if (!items.length) return
    const wrapped = (index + items.length) % items.length
    items[wrapped].focus()
  }

  const moveFocus = (direction) => {
    const items = Array.from(listRef.current?.querySelectorAll('[role="option"]') ?? [])
    if (!items.length) return

    const current = items.findIndex((item) => item.getAttribute('aria-selected') === 'true')
    if (current === -1) {
      focusItem(direction > 0 ? 0 : -1)
      return
    }
    focusItem(current + direction)
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        requestAnimationFrame(() => moveFocus(event.key === 'ArrowDown' ? 1 : -1))
      } else {
        moveFocus(event.key === 'ArrowDown' ? 1 : -1)
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((wasOpen) => !wasOpen)
    }
  }

  const handleOptionKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(event.key === 'ArrowDown' ? 1 : -1)
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      focusItem(event.key === 'Home' ? 0 : -1)
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.currentTarget.click()
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm transition-all duration-100 ease-out hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98] motion-reduce:transition-none dark:bg-slate-900 ${
          open
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        <span className="truncate">{display}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-[120ms] ease-out motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        id={listId}
        ref={listRef}
        role="listbox"
        aria-label={label}
        aria-hidden={!open}
        className={`absolute left-0 top-full z-30 mt-1 w-full min-w-[12rem] origin-top rounded-lg border border-slate-200 bg-white shadow-xl transition-[opacity,transform] duration-[120ms] ease-out motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-900 ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        <div className="max-h-64 overflow-y-auto p-1">
          {options.map((option) => {
            const isSelected = String(option.value) === String(value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                onKeyDown={handleOptionKeyDown}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-100 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none motion-reduce:transition-none dark:hover:bg-slate-800 dark:focus:bg-slate-800 ${
                  isSelected
                    ? 'font-semibold text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <span aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
