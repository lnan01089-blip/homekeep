import { useMemo, useState } from 'react'
import {
  Check,
  CheckCheck,
  ChevronRight,
  Menu,
  ShoppingBasket,
  SlidersHorizontal,
  Wrench,
} from 'lucide-react'
import { findCategory, findLocation, formatDate } from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  ProductMedia,
} from '../components/ui'

const filterOptions = [
  { id: 'all', label: '全部' },
  { id: 'low', label: '库存不足' },
  { id: 'replace', label: '需要更换' },
]

function TaskCard({ item, type, onOpen, onQuickAction, quickLabel }) {
  const { settings } = useStore()
  const category = findCategory(item.category)
  const location = findLocation(item.location)
  const isLow = type === 'low'
  const Icon = isLow ? ShoppingBasket : Wrench
  const title = isLow
    ? `仅剩 ${item.quantity ?? 0}${item.unit || ''}`
    : item.replaceLabel || '建议更换'
  const detail = isLow
    ? item.lowStockAt
      ? `低于库存提醒线 ${item.lowStockAt}${item.unit || ''}`
      : '库存已经见底'
    : item.replaceAt
      ? `建议在 ${formatDate(item.replaceAt, settings.dateFormat)} 前处理`
      : '按使用周期提醒'

  return (
    <article className="reminder-card">
      <button className="reminder-card-main" onClick={onOpen}>
        <span className="reminder-item-heading">
          <ProductMedia item={item} size={56} />
          <span className="reminder-item-copy">
            <span className="reminder-item-name">
              {item.name}
              <span className={`task-kind tone-${isLow ? 'low' : 'replace'}`}>
                {isLow ? '补货' : '更换'}
              </span>
            </span>
            <span className="reminder-item-meta">
              <span className="category-inline" style={{ color: category.color }}>
                <CategoryIcon category={category} size={12} />
                {category.name}
              </span>
              <i />
              <span>{location.name}</span>
            </span>
          </span>
          <ChevronRight size={17} className="reminder-chevron" />
        </span>
        <span className={`reminder-reason tone-${isLow ? 'low' : 'replace'}`}>
          <span className="reminder-reason-icon">
            <Icon size={15} />
          </span>
          <span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </span>
        </span>
      </button>
      <div className="reminder-card-footer">
        <button className="reminder-detail-link" onClick={onOpen}>
          查看详情
          <ChevronRight size={12} />
        </button>
        <button
          className={`reminder-action tone-${isLow ? 'low' : 'replace'}`}
          onClick={onQuickAction}
        >
          {quickLabel}
        </button>
      </div>
    </article>
  )
}

export default function Tasks() {
  const {
    route,
    helpers,
    navigate,
    openSidebar,
    adjustQuantity,
    markReplaced,
    toast,
  } = useStore()
  const initialFilter = filterOptions.some((option) => option.id === route.params?.tab)
    ? route.params.tab
    : 'all'
  const [filter, setFilter] = useState(initialFilter)

  const lowItems = helpers.lowItems
  const replacementItems = helpers.replacementItems
  const taskTotal = new Set(
    [...lowItems, ...replacementItems].map((item) => item.id),
  ).size

  const sections = [
    {
      id: 'low',
      title: '库存不足',
      icon: ShoppingBasket,
      tone: 'low',
      items: lowItems,
      quickLabel: '补充 1 件',
      quickAction: (item) => {
        adjustQuantity(item.id, 1)
        toast(`已为「${item.name}」补充 1 ${item.unit || '件'}`)
      },
    },
    {
      id: 'replace',
      title: '需要更换',
      icon: Wrench,
      tone: 'replace',
      items: replacementItems,
      quickLabel: '标记已更换',
      quickAction: (item) => {
        markReplaced(item.id)
        toast(`「${item.name}」已标记完成`)
      },
    },
  ]

  const shownSections = filter === 'all' ? sections : sections.filter((section) => section.id === filter)
  const hasVisibleTasks = shownSections.some((section) => section.items.length > 0)

  return (
    <div className="page tasks-page">
      <header className="tasks-header">
        <div className="tasks-topline">
          <button className="icon-button settings-button" onClick={openSidebar} aria-label="打开物品导航">
            <Menu size={20} />
          </button>
          <span className="eyebrow">THINGS TO DO</span>
          <button
            className="icon-button settings-button"
            onClick={() => navigate('reminderSettings')}
            aria-label="通知设置"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
        <div className="tasks-title-row">
          <div>
            <h1>待办中心</h1>
          </div>
          <span className="tasks-mark">
            <CheckCheck size={25} />
            <i />
          </span>
        </div>
      </header>

      <section className="tasks-summary">
        <div className="tasks-summary-total">
          <span>待处理</span>
          <strong>{taskTotal}</strong>
          <small>项</small>
        </div>
        <div className="tasks-summary-actions">
          <button onClick={() => setFilter(filter === 'low' ? 'all' : 'low')} className={filter === 'low' ? 'is-active' : ''}>
            <strong>{lowItems.length}</strong>
            <span>库存不足</span>
          </button>
          <i />
          <button
            onClick={() => setFilter(filter === 'replace' ? 'all' : 'replace')}
            className={filter === 'replace' ? 'is-active' : ''}
          >
            <strong>{replacementItems.length}</strong>
            <span>需要更换</span>
          </button>
        </div>
      </section>

      <div className="tasks-filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            className={filter === option.id ? 'is-active' : ''}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
            {option.id === 'low' && <span>{lowItems.length}</span>}
            {option.id === 'replace' && <span>{replacementItems.length}</span>}
          </button>
        ))}
      </div>

      {taskTotal === 0 ? (
        <div className="tasks-empty">
          <span>
            <Check size={26} />
          </span>
          <h3>今天没有待办</h3>
        </div>
      ) : !hasVisibleTasks ? (
        <div className="tasks-filter-empty">当前筛选下没有待办</div>
      ) : (
        <div className="tasks-sections">
          {shownSections.map((section) => {
            if (!section.items.length) return null
            const SectionIcon = section.icon
            return (
              <section className={`tasks-section tone-${section.tone}`} key={section.id}>
                <div className="tasks-section-heading">
                  <span className={`tasks-section-icon tone-${section.tone}`}>
                    <SectionIcon size={17} />
                  </span>
                  <h2>
                    {section.title}
                    <span>{section.items.length}</span>
                  </h2>
                </div>
                <div className="reminder-card-list">
                  {section.items.map((item) => (
                    <TaskCard
                      key={item.id}
                      item={item}
                      type={section.id}
                      onOpen={() => navigate('item', { id: item.id })}
                      onQuickAction={() => section.quickAction(item)}
                      quickLabel={section.quickLabel}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
