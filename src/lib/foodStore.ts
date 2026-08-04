// Local storage food item manager — 100% offline
export interface FoodItem {
  id: string
  name: string
  quantity: string
  category: FoodCategory
  expiryDate: string // ISO date string
  addedDate: string
  notes?: string
  status: 'fresh' | 'warning' | 'expiring' | 'expired'
}

export type FoodCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'meat' 
  | 'dairy' 
  | 'grains' 
  | 'beverages' 
  | 'condiments' 
  | 'snacks' 
  | 'other'

export const CATEGORIES: { value: FoodCategory; label: string; icon: string }[] = [
  { value: 'vegetables', label: 'Vegetables', icon: 'leaf' },
  { value: 'fruits', label: 'Fruits', icon: 'apple' },
  { value: 'meat', label: 'Meat & Fish', icon: 'steak' },
  { value: 'dairy', label: 'Dairy', icon: 'cheese' },
  { value: 'grains', label: 'Grains & Bread', icon: 'wheat' },
  { value: 'beverages', label: 'Beverages', icon: 'coffee' },
  { value: 'condiments', label: 'Condiments', icon: 'jar' },
  { value: 'snacks', label: 'Snacks', icon: 'cookie' },
  { value: 'other', label: 'Other', icon: 'package' },
]

const STORAGE_KEY = 'bingine-food-items'
const LEGACY_STORAGE_KEY = 'xpiri-food-items' // pre-rebrand key — migrate on read

// Migrate data saved under the old Xpiri key so users keep their items
function migrateLegacyData(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(STORAGE_KEY)) return
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (legacy) {
    localStorage.setItem(STORAGE_KEY, legacy)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  }
}

// Calculate status based on expiry date
function calculateStatus(expiryDate: string): FoodItem['status'] {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 2) return 'expiring'
  if (daysUntilExpiry <= 7) return 'warning'
  return 'fresh'
}

// Get all food items from localStorage
export function getFoodItems(): FoodItem[] {
  if (typeof window === 'undefined') return []

  migrateLegacyData()

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  const items: FoodItem[] = JSON.parse(stored)
  
  // Recalculate status on each read
  return items.map(item => ({
    ...item,
    status: calculateStatus(item.expiryDate),
  })).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
}

// Add a new food item
export function addFoodItem(item: Omit<FoodItem, 'id' | 'addedDate' | 'status'>): FoodItem {
  const items = getFoodItems()
  
  const newItem: FoodItem = {
    ...item,
    id: crypto.randomUUID(),
    addedDate: new Date().toISOString(),
    status: calculateStatus(item.expiryDate),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]))
  return newItem
}

// Update a food item
export function updateFoodItem(id: string, updates: Partial<FoodItem>): FoodItem | null {
  const items = getFoodItems()
  const index = items.findIndex(item => item.id === id)
  
  if (index === -1) return null

  const updatedItem = { ...items[index], ...updates }
  updatedItem.status = calculateStatus(updatedItem.expiryDate)
  
  items[index] = updatedItem
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  
  return updatedItem
}

// Delete a food item
export function deleteFoodItem(id: string): boolean {
  const items = getFoodItems()
  const filtered = items.filter(item => item.id !== id)
  
  if (filtered.length === items.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

// Get items expiring soon (within N days)
export function getExpiringSoon(days: number = 3): FoodItem[] {
  return getFoodItems().filter(item => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry >= 0 && daysUntilExpiry <= days
  })
}

// Get waste analytics
export function getWasteAnalytics() {
  const items = getFoodItems()
  const now = new Date()
  
  const total = items.length
  const expired = items.filter(i => i.status === 'expired').length
  const expiring = items.filter(i => i.status === 'expiring').length
  const warning = items.filter(i => i.status === 'warning').length
  const fresh = items.filter(i => i.status === 'fresh').length
  
  // Items by category
  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total,
    expired,
    expiring,
    warning,
    fresh,
    byCategory,
    wasteRate: total > 0 ? Math.round((expired / total) * 100) : 0,
  }
}

// Get recipe suggestions based on expiring items
export function getRecipeSuggestions(): { item: FoodItem; recipes: string[] }[] {
  const expiringItems = getExpiringSoon(3)
  
  const recipeMap: Record<string, string[]> = {
    'chicken': ['Stir-fry', 'Chicken soup', 'Grilled chicken', 'Caesar salad'],
    'beef': ['Beef stew', 'Tacos', 'Stir-fry', 'Pasta bolognese'],
    'fish': ['Fish tacos', 'Baked salmon', 'Fish curry', 'Fish and chips'],
    'milk': ['Pancakes', 'Hot chocolate', 'Cream sauce', 'Smoothie'],
    'cheese': ['Grilled cheese', 'Pasta carbonara', 'Quesadilla', 'Cheese fondue'],
    'bread': ['French toast', 'Croutons', 'Bread pudding', 'Sandwiches'],
    'tomato': ['Pasta sauce', 'Bruschetta', 'Tomato soup', 'Salad'],
    'potato': ['Mashed potatoes', 'French fries', 'Potato salad', 'Soup'],
    'onion': ['Caramelized onions', 'French onion soup', 'Fajitas', 'Stir-fry'],
    'carrot': ['Carrot soup', 'Roasted carrots', 'Carrot cake', 'Stir-fry'],
    'lettuce': ['Caesar salad', 'Tacos', 'Lettuce wraps', 'Garden salad'],
    'apple': ['Apple pie', 'Apple sauce', 'Fruit salad', 'Smoothie'],
    'banana': ['Banana bread', 'Smoothie', 'Pancakes', 'Fruit salad'],
    'egg': ['Omelette', 'Quiche', 'Scrambled eggs', 'French toast'],
    'rice': ['Fried rice', 'Risotto', 'Rice pudding', 'Stir-fry'],
    'pasta': ['Pasta carbonara', 'Mac and cheese', 'Pasta salad', 'Spaghetti'],
  }

  return expiringItems.map(item => {
    const lowerName = item.name.toLowerCase()
    const recipes = Object.entries(recipeMap).find(([key]) => lowerName.includes(key))?.[1] || [
      'Use in a stir-fry',
      'Add to a soup',
      'Make a salad',
      'Freeze for later',
    ]
    return { item, recipes }
  })
}
