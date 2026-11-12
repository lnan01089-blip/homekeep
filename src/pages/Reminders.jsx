import { useEffect, useMemo, useState } from 'react'
import {
  AlarmClock,
  Bell,
  BellOff,
  ChevronRight,
  CircleCheck,
  PackageOpen,
  Settings2,
  ShoppingBasket,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react'
import { findCategory, findLocation, formatDate, daysUntil } from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  ProductMedia,
} from '../components/ui'

const filters = [
  { id: 'all', label: '全部' },
  { id: 'expiring', label: '即将到期' },
  { id: 'low', label: '库存不足' },
  { id: 'replace', label: '需要更换' },
]

function ReminderCard({ item, type, onOpen, onQuickAction, quickLabel }) {
  const { settings } = useStore()
  const category = findCategory(item.category)
  const location = findLocation(item.location)
  const expiryDays = item.expiryDate ? daysUntil(item.expiryDate) : null
  const reminder = type === 'expiring'
    ? {
        icon: AlarmClock,
        label: expiryDays === 0 ? '今天到期' : `${Math.max(0, expiryDays ?? 0)} 天后到期`,
        detail: item.expiryDate ? `${formatDate(item.expiryDate, settings.dateFormat)}${item.expiryTime ? ` ${item.expiryTime}` : ''} 到期 · 请优先使用` : '',
        tone: 'soon',
      }
    : type === 'low'
      ? {
          icon: ShoppingBasket,
          label: `仅剩 ${item.quantity}${item.unit}`,
          detail: item.lowStockAt ? `低于库存提醒线 ${item.lowStockAt}${item.unit}` : '库存已经见底',
          tone: 'low',
        }
      : {
          icon: Wrench,
          label: item.replaceLabel || '建议更换',
          detail: item.replaceAt ? `建议在 ${formatDate(item.replaceAt, settings.dateFormat)} 前处理` : '按使用周期提醒',
          tone: 'replace',
        }
  const ReminderIcon = reminder.icon

  return (
    <article className="reminder-card">
      <button className="reminder-card-main" onClick={onOpen}>
        <span className="reminder-item-heading">
          <ProductMedia item={item} size={56} />
          <span className="reminder-item-copy">
            <span className="reminder-item-name">
              {item.name}
              {type === 'expiring' && item.expiryDate && (
                <span className="reminder-days">{Math.max(0, expiryDays ?? 0)} 天</span>
              )}
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
        <span className={`reminder-reason tone-${reminder.tone}`}>
          <span className="reminder-reason-icon">
            <ReminderIcon size={15} />
          </span>
          <span>
            <strong>{reminder.label}</strong>
            <small>{reminder.detail}</small>
          </span>
        </span>
      </button>
      <div className="reminder-card-footer">
        <button className="reminder-detail-link" onClick={onOpen}>
          查看详情
          <ChevronRight size={12} />
        </button>
        <button className={`reminder-action tone-${reminder.tone}`} onClick={onQuickAction}>
          {quickLabel}
        </button>
      </div>
    </article>
  )
}

export default function Reminders() {
  const { route, helpers, navigate, settings, adjustQuantity, markReplaced, toast } = useStore()
  const initialFilter = route.params?.tab || 'all'
  const [filter, setFilter] = useState(
    ['all', 'expiring', 'low', 'replace'].includes(initialFilter) ? initialFilter : 'all',
  )

  const expiring = useMemo(
    () => [...helpers.soonItems].sort((a, b) => helpers.daysLeft(a) - helpers.daysLeft(b)),
    [helpers],
  )
  const low = useMemo(() => helpers.lowItems, [helpers.lowItems])
  const replacement = useMemo(() => helpers.replacementItems, [helpers.replacementItems])

  const enabledSections = {
    expiring: settings.expiryReminders && settings.remindersOn,
    low: settings.stockReminders && settings.remindersOn,
    replace: settings.replaceReminders && settings.remindersOn,
  }

  const sections = [
    {
      id: 'expiring',
      title: '即将到期',
      subtitle: '在最佳的时候，好好享用',
      count: expiring.length,
      icon: AlarmClock,
      tone: 'soon',
      items: expiring,
      quickLabel: '调整日期',
      quickAction: (item) => navigate('edit', { id: item.id }),
      empty: '没有即将到期的物品',
    },
    {
      id: 'low',
      title: '库存不足',
      subtitle: '为下一次使用提前备好',
      count: low.length,
      icon: ShoppingBasket,
      tone: 'low',
      items: low,
      quickLabel: '补充 1 件',
      quickAction: (item) => {
        adjustQuantity(item.id, 1)
        toast(`已为「${item.name}」补充 1 ${item.unit}`)
      },
      empty: '家中储备充足',
    },
    {
      id: 'replace',
      title: '需要更换',
      subtitle: '到周期了，给自己换件新的',
      count: replacement.length,
      icon: Wrench,
      tone: 'replace',
      items: replacement,
      quickLabel: '标记已更换',
      quickAction: (item) => {
        markReplaced(item.id)
        toast(`「${item.name}」已标记完成`)
      },
      empty: '暂时没有需要更换的物品',
    },
  ].filter((section) => enabledSections[section.id])

  const total = new Set(sections.flatMap((section) => section.items.map((item) => item.id))).size
  const sectionIds = sections.map((section) => section.id).join('|')

  useEffect(() => {
    if (filter !== 'all' && !sections.some((section) => section.id === filter)) {
      setFilter('all')
    }
  }, [filter, sectionIds, sections])

  const shownSections =
    filter === 'all'
      ? sections
      : sections.filter((section) => section.id === filter)
  const allEmpty = total === 0

  return (
    <div className="page reminders-page">
      <header className="reminders-header">
        <div className="reminders-topline">
          <span className="eyebrow">A LITTLE CARE, EVERY DAY</span>
          <button
            className="icon-button settings-button"
            onClick={() => navigate('reminderSettings')}
            aria-label="提醒设置"
          >
            <Settings2 size={20} />
          </button>
        </div>
        <div className="reminders-title-row">
          <div>
            <h1>提醒中心</h1>
            <p>需要留意的，放在这里，不必记在心上。</p>
          </div>
          <span className="bell-illustration">
            <Bell size={26} strokeWidth={1.5} />
            <i />
          </span>
        </div>
      </header>

      {!settings.remindersOn && (
        <div className="reminder-paused-banner">
          <span>
            <BellOff size={20} />
          </span>
          <div>
            <strong>提醒已暂停</strong>
            <p>物品仍会被记录，但暂时不会主动提醒你。</p>
          </div>
          <button onClick={() => navigate('reminderSettings')}>开启</button>
        </div>
      )}

      <div className="reminder-summary">
        <div className="reminder-summary-main">
          <span>今日需要关注</span>
          <strong>{total}</strong>
          <span>件</span>
        </div>
        <div className="reminder-summary-pills">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`summary-pill tone-${section.tone} ${filter === section.id ? 'is-active' : ''}`}
              onClick={() => setFilter(filter === section.id ? 'all' : section.id)}
            >
              <strong>{section.count}</strong>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {helpers.trashItems.length > 0 && (
        <button className="expired-reminder-banner" onClick={() => navigate('trash')}>
          <span className="expired-banner-icon">
            <Trash2 size={17} />
          </span>
          <span>
            <strong>{helpers.trashItems.length} 件过期物品在暂存区</strong>
            <small>过期不会自动删除，等你来决定</small>
          </span>
          <ChevronRight size={17} />
        </button>
      )}

      <div className="reminder-filter-tabs">
        {filters.map((tab) => {
          const count =
            tab.id === 'all'
              ? total
              : sections.find((section) => section.id === tab.id)?.count ?? 0
          if (tab.id !== 'all' && !sections.some((section) => section.id === tab.id)) return null
          return (
            <button
              key={tab.id}
              className={`reminder-filter-tab ${filter === tab.id ? 'is-active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
              {tab.id !== 'all' && <span>{count}</span>}
            </button>
          )
        })}
      </div>

      {allEmpty ? (
        <div className="reminders-empty">
          <span className="reminders-empty-art">
            <CircleCheck size={30} />
            <Sparkles size={16} />
          </span>
          <h3>都安排好了</h3>
          <p>目前没有需要关注的物品，安心享受此刻。</p>
        </div>
      ) : (
        <div className="reminder-sections">
          {shownSections.map((section) => {
            const SectionIcon = section.icon
            if (!section.count) {
              if (filter === 'all') return null
              return (
                <div className="reminder-section-empty" key={section.id}>
                  <SectionIcon size={19} />
                  {section.empty}
                </div>
              )
            }
            return (
              <section className={`reminder-section tone-${section.tone}`} key={section.id}>
                <div className="reminder-section-heading">
                  <span className={`reminder-section-icon tone-${section.tone}`}>
                    <SectionIcon size={17} />
                  </span>
                  <div>
                    <h2>
                      {section.title}
                      <span>{section.count}</span>
                    </h2>
                    <p>{section.subtitle}</p>
                  </div>
                  <button className="section-view-all" onClick={() => setFilter(section.id)}>
                    仅看这组
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="reminder-card-list">
                  {section.items.map((item) => (
                    <ReminderCard
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
          {shownSections.length > 0 && shownSections.every((s) => s.count === 0) && (
            <div className="reminders-empty small">
              <PackageOpen size={26} />
              <p>这组提醒暂时是空的</p>
            </div>
          )}
        </div>
      )}

      <button className="reminder-settings-link" onClick={() => navigate('reminderSettings')}>
        <Bell size={15} />
        管理提醒方式与时间
        <ChevronRight size={15} />
      </button>
    </div>
  )
}
