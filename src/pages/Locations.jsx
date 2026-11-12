import { MapPinned, Plus, Sparkles } from 'lucide-react'
import { locations } from '../data'
import { useStore } from '../store'
import { LocationIcon, ProductMedia, ScreenHeader } from '../components/ui'

const roomOrder = ['厨房', '餐厅', '客厅', '卧室', '浴室', '储物间', '家中']

export default function Locations() {
  const { helpers, navigate, back } = useStore()
  const { activeItems } = helpers

  const groups = roomOrder
    .map((room) => ({
      room,
      items: locations
        .filter((location) => location.room === room)
        .map((location) => {
          const content = activeItems.filter((item) => item.location === location.id)
          return {
            ...location,
            count: content.length,
            soon: content.filter((item) => helpers.isSoon(item) && !helpers.isLowStock(item)).length,
            previews: content.slice(0, 3),
          }
        })
        .filter((location) => location.count > 0),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="page locations-page">
      <ScreenHeader
        onBack={back}
        eyebrow="EVERYTHING IN PLACE"
        title="存放位置"
        subtitle="每一处收纳，都有自己的秩序"
        right={
          <button className="icon-button solid" onClick={() => navigate('add')} aria-label="添加物品">
            <Plus size={20} />
          </button>
        }
      />

      <div className="location-summary-card">
        <div className="location-summary-icon">
          <MapPinned size={22} />
        </div>
        <div>
          <span>家中空间</span>
          <strong>{groups.reduce((sum, group) => sum + group.items.length, 0)} 处收纳</strong>
        </div>
        <div className="location-summary-items">
          <strong>{activeItems.length}</strong>
          <span>件物品</span>
        </div>
        <Sparkles size={14} className="location-summary-sparkle" />
      </div>

      {groups.length ? (
        <div className="location-groups">
          {groups.map((group) => (
            <section className="location-group" key={group.room}>
              <div className="location-room-heading">
                <h3>{group.room}</h3>
                <span>{group.items.reduce((sum, item) => sum + item.count, 0)} 件</span>
              </div>
              <div className="location-card-list">
                {group.items.map((location) => (
                  <button
                    key={location.id}
                    className="location-card"
                    onClick={() => navigate('location', { id: location.id })}
                  >
                    <span
                      className="location-card-icon"
                      style={{ background: location.tint, color: location.color }}
                    >
                      <LocationIcon location={location} size={22} />
                    </span>
                    <span className="location-card-copy">
                      <span className="location-card-name">
                        {location.name}
                        {location.soon > 0 && <em>{location.soon} 件需留意</em>}
                      </span>
                      <span className="location-card-meta">
                        {location.count} 件物品
                        {location.previews.length > 0 && (
                          <span className="location-previews">
                            {location.previews.map((item) => (
                              <span className="location-preview" key={item.id}>
                                <ProductMedia item={item} size={21} rounded={7} />
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="location-arrow">›</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="locations-empty">
          <span>
            <MapPinned size={28} />
          </span>
          <h3>位置还在等待被填满</h3>
          <p>添加第一件物品后，就能按空间浏览了</p>
          <button className="small-solid-button" onClick={() => navigate('add')}>
            <Plus size={15} />
            添加物品
          </button>
        </div>
      )}

      <p className="locations-footnote">你也可以在物品界面直接点击家中的家具</p>
    </div>
  )
}
