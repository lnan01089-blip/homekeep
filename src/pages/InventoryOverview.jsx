import { Boxes, PackageCheck } from 'lucide-react'
import { useStore } from '../store'
import {
  CategoryIcon,
  ItemRow,
  LocationIcon,
  ScreenHeader,
  SectionHeader,
} from '../components/ui'

export default function InventoryOverview() {
  const { helpers, navigate, back, allCategories, allLocations } = useStore()
  const activeItems = helpers.activeItems
  const lowItems = helpers.lowItems

  const categoryRows = allCategories
    .map((category) => ({
      ...category,
      count: activeItems.filter((item) => item.category === category.id).length,
    }))
    .filter((category) => category.count > 0 || category.isCustom)

  const locationRows = allLocations
    .map((location) => ({
      ...location,
      count: activeItems.filter((item) => item.location === location.id).length,
    }))
    .filter((location) => location.count > 0 || location.isCustom)

  return (
    <div className="page inventory-page">
      <ScreenHeader
        onBack={back}
        eyebrow="INVENTORY OVERVIEW"
        title="库存总览"
        right={
          <span className="inventory-count-chip">
            <Boxes size={15} />
            {activeItems.length}
          </span>
        }
      />

      <section className="inventory-hero">
        <div className="inventory-hero-main">
          <span>在库物品</span>
          <strong>{activeItems.length}</strong>
          <small>件记录</small>
        </div>
        <div className="inventory-hero-stats">
          <div>
            <strong>{allCategories.length}</strong>
            <span>分类</span>
          </div>
          <i />
          <div>
            <strong>{locationRows.length}</strong>
            <span>位置</span>
          </div>
          <i />
          <div>
            <strong className={lowItems.length ? 'warn' : ''}>{lowItems.length}</strong>
            <span>库存不足</span>
          </div>
        </div>
      </section>

      <section className="inventory-section">
        <SectionHeader title="分类库存" meta={categoryRows.length} />
        <div className="inventory-taxonomy-list">
          {categoryRows.map((category) => (
            <button
              key={category.id}
              className="inventory-taxonomy-row"
              onClick={() => navigate('category', { id: category.id })}
            >
              <span
                className="inventory-taxonomy-icon"
                style={{ background: category.tint, color: category.color }}
              >
                <CategoryIcon category={category} size={18} />
              </span>
              <span className="inventory-taxonomy-name">{category.name}</span>
              <span className="inventory-taxonomy-count">{category.count}</span>
              <span className="inventory-taxonomy-chevron">›</span>
            </button>
          ))}
        </div>
      </section>

      <section className="inventory-section">
        <SectionHeader title="存放位置" meta={locationRows.length} />
        <div className="inventory-taxonomy-list">
          {locationRows.map((location) => (
            <button
              key={location.id}
              className="inventory-taxonomy-row"
              onClick={() => navigate('location', { id: location.id })}
            >
              <span
                className="inventory-taxonomy-icon"
                style={{ background: location.tint, color: location.color }}
              >
                <LocationIcon location={location} size={18} />
              </span>
              <span className="inventory-taxonomy-name">
                {location.name}
                <small>{location.room}</small>
              </span>
              <span className="inventory-taxonomy-count">{location.count}</span>
              <span className="inventory-taxonomy-chevron">›</span>
            </button>
          ))}
        </div>
      </section>

      <section className="inventory-section">
        <SectionHeader title="库存不足" meta={lowItems.length} />
        {lowItems.length ? (
          <div className="inventory-low-list">
            {lowItems.map((item) => (
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
          <div className="inventory-clear">
            <PackageCheck size={19} />
            当前没有库存不足的物品
          </div>
        )}
      </section>
    </div>
  )
}
