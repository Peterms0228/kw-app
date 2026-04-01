import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [models, setModels]         = useState([])
  const [stocks, setStocks]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [toast, setToast]           = useState(null)
  const [manageMode, setManageMode] = useState(false)

  const toggleManageMode = useCallback(() => setManageMode(p => !p), [])

  // ── TOAST ──
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  // ── FETCH ALL ──
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [
      { data: catsData,    error: cErr },
      { data: modelsData,  error: mErr },
      { data: stocksData,  error: sErr },
    ] = await Promise.all([
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('models').select('*').order('name', { ascending: true }),
      supabase.from('stocks').select('*').order('created_at', { ascending: false }),
    ])
    if (cErr || mErr || sErr) {
      showToast('Failed to load data. Check your connection.', 'error')
    } else {
      setCategories(catsData  ?? [])
      setModels(modelsData    ?? [])
      setStocks(stocksData    ?? [])
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── CATEGORY ACTIONS ──
  const addCategory = useCallback(async (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const { data, error } = await supabase
      .from('categories').insert({ name: trimmed }).select().single()
    if (error) { showToast('Could not add category.', 'error'); return }
    setCategories(prev => [...prev, data])
    showToast(`"${trimmed}" added.`)
    return data
  }, [showToast])

  const deleteCategory = useCallback(async (id) => {
    const cat = categories.find(c => c.id === id)
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { showToast('Could not delete category.', 'error'); return }
    // cascade: remove child models + their stocks from local state
    const childModelIds = models.filter(m => m.category_id === id).map(m => m.id)
    setCategories(prev => prev.filter(c => c.id !== id))
    setModels(prev => prev.filter(m => m.category_id !== id))
    setStocks(prev => prev.filter(s => !childModelIds.includes(s.model_id)))
    showToast(`"${cat?.name}" deleted.`)
  }, [categories, models, showToast])

  // ── MODEL ACTIONS ──
  const addModel = useCallback(async (categoryId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const { data, error } = await supabase
      .from('models').insert({ category_id: categoryId, name: trimmed }).select().single()
    if (error) { showToast('Could not add model.', 'error'); return }
    setModels(prev => [...prev, data])
    showToast(`"${trimmed}" added.`)
    return data
  }, [showToast])

  const deleteModel = useCallback(async (id) => {
    const model = models.find(m => m.id === id)
    const { error } = await supabase.from('models').delete().eq('id', id)
    if (error) { showToast('Could not delete model.', 'error'); return }
    setModels(prev => prev.filter(m => m.id !== id))
    setStocks(prev => prev.filter(s => s.model_id !== id))
    showToast(`"${model?.name}" deleted.`)
  }, [models, showToast])

  // ── STOCK ACTIONS ──
  const addStock = useCallback(async (modelId, name, remark = '') => {
    const trimmed = name.trim()
    if (!trimmed) return
    const { data, error } = await supabase
      .from('stocks')
      .insert({ model_id: modelId, name: trimmed, quantity: 0, remark: remark.trim().slice(0, 100) })
      .select().single()
    if (error) { showToast('Could not add stock.', 'error'); return }
    setStocks(prev => [...prev, data])
    showToast(`"${trimmed}" added.`)
  }, [showToast])

  const deleteStock = useCallback(async (id) => {
    const stock = stocks.find(s => s.id === id)
    const { error } = await supabase.from('stocks').delete().eq('id', id)
    if (error) { showToast('Could not delete stock.', 'error'); return }
    setStocks(prev => prev.filter(s => s.id !== id))
    showToast(`"${stock?.name}" removed.`)
  }, [stocks, showToast])

  const updateQuantity = useCallback(async (id, delta) => {
    const stock = stocks.find(s => s.id === id)
    if (!stock) return
    const newQty = Math.max(0, stock.quantity + delta)
    const { error } = await supabase.from('stocks').update({ quantity: newQty }).eq('id', id)
    if (error) { showToast('Could not update quantity.', 'error'); return }
    setStocks(prev => prev.map(s => s.id === id ? { ...s, quantity: newQty } : s))
  }, [stocks, showToast])

  const updateRemark = useCallback(async (id, remark) => {
    const trimmed = remark.trim().slice(0, 100)
    const { error } = await supabase.from('stocks').update({ remark: trimmed }).eq('id', id)
    if (error) { showToast('Could not save remark.', 'error'); return }
    setStocks(prev => prev.map(s => s.id === id ? { ...s, remark: trimmed } : s))
  }, [showToast])

  // ── HELPERS ──
  const getModelsForCategory = useCallback(
    (categoryId) => models.filter(m => m.category_id === categoryId),
    [models]
  )
  const getStocksForModel = useCallback(
    (modelId) => stocks.filter(s => s.model_id === modelId),
    [stocks]
  )
  const totalItems = stocks.reduce((s, st) => s + (st.quantity ?? 0), 0)

  return (
    <InventoryContext.Provider value={{
      categories, models, stocks, loading, toast,
      manageMode, toggleManageMode,
      addCategory, deleteCategory,
      addModel, deleteModel,
      addStock, deleteStock, updateQuantity, updateRemark,
      getModelsForCategory, getStocksForModel,
      totalItems, showToast,
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export const useInventory = () => useContext(InventoryContext)
