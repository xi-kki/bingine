'use client'

import { useState, useEffect } from 'react'
import { 
  getFoodItems, 
  addFoodItem, 
  deleteFoodItem, 
  getWasteAnalytics, 
  getRecipeSuggestions,
  CATEGORIES,
  FoodItem,
  FoodCategory 
} from '@/lib/foodStore'
import {
  Plus,
  Trash2,
  Leaf,
  AlertTriangle,
  Clock,
  Apple,
  Beef,
  Fish,
  Egg,
  Carrot,
  Banana,
  Wheat,
  Milk,
  Coffee,
  Cookie,
  Package,
  X,
  TrendingDown,
  TrendingUp,
  BarChart3,
  ChefHat,
  ShoppingCart,
} from '@phosphor-icons/react'

const CATEGORY_ICONS: Record<FoodCategory, React.ReactNode> = {
  vegetables: <Carrot className="w-8 h-8 text-green-600" weight="duotone" />,
  fruits: <Apple className="w-8 h-8 text-red-500" weight="duotone" />,
  meat: <Beef className="w-8 h-8 text-red-700" weight="duotone" />,
  dairy: <Milk className="w-8 h-8 text-yellow-500" weight="duotone" />,
  grains: <Wheat className="w-8 h-8 text-amber-600" weight="duotone" />,
  beverages: <Coffee className="w-8 h-8 text-brown-600" weight="duotone" />,
  condiments: <Package className="w-8 h-8 text-purple-600" weight="duotone" />,
  snacks: <Cookie className="w-8 h-8 text-orange-500" weight="duotone" />,
  other: <ShoppingCart className="w-8 h-8 text-gray-500" weight="duotone" />,
}

export default function Dashboard() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [analytics, setAnalytics] = useState(getWasteAnalytics())
  const [recipes, setRecipes] = useState(getRecipeSuggestions())
  
  // Form state
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState<FoodCategory>('other')
  const [expiryDate, setExpiryDate] = useState('')
  const [notes, setNotes] = useState('')

  // Load items on mount
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    const loaded = getFoodItems()
    setItems(loaded)
    setAnalytics(getWasteAnalytics())
    setRecipes(getRecipeSuggestions())
  }

  const handleAdd = () => {
    if (!name || !expiryDate) return
    
    addFoodItem({
      name,
      quantity: quantity || '1',
      category,
      expiryDate,
      notes: notes || undefined,
    })
    
    // Reset form
    setName('')
    setQuantity('')
    setCategory('other')
    setExpiryDate('')
    setNotes('')
    setShowAdd(false)
    refreshData()
  }

  const handleDelete = (id: string) => {
    deleteFoodItem(id)
    refreshData()
  }

  const getStatusColor = (status: FoodItem['status']) => {
    switch (status) {
      case 'fresh': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getStatusLabel = (status: FoodItem['status']) => {
    switch (status) {
      case 'fresh': return 'Fresh'
      case 'warning': return 'Use Soon'
      case 'expiring': return 'Expiring!'
      case 'expired': return 'Expired'
    }
  }

  const getStatusIcon = (status: FoodItem['status']) => {
    switch (status) {
      case 'fresh': return <Leaf className="w-4 h-4" weight="duotone" />
      case 'warning': return <Clock className="w-4 h-4" weight="duotone" />
      case 'expiring': return <AlertTriangle className="w-4 h-4" weight="duotone" />
      case 'expired': return <TrendingDown className="w-4 h-4" weight="duotone" />
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-xpiri-green text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6" weight="duotone" />
            Xpiri
          </a>
          <nav className="flex gap-6">
            <a href="/" className="hover:opacity-80">Home</a>
            <span className="opacity-60">Dashboard</span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Items</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Fresh</p>
            <p className="text-3xl font-bold text-green-600">{analytics.fresh}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Expiring Soon</p>
            <p className="text-3xl font-bold text-orange-600">{analytics.expiring + analytics.warning}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Expired</p>
            <p className="text-3xl font-bold text-red-600">{analytics.expired}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Food Items List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Kitchen</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-xpiri-green text-white px-6 py-3 rounded-full font-semibold hover:bg-xpiri-green/90 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" weight="bold" />
                Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" weight="duotone" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your kitchen is empty</h3>
                <p className="text-gray-500 mb-6">Add your first food item to start tracking</p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="bg-xpiri-green text-white px-6 py-3 rounded-full font-semibold hover:bg-xpiri-green/90 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" weight="bold" />
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate)
                  
                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-4 rounded-xl border ${getStatusColor(item.status)} flex items-center gap-4`}
                    >
                      {CATEGORY_ICONS[item.category]}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-sm text-gray-500">×{item.quantity}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : 
                           daysLeft === 0 ? 'Expires today' :
                           `${daysLeft} days left`}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)} flex items-center gap-1`}>
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-5 h-5" weight="duotone" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Suggestions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-xpiri-green" weight="duotone" />
                Recipe Ideas
              </h3>
              {recipes.length === 0 ? (
                <p className="text-gray-500 text-sm">No items expiring soon. Add items to get recipe suggestions!</p>
              ) : (
                <div className="space-y-4">
                  {recipes.slice(0, 3).map(({ item, recipes: itemRecipes }) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {itemRecipes.slice(0, 2).map((recipe) => (
                          <span key={recipe} className="text-xs bg-xpiri-green/10 text-xpiri-green px-2 py-1 rounded">
                            {recipe}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Waste Stats */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-xpiri-green" weight="duotone" />
                Waste Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Waste Rate</span>
                  <span className="font-semibold text-red-600">{analytics.wasteRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${analytics.wasteRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {analytics.wasteRate <= 10 ? '🎉 Great job minimizing waste!' :
                   analytics.wasteRate <= 25 ? '👍 Not bad, room for improvement' :
                   '⚠️ Consider using items before they expire'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Food Item</h2>
              <button 
                onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chicken breast"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-xpiri-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 500g, 2 packs"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-xpiri-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-xpiri-green"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-xpiri-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Store in fridge, use for stir-fry"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-xpiri-green"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name || !expiryDate}
                className="flex-1 px-4 py-3 bg-xpiri-green text-white rounded-xl font-semibold hover:bg-xpiri-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" weight="bold" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
