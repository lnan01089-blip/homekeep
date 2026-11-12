import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  Leaf,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { findCategory, findLocation, formatDate } from '../data'
import { useStore } from '../store'
import { ProductMedia, ScreenEmpty } from '../components/ui'

export default function Trash() {
  const {
    helpers,
    back,
    navigate,
    settings,
    retainItem,
    deleteItem,
    askConfirm,
    toast,
  } = useStore()
  const items = helpers.trashItems

  const handleRetain = (item) => {
    retainItem(item.id)
    toast(`「${item.name}」已保留，请按实际情况使用`)
    navigate('allItems', { filter: 'retained' })
  }

  const handleDelete = async (item) => {
    const confirmed = await askConfirm({
      title: '彻底删除这件物品？',
      message: `「${item.name}」的记录将从 HomeKeep 中永久移除。物品本身仍在你手中，去留请自行决定。`,
      confirmLabel: '确认删除记录',
      cancelLabel: '再想想',
      danger: true,
    })
    if (!confirmed) return
    deleteItem(item.id)
    toast('记录已从 HomeKeep 中删除')
  }

  return (
    <div className="page trash-page">
      <header className="trash-header">
        <div className="trash-topbar">
          <button className="icon-button soft" onClick={back} aria-label="返回">
            <ArrowLeft size={20} />
          </button>
          <span className="trash-top-title">过期物品</span>
          <span className="trash-count-badge">{items.length}</span>
        </div>
        <div className="trash-hero">
          <span className="trash-hero-icon">
            <Trash2 size={26} />
          </span>
          <div>
            <span className="eyebrow">EXPIRED STAGING</span>
            <h1>过期物品暂存区</h1>
            <p>过期，不等于丢弃。这里没有自动删除，只有你做的决定。</p>
          </div>
          <Leaf size={18} className="trash-leaf" />
        </div>
      </header>

      <div className="trash-rule-card">
        <span>
          <ShieldCheck size={16} />
        </span>
        <p>
          HomeKeep 只负责记录与提醒。食品、药品是否还能使用，请你结合实际情况判断。
        </p>
      </div>

      {items.length ? (
        <>
          <div className="trash-section-head">
            <span>暂存中</span>
            <strong>{items.length} 件</strong>
          </div>
          <div className="trash-list">
            {items.map((item) => {
              const category = findCategory(item.category)
              const location = findLocation(item.location)
              const days = Math.abs(helpers.daysLeft(item))
              return (
                <article className="trash-card" key={item.id}>
                  <button className="trash-card-main" onClick={() => navigate('item', { id: item.id })}>
                    <ProductMedia item={item} size={68} />
                    <span className="trash-card-copy">
                      <span className="trash-card-title">
                        <strong>{item.name}</strong>
                        <em>已过期 {days} 天</em>
                      </span>
                      <span className="trash-meta">
                        {category.name}
                        <i />
                        {location.name}
                      </span>
                      <span className="trash-date">
                        <Clock3 size={12} />
                        有效期 {formatDate(item.expiryDate, settings.dateFormat)}
                      </span>
                    </span>
                    <ChevronRight size={16} className="trash-chevron" />
                  </button>
                  <div className="trash-card-actions">
                    <button className="retain-button" onClick={() => handleRetain(item)}>
                      <RotateCcw size={16} />
                      继续保留
                    </button>
                    <button className="delete-permanent-button" onClick={() => handleDelete(item)}>
                      <Trash2 size={16} />
                      彻底删除
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="trash-footer-note">
            <span>
              <Leaf size={14} />
            </span>
            继续保留后，物品会回到普通列表，并标记为「已过期 · 已保留」
          </div>
          <button className="trash-back-link" onClick={() => navigate('allItems')}>
            返回普通物品列表
            <ChevronRight size={15} />
          </button>
        </>
      ) : (
        <>
          <ScreenEmpty
            icon="leaf"
            title="暂存区空空的"
            description="现在没有待处理的过期物品，家里的一切都被好好照看着。"
            action="返回物品列表"
            onAction={() => navigate('allItems')}
          />
          <div className="trash-soft-rule">
            <span className="trash-soft-rule-dot" />
            未来有物品到期时，会自动来到这里等待你决定
          </div>
        </>
      )}

      <div className="trash-location-hint">
        <MapPin size={14} />
        也可以在物品页右下角的垃圾篓随时找到这里
      </div>
    </div>
  )
}
