import { useEffect, useState } from 'react'
import {
  Bell,
  House,
  LayoutGrid,
  ScanLine,
  Settings2,
} from 'lucide-react'
import { StoreProvider, useStore } from './store'
import { BrandMark, ConfirmDialog, LogoWordmark, Toast } from './components/ui'
import Home from './pages/Home'
import Items from './pages/Items'
import Reminders from './pages/Reminders'
import Settings from './pages/Settings'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import AllItems from './pages/AllItems'
import ItemDetail from './pages/ItemDetail'
import Scan from './pages/Scan'
import ItemForm from './pages/ItemForm'
import Trash from './pages/Trash'
import ReminderSettings from './pages/ReminderSettings'
import InfoPage from './pages/InfoPage'

const tabItems = [
  { id: 'home', label: '首页', icon: House },
  { id: 'items', label: '物品', icon: LayoutGrid },
  { id: 'scan', label: '扫描', center: true },
  { id: 'reminders', label: '提醒', icon: Bell },
  { id: 'settings', label: '设置', icon: Settings2 },
]

function StatusBar({ light = false }) {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }, 30_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`statusbar ${light ? 'is-light' : ''}`}>
      <span className="statusbar-time">{time}</span>
      <span className="dynamic-island" />
      <span className="statusbar-icons">
        <svg className="signal-icon" viewBox="0 0 18 12" fill="none" aria-hidden="true">
          <rect x="0" y="8" width="2.6" height="4" rx="1" fill="currentColor" />
          <rect x="4.6" y="6" width="2.6" height="6" rx="1" fill="currentColor" />
          <rect x="9.2" y="3.2" width="2.6" height="8.8" rx="1" fill="currentColor" />
          <rect x="13.8" y="0" width="2.6" height="12" rx="1" fill="currentColor" />
        </svg>
        <svg className="wifi-icon" viewBox="0 0 16 11" fill="none" aria-hidden="true">
          <path d="M1 3.5A10.7 10.7 0 0 1 15 3.5M3.6 6A7.1 7.1 0 0 1 12.4 6M6.1 8.4a3.2 3.2 0 0 1 3.8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="10.2" r=".7" fill="currentColor" />
        </svg>
        <svg className="battery-icon" viewBox="0 0 24 12" fill="none" aria-hidden="true">
          <rect x="1" y="1.4" width="19.5" height="9.2" rx="2.6" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
          <rect x="3" y="3.4" width="14.5" height="5.2" rx="1.3" fill="currentColor" />
          <path d="M22 4.4v3.3c.9-.3 1.3-.8 1.3-1.7 0-.8-.4-1.3-1.3-1.6Z" fill="currentColor" opacity=".6" />
        </svg>
      </span>
    </div>
  )
}

function BottomNav() {
  const { activeTab, goTab, navigate } = useStore()
  return (
    <nav className="tabbar" aria-label="主导航">
      {tabItems.map((tab) => {
        const Icon = tab.icon
        if (tab.center) {
          return (
            <button
              key={tab.id}
              className="tabbar-item scan-tab"
              onClick={() => navigate('scan')}
              aria-label="扫描添加物品"
            >
              <span className="scan-bubble">
                <ScanLine size={24} strokeWidth={1.8} />
                <span className="scan-spark" />
              </span>
              <span className="tab-label">扫描</span>
            </button>
          )
        }
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            className={`tabbar-item ${active ? 'is-active' : ''}`}
            onClick={() => goTab(tab.id)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="tab-icon-wrap">
              <Icon size={21} strokeWidth={active ? 2 : 1.7} />
            </span>
            <span className="tab-label">{tab.label}</span>
            {active && <span className="tab-active-dot" />}
          </button>
        )
      })}
    </nav>
  )
}

function RouteView() {
  const { route } = useStore()
  switch (route.name) {
    case 'home':
      return <Home />
    case 'items':
      return <Items />
    case 'categories':
      return <Categories />
    case 'category':
      return <CategoryDetail />
    case 'locations':
      return <Locations />
    case 'location':
      return <LocationDetail />
    case 'allItems':
      return <AllItems />
    case 'item':
      return <ItemDetail />
    case 'scan':
      return <Scan />
    case 'add':
    case 'edit':
      return <ItemForm />
    case 'reminders':
      return <Reminders />
    case 'reminderSettings':
      return <ReminderSettings />
    case 'trash':
      return <Trash />
    case 'settings':
      return <Settings />
    case 'privacy':
    case 'about':
      return <InfoPage />
    default:
      return <Home />
  }
}

function ShowcaseChrome() {
  return (
    <div className="showcase-chrome" aria-hidden="true">
      <div className="showcase-brand">
        <LogoWordmark />
        <p>Know what you have, where it is,<br />and when it expires.</p>
      </div>
      <div className="showcase-caption">
        <span>交互原型 · 2026</span>
        <span>Household essentials, quietly organized.</span>
      </div>
      <div className="showcase-side-note">
        <span>01</span>
        <p>3D 家的空间</p>
        <span>02</span>
        <p>智能到期提醒</p>
        <span>03</span>
        <p>过期自主决定</p>
      </div>
      <div className="showcase-orb orb-a" />
      <div className="showcase-orb orb-b" />
    </div>
  )
}

function PhoneShell() {
  const {
    route,
    stack,
    showTabBar,
    confirmState,
    resolveConfirm,
    toastState,
  } = useStore()

  const fixedActionRoutes = new Set(['item', 'add', 'edit'])
  const hasFixedAction = fixedActionRoutes.has(route.name)
  const isScan = route.name === 'scan'

  return (
    <div className="prototype-stage">
      <ShowcaseChrome />
      <div
        className={`phone-shell ${showTabBar ? 'has-tabbar' : ''} ${hasFixedAction ? 'has-fixed-action' : ''} ${isScan ? 'is-scanning' : ''}`}
      >
        <StatusBar light={isScan} />
        <main className={`app-scroll ${isScan ? 'is-fullscreen' : ''}`}>
          <div
            className="route-transition"
            key={`${route.name}-${route.params?.id || ''}-${stack.length}`}
          >
            <RouteView />
          </div>
        </main>
        {showTabBar && <BottomNav />}
        <div id="phone-layer" className="phone-layer" />
        <ConfirmDialog state={confirmState} onResolve={resolveConfirm} />
        <Toast toast={toastState} />
      </div>
      <div className="mobile-prototype-mark" aria-hidden="true">
        <BrandMark size={22} />
        HomeKeep · Interactive prototype
      </div>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <PhoneShell />
    </StoreProvider>
  )
}
