import {
  Bell,
  EyeOff,
  HardDrive,
  HeartHandshake,
  Leaf,
  MapPinned,
  Package,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useStore } from '../store'
import { BrandMark, ScreenHeader } from '../components/ui'

export default function InfoPage() {
  const { route, back, items } = useStore()
  const isAbout = route.name === 'about'

  if (isAbout) {
    return (
      <div className="page about-page">
        <ScreenHeader
          onBack={back}
          eyebrow="ABOUT HOMEKEEP"
          title="关于 HomeKeep"
          subtitle="Know what you have, where it is, and when it expires."
        />
        <section className="about-hero">
          <div className="about-orb one" />
          <div className="about-orb two" />
          <BrandMark size={64} />
          <div>
            <span>HOMEKEEP · 家物管理</span>
            <h2>知道拥有什么，<br />也知道它们在家的哪里。</h2>
          </div>
          <Sparkles size={16} className="about-sparkle" />
        </section>

        <div className="about-values">
          <article>
            <span>
              <Package size={21} />
            </span>
            <strong>清楚地拥有</strong>
            <p>记录数量、分类和每一段有效的时光。</p>
          </article>
          <article>
            <span>
              <MapPinned size={21} />
            </span>
            <strong>轻松地找到</strong>
            <p>用真实的家，替物品记住落脚的位置。</p>
          </article>
          <article>
            <span>
              <Bell size={21} />
            </span>
            <strong>从容地使用</strong>
            <p>在恰到好处的时候，被温柔提醒。</p>
          </article>
        </div>

        <section className="about-story">
          <span className="eyebrow">A NOTE FROM HOMEKEEP</span>
          <p>
            我们不希望家变成一个需要被管理的仓库。HomeKeep
            更像一本安静的居家手账，帮你记住那些容易被忘记的小事，把决定权留给认真生活的你。
          </p>
        </section>

        <div className="about-meta">
          <span>版本</span>
          <strong>1.0.0 · 高保真交互原型</strong>
          <span>记录数量</span>
          <strong>{items.length} 条本地数据</strong>
          <span>设计基准</span>
          <strong>下一步可用于 React Native + Expo 实现</strong>
        </div>

        <p className="about-footer">
          <Leaf size={13} />
          Made for calm homes.
        </p>
      </div>
    )
  }

  return (
    <div className="page privacy-page">
      <ScreenHeader
        onBack={back}
        eyebrow="YOUR DATA, YOUR HOME"
        title="隐私政策"
        subtitle="最后更新：2026年11月12日"
      />
      <div className="privacy-intro">
        <span>
          <HardDrive size={22} />
        </span>
        <div>
          <strong>数据留在这台设备</strong>
          <p>HomeKeep 的首版原型不设置账户，不会把家庭物品信息上传到服务器。</p>
        </div>
      </div>

      <div className="privacy-content">
        <section>
          <h2>01 · 我们记录什么</h2>
          <p>
            你主动填写的物品名称、分类、数量、存放位置、日期和备注会保存在浏览器的本地存储中。扫描功能为模拟体验，不会读取或上传真实相机内容。
          </p>
        </section>
        <section>
          <h2>02 · 数据被保存在哪里</h2>
          <p>
            所有数据只保存在当前浏览器。清除浏览器站点数据，或在设置中选择「清空数据」，记录会被移除且无法恢复。
          </p>
        </section>
        <section>
          <h2>03 · 我们如何使用数据</h2>
          <p>
            记录仅用于展示统计、分类、存放位置与提醒，不会用于广告、画像或任何形式的第三方共享。
          </p>
        </section>
        <section>
          <h2>04 · 你的决定权</h2>
          <p>
            你可以随时编辑、移动或删除任意物品。过期物品不会自动被永久删除，而会进入暂存区，由你选择继续保留或彻底移除。
          </p>
        </section>
      </div>

      <div className="privacy-promise">
        <EyeOff size={17} />
        <span>没有账户、没有追踪、没有云端上传。</span>
        <HeartHandshake size={17} />
      </div>

      <button className="privacy-delete-link" onClick={back}>
        <Trash2 size={14} />
        在设置中管理本地数据
      </button>
    </div>
  )
}
