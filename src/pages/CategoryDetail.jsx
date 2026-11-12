import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  ChevronDown,
  ChevronRight,
  MapPin,
  Plus,
  Sparkles,
} from 'lucide-react'
import { findCategory, findLocation, formatDate, groupItemsByProduct } from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  FilterChip,
  ProductMedia,
  ScreenEmpty,
  ScreenHeader,
  SearchBar,
  SelectSheet,
  StatusPill,
} from '../components/ui'

const sortOptions = [
  { value: 'expiry', label: '有效期从近到远', description: '优先看到最需要留意的物品' },
  { value: 'added', label: '最近添加优先', description: '按放入 HomeKeep 的时间排序' },
  { value: 'name', label: '按商品名称排序', description: '按中文名称顺序排列' },
]

function ProductGroupCard({ group, helpers, settings, onOpen, onAddVariant }) {
  const firstItem = group.items[0]
  const totalLabel =
    group.totalQuantity !== null
      ? `合计 ${group.totalQuantity}${group.unit}`
      : `${group.variantCount} 个规格`

  return (
    <article className="product-group-card">
      <div className="product-group-head">
        <ProductMedia item={firstItem} size={50} />
        <div className="product-group-title">
          <div className="product-group-name-line">
            <h3>{group.name}</h3>
            {group.variantCount > 1 && <span>{group.variantCount} 种规格</span>}
          </div>
          <p>{totalLabel}</p>
        </div>
        <button
          className="product-add-spec"
          onClick={onAddVariant}
          aria-label={`为${group.name}添加规格`}
        >
          <Plus size={14} />
          规格
        </button>
      </div>

      <div className="product-variant-list">
        {group.items.map((item) => (
          <button
            className="product-variant-row"
            key={item.id}
            onClick={() => onOpen(item.id)}
          >
            <span className="product-variant-main">
              <span className="product-variant-title">
                <span className="product-variant-name">{item.variant || item.spec || '默认规格'}</span>
                <StatusPill status={helpers.statusFor(item)} />
              </span>
              <span className="product-variant-meta">
                {item.quantity !== null && item.quantity !== undefined && item.quantity !== ''
                  ? `${item.quantity}${item.unit || ''}`
                  : '数量未记录'}
                <i />
                {findLocation(item.location).name}
                {item.expiryDate && (
                  <>
                    <i />
                    {formatDate(item.expiryDate, settings.dateFormat)}
                    {item.expiryTime ? ` ${item.expiryTime}` : ''}
                  </>
                )}
              </span>
            </span>
            <ChevronRight size={16} className="product-variant-chevron" />
          </button>
        ))}
      </div>
    </article>
  )
}

export default function CategoryDetail() {
  const { route, back, helpers, navigate, allLocations, settings } = useStore()
  const category = findCategory(route.params?.id)
  const [query, setQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sort, setSort] = useState('expiry')
  const [sortOpen, setSortOpen] = useState(false)

  const categoryItems = useMemo(
    () => helpers.activeItems.filter((item) => item.category === category.id),
    [helpers.activeItems, category.id],
  )

  const categoryGroups = useMemo(() => groupItemsByProduct(categoryItems), [categoryItems])

  const availableLocations = useMemo(() => {
    const ids = [...new Set(categoryItems.map((item) => item.location))]
    return allLocations.filter((location) => ids.includes(location.id))
  }, [categoryItems, allLocations])

  const shownItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categoryItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.variant || '').toLowerCase().includes(q) ||
        (item.spec || '').toLowerCase().includes(q) ||
        findLocation(item.location).name.includes(q)
      const matchesLocation = locationFilter === 'all' || item.location === locationFilter
      return matchesQuery && matchesLocation
    })
  }, [categoryItems, query, locationFilter])

  const shownGroups = useMemo(() => {
    const groups = groupItemsByProduct(shownItems)
    return groups.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'zh-CN')
      if (sort === 'added') {
        const aLast = Math.max(
          ...a.items.map((item) => new Date(item.createdAt || 0).getTime()),
        )
        const bLast = Math.max(
          ...b.items.map((item) => new Date(item.createdAt || 0).getTime()),
        )
        return bLast - aLast
      }
      const aDays = Math.min(...a.items.map((item) => helpers.daysLeft(item) ?? 99999))
      const bDays = Math.min(...b.items.map((item) => helpers.daysLeft(item) ?? 99999))
      return aDays - bDays
    })
  }, [shownItems, sort, helpers])

  const soonCount = categoryItems.filter((item) => helpers.isSoon(item)).length
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
            onClick={() => navigate('add', { category: category.id, returnTo: 'category' })}
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
              <strong>{categoryGroups.length}</strong> 种商品
            </span>
            <i />
            <span>
              <strong>{categoryItems.length}</strong> 个规格
            </span>
            <i />
            <span>
              <strong>{soonCount}</strong> 临近过期
            </span>
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
          <span className="result-count">
            {shownGroups.length} 种商品 · {shownItems.length} 个规格
          </span>
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

      {shownGroups.length ? (
        <div className="product-group-stack">
          {shownGroups.map((group) => (
            <ProductGroupCard
              key={group.key}
              group={group}
              helpers={helpers}
              settings={settings}
              onOpen={(id) => navigate('item', { id })}
              onAddVariant={() =>
                navigate('add', { category: category.id, product: group.name, returnTo: 'category' })
              }
            />
          ))}
        </div>
      ) : (
        <ScreenEmpty
          icon="search"
          title={query ? '没有找到相关商品' : '这一格还空着'}
          description={query ? '换一个关键词试试看' : `把第一件${category.name}商品收进来吧`}
          action="添加商品"
          onAction={() => navigate('add', { category: category.id })}
        />
      )}

      <button className="inline-add-item" onClick={() => navigate('add', { category: category.id, returnTo: 'category' })}>
        <Plus size={17} />
        添加新的{category.name}商品
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
