import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  addDays,
  dateKey,
  daysUntil,
  defaultSettings,
  parseDate,
  seedItems,
} from './data'

const STORAGE_KEY = 'homekeep.prototype.v1'
const StoreContext = createContext(null)

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

const initialSaved = readSaved()

const fullScreenRoutes = new Set(['scan', 'add', 'edit'])
const routeSections = {
  home: 'home',
  items: 'items',
  categories: 'items',
  category: 'items',
  locations: 'items',
  location: 'items',
  allItems: 'items',
  item: 'items',
  trash: 'items',
  reminders: 'reminders',
  reminderSettings: 'reminders',
  settings: 'settings',
  privacy: 'settings',
  about: 'settings',
}

export function StoreProvider({ children }) {
  const [items, setItems] = useState(initialSaved?.items ?? seedItems)
  const [settings, setSettings] = useState({
    ...defaultSettings,
    ...(initialSaved?.settings ?? {}),
  })
  const [stack, setStack] = useState([{ name: 'home', params: {} }])
  const [toastState, setToastState] = useState(null)
  const [confirmState, setConfirmState] = useState(null)
  const toastTimer = useRef(null)
  const [clockTick, setClockTick] = useState(0)

  useEffect(() => {
    const tick = () => setClockTick((value) => value + 1)
    const timer = window.setInterval(tick, 30_000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    window.addEventListener('focus', tick)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', tick)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, settings }))
    } catch {
      // The prototype still works when storage is unavailable.
    }
  }, [items, settings])

  const route = stack[stack.length - 1]
  const activeTab = routeSections[route.name] ?? null
  const isFullScreen = fullScreenRoutes.has(route.name)
  const showTabBar = !isFullScreen

  const navigate = useCallback((name, params = {}) => {
    setStack((prev) => [...prev, { name, params }])
    requestAnimationFrame(() => {
      const scroller = document.querySelector('.app-scroll')
      if (scroller) scroller.scrollTop = 0
    })
  }, [])

  const goTab = useCallback((name) => {
    setStack([{ name, params: {} }])
    requestAnimationFrame(() => {
      const scroller = document.querySelector('.app-scroll')
      if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [])

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : [{ name: 'home', params: {} }]))
    requestAnimationFrame(() => {
      const scroller = document.querySelector('.app-scroll')
      if (scroller) scroller.scrollTop = 0
    })
  }, [])

  const resetStack = useCallback((name = 'items') => {
    setStack([{ name, params: {} }])
  }, [])

  const toast = useCallback((message, options = {}) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastState({ message, ...options, key: Date.now() })
    toastTimer.current = setTimeout(() => setToastState(null), options.duration ?? 2400)
  }, [])

  const askConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? '确认',
        cancelLabel: options.cancelLabel ?? '取消',
        danger: Boolean(options.danger),
        onResolve: resolve,
      })
    })
  }, [])

  const resolveConfirm = useCallback((value) => {
    setConfirmState((state) => {
      state?.onResolve?.(value)
      return null
    })
  }, [])

  const addItem = useCallback((item) => {
    const newItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: dateKey(),
      retained: false,
    }
    setItems((prev) => [newItem, ...prev])
    return newItem
  }, [])

  const updateItem = useCallback((id, patch) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const expiryChanged =
          (Object.prototype.hasOwnProperty.call(patch, 'expiryDate') &&
            patch.expiryDate !== item.expiryDate) ||
          (Object.prototype.hasOwnProperty.call(patch, 'expiryTime') &&
            (patch.expiryTime ?? null) !== (item.expiryTime ?? null))
        return {
          ...item,
          ...patch,
          ...(expiryChanged ? { retained: false } : {}),
        }
      }),
    )
  }, [])

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const adjustQuantity = useCallback((id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + delta) } : item,
      ),
    )
  }, [])

  const retainItem = useCallback((id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, retained: true } : item)))
  }, [])

  const markReplaced = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, replaceAt: addDays(item.replaceCycle ?? 30), lastReplaced: dateKey() }
          : item,
      ),
    )
  }, [])

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const generateExport = useCallback(
    () =>
      JSON.stringify(
        {
          app: 'HomeKeep',
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          settings,
          items,
        },
        null,
        2,
      ),
    [items, settings],
  )

  const clearData = useCallback(() => {
    setItems([])
    toast('所有本地数据已清空')
  }, [toast])

  const restoreDemo = useCallback(() => {
    setItems(seedItems)
    setSettings(defaultSettings)
    toast('演示数据已恢复')
  }, [toast])

  const helpers = useMemo(() => {
    const daysLeft = (item) => daysUntil(item.expiryDate)
    const isExpiredByDate = (item) => {
      if (!item.expiryDate) return false
      if (item.expiryTime) {
        const [hours, minutes] = item.expiryTime.split(':').map(Number)
        const expiry = parseDate(item.expiryDate)
        expiry.setHours(Number.isFinite(hours) ? hours : 23, Number.isFinite(minutes) ? minutes : 59, 59, 999)
        return expiry.getTime() < Date.now()
      }
      const d = daysLeft(item)
      return d !== null && d < 0
    }
    const isTrash = (item) => isExpiredByDate(item) && !item.retained
    const isRetainedExpired = (item) => isExpiredByDate(item) && item.retained
    const isLowStock = (item) => {
      const quantityMissing =
        item.quantity === null || item.quantity === undefined || item.quantity === ''
      if (quantityMissing) return false
      return (
        Number(item.quantity) === 0 ||
        (item.lowStockAt !== null && item.lowStockAt !== undefined && Number(item.quantity) < item.lowStockAt)
      )
    }
    const isSoon = (item) => {
      const d = daysLeft(item)
      return !isExpiredByDate(item) && d !== null && d >= 0 && d <= settings.defaultAdvance
    }
    const isReplacement = (item) => {
      if (!item.replaceAt) return false
      const d = daysUntil(item.replaceAt)
      return d !== null && d <= 7
    }
    const statusFor = (item) => {
      const d = daysLeft(item)
      if (isTrash(item)) {
        return {
          code: 'expired',
          label: d === 0 ? '今日过期' : `已过期 ${Math.abs(d)} 天`,
          short: '已过期',
          tone: 'expired',
        }
      }
      if (isRetainedExpired(item)) {
        return { code: 'retained', label: '已过期 · 已保留', short: '已保留', tone: 'expired' }
      }
      if (isSoon(item)) {
        return {
          code: 'soon',
          label: d === 0 ? '今天到期' : `${d} 天后到期`,
          short: d === 0 ? '今天到期' : `${d} 天后`,
          tone: 'soon',
        }
      }
      if (isLowStock(item)) {
        return {
          code: 'low',
          label: Number(item.quantity) === 0 ? '已用完' : '库存不足',
          short: Number(item.quantity) === 0 ? '已用完' : '库存不足',
          tone: 'low',
        }
      }
      if (isReplacement(item)) {
        return { code: 'replace', label: '需要更换', short: '需要更换', tone: 'replace' }
      }
      return { code: 'normal', label: '状态良好', short: '正常', tone: 'normal' }
    }
    const activeItems = items.filter((item) => !isTrash(item))
    const trashItems = items.filter(isTrash)
    const soonItems = activeItems.filter(isSoon)
    const lowItems = activeItems.filter(isLowStock)
    const replacementItems = activeItems.filter(isReplacement)
    return {
      daysLeft,
      isExpiredByDate,
      isTrash,
      isRetainedExpired,
      isLowStock,
      isSoon,
      isReplacement,
      statusFor,
      activeItems,
      trashItems,
      soonItems,
      lowItems,
      replacementItems,
      expiredCount: trashItems.length,
    }
  }, [items, settings.defaultAdvance, clockTick])

  const value = {
    items,
    settings,
    route,
    stack,
    activeTab,
    isFullScreen,
    showTabBar,
    helpers,
    toastState,
    confirmState,
    navigate,
    goTab,
    back,
    resetStack,
    toast,
    askConfirm,
    resolveConfirm,
    addItem,
    updateItem,
    deleteItem,
    adjustQuantity,
    retainItem,
    markReplaced,
    updateSettings,
    generateExport,
    clearData,
    restoreDemo,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
