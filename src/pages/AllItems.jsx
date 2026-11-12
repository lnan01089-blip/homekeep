import { useMemo, useState } from 'react'
import { ArrowDownUp, ChevronDown, Plus } from 'lucide-react'
import { findCategory } from '../data'
import { useStore } from '../store'
import {
  FilterChip,
  ItemRow,
  ScreenEmpty,
  ScreenHeader,
  SearchBar,
  SelectSheet,
} from '../components/ui'

const sortOptions = [
  { value: 'expiry', label: '按有效期排序', description: '离到期日最近的排在前面' },
  { value: 'added', label: '最近添加优先', description: '新近记录的物品排在前面' },
  { value: 'name', label: '按名称排序', description: '按中文首字顺序排列' },
]

export default function AllItems() {
  const { helpers, navigate, back, route } = useStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(route.params?.filter || 'all')
  const [sort, setSort] = useState('expiry')
  const [sortOpen, setSortOpen] = useState(false)
  const items = helpers.activeItems

  const soonCount = helpers.soonItems.length
  const lowCount = helpers.lowItems.length
  const retainedCount = items.filter(helpers.isRetainedExpired).length

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((item) => {
        const categoryName = findCategory(item.category).name
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          (item.spec || '').toLowerCase().includes(q) ||
          categoryName.includes(q)
        const matchesFilter =
          filter === 'all' ||
          (filter === 'soon' && helpers.isSoon(item)) ||
          (filter === 'low' && helpers.isLowStock(item)) ||
          (filter === 'retained' && helpers.isRetainedExpired(item))
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        if (sort === 'added') return (b.createdAt || '').localeCompare(a.createdAt || '')
        if (sort === 'name') return a.name.localeCompare(b.name, 'zh-CN')
        const da = helpers.daysLeft(a)
        const db = helpers.daysLeft(b)
        if (da === null) return 1
        if (db === null) return -1
        return da - db
      })
  }, [items, query, filter, sort, helpers])

  const sortLabel = sortOptions.find((option) => option.value === sort)?.label

  return (
    <div className="page all-items-page">
      <ScreenHeader
        onBack={back}
        eyebrow="ALL THINGS, IN ONE PLACE"
        title="全部物品"
        right={
          <button className="icon-button solid" onClick={() => navigate('add')} aria-label="添加物品">
            <Plus size={20} />
          </button>
        }
      />

      <div className="list-controls">
        <SearchBar value={query} onChange={setQuery} placeholder="搜索物品名称或分类" />
        <div className="sort-row">
          <button className="sort-button" onClick={() => setSortOpen(true)}>
            <ArrowDownUp size={14} />
            {sortLabel}
            <ChevronDown size={14} />
          </button>
          <span className="result-count">{shown.length} 件</span>
        </div>
        <div className="filter-scroll">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
            全部 {items.length}
          </FilterChip>
          <FilterChip active={filter === 'soon'} onClick={() => setFilter('soon')} tone="soon">
            即将到期 {soonCount}
          </FilterChip>
          <FilterChip active={filter === 'low'} onClick={() => setFilter('low')} tone="low">
            库存不足 {lowCount}
          </FilterChip>
          <FilterChip active={filter === 'retained'} onClick={() => setFilter('retained')} tone="expired">
            已保留 {retainedCount}
          </FilterChip>
        </div>
      </div>

      {shown.length ? (
        <>
          <div className="item-list-stack">
            {shown.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                status={helpers.statusFor(item)}
                onClick={() => navigate('item', { id: item.id })}
                className="raised-item-row"
              />
            ))}
          </div>
          <p className="list-footnote">下拉列表不会包含暂存区里的过期物品</p>
        </>
      ) : (
        <ScreenEmpty
          icon={query ? 'search' : 'archive'}
          title={query ? '没有找到这件物品' : '当前筛选下没有物品'}
          description={query ? '试试其他关键词' : '换一个筛选条件，或添加新的物品'}
          action="添加物品"
          onAction={() => navigate('add')}
        />
      )}

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
