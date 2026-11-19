import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export const Select = ({
  name,
  id,
  value,
  defaultValue,
  onChange,
  options = [],
  children,
  placeholder = 'Select an option...',
  disabled = false,
  required = false,
  className = '',
  menuClassName = '',
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId()
  const selectId = id || name || generatedId
  const containerRef = useRef(null)
  const listboxRef = useRef(null)

  // Parse options from either `options` prop or `<option>` children
  const parsedOptions = React.useMemo(() => {
    if (options && options.length > 0) {
      return options.map((opt) =>
        typeof opt === 'string'
          ? { value: opt, label: opt }
          : { value: opt.value, label: opt.label ?? opt.value }
      )
    }

    if (!children) return []

    const items = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        items.push({
          value: child.props.value,
          label: child.props.children || child.props.value,
          disabled: child.props.disabled,
        })
      }
    })
    return items
  }, [options, children])

  // Internal value state if uncontrolled
  const [internalValue, setInternalValue] = useState(
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
  )

  const currentValue = value !== undefined ? value : internalValue
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // Find currently selected option
  const selectedOption = parsedOptions.find(
    (opt) => String(opt.value) === String(currentValue)
  )

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.querySelectorAll('[role="option"]')
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelectOption = (optionValue) => {
    if (disabled) return
    setInternalValue(optionValue)
    setIsOpen(false)

    if (onChange) {
      // Simulate standard event object for seamless drop-in compatibility
      const syntheticEvent = {
        target: {
          name,
          id: selectId,
          value: optionValue,
        },
      }
      onChange(syntheticEvent)
    }
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen) {
          if (highlightedIndex >= 0 && parsedOptions[highlightedIndex]) {
            handleSelectOption(parsedOptions[highlightedIndex].value)
          } else {
            setIsOpen(false)
          }
        } else {
          setIsOpen(true)
          const currentIdx = parsedOptions.findIndex(
            (opt) => String(opt.value) === String(currentValue)
          )
          setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0)
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          const currentIdx = parsedOptions.findIndex(
            (opt) => String(opt.value) === String(currentValue)
          )
          setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0)
        } else {
          setHighlightedIndex((prev) =>
            prev < parsedOptions.length - 1 ? prev + 1 : 0
          )
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          const currentIdx = parsedOptions.findIndex(
            (opt) => String(opt.value) === String(currentValue)
          )
          setHighlightedIndex(currentIdx >= 0 ? currentIdx : parsedOptions.length - 1)
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : parsedOptions.length - 1
          )
        }
        break

      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
        break

      case 'Tab':
        if (isOpen) {
          setIsOpen(false)
        }
        break

      default:
        break
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left font-sans ${className}`}
    >
      {/* Hidden native select for standard HTML form submissions & accessibility */}
      <select
        name={name}
        id={selectId}
        value={currentValue}
        onChange={(e) => handleSelectOption(e.target.value)}
        disabled={disabled}
        required={required}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
      >
        {parsedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Trigger Button: 16px font size, minimum 48px height, clear border */}
      <button
        type="button"
        id={`${selectId}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={ariaLabel ? undefined : `${selectId}-button`}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen)
            const currentIdx = parsedOptions.findIndex(
              (opt) => String(opt.value) === String(currentValue)
            )
            setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0)
          }
        }}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[48px] px-4 py-2.5 text-base font-medium rounded-xl border transition-all flex items-center justify-between gap-3 text-left shadow-xs ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
            : 'bg-white border-slate-300 hover:border-slate-400 text-slate-900'
        }`}
        title={selectedOption ? String(selectedOption.label) : placeholder}
      >
        <span
          className={`truncate text-base leading-normal ${
            selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Dropdown Menu: 16px font size, min-h 46px option height, generous padding, sufficient width */}
      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${selectId}-button`}
          className={`absolute left-0 z-50 mt-1.5 max-h-72 min-w-full w-max max-w-[calc(100vw-2rem)] sm:max-w-lg overflow-y-auto rounded-xl bg-white p-1.5 shadow-2xl border border-slate-200 focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100 ${menuClassName}`}
        >
          {parsedOptions.length === 0 ? (
            <div className="py-3 px-4 text-base text-slate-400 text-center">
              No options available
            </div>
          ) : (
            parsedOptions.map((opt, index) => {
              const isSelected = String(opt.value) === String(currentValue)
              const isHighlighted = highlightedIndex === index

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`relative flex items-center justify-between px-4 py-3 min-h-[46px] text-base rounded-lg cursor-pointer transition-colors select-none ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : isHighlighted
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-800 font-normal hover:bg-slate-50'
                  }`}
                >
                  <span className="whitespace-normal break-words pr-4 text-base leading-snug">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-blue-600 shrink-0 ml-2"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default Select
