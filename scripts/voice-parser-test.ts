// Voice parser test — runs natively with Node 24+ (no build step needed)
// Usage: npm test  (or: node scripts/voice-parser-test.ts)
import { parseVoiceInput } from '../src/lib/voiceParser.ts'

interface TestCase {
  input: string
  expect: {
    name: string
    category: string
    quantity?: string
    hasExpiry?: boolean
  }
}

const tests: TestCase[] = [
  { input: 'add chicken breast five hundred grams expires in three days', expect: { name: 'Chicken breast', category: 'meat', quantity: '500g', hasExpiry: true } },
  { input: 'add milk expires tomorrow', expect: { name: 'Milk', category: 'dairy', hasExpiry: true } },
  { input: 'two packs of noodles expires on august 10', expect: { name: 'Noodles', category: 'grains', quantity: '2 packs', hasExpiry: true } },
  { input: 'add bananas and oranges', expect: { name: 'Bananas and oranges', category: 'fruits' } },
  { input: '1.5 liters of water', expect: { name: 'Water', category: 'beverages', quantity: '1.5L' } },
  { input: 'add yam, 3 tubers', expect: { name: 'Yam', category: 'vegetables', quantity: '3 tubers' } },
  { input: 'chicken expires in 2 days', expect: { name: 'Chicken', category: 'meat', hasExpiry: true } },
  { input: 'add carrots and onions for the week', expect: { name: 'Carrots and onions', category: 'vegetables' } },
  { input: 'five eggs', expect: { name: 'Five eggs', category: 'dairy', quantity: '5 eggs' } },
  { input: 'add apple juice expires next week', expect: { name: 'Apple juice', category: 'fruits', hasExpiry: true } },
  { input: 'add tomatoes and pepper', expect: { name: 'Tomatoes and pepper', category: 'vegetables' } },
  { input: 'broccoli expires august 12', expect: { name: 'Broccoli', category: 'vegetables', hasExpiry: true } },
  { input: 'add groundnut oil', expect: { name: 'Groundnut oil', category: 'condiments' } },
  { input: 'a loaf of bread', expect: { name: 'Loaf of bread', category: 'grains', quantity: '1 loaf' } },
]

let passed = 0
let failed = 0

for (const t of tests) {
  const result = parseVoiceInput(t.input)
  const problems: string[] = []

  if (result.name !== t.expect.name) problems.push(`name: expected "${t.expect.name}", got "${result.name}"`)
  if (result.category !== t.expect.category) problems.push(`category: expected "${t.expect.category}", got "${result.category}"`)
  if (t.expect.quantity !== undefined && result.quantity !== t.expect.quantity) {
    problems.push(`quantity: expected "${t.expect.quantity}", got "${result.quantity}"`)
  }
  if (t.expect.hasExpiry === true && !result.expiryDate) problems.push('expiryDate: expected a date, got none')
  if (t.expect.hasExpiry === false && result.expiryDate) problems.push(`expiryDate: expected none, got "${result.expiryDate}"`)

  if (problems.length === 0) {
    passed++
    console.log(`✅ "${t.input}"`)
  } else {
    failed++
    console.log(`❌ "${t.input}"`)
    for (const p of problems) console.log(`   - ${p}`)
    console.log(`   raw output: ${JSON.stringify(result)}`)
  }
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
