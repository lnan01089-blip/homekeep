import { useMemo, useState } from 'react'
import { AlarmClock, PackageOpen, ShieldAlert } from 'lucide-react'
import { useStore } from '../store'
import {
  ItemRow,
  ScreenEmpty,
  ScreenHeader,
  SearchBar,
} from '../components/ui'

const views = {
  soon: {
    title: '临近过期',
    eyebrow: 'EXPIRING SOON',
    icon: AlarmClock,
    emptyTitle: '暂时没有临近过期物品',
    emptyDescription: '所有物品都还在舒适的有效期内。',
  },
  expired: {
    title: '已过期',
    eyebrow: 'EXPIRED · KEPT',
    icon: ShieldAlert,
    emptyTitle: '没有已保留的过期物品',
    emptyDescription: '过期物品仍会进入垃圾篓，等你决定是否保留。',
  },
  opened: {
    title: '已开封',
    eyebrow: 'OPENED ITEMS',
    icon: PackageOpen,
    emptyTitle: '暂时没有已开封物品',
    emptyDescription: '填写开封日期后，物品会出现在这里。',
  },
}

export default function SmartList() {
  const { route, back, helpers, navigate } = useStore()
  const viewId = route.params?.view || 'soon'
  const config = views[viewId] || views.soon
  const Icon = config.icon
  const [query, setQuery] = useState('')

  const source = useMemo(() => {
    if (viewId === 'expired') return helpers.activeItems.filter(helpers.isRetainedExpired)
    if (viewId === 'opened') return helpers.activeItems.filter((item) => item.openedDate)
    return helpers.soonItems
  }, [viewId, helpers])

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = source.filter(
      (item) =>
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        (item.spec || '').toLowerCase().includes(normalized),
    )
    return filtered.sort((a, b) => {
      if (viewId === 'opened') {
        return (b.openedDate || '').localeCompare(a.openedDate || '')
      }
      const da = helpers.daysLeft(a)
      const db = helpers.daysLeft(b)
      if (da === null) return 1
      if (db === null) return -1
      return da - db
    })
  }, [source, query, viewId, helpers])

  return (
    <div className="page smart-list-page">
      <ScreenHeader
        onBack={back}
        eyebrow={config.eyebrow}
        title={config.title}
        right={
          <span className="smart-count">
            <Icon size={15} />
            {source.length}
          </span>
        }
      />

      <div className="smart-search-wrap">
        <SearchBar value={query} onChange={setQuery} placeholder={`在${config.title}中搜索`} />
      </div>

      {items.length ? (
        <div className="item-list-stack">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              status={helpers.statusFor(item)}
              onClick={() => navigate('item', { id: item.id })}
              className="raised-item-row"
            />
          ))}
        </div>
      ) : (
        <ScreenEmpty
          icon={query ? 'search' : 'archive'}
          title={query ? '没有找到这件物品' : config.emptyTitle}
          description={query ? '' : config.emptyDescription}
        />
      )}
    </div>
  )
}
