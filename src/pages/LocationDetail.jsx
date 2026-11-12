import { useMemo, useState } from 'react'
import { ArrowDownUp, ChevronDown, Plus, Sparkles } from 'lucide-react'
import { findLocation } from '../data'
import { useStore } from '../store'
import {
  FilterChip,
  ItemRow,
  LocationIcon,
  ScreenEmpty,
  ScreenHeader,
  SearchBar,
  SelectSheet,
} from '../components/ui'

const sortOptions = [
  { value: 'expiry', label: '按有效期排序', description: '离到期日最近的排在前面' },
  { value: 'added', label: '最近放入优先', description: '按添加时间倒序排列' },
  { value: 'quantity', label: '数量少优先', description: '优先看到库存较少的物品' },
]

export default function LocationDetail() {
  const { route, back, helpers, navigate } = useStore()
  const location = findLocation(route.params?.id)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('expiry')
  const [sortOpen, setSortOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const locationItems = useMemo(
    () => helpers.activeItems.filter((item) => item.location === location.id),
    [helpers.activeItems, location.id],
  )

  const soonCount = locationItems.filter(
    (item) => helpers.isSoon(item) && !helpers.isLowStock(item),
  ).length
  const lowCount = locationItems.filter(helpers.isLowStock).length

  const shownItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return locationItems
      .filter((item) => {
        const matchesSearch = !q || item.name.toLowerCase().includes(q) || (item.spec || '').toLowerCase().includes(q)
        const matchesFilter =
          filter === 'all' ||
          (filter === 'soon' && helpers.isSoon(item) && !helpers.isLowStock(item)) ||
          (filter === 'low' && helpers.isLowStock(item))
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        if (sort === 'added') return (b.createdAt || '').localeCompare(a.createdAt || '')
        if (sort === 'quantity') return Number(a.quantity) - Number(b.quantity)
        const da = helpers.daysLeft(a)
        const db = helpers.daysLeft(b)
        if (da === null) return 1
        if (db === null) return -1
        return da - db
      })
  }, [locationItems, query, filter, sort, helpers])

  const label = sortOptions.find((option) => option.value === sort)?.label

  return (
    <div className="page location-detail-page">
      <ScreenHeader
        onBack={back}
        eyebrow={`${location.room} · SPACE`}
        title={location.name}
        right={
          <button
            className="icon-button solid"
            onClick={() => navigate('add', { location: location.id })}
            aria-label={`在${location.name}添加物品`}
          >
            <Plus size={20} />
          </button>
        }
      />

      <section className="location-hero" style={{ background: location.tint }}>
        <div className="location-hero-circle" />
        <span className="location-hero-icon" style={{ color: location.color, background: '#ffffffb8' }}>
          <LocationIcon location={location} size={30} />
          <Sparkles size={12} className="location-hero-sparkle" />
        </span>
        <div className="location-hero-copy">
          <span>{location.room} · 收纳位置</span>
          <h2>{location.name}</h2>
          <p>{locationItems.length} 件物品在这里</p>
        </div>
        <div className="location-hero-stats">
          <div>
            <strong>{locationItems.length}</strong>
            <span>物品数</span>
          </div>
          <i />
          <div>
            <strong className={soonCount ? 'soon-number' : ''}>{soonCount}</strong>
            <span>需留意</span>
          </div>
          <i />
          <div>
            <strong className={lowCount ? 'low-number' : ''}>{lowCount}</strong>
            <span>库存不足</span>
          </div>
        </div>
      </section>

      <div className="list-controls">
        <SearchBar value={query} onChange={setQuery} placeholder={`在${location.name}中搜索`} />
        <div className="sort-row">
          <button className="sort-button" onClick={() => setSortOpen(true)}>
            <ArrowDownUp size={14} />
            {label}
            <ChevronDown size={14} />
          </button>
          <span className="result-count">{shownItems.length} 件</span>
        </div>
        {(soonCount > 0 || lowCount > 0) && (
          <div className="filter-scroll">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              全部
            </FilterChip>
            {soonCount > 0 && (
              <FilterChip active={filter === 'soon'} onClick={() => setFilter('soon')} tone="soon">
                即将到期 {soonCount}
              </FilterChip>
            )}
            {lowCount > 0 && (
              <FilterChip active={filter === 'low'} onClick={() => setFilter('low')} tone="low">
                库存不足 {lowCount}
              </FilterChip>
            )}
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
          icon={query ? 'search' : 'archive'}
          title={query ? '没有找到这件物品' : '这里暂时是空的'}
          description={query ? '换一个关键词再找找看' : `在${location.name}添加一件物品吧`}
          action="添加物品"
          onAction={() => navigate('add', { location: location.id })}
        />
      )}

      <button
        className="inline-add-item"
        onClick={() => navigate('add', { location: location.id })}
      >
        <Plus size={17} />
        在{location.name}添加物品
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
