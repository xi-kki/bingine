'use client'

import { useState, useEffect, useRef } from 'react'
import {
  getFoodItems,
  addFoodItem,
  deleteFoodItem,
  getWasteAnalytics,
  getRecipeSuggestions,
  CATEGORIES,
  FoodItem,
  FoodCategory,
} from '@/lib/foodStore'
import { parseVoiceInput, ParsedVoiceItem } from '@/lib/voiceParser'
import {
  Plus,
  Trash2,
  Leaf,
  TriangleAlert,
  Clock,
  Citrus,
  Fish,
  Carrot,
  Wheat,
  Milk,
  Coffee,
  Cookie,
  Package,
  X,
  TrendingDown,
  ChartBar,
  ChefHat,
  ShoppingCart,
  Mic,
  MicOff,
  Square,
  Sparkles,
} from 'lucide-react'

const CATEGORY_ICONS: Record<FoodCategory, React.ReactNode> = {
  vegetables: <Carrot className="w-8 h-8 text-green-600" strokeWidth={1.7} />,
  fruits: <Citrus className="w-8 h-8 text-red-500" strokeWidth={1.7} />,
  meat: <Fish className="w-8 h-8 text-red-700" strokeWidth={1.7} />,
  dairy: <Milk className="w-8 h-8 text-yellow-500" strokeWidth={1.7} />,
  grains: <Wheat className="w-8 h-8 text-amber-600" strokeWidth={1.7} />,
  beverages: <Coffee className="w-8 h-8 text-amber-700" strokeWidth={1.7} />,
  condiments: <Package className="w-8 h-8 text-purple-600" strokeWidth={1.7} />,
  snacks: <Cookie className="w-8 h-8 text-orange-500" strokeWidth={1.7} />,
  other: <ShoppingCart className="w-8 h-8 text-gray-500" strokeWidth={1.7} />,
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

  // Voice state
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceParsed, setVoiceParsed] = useState<ParsedVoiceItem | null>(null)
  const [voiceError, setVoiceError] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [toast, setToast] = useState('')
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const toastTimer = useRef<any>(null)

  // Load items on mount
  useEffect(() => {
    refreshData()
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const refreshData = () => {
    const loaded = getFoodItems()
    setItems(loaded)
    setAnalytics(getWasteAnalytics())
    setRecipes(getRecipeSuggestions())
  }

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  const resetForm = () => {
    setName('')
    setQuantity('')
    setCategory('other')
    setExpiryDate('')
    setNotes('')
  }

  const closeModal = () => {
    setShowAdd(false)
    setListening(false)
    setTranscript('')
    setVoiceParsed(null)
    setVoiceError('')
    if (recognitionRef.current) recognitionRef.current.stop()
    resetForm()
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

    resetForm()
    setShowAdd(false)
    setVoiceParsed(null)
    refreshData()
    showToast(`✓ ${name} added to your kitchen`)
  }

  const handleDelete = (id: string, itemName: string) => {
    deleteFoodItem(id)
    refreshData()
    showToast(`Removed ${itemName}`)
  }

  // --- Voice input ----------------------------------------------------------

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setVoiceSupported(false)
      return
    }
    if (recognitionRef.current) recognitionRef.current.stop()

    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.continuous = false // auto-stops after a pause so we can parse

    rec.onresult = (e: any) => {
      let text = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript
      }
      transcriptRef.current = text
      setTranscript(text)
    }

    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setVoiceError('Microphone blocked — allow mic access for this site in your browser.')
      } else if (e.error === 'no-speech') {
        setVoiceError("I didn't catch that — tap the mic and try again.")
      } else if (e.error !== 'aborted') {
        setVoiceError(`Voice error: ${e.error}`)
      }
      setListening(false)
    }

    rec.onend = () => {
      setListening(false)
      const spoken = transcriptRef.current.trim()
      if (!spoken) return

      const parsed = parseVoiceInput(spoken)
      setVoiceParsed(parsed)
      // prefill the form so the user can review / edit before adding
      setName(parsed.name)
      setQuantity(parsed.quantity)
      setCategory(parsed.category)
      setExpiryDate(parsed.expiryDate)
    }

    recognitionRef.current = rec
    transcriptRef.current = ''
    setTranscript('')
    setVoiceParsed(null)
    setVoiceError('')
    try {
      rec.start()
      setListening(true)
    } catch {
      setVoiceError('Voice input could not start — try again.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setListening(false)
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
      case 'fresh': return <Leaf className="w-4 h-4" />
      case 'warning': return <Clock className="w-4 h-4" />
      case 'expiring': return <TriangleAlert className="w-4 h-4" />
      case 'expired': return <TrendingDown className="w-4 h-4" />
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const formatDate = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-bingine-green text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            Bingine
          </a>
          <nav className="flex gap-6">
            <a href="/" className="hover:opacity-80">Home</a>
            <span className="opacity-60">Dashboard</span>
          </nav>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

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
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-gray-900">My Kitchen</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAdd(true); setTimeout(startListening, 400) }}
                  className="bg-white text-bingine-green border-2 border-bingine-green px-6 py-3 rounded-full font-semibold hover:bg-bingine-green/5 transition-all hover:scale-105 flex items-center gap-2"
                  title="Add an item by speaking"
                >
                  <Mic className="w-5 h-5" />
                  Voice Add
                </button>
                <button
                  onClick={() => setShowAdd(true)}
                  className="bg-bingine-green text-white px-6 py-3 rounded-full font-semibold hover:bg-bingine-green/90 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your kitchen is empty</h3>
                <p className="text-gray-500 mb-6">Add your first food item — by typing or with your voice</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowAdd(true)}
                    className="bg-bingine-green text-white px-6 py-3 rounded-full font-semibold hover:bg-bingine-green/90 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Item
                  </button>
                  <button
                    onClick={() => { setShowAdd(true); setTimeout(startListening, 400) }}
                    className="bg-white text-bingine-green border-2 border-bingine-green px-6 py-3 rounded-full font-semibold hover:bg-bingine-green/5 flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Speak It
                  </button>
                </div>
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
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
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
                <ChefHat className="w-5 h-5 text-bingine-green" />
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
                          <span key={recipe} className="text-xs bg-bingine-green/10 text-bingine-green px-2 py-1 rounded">
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
                <ChartBar className="w-5 h-5 text-bingine-green" />
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
                  {analytics.wasteRate <= 10 ? '✨ Great job minimizing waste!' :
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
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Food Item</h2>
              <div className="flex items-center gap-2">
                {/* Voice mic button */}
                <button
                  onClick={listening ? stopListening : startListening}
                  className={`p-2 rounded-full transition-all ${
                    listening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-bingine-green hover:bg-bingine-green/10'
                  }`}
                  title={listening ? 'Stop listening' : 'Add by voice'}
                  aria-label={listening ? 'Stop voice input' : 'Start voice input'}
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Voice panel */}
            {listening && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <p className="font-medium text-red-700 text-sm">Listening… say something like</p>
                </div>
                <p className="text-xs text-red-600/80 mt-1 italic">
                  "add chicken breast, 500 grams, expires in 3 days"
                </p>
                {transcript && (
                  <p className="mt-2 text-sm text-gray-800 bg-white rounded-lg px-3 py-2">"{transcript}"</p>
                )}
                <button
                  onClick={stopListening}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                >
                  <Square className="w-3 h-3" fill="currentColor" />
                  Stop
                </button>
              </div>
            )}

            {voiceParsed && !listening && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="flex items-center gap-2 font-medium text-green-800 text-sm">
                  <Sparkles className="w-4 h-4" />
                  Detected — review and tap Add Item
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="bg-white px-2.5 py-1 rounded-full border border-green-200 text-green-900">
                    {voiceParsed.name || '—'}
                  </span>
                  {voiceParsed.quantity && (
                    <span className="bg-white px-2.5 py-1 rounded-full border border-green-200 text-green-900">
                      {voiceParsed.quantity}
                    </span>
                  )}
                  <span className="bg-white px-2.5 py-1 rounded-full border border-green-200 text-green-900">
                    {CATEGORIES.find(c => c.value === voiceParsed.category)?.label || voiceParsed.category}
                  </span>
                  {voiceParsed.expiryDate && (
                    <span className="bg-white px-2.5 py-1 rounded-full border border-green-200 text-green-900">
                      Expires {formatDate(voiceParsed.expiryDate)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {voiceError && !listening && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-2">
                <TriangleAlert className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-sm text-orange-800">{voiceError}</p>
              </div>
            )}

            {!voiceSupported && (
              <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-600">
                  Voice input isn't supported in this browser. Try Chrome or Edge — or just type below. 🎤
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chicken breast"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bingine-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 500g, 2 packs"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bingine-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bingine-green"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bingine-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Store in fridge, use for stir-fry"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bingine-green"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name || !expiryDate}
                className="flex-1 px-4 py-3 bg-bingine-green text-white rounded-xl font-semibold hover:bg-bingine-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
