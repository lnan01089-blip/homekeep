import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Apple,
  Archive,
  ArrowRight,
  Bandage,
  Bath,
  Battery,
  Blend,
  Boxes,
  Bubbles,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Coffee,
  Cookie,
  CupSoda,
  DoorClosed,
  Droplets,
  Egg,
  FlaskConical,
  FlaskRound,
  GlassWater,
  House,
  Lamp,
  Layers2,
  Leaf,
  Lightbulb,
  MapPin,
  Minus,
  Package,
  Package2,
  Pill,
  Pipette,
  Plus,
  Refrigerator,
  Search,
  Sparkles,
  SprayCan,
  Table2,
  Thermometer,
  Trash2,
  Tv,
  Utensils,
  WashingMachine,
  X,
} from 'lucide-react'
import { categories, findCategory, findLocation, formatDate, getItemImage, glyphMap } from '../data'
import { useStore } from '../store'

const categoryIcons = {
  food: Apple,
  medicine: Pill,
  beauty: Sparkles,
  cleaning: SprayCan,
  home: House,
}

const locationIcons = {
  refrigerator: Refrigerator,
  cabinet: Archive,
  sideboard: Table2,
  archive: Archive,
  tv: Tv,
  boxes: Boxes,
  bath: Bath,
  door: DoorClosed,
  lamp: Lamp,
  sparkles: Sparkles,
  pin: MapPin,
}

const glyphIcons = {
  milk: GlassWater,
  eggs: Egg,
  bread: Cookie,
  apple: Apple,
  yogurt: CupSoda,
  juice: GlassWater,
  lettuce: Leaf,
  cheese: Cookie,
  water: Droplets,
  coffee: Coffee,
  cookies: Cookie,
  vitamins: Pill,
  bandage: Bandage,
  ibuprofen: Pill,
  thermometer: Thermometer,
  cream: Sparkles,
  serum: Pipette,
  handcream: FlaskRound,
  shampoo: FlaskConical,
  cleanser: FlaskRound,
  bodywash: Bubbles,
  lotion: FlaskConical,
  detergent: WashingMachine,
  dishsoap: Bubbles,
  disinfectant: SprayCan,
  cloth: Layers2,
  pods: Blend,
  tissues: Package,
  backupTissues: Package2,
  batteries: Battery,
  bulbs: Lightbulb,
  trashbags: Trash2,
  toast: Cookie,
}

export function CategoryIcon({ category, size = 20, strokeWidth = 1.8 }) {
  const Icon = categoryIcons[category?.id] || Utensils
  return <Icon size={size} strokeWidth={strokeWidth} />
}

export function LocationIcon({ location, size = 20, strokeWidth = 1.8 }) {
  const Icon = locationIcons[location?.icon] || MapPin
  return <Icon size={size} strokeWidth={strokeWidth} />
}

export function GlyphIcon({ glyph, size = 24, strokeWidth = 1.55 }) {
  const Icon = glyphIcons[glyph] || glyphIcons[glyphMap[glyph]] || Package
  return <Icon size={size} strokeWidth={strokeWidth} />
}

export function BrandMark({ size = 40, className = '' }) {
  return (
    <span className={`brand-mark ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M9.7 18.7 20 9.9l10.3 8.8v10.6c0 1.2-1 2.2-2.2 2.2H11.9c-1.2 0-2.2-1-2.2-2.2V18.7Z"
          fill="currentColor"
          opacity=".16"
        />
        <path
          d="M8.7 19.5 20 9.6l11.3 9.9M11.4 17.7v11.3c0 1.4 1.1 2.5 2.5 2.5h12.2c1.4 0 2.5-1.1 2.5-2.5V17.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16.6 31.4v-6.2c0-.8.7-1.5 1.5-1.5h3.8c.8 0 1.5.7 1.5 1.5v6.2" fill="#F6F5F0" />
        <path d="M24.6 12.7c.3-2.1 1.7-3.6 3.8-4.2-.2 2.3-1.5 3.9-3.8 4.2Z" fill="currentColor" opacity=".75" />
      </svg>
    </span>
  )
}

export function ProductMedia({ item, size = 58, className = '', rounded = 18 }) {
  const image = getItemImage(item)
  const category = findCategory(item?.category)
  const style = {
    '--media-size': `${size}px`,
    '--media-tint': category?.tint || '#EDF0EB',
    '--media-color': category?.color || '#728378',
    '--media-radius': `${rounded}px`,
  }
  return (
    <span className={`product-media ${className}`} style={style}>
      {image ? (
        <img src={image} alt="" draggable="false" />
      ) : (
        <span className="product-glyph">
          <span className="product-glyph-orbit" />
          <GlyphIcon glyph={item?.glyph || item?.category} size={Math.max(20, size * 0.38)} />
        </span>
      )}
      <span className="media-gloss" />
    </span>
  )
}

export function StatusPill({ status, dot = false, className = '' }) {
  if (!status) return null
  return (
    <span className={`status-pill status-${status.tone} ${className}`}>
      {dot && <span className="status-dot" />}
      {status.label ?? status.short}
    </span>
  )
}

export function QtyPill({ item }) {
  return (
    <span className="qty-pill">
      {item.quantity}
      {item.unit}
    </span>
  )
}

export function ScreenHeader({ title, eyebrow, onBack, right = null, sticky = false, className = '' }) {
  return (
    <header className={`screen-header ${sticky ? 'is-sticky' : ''} ${className}`}>
      <div className="screen-header-top">
        {onBack ? (
          <button className="icon-button soft back-button" onClick={onBack} aria-label="返回">
            <ChevronLeft size={22} />
          </button>
        ) : null}
        <div className="screen-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
        </div>
        {right ? <div className="screen-header-right">{right}</div> : null}
      </div>
    </header>
  )
}

export function SectionHeader({ title, meta, action, onAction, icon }) {
  return (
    <div className="section-header">
      <div className="section-title-wrap">
        <h2>{title}</h2>
        {meta != null && <span className="section-count">{meta}</span>}
      </div>
      {action ? (
        <button className="text-button" onClick={onAction}>
          {action}
          <ChevronRight size={15} />
        </button>
      ) : null}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = '搜索物品名称', onSubmit, autoFocus = false, right }) {
  const inputRef = useRef(null)
  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [autoFocus])
  return (
    <div className={`search-field ${value ? 'has-value' : ''}`}>
      <Search size={18} />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit?.(value)
        }}
      />
      {value ? (
        <button className="search-clear" onClick={() => onChange('')} aria-label="清空搜索">
          <X size={15} />
        </button>
      ) : null}
      {right}
    </div>
  )
}

export function FilterChip({ active, children, onClick, count, tone = 'sage' }) {
  return (
    <button className={`filter-chip ${active ? 'is-active' : ''} tone-${tone}`} onClick={onClick}>
      {children}
      {count != null && <span className="chip-count">{count}</span>}
    </button>
  )
}

export function ItemRow({
  item,
  status,
  onClick,
  compact = false,
  showChevron = true,
  trailing,
  className = '',
  hideStatus = false,
}) {
  const category = findCategory(item.category)
  const location = findLocation(item.location)
  const { settings } = useStore()
  return (
    <button className={`item-row ${compact ? 'is-compact' : ''} ${className}`} onClick={onClick}>
      <ProductMedia item={item} size={compact ? 58 : 64} />
      <span className="item-row-body">
        <span className="item-row-heading">
          <span className="item-name">{item.name}</span>
          {!hideStatus && status ? <StatusPill status={status} /> : null}
        </span>
        <span className="item-meta">
          <span>{category.name}</span>
          <i />
          <span>{location.name}</span>
          {!compact && (
            <>
              <i />
              <span>
                {item.quantity}
                {item.unit}
              </span>
            </>
          )}
        </span>
        <span className="item-expiry">
          {status?.code === 'expired' || status?.code === 'retained'
            ? `有效期 ${formatDate(item.expiryDate, settings.dateFormat)} · 已过期`
            : item.expiryDate
              ? `有效期至 ${formatDate(item.expiryDate, settings.dateFormat)}`
              : '未设置有效期 · 长期保存'}
        </span>
      </span>
      {trailing || (showChevron ? <ChevronRight className="row-chevron" size={18} /> : null)}
    </button>
  )
}

export function QuantityStepper({ value, unit, onChange, min = 0, size = 'normal' }) {
  return (
    <div className={`quantity-stepper size-${size}`}>
      <button
        type="button"
        className="step-button"
        onClick={() => onChange(Math.max(min, Number(value) - 1))}
        aria-label="减少数量"
        disabled={Number(value) <= min}
      >
        <Minus size={18} />
      </button>
      <span className="quantity-value">
        <strong>{value}</strong>
        <span>{unit}</span>
      </span>
      <button type="button" className="step-button plus" onClick={() => onChange(Number(value) + 1)} aria-label="增加数量">
        <Plus size={18} />
      </button>
    </div>
  )
}

export function ScreenEmpty({ icon = 'leaf', title, description, action, onAction }) {
  const Icon = icon === 'search' ? Search : icon === 'archive' ? Archive : Leaf
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={28} strokeWidth={1.45} />
        <span className="empty-dot" />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <button className="small-solid-button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

export function EmptyLine({ children = '未记录' }) {
  return <span className="empty-line">{children}</span>
}

/* Overlays live inside the phone shell, not the full browser window. */
function usePhoneLayer() {
  const [host, setHost] = useState(null)
  useEffect(() => {
    setHost(document.getElementById('phone-layer'))
  }, [])
  return host
}

export function PhonePortal({ children }) {
  const host = usePhoneLayer()
  if (!host) return null
  return createPortal(children, host)
}

function useOverlayBehavior(open, onClose) {
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    document.querySelector('.app-scroll')?.classList.add('scroll-locked')
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.querySelector('.app-scroll')?.classList.remove('scroll-locked')
    }
  }, [open, onClose])
}

export function Sheet({ open, onClose, title, children, className = '', full = false }) {
  useOverlayBehavior(open, onClose)
  if (!open) return null
  return (
    <PhonePortal>
      <div className={`overlay sheet-overlay ${full ? 'sheet-full' : ''}`} role="presentation" onMouseDown={onClose}>
        <div className="overlay-backdrop" />
        <section
          className={`bottom-sheet ${className}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="sheet-handle" />
          {title && (
            <div className="sheet-heading">
              <div>
                <h2>{title}</h2>
                    </div>
              <button className="icon-button soft sheet-close" onClick={onClose} aria-label="关闭">
                <X size={18} />
              </button>
            </div>
          )}
          <div className="sheet-content">{children}</div>
        </section>
      </div>
    </PhonePortal>
  )
}

export function ConfirmDialog({ state, onResolve }) {
  useOverlayBehavior(Boolean(state), () => onResolve(false))
  if (!state) return null
  return (
    <PhonePortal>
      <div className="overlay dialog-overlay" role="presentation" onMouseDown={() => onResolve(false)}>
        <div className="overlay-backdrop is-deep" />
        <section className="confirm-dialog" role="alertdialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
          <span className={`dialog-icon ${state.danger ? 'danger' : ''}`}>
            {state.danger ? <Trash2 size={24} /> : <CircleAlert size={24} />}
          </span>
          <h2>{state.title}</h2>
          <p>{state.message}</p>
          <div className="dialog-actions">
            <button className="dialog-button secondary" onClick={() => onResolve(false)}>
              {state.cancelLabel}
            </button>
            <button
              className={`dialog-button ${state.danger ? 'danger' : 'primary'}`}
              onClick={() => onResolve(true)}
            >
              {state.confirmLabel}
            </button>
          </div>
        </section>
      </div>
    </PhonePortal>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <PhonePortal>
      <div className="toast" role="status" key={toast.key}>
        <span className="toast-icon">
          <Check size={14} strokeWidth={2.5} />
        </span>
        <span>{toast.message}</span>
      </div>
    </PhonePortal>
  )
}

export function FixedAction({ children, withTabs = false, className = '' }) {
  return (
    <PhonePortal>
      <div className={`fixed-action ${withTabs ? 'with-tabs' : ''} ${className}`}>
        <div className="fixed-action-inner">{children}</div>
      </div>
    </PhonePortal>
  )
}

export function SelectSheet({ open, onClose, title, options, value, onSelect, columns = 1 }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className={`select-list ${columns === 2 ? 'two-column' : ''}`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`select-option ${value === option.value ? 'is-selected' : ''}`}
            onClick={() => {
              onSelect(option.value)
              onClose()
            }}
          >
            {option.render ? (
              option.render
            ) : (
              <>
                <span className="select-option-label">{option.label}</span>
                {option.description && <span className="select-option-description">{option.description}</span>}
              </>
            )}
            {value === option.value && (
              <span className="select-check">
                <Check size={15} />
              </span>
            )}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

export function CategorySelectRender({ category }) {
  return (
    <span className="category-select-option">
      <span className="category-icon" style={{ background: category.tint, color: category.color }}>
        <CategoryIcon category={category} size={19} />
      </span>
      <span>
        <strong>{category.name}</strong>
      </span>
    </span>
  )
}

export function LocationSelectRender({ location }) {
  return (
    <span className="category-select-option">
      <span className="category-icon" style={{ background: location.tint, color: location.color }}>
        <LocationIcon location={location} size={19} />
      </span>
      <span>
        <strong>{location.name}</strong>
      </span>
    </span>
  )
}

/* A refined, dependency-free date picker. */
const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

function buildMonth(year, month) {
  const first = new Date(year, month, 1, 12)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = first.getDay()
  const cells = []
  for (let i = 0; i < leading; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${`${month + 1}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
    cells.push({ day, iso })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function DatePickerSheet({ open, onClose, value, onSelect, title = '选择日期', minYear = 2000, maxYear = 2045 }) {
  const selectedDate = value ? new Date(`${value}T12:00:00`) : new Date()
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())
  useEffect(() => {
    if (!open) return
    const date = value ? new Date(`${value}T12:00:00`) : new Date()
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth())
  }, [open, value])
  const cells = useMemo(() => buildMonth(viewYear, viewMonth), [viewYear, viewMonth])
  const todayKey = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`
  }, [])
  const goMonth = (delta) => {
    let nextMonth = viewMonth + delta
    let nextYear = viewYear
    if (nextMonth < 0) {
      nextMonth = 11
      nextYear -= 1
    } else if (nextMonth > 11) {
      nextMonth = 0
      nextYear += 1
    }
    if (nextYear < minYear || nextYear > maxYear) return
    setViewMonth(nextMonth)
    setViewYear(nextYear)
  }
  return (
    <Sheet open={open} onClose={onClose} title={title} className="date-sheet">
      <div className="date-picker-head">
        <button className="icon-button soft" onClick={() => goMonth(-1)} aria-label="上个月">
          <ChevronLeft size={18} />
        </button>
        <div className="date-month-title">
          <strong>{viewYear}年</strong>
          <span>{viewMonth + 1}月</span>
        </div>
        <button className="icon-button soft" onClick={() => goMonth(1)} aria-label="下个月">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekdayLabels.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, index) =>
          cell ? (
            <button
              key={cell.iso}
              className={`calendar-day ${cell.iso === value ? 'is-selected' : ''} ${cell.iso === todayKey ? 'is-today' : ''}`}
              onClick={() => {
                onSelect(cell.iso)
                onClose()
              }}
            >
              {cell.day}
            </button>
          ) : (
            <span key={`empty-${index}`} className="calendar-day empty" />
          ),
        )}
      </div>
      <div className="date-picker-actions">
        <button
          className="text-button subtle"
          onClick={() => {
            onSelect('')
            onClose()
          }}
        >
          清除日期
        </button>
        <button
          className="text-button accent"
          onClick={() => {
            onSelect(todayKey)
            onClose()
          }}
        >
          选择今天
        </button>
      </div>
    </Sheet>
  )
}

export function LogoWordmark({ compact = false }) {
  return (
    <span className={`wordmark ${compact ? 'compact' : ''}`}>
      <BrandMark size={compact ? 27 : 32} />
      <span className="wordmark-text">
        <strong>HomeKeep</strong>
        {!compact && <small>家物管理</small>}
      </span>
    </span>
  )
}

export function DeltaPill({ direction = 'up', children }) {
  return (
    <span className={`delta-pill ${direction}`}>
      {direction === 'up' ? '+' : ''}
      {children}
    </span>
  )
}

export function SmallArrowButton({ onClick, label = '查看' }) {
  return (
    <button className="small-arrow-button" onClick={onClick} aria-label={label}>
      <ArrowRight size={16} />
    </button>
  )
}

export function ShortcutCard({ icon: Icon, label, count, onClick, color = '#6F9682', tint = '#E7EFEA' }) {
  return (
    <button className="shortcut-card" onClick={onClick}>
      <span className="shortcut-icon" style={{ background: tint, color }}>
        <Icon size={19} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{count}</small>
      </span>
      <ChevronRight size={16} className="shortcut-chevron" />
    </button>
  )
}

export function InfoRow({ icon: Icon, label, value, valueNode, onClick, muted, last = false }) {
  const content = (
    <>
      <span className="info-row-label">
        {Icon && <Icon size={17} strokeWidth={1.7} />}
        {label}
      </span>
      <span className={`info-row-value ${muted ? 'muted' : ''}`}>{valueNode || value}</span>
      {onClick && <ChevronRight size={16} className="info-chevron" />}
    </>
  )
  if (onClick) {
    return (
      <button className={`info-row clickable ${last ? 'last' : ''}`} onClick={onClick}>
        {content}
      </button>
    )
  }
  return <div className={`info-row ${last ? 'last' : ''}`}>{content}</div>
}

export function Divider({ label }) {
  if (!label) return <div className="fine-divider" />
  return (
    <div className="labeled-divider">
      <span />
      <em>{label}</em>
      <span />
    </div>
  )
}

export { categories, findCategory, findLocation, formatDate }
