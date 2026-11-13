import { useEffect, useMemo, useRef, useState } from 'react'
import { Boxes, CalendarDays, ChevronLeft, ChevronRight, MapPin, Menu, X } from 'lucide-react'
import { findLocation, formatDate } from '../data'
import { useStore } from '../store'

const statItems = [
  { key: 'total', label: '在库物品', tone: 'neutral' },
  { key: 'soon', label: '临近过期', tone: 'soon' },
  { key: 'expired', label: '过期待处理', tone: 'expired' },
  { key: 'low', label: '库存不足', tone: 'low' },
]

const MIN_YEAR = 2000
const MAX_YEAR = 2045

export default function Home() {
  const { helpers, navigate, items, settings, openSidebar } = useStore()
  const calendarHeaderRef = useRef(null)
  const swipeStartRef = useRef(null)
  const swipeMovedRef = useRef(false)
  const suppressClickRef = useRef(false)
  const [popover, setPopover] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(currentYear, currentMonth - 1, 1),
  )

  const { activeItems, soonItems, lowItems, expiredCount } = helpers
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth() + 1
  const isViewingCurrentMonth = year === currentYear && month === currentMonth
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const monthKey = `${year}-${`${month}`.padStart(2, '0')}`

  const expiryByDay = useMemo(() => {
    const result = {}
    items.forEach((item) => {
      if (!item.expiryDate || !item.expiryDate.startsWith(monthKey)) return
      const dayNumber = Number(item.expiryDate.slice(8, 10))
      if (!result[dayNumber]) result[dayNumber] = []
      result[dayNumber].push(item)
    })
    return result
  }, [items, monthKey])

  const attentionByDay = useMemo(() => {
    const result = {}
    Object.entries(expiryByDay).forEach(([dayNumber, dayItems]) => {
      const attention = dayItems.filter(
        (item) =>
          helpers.isTrash(item) ||
          helpers.isRetainedExpired(item) ||
          helpers.isSoon(item),
      )
      if (attention.length) result[dayNumber] = attention
    })
    return result
  }, [expiryByDay, helpers])

  const eventTone = (item) => {
    if (helpers.isTrash(item) || helpers.isRetainedExpired(item)) return 'expired'
    if (helpers.isSoon(item)) return 'soon'
    return 'normal'
  }

  const selectedEvents = popover ? expiryByDay[popover.day] || [] : []

  const canGoPrevious =
    !(year === MIN_YEAR && month === 1)
  const canGoNext = !(year === MAX_YEAR && month === 12)

  const changeMonth = (delta) => {
    const next = new Date(year, month - 1 + delta, 1)
    if (next.getFullYear() < MIN_YEAR || next.getFullYear() > MAX_YEAR) return
    setVisibleMonth(next)
    setPopover(null)
    setSwipeOffset(0)
  }

  const handleSwipeStart = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    swipeStartRef.current = { x: event.clientX, y: event.clientY }
    swipeMovedRef.current = false
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleSwipeMove = (event) => {
    const start = swipeStartRef.current
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      swipeMovedRef.current = true
      setSwipeOffset(Math.max(-58, Math.min(58, dx)))
    }
  }

  const finishSwipe = (event) => {
    const start = swipeStartRef.current
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    swipeStartRef.current = null
    setSwipeOffset(0)
    if (swipeMovedRef.current && Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 280)
      changeMonth(dx > 0 ? -1 : 1)
    }
    swipeMovedRef.current = false
  }

  const cancelSwipe = () => {
    swipeStartRef.current = null
    swipeMovedRef.current = false
    setSwipeOffset(0)
  }

  useEffect(() => {
    if (!popover) return undefined
    const closeOnOutside = (event) => {
      if (
        event.target.closest('.calendar-popover') ||
        event.target.closest('.month-day') ||
        event.target.closest('.month-calendar-nav')
      ) {
        return
      }
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
    if (suppressClickRef.current) return
    if (popover?.day === date) {
      setPopover(null)
      return
    }
    const header = calendarHeaderRef.current
    if (!header) return
    const headerRect = header.getBoundingClientRect()
    const cellRect = event.currentTarget.getBoundingClientRect()
    const width = Math.min(300, headerRect.width - 14)
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
          <div className="month-calendar-nav">
            <button
              className="month-nav-button"
              onClick={() => changeMonth(-1)}
              disabled={!canGoPrevious}
              aria-label="上个月"
            >
              <ChevronLeft size={19} />
            </button>
            <strong className="month-calendar-title">
              {year}年{month}月
            </strong>
            <button
              className="month-nav-button"
              onClick={() => changeMonth(1)}
              disabled={!canGoNext}
              aria-label="下个月"
            >
              <ChevronRight size={19} />
            </button>
          </div>
          <div className="month-week-labels" aria-hidden="true">
            {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div
            className="month-grid"
            role="group"
            aria-label={`${year}年${month}月日历`}
            style={{
              transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
              transition: swipeOffset ? 'none' : undefined,
            }}
            onPointerDown={handleSwipeStart}
            onPointerMove={handleSwipeMove}
            onPointerUp={finishSwipe}
            onPointerCancel={cancelSwipe}
          >
            {calendarCells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} className="month-day is-empty" />
              const allEvents = expiryByDay[date] || []
              const attention = attentionByDay[date] || []
              const dateWeekday = new Intl.DateTimeFormat('zh-CN', {
                weekday: 'long',
              }).format(new Date(year, month - 1, date))
              const isToday =
                isViewingCurrentMonth && date === today.getDate()
              const dayLabel = `${year}年${month}月${date}日，${dateWeekday}${
                allEvents.length ? `，${allEvents.map((item) => item.name).join('、')}` : ''
              }`
              return (
                <button
                  type="button"
                  key={`${year}-${month}-${date}`}
                  className={`month-day is-selectable ${attention.length ? 'has-events' : ''} ${
                    isToday ? 'is-today' : ''
                  } ${popover?.day === date ? 'is-selected' : ''}`}
                  onClick={(event) => openDayPopover(event, date)}
                  aria-label={dayLabel}
                  aria-selected={popover?.day === date}
                  aria-expanded={popover?.day === date}
                  aria-controls="calendar-date-popover"
                  title={allEvents.length ? allEvents.map((item) => item.name).join('、') : dayLabel}
                >
                  <span className="month-day-number">{date}</span>
                  {attention.length > 0 && (
                    <span className="month-day-dots" aria-hidden="true">
                      {attention.slice(0, 3).map((item, dotIndex) => (
                        <i key={`${item.id}-${dotIndex}`} className={`month-event-dot tone-${eventTone(item)}`} />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="home-calendar-tagline">Everything, kept with care.</p>
        </div>
        {popover && (
          <div
            className="calendar-popover"
            id="calendar-date-popover"
            role="dialog"
            aria-label={`${year}年${month}月${popover.day}日的物品`}
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
            <div className={`calendar-popover-list ${selectedEvents.length ? '' : 'is-empty'}`}>
              {selectedEvents.length ? (
                selectedEvents.map((item) => {
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
                })
              ) : (
                <div className="calendar-popover-empty">
                  <span className="calendar-empty-dot" />
                  当天没有到期物品
                </div>
              )}
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
