import { useState } from 'react'
import {
  AlarmClock,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  Clock3,
  MapPin,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Sparkles,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import { addDays, findCategory, findLocation, formatDate, parseDate, getItemImage } from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  FixedAction,
  InfoRow,
  LocationIcon,
  LocationSelectRender,
  ProductMedia,
  QuantityStepper,
  Sheet,
  StatusPill,
} from '../components/ui'

export default function ItemDetail() {
  const {
    route,
    back,
    navigate,
    helpers,
    items,
    settings,
    allLocations,
    adjustQuantity,
    updateItem,
    deleteItem,
    markReplaced,
    toast,
    askConfirm,
  } = useStore()
  const item = items.find((entry) => entry.id === route.params?.id)
  const [locationOpen, setLocationOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  if (!item) {
    return (
      <div className="page missing-page">
        <button className="icon-button soft" onClick={back}>
          <ChevronLeft size={21} />
        </button>
        <div>
          <h2>这件物品已经不在这里了</h2>
          <p>它可能被删除了，返回物品列表看看吧。</p>
          <button className="small-solid-button" onClick={back}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const category = findCategory(item.category)
  const location = findLocation(item.location)
  const status = helpers.statusFor(item)
  const days = helpers.daysLeft(item)
  const image = getItemImage(item)
  const retained = helpers.isRetainedExpired(item)
  const expired = helpers.isExpiredByDate(item)
  const soon = !expired && days !== null && days >= 0 && days <= settings.defaultAdvance
  const quantityMissing = item.quantity === null || item.quantity === undefined || item.quantity === ''
  const expiryTone = retained || expired ? 'expired' : soon ? 'soon' : item.expiryDate ? 'normal' : 'neutral'
  const afterOpenDate =
    item.openedDate && item.afterOpenDays
      ? addDays(Number(item.afterOpenDays), parseDate(item.openedDate))
      : null
  const totalShelfDays =
    item.productionDate && item.expiryDate
      ? Math.max(1, Math.round((parseDate(item.expiryDate) - parseDate(item.productionDate)) / 86_400_000))
      : null
  const shelfLifeLabel = item.shelfLifeValue
    ? `${item.shelfLifeValue}${item.shelfLifeUnit || '天'}`
    : '未设置'
  const remainingRatio =
    totalShelfDays && days !== null ? Math.max(0, Math.min(1, days / totalShelfDays)) : null

  const expiryHeadline = (() => {
    if (item.expiryDate === null || item.expiryDate === undefined) return '长期保存'
    if (days < 0) return `已过期 ${Math.abs(days)} 天`
    if (expired) return '今天已过期'
    if (days === 0) return '今天到期'
    return `还有 ${days} 天`
  })()

  const handleDelete = async () => {
    const confirmed = await askConfirm({
      title: '删除这件物品？',
      message: `「${item.name}${item.variant ? ` · ${item.variant}` : ''}」的记录会从 HomeKeep 中移除，此操作无法撤销。`,
      confirmLabel: '确认删除',
      cancelLabel: '先留着',
      danger: true,
    })
    if (!confirmed) return
    deleteItem(item.id)
    toast('物品已删除')
    back()
  }

  const handleLocation = (locationId) => {
    updateItem(item.id, { location: locationId })
    toast(`已移动到${findLocation(locationId).name}`)
  }

  return (
    <div className="page item-detail-page">
      <header className="detail-topbar">
        <button className="icon-button glass" onClick={back} aria-label="返回">
          <ChevronLeft size={22} />
        </button>
        <span className="detail-topbar-title">物品详情</span>
        <button className="icon-button glass" onClick={() => setMoreOpen(true)} aria-label="更多操作">
          <MoreHorizontal size={21} />
        </button>
      </header>

      <div className="item-hero">
        <div
          className="item-hero-media"
          style={{ '--hero-tint': category.tint, '--hero-color': category.color }}
        >
          {image ? (
            <img src={image} alt={item.name} />
          ) : (
            <div className="item-hero-glyph">
              <ProductMedia item={item} size={182} rounded={45} />
            </div>
          )}
          <div className="item-hero-shade" />
          <div className="item-hero-badges">
            <span className="hero-category-pill" style={{ background: category.tint, color: category.color }}>
              <CategoryIcon category={category} size={13} />
              {category.name}
            </span>
            <StatusPill status={status} className="hero-status" />
          </div>
        </div>

        <div className="item-identity">
          <div>
            <h1>{item.name}</h1>
            <p>{item.variant ? `${item.variant}${item.spec ? ` · ${item.spec}` : ''}` : item.spec || category.name}</p>
          </div>
          {!quantityMissing && (
            <span className="identity-quantity">
              <strong>{item.quantity}</strong>
              {item.unit ? <small>{item.unit}</small> : null}
            </span>
          )}
        </div>
      </div>

      <div className={`expiry-focus-card tone-${expiryTone}`}>
        <div className="expiry-focus-top">
          <span className="expiry-icon">
            <AlarmClock size={19} />
          </span>
          <div className="expiry-copy">
            <span>
              {item.expiryDate ? (retained ? '有效期已过 · 你选择保留' : '有效期') : '有效期设置'}
            </span>
            <strong>{expiryHeadline}</strong>
            {item.expiryDate && (
              <small>
                {formatDate(item.expiryDate, settings.dateFormat)}
                {item.expiryTime ? ` ${item.expiryTime}` : ''}
                {retained && ' · 已保留'}
              </small>
            )}
          </div>
          <span className="expiry-arc" aria-hidden="true" />
        </div>
        {remainingRatio !== null && (
          <div className="expiry-progress">
            <span className="expiry-progress-label">
              <span>保质期进度</span>
              <span>{Math.round(remainingRatio * 100)}% 剩余</span>
            </span>
            <div className="progress-track">
              <span style={{ width: `${remainingRatio * 100}%` }} />
            </div>
          </div>
        )}
        {retained && (
          <div className="retained-note">
            <TriangleAlert size={14} />
            你已选择继续保留。食品与药品是否安全，请由你自行判断。
          </div>
        )}
        {afterOpenDate && (
          <div className="after-open-note">
            <Clock3 size={14} />
            开封于 {formatDate(item.openedDate, 'short')}，开封后建议使用至 {formatDate(afterOpenDate, 'short')}
          </div>
        )}
      </div>

      <div className="detail-card location-link-card">
        <button
          className="location-link-main"
          onClick={() => navigate('location', { id: location.id })}
        >
          <span className="location-link-icon" style={{ background: location.tint, color: location.color }}>
            <LocationIcon location={location} size={22} />
          </span>
          <span className="location-link-copy">
            <small>存放位置 · {location.room}</small>
            <strong>{location.name}</strong>
          </span>
          <span className="location-link-action">
            查看
            <ArrowUpRight size={15} />
          </span>
        </button>
        <button className="location-change-button" onClick={() => setLocationOpen(true)}>
          更换位置
        </button>
      </div>

      <section className="detail-card stock-card">
        <div className="stock-heading">
          <div>
            <span className="overline">当前库存</span>
            <h3>数量管理</h3>
          </div>
          <span className={`stock-indicator ${helpers.isLowStock(item) ? 'is-low' : ''}`}>
            <span />
            {quantityMissing ? '数量未记录' : helpers.isLowStock(item) ? '需要补充' : '存量充足'}
          </span>
        </div>
        <QuantityStepper
          value={item.quantity}
          unit={item.unit}
          min={0}
          onChange={(next) => adjustQuantity(item.id, next - (Number(item.quantity) || 0))}
        />
        {helpers.isLowStock(item) && (
          <p className="stock-note">
            <TriangleAlert size={13} />
            当前数量低于你的库存提醒线，记得补充。
          </p>
        )}
      </section>

      <section className="detail-card info-card">
        <div className="detail-card-heading">
          <h3>物品档案</h3>
          <span>记录于 {formatDate(item.createdAt, 'short')}</span>
        </div>
        <div className="info-list">
          <InfoRow label="物品分类" icon={Sparkles} valueNode={category.name} />
          <InfoRow
            label="规格 / 口味"
            icon={Sparkles}
            value={item.variant || '未设置'}
            muted={!item.variant}
          />
          <InfoRow
            label="生产日期"
            icon={CalendarDays}
            value={item.productionDate ? formatDate(item.productionDate, settings.dateFormat) : '未记录'}
            muted={!item.productionDate}
          />
          <InfoRow
            label="保质期"
            icon={NotebookPen}
            value={shelfLifeLabel}
            muted={!item.shelfLifeValue}
          />
          <InfoRow
            label="有效期"
            icon={AlarmClock}
            value={item.expiryDate ? `${formatDate(item.expiryDate, settings.dateFormat)}${item.expiryTime ? ` ${item.expiryTime}` : ''}` : '未设置'}
            muted={!item.expiryDate}
          />
          <InfoRow label="开封日期" icon={Clock3} value={item.openedDate ? formatDate(item.openedDate, settings.dateFormat) : '未开封'} muted={!item.openedDate} />
          <InfoRow
            label="开封后使用期限"
            icon={NotebookPen}
            value={item.afterOpenDays ? `${item.afterOpenDays} 天` : '未设置'}
            muted={!item.afterOpenDays}
            last
          />
        </div>
      </section>

      {item.replaceAt && (
        <section className="detail-card maintenance-card">
          <div className="maintenance-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <span>维护提醒</span>
            <strong>{item.replaceLabel || '建议更换'}</strong>
            <small>建议在 {formatDate(item.replaceAt, 'short')} 前处理</small>
          </div>
          <button
            onClick={() => {
              markReplaced(item.id)
              toast('已标记为更换完成')
            }}
            className="maintenance-action"
          >
            标记完成
          </button>
        </section>
      )}

      <section className="detail-card note-card">
        <div className="detail-card-heading">
          <h3>生活小记</h3>
          <NotebookPen size={16} />
        </div>
        <p>{item.note || '还没有为这件物品写下备注。'}</p>
      </section>

      <FixedAction withTabs>
        <button className="detail-delete-button" onClick={handleDelete} aria-label="删除物品">
          <Trash2 size={20} />
        </button>
        <button className="primary-action edit-item-button" onClick={() => navigate('edit', { id: item.id })}>
          <Pencil size={17} />
          编辑物品
        </button>
      </FixedAction>

      <Sheet
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        title="更换存放位置"
      >
        <div className="select-list">
          {allLocations.map((option) => (
            <button
              className={`select-option ${item.location === option.id ? 'is-selected' : ''}`}
              key={option.id}
              onClick={() => {
                handleLocation(option.id)
                setLocationOpen(false)
              }}
            >
              <LocationSelectRender location={option} />
              {item.location === option.id && (
                <span className="select-check">
                  <Sparkles size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="物品操作">
        <div className="select-list action-list">
          <button
            className="select-option"
            onClick={() => {
              setMoreOpen(false)
              navigate('edit', { id: item.id })
            }}
          >
            <span className="action-sheet-icon">
              <Pencil size={19} />
            </span>
            <span className="select-option-label">编辑物品信息</span>
          </button>
          <button
            className="select-option"
            onClick={() => {
              setMoreOpen(false)
              setLocationOpen(true)
            }}
          >
            <span className="action-sheet-icon">
              <MapPin size={19} />
            </span>
            <span className="select-option-label">修改存放位置</span>
          </button>
          <button
            className="select-option danger"
            onClick={() => {
              setMoreOpen(false)
              handleDelete()
            }}
          >
            <span className="action-sheet-icon">
              <Trash2 size={19} />
            </span>
            <span className="select-option-label">删除物品</span>
          </button>
        </div>
      </Sheet>

    </div>
  )
}
