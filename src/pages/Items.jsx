import { useState } from 'react'
import {
  ChevronRight,
  LayoutGrid,
  ListFilter,
  MapPinned,
  Menu,
  PackageSearch,
  Plus,
  ScanLine,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { findCategory, findLocation } from '../data'
import { useStore } from '../store'
import HouseScene from '../components/HouseScene'
import {
  CategoryIcon,
  ItemRow,
  PhonePortal,
  SearchBar,
  SectionHeader,
  Sheet,
} from '../components/ui'

export default function Items() {
  const { helpers, navigate, allCategories, openSidebar } = useStore()
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const { activeItems, trashItems } = helpers

  const counts = {}
  const soonCounts = {}
  activeItems.forEach((item) => {
    counts[item.location] = (counts[item.location] || 0) + 1
    if (helpers.isSoon(item)) {
      soonCounts[item.location] = (soonCounts[item.location] || 0) + 1
    }
  })

  const normalizedQuery = query.trim().toLowerCase()
  const results = normalizedQuery
    ? activeItems.filter((item) => {
        const category = findCategory(item.category)
        const location = findLocation(item.location)
        return (
          item.name.toLowerCase().includes(normalizedQuery) ||
          (item.variant || '').toLowerCase().includes(normalizedQuery) ||
          (item.spec || '').toLowerCase().includes(normalizedQuery) ||
          category.name.includes(normalizedQuery) ||
          location.name.includes(normalizedQuery)
        )
      })
    : []

  const openLocation = (id) => {
    if (!counts[id]) return
    navigate('location', { id })
  }

  return (
    <div className="page items-page">
      <header className="items-header">
        <div className="items-topline">
          <div>
            <div className="tab-eyebrow-row">
              <button className="icon-button settings-button tab-menu-button" onClick={openSidebar} aria-label="打开物品导航">
                <Menu size={18} />
              </button>
              <span className="eyebrow">MY HOME · SPACE</span>
            </div>
            <h1>
              我的物品
              <span className="title-count">{activeItems.length}</span>
            </h1>
          </div>
          <button className="small-add-button" onClick={() => navigate('add')}>
            <Plus size={17} />
            添加
          </button>
        </div>
        <div className="items-search-row">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="搜索物品名称、分类或位置"
            autoFocus={false}
          />
          <button className="filter-button" onClick={() => setFilterOpen(true)} aria-label="按分类筛选">
            <ListFilter size={19} />
          </button>
        </div>
      </header>

      {normalizedQuery ? (
        <section className="search-results-section">
          <div className="search-results-meta">
            <span>
              找到 <strong>{results.length}</strong> 件物品
            </span>
            <button className="text-button" onClick={() => setQuery('')}>
              取消搜索
              <X size={14} />
            </button>
          </div>
          {results.length ? (
            <div className="search-result-list card-surface">
              {results.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  status={helpers.statusFor(item)}
                  onClick={() => navigate('item', { id: item.id })}
                />
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <span>
                <PackageSearch size={28} strokeWidth={1.4} />
              </span>
              <h3>没有找到相关物品</h3>
              <p>试试物品名称、分类或存放位置</p>
              <button className="small-solid-button" onClick={() => navigate('add')}>
                <Plus size={15} />
                添加一件物品
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="house-explorer-card">
            <div className="space-card-head">
              <div>
                <span className="eyebrow with-line">家的空间</span>
                <p>每一件物品，都在家的某个角落</p>
              </div>
              <span className="panorama-pill">
                <ScanLine size={13} />
                3D 全景
              </span>
            </div>
            <HouseScene
              counts={counts}
              soonCounts={soonCounts}
              onSelect={openLocation}
            />
            <div className="house-card-footer">
              <span>
                <i className="legend-dot legend-normal" />
                正常收纳
              </span>
              <span>
                <i className="legend-dot legend-soon" />
                需要留意
              </span>
              <span className="house-rooms-count">5 个空间 · 10 处收纳</span>
            </div>
          </section>

          <section className="quick-access-section">
            <SectionHeader title="快速查看" />
            <div className="quick-access-grid">
              <button className="quick-access-tile" onClick={() => navigate('allItems')}>
                <span className="quick-icon sage">
                  <LayoutGrid size={20} />
                </span>
                <span>
                  <strong>全部物品</strong>
                  <small>{activeItems.length} 件</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <button className="quick-access-tile" onClick={() => navigate('categories')}>
                <span className="quick-icon cream">
                  <Search size={20} />
                </span>
                <span>
                  <strong>按分类查看</strong>
                  <small>{allCategories.length} 个分类</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <button className="quick-access-tile" onClick={() => navigate('locations')}>
                <span className="quick-icon blue">
                  <MapPinned size={20} />
                </span>
                <span>
                  <strong>按位置查看</strong>
                  <small>10 个位置</small>
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </section>


        </>
      )}

      {trashItems.length > 0 && (
        <PhonePortal>
          <button className="floating-trash" onClick={() => navigate('trash')} aria-label="打开过期物品暂存区">
            <Trash2 size={22} />
            <span className="floating-trash-badge">{trashItems.length}</span>
            <span className="floating-trash-tip">过期暂存</span>
          </button>
        </PhonePortal>
      )}

      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="按分类查看"
      >
        <div className="category-filter-list">
          <button
            className="category-filter-row"
            onClick={() => {
              setFilterOpen(false)
              navigate('allItems')
            }}
          >
            <span className="category-filter-icon all">
              <LayoutGrid size={19} />
            </span>
            <span className="category-filter-copy">
              <strong>全部物品</strong>
              <small>{activeItems.length} 件物品</small>
            </span>
            <ChevronRight size={17} />
          </button>
          {allCategories.map((category) => {
            const count = activeItems.filter((item) => item.category === category.id).length
            return (
              <button
                className="category-filter-row"
                key={category.id}
                onClick={() => {
                  setFilterOpen(false)
                  navigate('category', { id: category.id })
                }}
              >
                <span
                  className="category-filter-icon"
                  style={{ background: category.tint, color: category.color }}
                >
                  <CategoryIcon category={category} size={19} />
                </span>
                <span className="category-filter-copy">
                  <strong>{category.name}</strong>
                  <small>{count} 件物品</small>
                </span>
                <ChevronRight size={17} />
              </button>
            )
          })}
        </div>
      </Sheet>
    </div>
  )
}
