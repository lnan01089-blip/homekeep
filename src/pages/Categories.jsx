import { ChevronRight, Plus, Sparkles } from 'lucide-react'
import { categories } from '../data'
import { useStore } from '../store'
import { CategoryIcon, ScreenHeader } from '../components/ui'

export default function Categories() {
  const { helpers, navigate, back, toast } = useStore()
  const { activeItems } = helpers

  const items = categories.map((category) => {
    const categoryItems = activeItems.filter((item) => item.category === category.id)
    return {
      ...category,
      count: categoryItems.length,
      soon: categoryItems.filter((item) => helpers.isSoon(item)).length,
      low: categoryItems.filter((item) => helpers.isLowStock(item)).length,
    }
  })

  return (
    <div className="page categories-page">
      <ScreenHeader
        onBack={back}
        eyebrow="COLLECTIONS"
        title="物品分类"
        right={
          <button className="icon-button solid" onClick={() => navigate('add')} aria-label="添加物品">
            <Plus size={20} />
          </button>
        }
      />

      <div className="category-overview-strip">
        <div>
          <span className="overline">已整理</span>
          <strong>{activeItems.length}</strong>
          <span>件物品</span>
        </div>
        <span className="overview-strip-divider" />
        <div>
          <span className="overline">分布于</span>
          <strong>{categories.length}</strong>
          <span>个分类</span>
        </div>
        <span className="tiny-leaf-decoration">
          <Sparkles size={18} />
        </span>
      </div>

      <div className="category-card-grid">
        {items.map((category, index) => (
          <button
            key={category.id}
            className="category-card"
            style={{ background: category.soft }}
            onClick={() => navigate('category', { id: category.id })}
          >
            <span className="category-card-wash" style={{ background: category.tint }} />
            <span className="category-card-top">
              <span
                className="category-card-icon"
                style={{ background: category.tint, color: category.color }}
              >
                <CategoryIcon category={category} size={24} />
              </span>
              <span className="category-arrow">
                <ChevronRight size={17} />
              </span>
            </span>
            <span className="category-card-name">{category.name}</span>
            <span className="category-card-description">{category.description}</span>
            <span className="category-card-footer">
              <span className="category-count">
                {category.count}
                <small>件物品</small>
              </span>
              <span className="category-flags">
                {category.soon > 0 && <em>{category.soon} 即将到期</em>}
                {category.low > 0 && <em className="low">{category.low} 库存不足</em>}
              </span>
            </span>
            <span className="category-card-index">0{index + 1}</span>
          </button>
        ))}
      </div>

      <button
        className="custom-category-button"
        onClick={() => toast('自定义分类将在后续版本开放')}
      >
        <span>
          <Plus size={17} />
        </span>
        <div>
          <strong>自定义分类</strong>
          <small>为更特别的生活习惯留一个位置</small>
        </div>
        <ChevronRight size={17} />
      </button>

      <p className="categories-footnote">分类会随着每一条物品记录自动更新</p>
    </div>
  )
}
