export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return formatDateOnly(dateString)
}

/**
 * Validates Malaysian telephone numbers.
 * Supports:
 * - Local prefix: 01x-xxx xxxx, 011-xxxx xxxx, 01xxxxxxxx (10 to 11 digits)
 * - International prefix: +60 1x-xxx xxxx, +601xxxxxxxx, 601xxxxxxxx (11 to 12 digits)
 */
export const validateMalaysianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: 'Telephone number is required.' }
  }
  const trimmed = phone.trim()
  if (!trimmed) {
    return { valid: false, message: 'Telephone number is required.' }
  }

  // Strip spaces, hyphens, parentheses
  const clean = trimmed.replace(/[\s\-().]/g, '')

  // Regex pattern for Malaysian mobile numbers
  const myPhoneRegex = /^(?:\+?60|0)1[0-9]{8,9}$/

  if (!myPhoneRegex.test(clean)) {
    return {
      valid: false,
      message: 'Please enter a valid Malaysian mobile number (e.g., +60 12-345 6789 or 012-345 6789).',
    }
  }

  return { valid: true, clean }
}

/**
 * Formats Malaysian phone numbers into standard readable format while preserving user inputs.
 */
export const formatMalaysianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return ''
  const trimmed = phone.trim()
  if (!trimmed) return ''

  const clean = trimmed.replace(/[\s\-().]/g, '')

  // Format +601xxxxxxxxx
  if (clean.startsWith('+601')) {
    if (clean.startsWith('+6011') && clean.length === 13) {
      return `+60 11-${clean.slice(5, 9)} ${clean.slice(9)}`
    } else if (clean.length === 12) {
      return `+60 ${clean.slice(3, 5)}-${clean.slice(5, 8)} ${clean.slice(8)}`
    }
  } else if (clean.startsWith('601')) {
    if (clean.startsWith('6011') && clean.length === 12) {
      return `+60 11-${clean.slice(4, 8)} ${clean.slice(8)}`
    } else if (clean.length === 11) {
      return `+60 ${clean.slice(2, 4)}-${clean.slice(4, 7)} ${clean.slice(7)}`
    }
  } else if (clean.startsWith('01')) {
    if (clean.startsWith('011') && clean.length === 11) {
      return `011-${clean.slice(3, 7)} ${clean.slice(7)}`
    } else if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)} ${clean.slice(6)}`
    }
  }

  return trimmed
}
