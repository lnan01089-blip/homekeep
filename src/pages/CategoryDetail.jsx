import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  ChevronDown,
  MapPin,
  Plus,
  Sparkles,
} from 'lucide-react'
import { findCategory, findLocation, locations } from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  FilterChip,
  ItemRow,
  ScreenEmpty,
  ScreenHeader,
  SearchBar,
  SelectSheet,
} from '../components/ui'

const sortOptions = [
  { value: 'expiry', label: '有效期从近到远', description: '优先看到最需要留意的物品' },
  { value: 'added', label: '最近添加优先', description: '按放入 HomeKeep 的时间排序' },
  { value: 'name', label: '按名称排序', description: '按中文名称顺序排列' },
]

export default function CategoryDetail() {
  const { route, back, helpers, navigate } = useStore()
  const category = findCategory(route.params?.id)
  const [query, setQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sort, setSort] = useState('expiry')
  const [sortOpen, setSortOpen] = useState(false)

  const categoryItems = useMemo(
    () => helpers.activeItems.filter((item) => item.category === category.id),
    [helpers.activeItems, category.id],
  )

  const availableLocations = useMemo(() => {
    const ids = [...new Set(categoryItems.map((item) => item.location))]
    return locations.filter((location) => ids.includes(location.id))
  }, [categoryItems])

  const shownItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = categoryItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.spec || '').toLowerCase().includes(q) ||
        findLocation(item.location).name.includes(q)
      const matchesLocation = locationFilter === 'all' || item.location === locationFilter
      return matchesQuery && matchesLocation
    })
    return filtered.sort((a, b) => {
      if (sort === 'added') return (b.createdAt || '').localeCompare(a.createdAt || '')
      if (sort === 'name') return a.name.localeCompare(b.name, 'zh-CN')
      const da = helpers.daysLeft(a)
      const db = helpers.daysLeft(b)
      if (da === null && db === null) return a.name.localeCompare(b.name, 'zh-CN')
      if (da === null) return 1
      if (db === null) return -1
      return da - db
    })
  }, [categoryItems, query, locationFilter, sort, helpers])

  const soonCount = categoryItems.filter(
    (item) => helpers.isSoon(item) && !helpers.isLowStock(item),
  ).length
  const retainedCount = categoryItems.filter(helpers.isRetainedExpired).length
  const sortLabel = sortOptions.find((option) => option.value === sort)?.label

  return (
    <div className="page category-detail-page">
      <ScreenHeader
        onBack={back}
        eyebrow="CATEGORY"
        title={category.name}
        right={
          <button
            className="icon-button solid"
            onClick={() => navigate('add', { category: category.id })}
            aria-label={`添加${category.name}物品`}
          >
            <Plus size={20} />
          </button>
        }
      />

      <section className="category-detail-hero" style={{ background: category.soft }}>
        <div className="category-detail-wash" style={{ background: category.tint }} />
        <span className="category-detail-icon" style={{ background: category.tint, color: category.color }}>
          <CategoryIcon category={category} size={31} />
          <span className="category-orb" />
        </span>
        <div className="category-detail-copy">
          <span className="category-kicker" style={{ color: category.color }}>
            {category.description}
          </span>
          <h2>{category.name}</h2>
          <div className="category-detail-stats">
            <span>
              <strong>{categoryItems.length}</strong> 件物品
            </span>
            <i />
            <span>
              <strong>{soonCount}</strong> 即将到期
            </span>
            {retainedCount > 0 && (
              <>
                <i />
                <span className="retained-stat">
                  <strong>{retainedCount}</strong> 已保留
                </span>
              </>
            )}
          </div>
        </div>
        <Sparkles className="category-hero-sparkle" size={15} />
      </section>

      <div className="list-controls">
        <SearchBar value={query} onChange={setQuery} placeholder={`在${category.name}中搜索`} />
        <div className="sort-row">
          <button className="sort-button" onClick={() => setSortOpen(true)}>
            <ArrowDownUp size={14} />
            {sortLabel}
            <ChevronDown size={14} />
          </button>
          <span className="result-count">{shownItems.length} 件</span>
        </div>
        {availableLocations.length > 1 && (
          <div className="filter-scroll">
            <FilterChip active={locationFilter === 'all'} onClick={() => setLocationFilter('all')}>
              全部位置
            </FilterChip>
            {availableLocations.map((location) => (
              <FilterChip
                key={location.id}
                active={locationFilter === location.id}
                onClick={() => setLocationFilter(location.id)}
              >
                <MapPin size={12} />
                {location.name}
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      {shownItems.length ? (
        <div className="item-list-stack">
          {shownItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              status={helpers.statusFor(item)}
              onClick={() => navigate('item', { id: item.id })}
              className="raised-item-row"
            />
          ))}
        </div>
      ) : (
        <ScreenEmpty
          icon="search"
          title={query ? '没有找到相关物品' : '这一格还空着'}
          description={query ? '换一个关键词试试看' : `把第一件${category.name}物品收进来吧`}
          action="添加物品"
          onAction={() => navigate('add', { category: category.id })}
        />
      )}

      <button className="inline-add-item" onClick={() => navigate('add', { category: category.id })}>
        <Plus size={17} />
        添加一件{category.name}物品
      </button>

      <SelectSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        title="排序方式"
        options={sortOptions}
        value={sort}
        onSelect={setSort}
      />
    </div>
  )
}
