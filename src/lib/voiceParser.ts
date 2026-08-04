// Voice input parser — turns spoken kitchen items into structured food data.
// Pure function, no browser APIs, easily unit-testable.

import type { FoodCategory } from './foodStore'

export interface ParsedVoiceItem {
  name: string
  quantity: string
  category: FoodCategory
  expiryDate: string // 'YYYY-MM-DD' or ''
  raw: string
}

// Number words → digits so "expires in three days" and "five hundred grams" work
const NUM_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
}

function wordsToNumber(text: string): number | null {
  const words = text.trim().toLowerCase().split(/\s+/)
  let total = 0
  let current = 0
  for (const w of words) {
    if (!(w in NUM_WORDS)) return null
    const v = NUM_WORDS[w]
    if (v === 100) {
      current = current === 0 ? v : current * v
    } else if (v >= 20) {
      current += v
    } else {
      current += v
    }
    if (w === 'hundred') { total += current; current = 0 }
  }
  total += current
  return total > 0 ? total : null
}

const MONTHS: Record<string, number> = {
  january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4,
  jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
}

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

// --- Expiry extraction ------------------------------------------------------

function extractExpiry(text: string): { date: string; removed: string[] } {
  const lower = text.toLowerCase()
  let date = ''
  let remaining = lower

  // "expires in three days" / "expires in 3 days" / "in 2 days"
  let m = remaining.match(/(?:expires?|use by|best before|good for)\s+in\s+([a-z]+|\d+)\s+days?/)
  if (!m) m = remaining.match(/(?:^|\s)in\s+([a-z]+|\d+)\s+days?/)
  if (m) {
    const n = /^\d+$/.test(m[1]) ? parseInt(m[1], 10) : wordsToNumber(m[1])
    if (n !== null) {
      date = daysFromNow(n)
      remaining = remaining.replace(m[0], ' ')
    }
  }

  // "expires tomorrow" / "expires today" / "expires tonight"
  if (!date) {
    m = remaining.match(/(?:expires?|use by|best before)\s+(today|tonight|tomorrow)/)
    if (m) {
      date = m[1] === 'tomorrow' ? daysFromNow(1) : daysFromNow(0)
      remaining = remaining.replace(m[0], ' ')
    }
  }

  // "expires next week"
  if (!date) {
    m = remaining.match(/(?:expires?|use by|best before)\s+next\s+week/)
    if (m) { date = daysFromNow(7); remaining = remaining.replace(m[0], ' ') }
  }

  // "expires on august 10" / "expires august 10th" / "use by december 25"
  if (!date) {
    m = remaining.match(/(?:expires?|use by|best before)(?:\s+on)?\s+([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?/)
    if (m && MONTHS[m[1]] !== undefined) {
      const month = MONTHS[m[1]]
      const day = Math.min(31, parseInt(m[2], 10))
      const year = new Date().getFullYear()
      const candidate = new Date(year, month, day)
      if (candidate.getTime() < Date.now() - 86400000) candidate.setFullYear(year + 1)
      date = toISODate(candidate)
      remaining = remaining.replace(m[0], ' ')
    }
  }

  // "expires 10/08" or "expires 10-08"
  if (!date) {
    m = remaining.match(/(?:expires?|use by|best before)\s+(\d{1,2})[\/\-.](\d{1,2})/)
    if (m) {
      const a = parseInt(m[1], 10)
      const b = parseInt(m[2], 10)
      // treat as day/month (common outside US)
      const day = a <= 31 && b <= 12 ? a : b
      const month = a <= 31 && b <= 12 ? b - 1 : a - 1
      const year = new Date().getFullYear()
      const candidate = new Date(year, month, day)
      if (candidate.getTime() < Date.now() - 86400000) candidate.setFullYear(year + 1)
      date = toISODate(candidate)
      remaining = remaining.replace(m[0], ' ')
    }
  }

  // default: nothing said → a week out is a sensible "use soon" default
  if (!date) date = daysFromNow(7)

  return { date, removed: [remaining] }
}

// --- Quantity extraction ----------------------------------------------------

const UNITS = [
  'kilograms', 'kilogram', 'kgs', 'kg',
  'grams', 'gram', 'g',
  'liters', 'liter', 'litres', 'litre', 'liters', 'l',
  'milliliters', 'millilitres', 'mls', 'ml',
  'packets', 'packet', 'packs', 'pack',
  'bottles', 'bottle', 'cans', 'can', 'cartons', 'carton',
  'tubers', 'tuber', 'pieces', 'piece', 'heads', 'head',
  'bunches', 'bunch', 'loaves', 'loaf', 'bars', 'bar',
  'bags', 'bag', 'boxes', 'box', 'cups', 'cup', 'slices', 'slice',
  'units', 'unit', 'sticks', 'stick', 'cloves', 'clove', 'dozens', 'dozen',
  'eggs', 'egg',
].join('|')

// abbreviations stay tight (500g), full words get a space (3 tubers)
const SHORT_UNITS: Record<string, string> = {
  kilograms: 'kg', kilogram: 'kg', kgs: 'kg', kg: 'kg',
  grams: 'g', gram: 'g', g: 'g',
  liters: 'L', liter: 'L', litres: 'L', litre: 'L', l: 'L',
  milliliters: 'ml', millilitres: 'ml', mls: 'ml', ml: 'ml',
  packets: 'packs', packet: 'packs', packs: 'packs', pack: 'packs',
  dozens: 'dozen', dozen: 'dozen',
}

function extractQuantity(text: string): { quantity: string; remaining: string } {
  let remaining = text

  // 1) numeric: "500 grams" / "2kg" / "1.5 liters" / "3 tubers"
  let m = remaining.match(new RegExp(`\\b(\\d+(?:\\.\\d+)?)\\s*(${UNITS})\\b`))
  if (m) {
    const num = m[1].replace(/\.0+$/, '')
    const unit = m[2]
    const short = SHORT_UNITS[unit] || unit
    const qty = short.length <= 2 ? `${num}${short}` : `${num} ${short}`
    remaining = remaining.replace(m[0], ' ')
    return { quantity: qty, remaining }
  }

  // 2) word numbers: "five hundred grams" / "two packs" / "a loaf" / "five eggs"
  const unitMatch = remaining.match(new RegExp(`\\b(${UNITS})\\b`))
  if (unitMatch && unitMatch.index !== undefined) {
    const unitWord = unitMatch[1]
    const before = remaining.slice(0, unitMatch.index).trim().split(/\s+/).filter(Boolean)
    const numWords: string[] = []
    for (let i = before.length - 1; i >= 0 && numWords.length < 4; i--) {
      const w = before[i]
      if (w in NUM_WORDS) {
        numWords.unshift(w)
      } else if ((w === 'a' || w === 'an') && numWords.length === 0) {
        numWords.unshift('one')
        break
      } else {
        break
      }
    }
    if (numWords.length > 0) {
      const n = wordsToNumber(numWords.join(' '))
      if (n !== null) {
        const short = SHORT_UNITS[unitWord] || unitWord
        const qty = short.length <= 2 ? `${n}${short}` : `${n} ${short}`
        const phrase = numWords.join('\\s+') + '\\s+' + unitWord
        remaining = remaining.replace(new RegExp(`\\b${phrase}\\b`, 'i'), ' ')
        return { quantity: qty, remaining }
      }
    }
  }

  // 3) bare number: "2 tomatoes"
  m = remaining.match(/(\d+(?:\.\d+)?)\s+([a-z]+)/)
  if (m) {
    remaining = remaining.replace(m[0], ` ${m[2]} `)
    return { quantity: m[1], remaining }
  }

  return { quantity: '', remaining }
}

// --- Category inference -----------------------------------------------------

const CATEGORY_KEYWORDS: Record<Exclude<FoodCategory, 'other'>, string[]> = {
  vegetables: ['broccoli', 'spinach', 'kale', 'cabbage', 'cucumber', 'lettuce', 'pepper', 'peppers',
    'onion', 'onions', 'garlic', 'ginger', 'carrot', 'carrots', 'tomato', 'tomatoes', 'potato',
    'potatoes', 'yam', 'yams', 'plantain', 'plantains', 'sweet potato', 'green beans', 'peas',
    'mushroom', 'mushrooms', 'corn', 'okra', 'pumpkin', 'squash', 'celery', 'vegetables', 'vegetable'],
  fruits: ['apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'mango', 'mangoes',
    'grape', 'grapes', 'strawberry', 'strawberries', 'watermelon', 'pineapple', 'pineapples',
    'pear', 'pears', 'peach', 'peaches', 'plum', 'plums', 'kiwi', 'avocado', 'avocados', 'fruit', 'fruits', 'lemon', 'lemons', 'lime', 'limes', 'cherry', 'cherries'],
  meat: ['chicken', 'beef', 'fish', 'pork', 'turkey', 'goat', 'meat', 'lamb', 'steak', 'suya',
    'sausage', 'sausages', 'bacon', 'shrimp', 'prawn', 'prawns', 'salmon', 'tilapia', 'cow meat',
    'drumstick', 'drumsticks', 'wings', 'gizzard'],
  dairy: ['milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'cream', 'egg', 'eggs', 'fage', 'wara',
    'ice cream', 'margarine'],
  grains: ['bread', 'rice', 'pasta', 'wheat', 'flour', 'oats', 'cereal', 'noodles', 'spaghetti',
    'garri', 'beans', 'bean', 'couscous', 'cornflakes', 'baguette', 'tortilla', 'tortillas', 'loaf'],
  beverages: ['water', 'juice', 'soda', 'coke', 'coffee', 'tea', 'wine', 'beer', 'malt', 'drink',
    'drinks', 'orange juice', 'coconut water', 'zobo', 'kombucha', 'smoothie'],
  condiments: ['salt', 'pepper sauce', 'ketchup', 'mayonnaise', 'mayo', 'oil', 'vinegar', 'sauce',
    'soy sauce', 'honey', 'jam', 'seasoning', 'stock cube', 'maggi', 'curry', 'mustard', 'kuli-kuli',
    'groundnut oil', 'palm oil', 'shito'],
  snacks: ['chips', 'biscuit', 'biscuits', 'cookie', 'cookies', 'cracker', 'crackers', 'chocolate',
    'candy', 'nuts', 'peanuts', 'popcorn', 'snack', 'snacks', 'granola', 'chewing gum'],
}

function inferCategory(name: string): FoodCategory {
  const lower = name.toLowerCase()
  let best: FoodCategory = 'other'
  let bestLen = 0
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw) && kw.length > bestLen) {
        best = cat as FoodCategory
        bestLen = kw.length
      }
    }
  }
  return best
}

// --- Filler removal ---------------------------------------------------------

const FILLERS = [
  'please', 'can you', 'could you', "i'd like to", 'i would like to', 'i want to', 'i wanna',
  'add a', 'add an', 'add some', 'add the', 'add', 'we have', 'i have', "there's", 'there is',
  'put', 'log', 'track', 'new item', 'item', 'that is', "that's", 'a', 'an', 'some',
  'also', 'and', 'okay', 'ok', 'yes', 'let me add', "i'm adding", 'im adding', 'going to add',
  'for the week', 'for the weekend', 'of',
]

function cleanName(remaining: string): string {
  let name = remaining.toLowerCase()
  name = name.replace(/\s{2,}/g, ' ').trim()
  for (const f of FILLERS) {
    const esc = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // leading
    name = name.replace(new RegExp(`^\\s*${esc}(?=\\s|$)`, 'i'), ' ')
    // trailing (e.g. "... for the week")
    name = name.replace(new RegExp(`(?:^|\\s)${esc}\\s*$`, 'i'), ' ')
  }
  name = name.replace(/\s{2,}/g, ' ').trim()
  // trailing stray words / punctuation
  name = name.replace(/[.,!?;:]+$/, '').trim()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// --- Main parser ------------------------------------------------------------

export function parseVoiceInput(transcript: string): ParsedVoiceItem {
  const raw = transcript.trim()
  let work = ` ${raw.toLowerCase()} `

  // 1) expiry
  const { date, removed } = extractExpiry(work)
  work = removed[0]

  // 2) quantity
  const { quantity, remaining } = extractQuantity(work)
  work = remaining

  // 3) name = what's left, cleaned
  let name = cleanName(work)
  // fallback: if everything was quantity (e.g. "five eggs"), keep the unit as the name
  if (!name) name = cleanName(extractExpiry(raw.toLowerCase()).removed[0])
  if (!name) name = raw.charAt(0).toUpperCase() + raw.slice(1)

  return {
    name,
    quantity,
    category: inferCategory(name || raw),
    expiryDate: date,
    raw,
  }
}
