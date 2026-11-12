import { useEffect, useMemo, useRef, useState } from 'react'
import { Boxes, CalendarDays, MapPin, Menu, X } from 'lucide-react'
import { findLocation, formatDate } from '../data'
import { useStore } from '../store'


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
  { key: 'total', label: '在库物品', tone: 'neutral' },
  { key: 'soon', label: '临近过期', tone: 'soon' },
  { key: 'expired', label: '过期待处理', tone: 'expired' },
  { key: 'low', label: '库存不足', tone: 'low' },
]

export default function Home() {
  const { helpers, navigate, items, settings, openSidebar } = useStore()
  const [popover, setPopover] = useState(null)
  const calendarHeaderRef = useRef(null)
  const { activeItems, soonItems, lowItems, expiredCount } = helpers
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(today)
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const monthKey = `${year}-${`${month}`.padStart(2, '0')}`
  const eventsByDay = useMemo(() => {
    const result = {}
    items.forEach((item) => {
      if (!item.expiryDate || !item.expiryDate.startsWith(monthKey)) return
      const needsAttention =
        helpers.isTrash(item) || helpers.isRetainedExpired(item) || helpers.isSoon(item)
      if (!needsAttention) return
      const dayNumber = Number(item.expiryDate.slice(8, 10))
      if (!result[dayNumber]) result[dayNumber] = []
      result[dayNumber].push(item)
    })
    return result
  }, [items, monthKey, helpers])

  const eventTone = (item) => {
    if (helpers.isTrash(item) || helpers.isRetainedExpired(item)) return 'expired'
    if (helpers.isSoon(item)) return 'soon'
    return 'normal'
  }

  const selectedEvents = popover ? eventsByDay[popover.day] || [] : []

  useEffect(() => {
    if (!popover) return undefined
    const closeOnOutside = (event) => {
      if (event.target.closest('.calendar-popover') || event.target.closest('.month-day.has-events')) return
      setPopover(null)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setPopover(null)
    }
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [popover])

  const openDayPopover = (event, date) => {
    if (popover?.day === date) {
      setPopover(null)
      return
    }
    const header = calendarHeaderRef.current
    if (!header) return
    const headerRect = header.getBoundingClientRect()
    const cellRect = event.currentTarget.getBoundingClientRect()
    const width = Math.min(286, headerRect.width - 14)
    const anchorX = cellRect.left - headerRect.left + cellRect.width / 2
    const left = Math.max(7, Math.min(anchorX - width / 2, headerRect.width - width - 7))
    setPopover({
      day: date,
      left,
      top: cellRect.bottom - headerRect.top + 10,
      width,
      arrowX: anchorX - left,
    })
  }

  const counts = {
    total: activeItems.length,
    soon: soonItems.length,
    expired: expiredCount,
    low: lowItems.length,
  }

  const onStatClick = (key) => {
    if (key === 'total') navigate('allItems')
    if (key === 'soon') navigate('collection', { view: 'soon' })
    if (key === 'expired') navigate('trash')
    if (key === 'low') navigate('reminders', { tab: 'low' })
  }


  return (
    <div className="page home-page">
      <header className="home-header home-calendar-header" ref={calendarHeaderRef}>
        <div className="home-calendar-topbar">
          <button className="icon-button settings-button" onClick={openSidebar} aria-label="打开物品导航">
            <Menu size={20} />
          </button>
        </div>
        <div className="home-calendar-card month-calendar-card">
          <div className="month-calendar-head">
            <div>
              <strong>{month}月</strong>
              <span>{year}</span>
            </div>
            <span className="month-calendar-weekday">{weekday}</span>
          </div>
          <div className="month-week-labels" aria-hidden="true">
            {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="month-grid" role="group" aria-label={`${year}年${month}月日历`}>
            {calendarCells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} className="month-day is-empty" />
              const events = eventsByDay[date] || []
              const dayLabel = `${month}月${date}日${date === day ? `，${weekday}` : ''}${
                events.length ? `，${events.map((item) => item.name).join('、')}` : ''
              }`
              const content = (
                <>
                  <span className="month-day-number">{date}</span>
                  {events.length > 0 && (
                    <span className="month-day-dots" aria-hidden="true">
                      {events.slice(0, 3).map((item, dotIndex) => (
                        <i key={`${item.id}-${dotIndex}`} className={`month-event-dot tone-${eventTone(item)}`} />
                      ))}
                    </span>
                  )}
                </>
              )
              return events.length ? (
                <button
                  type="button"
                  key={`${month}-${date}`}
                  className={`month-day has-events ${date === day ? 'is-today' : ''}`}
                  onClick={(event) => openDayPopover(event, date)}
                  aria-label={dayLabel}
                  aria-expanded={popover?.day === date}
                  aria-controls="calendar-date-popover"
                  title={events.map((item) => item.name).join('、')}
                >
                  {content}
                </button>
              ) : (
                <span
                  key={`${month}-${date}`}
                  className={`month-day ${date === day ? 'is-today' : ''}`}
                  aria-label={dayLabel}
                >
                  {content}
                </span>
              )
            })}
          </div>
          <p className="home-calendar-tagline">Everything, kept with care.</p>
        </div>
        {popover && selectedEvents.length > 0 && (
          <div
            className="calendar-popover"
            id="calendar-date-popover"
            role="dialog"
            aria-label={`${month}月${popover.day}日的物品`}
            style={{
              left: `${popover.left}px`,
              top: `${popover.top}px`,
              width: `${popover.width}px`,
              '--arrow-x': `${popover.arrowX}px`,
            }}
          >
            <button className="calendar-popover-close" onClick={() => setPopover(null)} aria-label="关闭">
              <X size={13} />
            </button>
            <div className="calendar-popover-list">
              {selectedEvents.map((item) => {
                const itemLocation = findLocation(item.location)
                return (
                  <div className="calendar-popover-item" key={item.id}>
                    <span className={`calendar-popover-dot tone-${eventTone(item)}`} />
                    <div className="calendar-popover-copy">
                      <strong>{item.name}{item.variant ? ` · ${item.variant}` : ''}</strong>
                      <span className="calendar-popover-meta">
                        <span>
                          <MapPin size={12} />
                          {itemLocation.name}
                        </span>
                        <span>
                          <CalendarDays size={12} />
                          {formatDate(item.expiryDate, settings.dateFormat)}{item.expiryTime ? ` ${item.expiryTime}` : ''}
                        </span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <section className="overview-card glass-card">
        <div className="overview-heading">
          <span className="overline-with-icon">
            <Boxes size={14} />
            库存
          </span>
          <span
            className={`health-pill ${expiredCount ? 'has-alert' : soonItems.length || lowItems.length ? 'has-notice' : ''}`}
          >
            <span />
            {items.length === 0 ? '等待记录' : expiredCount ? '有待处理' : soonItems.length || lowItems.length ? '需关注' : '状态良好'}
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
      </section>

    </div>
  )
}
