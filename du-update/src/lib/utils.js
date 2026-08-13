export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const COURSE_MAP = {
  'bcom-hons':        'B.Com (Honours)',
  'bcom-prog':        'B.Com (Programme)',
  'ba-eco-hons':      'BA (Hons) Economics',
  'ba-eng-hons':      'BA (Hons) English',
  'ba-polsci-hons':   'BA (Hons) Political Science',
  'bca':              'BCA',
  'bsc-maths-hons':   'B.Sc (Hons) Mathematics',
}

export function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

export function attendanceColor(pct) {
  if (pct >= 75) return '#16a34a'
  if (pct >= 60) return '#ca8a04'
  return '#dc2626'
}
