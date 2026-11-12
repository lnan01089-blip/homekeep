import { useEffect, useState } from 'react'
import {
  AlarmClock,
  Boxes,
  ChevronRight,
  CircleAlert,
  LayoutGrid,
  PackageOpen,
  Plus,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { useStore } from '../store'
import { BrandMark, CategoryIcon, LocationIcon, Sheet } from './ui'

const commonCategoryIds = ['food', 'beauty', 'medicine']
const commonLocationIds = ['fridge', 'livingCabinet', 'kitchenCabinet', 'bathroomCabinet']

export default function Sidebar() {
  const {
    sidebarOpen,
    closeSidebar,
    navigate,
    route,
    helpers,
    allCategories,
    allLocations,
    addCustomCategory,
    addCustomLocation,
    toast,
  } = useStore()
  const [createMode, setCreateMode] = useState(null)
  const [customName, setCustomName] = useState('')

  useEffect(() => {
    if (!sidebarOpen) return undefined
    const scroller = document.querySelector('.app-scroll')
    scroller?.classList.add('scroll-locked')
    const handleKey = (event) => {
      if (event.key === 'Escape') closeSidebar()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      scroller?.classList.remove('scroll-locked')
      document.removeEventListener('keydown', handleKey)
    }
  }, [sidebarOpen, closeSidebar])

  useEffect(() => {
    if (!createMode) setCustomName('')
  }, [createMode])

  if (!sidebarOpen) return null

  const activeItems = helpers.activeItems
  const retainedExpired = activeItems.filter(helpers.isRetainedExpired)
  const openedItems = activeItems.filter((item) => item.openedDate)
  const soonItems = helpers.soonItems

  const categoryCounts = Object.fromEntries(
    allCategories.map((category) => [
      category.id,
      activeItems.filter((item) => item.category === category.id).length,
    ]),
  )
  const locationCounts = Object.fromEntries(
    allLocations.map((location) => [
      location.id,
      activeItems.filter((item) => item.location === location.id).length,
    ]),
  )

  const smartItems = [
    {
      id: 'all',
      label: '全部',
      icon: LayoutGrid,
      count: activeItems.length,
      onClick: () => navigate('allItems'),
      active: route.name === 'allItems',
    },
    {
      id: 'soon',
      label: '临近过期',
      icon: AlarmClock,
      count: soonItems.length,
      onClick: () => navigate('collection', { view: 'soon' }),
      active: route.name === 'collection' && route.params?.view === 'soon',
    },
    {
      id: 'expired',
      label: '已过期',
      icon: CircleAlert,
      count: retainedExpired.length,
      onClick: () => navigate('collection', { view: 'expired' }),
      active: route.name === 'collection' && route.params?.view === 'expired',
    },
    {
      id: 'opened',
      label: '已开封',
      icon: PackageOpen,
      count: openedItems.length,
      onClick: () => navigate('collection', { view: 'opened' }),
      active: route.name === 'collection' && route.params?.view === 'opened',
    },
    {
      id: 'trash',
      label: '垃圾篓',
      icon: Trash2,
      count: helpers.trashItems.length,
      onClick: () => navigate('trash'),
      active: route.name === 'trash',
    },
    {
      id: 'inventory',
      label: '库存总览',
      icon: Boxes,
      count: activeItems.length,
      onClick: () => navigate('inventory'),
      active: route.name === 'inventory',
    },
  ]

  const commonCategories = commonCategoryIds
    .map((id) => allCategories.find((category) => category.id === id))
    .filter(Boolean)
  const customCategories = allCategories.filter((category) => category.isCustom)
  const commonLocations = commonLocationIds
    .map((id) => allLocations.find((location) => location.id === id))
    .filter(Boolean)
  const customLocations = allLocations.filter((location) => location.isCustom)

  const go = (name, params) => {
    closeSidebar()
    navigate(name, params)
  }

  const openCreate = (mode) => {
    setCustomName('')
    setCreateMode(mode)
  }

  const submitCustom = () => {
    if (!customName.trim()) return
    const created =
      createMode === 'category'
        ? addCustomCategory(customName)
        : addCustomLocation(customName)
    if (!created) {
      toast('名称已存在或不能为空')
      return
    }
    toast(`已创建「${created.name}」`)
    setCreateMode(null)
    setCustomName('')
  }

  return (
    <>
      <div className="sidebar-layer is-open" aria-hidden={!sidebarOpen}>
        <button className="sidebar-backdrop" onClick={closeSidebar} aria-label="关闭侧边栏" />
        <aside className="sidebar-panel" role="dialog" aria-modal="true" aria-label="物品导航">
          <header className="sidebar-header">
            <BrandMark size={35} />
            <div>
              <strong>HomeKeep</strong>
            </div>
            <button className="icon-button soft sidebar-close" onClick={closeSidebar} aria-label="关闭">
              <X size={18} />
            </button>
          </header>

          <div className="sidebar-scroll">
            <nav className="sidebar-smart-list" aria-label="物品状态">
              {smartItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={`sidebar-row ${item.active ? 'is-active' : ''}`}
                    onClick={() => {
                      closeSidebar()
                      item.onClick()
                    }}
                  >
                    <span className="sidebar-row-icon">
                      <Icon size={18} />
                    </span>
                    <span>{item.label}</span>
                    {item.id !== 'inventory' && <em>{item.count}</em>}
                    {item.id === 'inventory' && <ChevronRight size={15} className="sidebar-chevron" />}
                  </button>
                )
              })}
            </nav>

            <section className="sidebar-section">
              <div className="sidebar-section-heading">
                <span>分类</span>
              </div>
              <div className="sidebar-taxonomy-list">
                {commonCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`sidebar-taxonomy-row ${route.name === 'category' && route.params?.id === category.id ? 'is-active' : ''}`}
                    onClick={() => go('category', { id: category.id })}
                  >
                    <span
                      className="sidebar-taxonomy-icon"
                      style={{ background: category.tint, color: category.color }}
                    >
                      <CategoryIcon category={category} size={17} />
                    </span>
                    <span>{category.name}</span>
                    <em>{categoryCounts[category.id] || 0}</em>
                  </button>
                ))}
                {customCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`sidebar-taxonomy-row ${route.name === 'category' && route.params?.id === category.id ? 'is-active' : ''}`}
                    onClick={() => go('category', { id: category.id })}
                  >
                    <span
                      className="sidebar-taxonomy-icon"
                      style={{ background: category.tint, color: category.color }}
                    >
                      <CategoryIcon category={category} size={17} />
                    </span>
                    <span>{category.name}</span>
                    <em>{categoryCounts[category.id] || 0}</em>
                  </button>
                ))}
                <button className="sidebar-taxonomy-row is-create" onClick={() => openCreate('category')}>
                  <span className="sidebar-taxonomy-icon">
                    <Plus size={17} />
                  </span>
                  <span>自定义</span>
                </button>
              </div>
            </section>

            <section className="sidebar-section">
              <div className="sidebar-section-heading">
                <span>存储位置</span>
              </div>
              <div className="sidebar-taxonomy-list">
                {commonLocations.map((location) => (
                  <button
                    key={location.id}
                    className={`sidebar-taxonomy-row ${route.name === 'location' && route.params?.id === location.id ? 'is-active' : ''}`}
                    onClick={() => go('location', { id: location.id })}
                  >
                    <span
                      className="sidebar-taxonomy-icon"
                      style={{ background: location.tint, color: location.color }}
                    >
                      <LocationIcon location={location} size={17} />
                    </span>
                    <span>{location.name}</span>
                    <em>{locationCounts[location.id] || 0}</em>
                  </button>
                ))}
                {customLocations.map((location) => (
                  <button
                    key={location.id}
                    className={`sidebar-taxonomy-row ${route.name === 'location' && route.params?.id === location.id ? 'is-active' : ''}`}
                    onClick={() => go('location', { id: location.id })}
                  >
                    <span
                      className="sidebar-taxonomy-icon"
                      style={{ background: location.tint, color: location.color }}
                    >
                      <LocationIcon location={location} size={17} />
                    </span>
                    <span>{location.name}</span>
                    <em>{locationCounts[location.id] || 0}</em>
                  </button>
                ))}
                <button className="sidebar-taxonomy-row is-create" onClick={() => openCreate('location')}>
                  <span className="sidebar-taxonomy-icon">
                    <Plus size={17} />
                  </span>
                  <span>自定义</span>
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <Sheet
        open={Boolean(createMode)}
        onClose={() => setCreateMode(null)}
        title={createMode === 'category' ? '新建自定义分类' : '新建自定义位置'}
      >
        <div className="sidebar-create-form">
          <label>
            <input
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              placeholder={createMode === 'category' ? '例如：宠物用品、酒类' : '例如：阳台柜、书房'}
              maxLength={12}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitCustom()
              }}
            />
            {createMode === 'category' ? <Tag size={17} /> : null}
          </label>
          <button className="sidebar-create-submit" onClick={submitCustom} disabled={!customName.trim()}>
            创建
          </button>
        </div>
      </Sheet>
    </>
  )
}
