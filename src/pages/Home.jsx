import { CalendarDays, ChevronRight, CircleAlert, Plus, Settings2, Sparkles } from 'lucide-react'
import { categories } from '../data'
import { useStore } from '../store'
import { CategoryIcon, ItemRow, SectionHeader } from '../components/ui'

function MiniHomeDoodle() {
  return (
    <div className="mini-home-doodle" aria-hidden="true">
      <svg viewBox="0 0 132 106" fill="none">
        <ellipse cx="66" cy="94" rx="47" ry="7" fill="#7B8C7C" opacity=".1" />
        <path d="M25 53.6 66 24l41 29.6v38.1c0 3.2-2.5 5.8-5.7 5.8H30.7c-3.2 0-5.7-2.6-5.7-5.8V53.6Z" fill="#E8EFE7" />
        <path d="M20 57 66 23l46 34v7.4L66 31 20 64.4V57Z" fill="#A9C8B8" />
        <path d="M43 64h24v33H43z" fill="#F7F4EC" />
        <path d="M47 69h7v8h-7zM56 69h7v8h-7zM47 80h7v8h-7zM56 80h7v8h-7z" fill="#B9D1C2" />
        <path d="M82 34v30" stroke="#C4A27C" strokeWidth="2" strokeLinecap="round" />
        <path d="M82 37c7-2 10-7 11-12-6-.2-10 4-11 12Z" fill="#7D9D85" />
        <path d="M82 48c-7-2-10-6-11-11 6 0 10 4 11 11Z" fill="#9DB7A1" opacity=".9" />
        <rect x="39" y="97" width="60" height="3" rx="1.5" fill="#D5C5AD" />
        <path d="M95 92c-7-8-6-19 2-25 8 7 7 18-2 25Z" fill="#D9E6DB" />
        <path d="M98 91c4-9 10-13 18-13-1 8-7 13-18 13Z" fill="#C3D6C6" />
        <circle cx="26" cy="38" r="3" fill="#D7B98F" opacity=".7" />
        <circle cx="109" cy="52" r="2" fill="#C4D7C8" />
        <path d="M29 20v-7M23.5 15h11" stroke="#B7CABB" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

const statItems = [
  { key: 'total', label: '物品总数', tone: 'neutral' },
  { key: 'soon', label: '即将到期', tone: 'soon' },
  { key: 'expired', label: '已过期', tone: 'expired' },
  { key: 'low', label: '库存不足', tone: 'low' },
]

export default function Home() {
  const { helpers, navigate, goTab } = useStore()
  const { activeItems, soonItems, lowItems, expiredCount } = helpers
  const greeting = new Date().getHours() < 11 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'
  const minuteItems = [...soonItems].sort((a, b) => helpers.daysLeft(a) - helpers.daysLeft(b)).slice(0, 3)
  const todaysDate = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(
    new Date(),
  )

  const counts = {
    total: activeItems.length,
    soon: soonItems.length,
    expired: expiredCount,
    low: lowItems.length,
  }

  const onStatClick = (key) => {
    if (key === 'total') navigate('allItems')
    if (key === 'soon') navigate('reminders', { tab: 'expiring' })
    if (key === 'expired') navigate('trash')
    if (key === 'low') navigate('reminders', { tab: 'low' })
  }

  const categoryCounts = categories.map((category) => ({
    ...category,
    count: activeItems.filter((item) => item.category === category.id).length,
    soon: activeItems.filter(
      (item) => item.category === category.id && helpers.isSoon(item) && !helpers.isLowStock(item),
    ).length,
  }))

  const isEmpty = activeItems.length === 0 && helpers.trashItems.length === 0

  return (
    <div className="page home-page">
      <header className="home-header">
        <div className="home-topline">
          <span className="mini-brand">
            <span className="mini-brand-dot" />
            HOMEKEEP <em>·</em> 家物
          </span>
          <button className="icon-button settings-button" onClick={() => goTab('settings')} aria-label="打开设置">
            <Settings2 size={20} />
          </button>
        </div>
        <div className="home-title-block">
          <div>
            <span className="greeting">
              {greeting}
              <i />
            </span>
            <h1>我的家</h1>
            <div className="home-date">
              <CalendarDays size={14} />
              <span>{todaysDate}</span>
              <span className="date-divider" />
              <span>{activeItems.length ? '一切都被好好收着' : '从记录第一件物品开始'}</span>
            </div>
          </div>
          <MiniHomeDoodle />
        </div>
      </header>

      <section className="overview-card glass-card">
        <div className="overview-heading">
          <span className="overline-with-icon">
            <Sparkles size={14} />
            家中概览
          </span>
          <span className={`health-pill ${expiredCount ? 'has-alert' : ''}`}>
            <span />
            {expiredCount ? '有待处理' : '状态良好'}
          </span>
        </div>
        <div className="overview-stats">
          {statItems.map((stat, index) => (
            <button
              className={`overview-stat tone-${stat.tone}`}
              key={stat.key}
              onClick={() => onStatClick(stat.key)}
            >
              <span className="stat-number">
                {counts[stat.key]}
                {stat.key === 'total' && <small>件</small>}
              </span>
              <span className="stat-label">{stat.label}</span>
              {index < statItems.length - 1 && <span className="stat-separator" />}
            </button>
          ))}
        </div>
        <div className="overview-note">
          <span className="overview-leaf">⌁</span>
          <span>
            {soonItems.length
              ? `下一次需要留意的是「${minuteItems[0]?.name}」，${helpers.daysLeft(minuteItems[0])} 天后到期`
              : '家里暂时没有需要留意的事情'}
          </span>
          <ChevronRight size={14} />
        </div>
      </section>

      <section className="home-section">
        <SectionHeader
          title="即将到期"
          meta={soonItems.length}
          action="查看全部"
          onAction={() => navigate('reminders', { tab: 'expiring' })}
        />
        {minuteItems.length ? (
          <div className="expiring-list card-surface">
            {minuteItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                compact
                status={helpers.statusFor(item)}
                onClick={() => navigate('item', { id: item.id })}
              />
            ))}
          </div>
        ) : (
          <div className="quiet-empty">
            <span className="quiet-empty-icon">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>暂时没有即将到期的物品</strong>
              <p>新的记录会自动帮你留意日期</p>
            </div>
          </div>
        )}
      </section>

      <section className="home-section home-category-section">
        <SectionHeader
          title="物品分类"
          action="查看全部"
          onAction={() => navigate('categories')}
        />
        <div className="home-category-grid">
          {categoryCounts.map((category) => (
            <button
              className="home-category-tile"
              key={category.id}
              onClick={() => navigate('category', { id: category.id })}
            >
              <span
                className="category-tile-icon"
                style={{ background: category.tint, color: category.color }}
              >
                <CategoryIcon category={category} size={20} />
              </span>
              <span className="category-tile-name">{category.name}</span>
              <span className="category-tile-count">{category.count} 件</span>
              {category.soon > 0 && <span className="category-soon-dot" title={`${category.soon}件即将到期`} />}
            </button>
          ))}
        </div>
      </section>

      <section className="home-add-wrap">
        <button className="home-add-button" onClick={() => navigate('add', { source: 'home' })}>
          <span className="home-add-icon">
            <Plus size={21} />
          </span>
          <span className="home-add-copy">
            <strong>添加物品</strong>
            <small>把新物品放进家的位置</small>
          </span>
          <ChevronRight size={18} />
        </button>
        <p className="privacy-note">
          <span className="privacy-dot" />
          数据仅保存在这台设备
        </p>
      </section>

      {isEmpty && (
        <button className="clear-data-hint" onClick={() => navigate('add')}>
          <CircleAlert size={15} />
          家中还没有物品，记录第一件吧
        </button>
      )}
    </div>
  )
}
