import {
  House,
  LayoutGrid,
  ListTodo,
  ScanLine,
  Settings2,
} from 'lucide-react'
import { StoreProvider, useStore } from './store'
import { ConfirmDialog, Toast } from './components/ui'
import Home from './pages/Home'
import Items from './pages/Items'
import Tasks from './pages/Tasks'
import SmartList from './pages/SmartList'
import InventoryOverview from './pages/InventoryOverview'
import Sidebar from './components/Sidebar'
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
  { id: 'reminders', label: '待办', icon: ListTodo },
  { id: 'settings', label: '设置', icon: Settings2 },
]

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
              aria-label="拍照识别并添加物品"
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
      return <Tasks />
    case 'reminderSettings':
      return <ReminderSettings />
    case 'trash':
      return <Trash />
    case 'collection':
      return <SmartList />
    case 'inventory':
      return <InventoryOverview />
    case 'settings':
      return <Settings />
    case 'privacy':
    case 'about':
      return <InfoPage />
    default:
      return <Home />
  }
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
    <div className={`app-shell ${showTabBar ? 'has-tabbar' : ''} ${hasFixedAction ? 'has-fixed-action' : ''} ${isScan ? 'is-scanning' : ''}`}>
      <main className={`app-scroll ${isScan ? 'is-fullscreen' : ''}`}>
        <div
          className="route-transition"
          key={`${route.name}-${route.params?.id || ''}-${stack.length}`}
        >
          <RouteView />
        </div>
      </main>
      {showTabBar && <BottomNav />}
      <Sidebar />
      <div id="phone-layer" className="phone-layer" />
      <ConfirmDialog state={confirmState} onResolve={resolveConfirm} />
      <Toast toast={toastState} />
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
