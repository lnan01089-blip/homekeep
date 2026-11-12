import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Download,
  FileHeart,
  Info,
  Leaf,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { formatDate, dateKey } from '../data'
import { useStore } from '../store'
import { BrandMark, SelectSheet } from '../components/ui'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      className={`toggle ${checked ? 'is-on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-thumb" />
    </button>
  )
}

function SettingsRow({ icon: Icon, iconClass = '', title, description, value, onClick, right, danger = false, last = false }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`settings-row ${onClick ? 'is-clickable' : ''} ${danger ? 'danger' : ''} ${last ? 'last' : ''}`} onClick={onClick}>
      <span className={`settings-row-icon ${iconClass}`}>
        <Icon size={18} />
      </span>
      <span className="settings-row-copy">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>
      {right || (value && <span className="settings-row-value">{value}</span>)}
      {onClick && !right && <ChevronRight size={16} className="settings-chevron" />}
    </Tag>
  )
}

const advanceOptions = [
  { value: 3, label: '3 天', description: '只在非常临近时提醒' },
  { value: 5, label: '5 天', description: '给易忘的日常物品留一点缓冲' },
  { value: 7, label: '7 天', description: '一周前开始留意' },
  { value: 14, label: '14 天', description: '较从容的提前量（默认）' },
  { value: 30, label: '30 天', description: '适合药品与长期储备' },
]

const timeOptions = ['08:00', '09:00', '12:00', '18:00', '20:00', '21:00'].map((time) => ({
  value: time,
  label: time,
}))

const dateFormatOptions = [
  { value: 'zh', label: '2026年11月12日', description: '中文长日期' },
  { value: 'iso', label: '2026-11-12', description: '数字短横线格式' },
  { value: 'short', label: '11月12日', description: '省略年份' },
]

export default function Settings() {
  const {
    settings,
    updateSettings,
    generateExport,
    clearData,
    restoreDemo,
    askConfirm,
    toast,
    navigate,
  } = useStore()
  const [sheet, setSheet] = useState(null)

  const handleExport = () => {
    const payload = generateExport()
    try {
      const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `homekeep-${dateKey()}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      toast('数据已导出为 JSON 文件')
    } catch {
      toast('导出遇到问题，请稍后再试')
    }
  }

  const handleClear = async () => {
    const confirmed = await askConfirm({
      title: '清空全部本地数据？',
      message: '所有物品、位置记录和自定义提醒都会从这台设备移除，且无法恢复。',
      confirmLabel: '清空数据',
      cancelLabel: '取消',
      danger: true,
    })
    if (confirmed) clearData()
  }

  const handleRestore = async () => {
    const confirmed = await askConfirm({
      title: '恢复演示数据？',
      message: '当前的修改会被 HomeKeep 的示例物品重新覆盖，适合重新演示完整流程。',
      confirmLabel: '恢复演示',
      cancelLabel: '取消',
    })
    if (confirmed) restoreDemo()
  }

  return (
    <div className="page settings-page">
      <header className="settings-header">
        <div>
          <span className="eyebrow">YOUR HOME, YOUR RHYTHM</span>
          <h1>设置</h1>
          <p>让提醒贴合你的生活节奏。</p>
        </div>
        <span className="settings-leaf-mark">
          <Leaf size={22} />
        </span>
      </header>

      <div className="settings-brand-card glass-card">
        <BrandMark size={43} />
        <div>
          <strong>HomeKeep</strong>
          <span>Know what you have. · 家物管理</span>
        </div>
        <span className="settings-version">v1.0.0</span>
        <Sparkles size={14} className="settings-brand-sparkle" />
      </div>

      <section className="settings-section">
        <div className="settings-section-title">
          <span>通知设置</span>
          <Bell size={14} />
        </div>
        <div className="settings-card">
          <SettingsRow
            icon={Bell}
            iconClass="sage"
            title="开启提醒"
            description={settings.remindersOn ? '在需要时，轻轻提醒你一下' : '当前所有提醒已暂停'}
            right={
              <Toggle
                checked={settings.remindersOn}
                onChange={(value) => updateSettings({ remindersOn: value })}
                label="开启提醒"
              />
            }
          />
          <SettingsRow
            icon={CalendarDays}
            iconClass="cream"
            title="默认提前提醒天数"
            description="修改后会应用到普通物品"
            value={`${settings.defaultAdvance} 天`}
            onClick={() => setSheet('advance')}
          />
          <SettingsRow
            icon={Clock3}
            iconClass="blue"
            title="默认提醒时间"
            description="每天在这个时间集中提醒"
            value={settings.reminderTime}
            onClick={() => setSheet('time')}
            last
          />
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <span>日期设置</span>
          <CalendarDays size={14} />
        </div>
        <div className="settings-card">
          <SettingsRow
            icon={CalendarDays}
            iconClass="neutral"
            title="日期显示格式"
            description={`默认日期格式 · 示例：${formatDate(dateKey(), settings.dateFormat)}`}
            value={
              settings.dateFormat === 'zh'
                ? '中文长日期'
                : settings.dateFormat === 'iso'
                  ? 'YYYY-MM-DD'
                  : '月日短格式'
            }
            onClick={() => setSheet('dateFormat')}
            last
          />
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <span>数据管理</span>
          <ShieldCheck size={14} />
        </div>
        <div className="settings-card">
          <SettingsRow
            icon={Download}
            iconClass="sage"
            title="导出数据"
            description="以 JSON 格式保存一份家庭物品清单"
            onClick={handleExport}
          />
          <SettingsRow
            icon={Trash2}
            iconClass="rose"
            title="清空数据"
            description="移除这台设备上的所有记录"
            onClick={handleClear}
            danger
          />
          <SettingsRow
            icon={RefreshCcw}
            iconClass="neutral"
            title="恢复演示数据"
            description="清除修改，重新体验完整流程"
            onClick={handleRestore}
            last
          />
        </div>
        <p className="settings-section-note">
          <LockKeyhole size={12} />
          本地原型数据保存在浏览器中，不会上传至服务器
        </p>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <span>关于</span>
          <Info size={14} />
        </div>
        <div className="settings-card">
          <SettingsRow
            icon={FileHeart}
            iconClass="cream"
            title="隐私政策"
            description="了解数据如何被保存在本机"
            onClick={() => navigate('privacy')}
          />
          <SettingsRow
            icon={Leaf}
            iconClass="sage"
            title="关于 HomeKeep"
            description="Know what you have, where it is, and when it expires."
            onClick={() => navigate('about')}
          />
          <SettingsRow
            icon={Info}
            iconClass="neutral"
            title="版本信息"
            value="1.0.0 · 高保真原型"
            last
          />
        </div>
      </section>

      <div className="settings-footer">
        <span>
          <Leaf size={13} />
        </span>
        <p>让家中的每一件小事，都被温柔地记得。</p>
      </div>

      <SelectSheet
        open={sheet === 'advance'}
        onClose={() => setSheet(null)}
        title="提前提醒天数"
        subtitle="越早提醒，准备的时间越从容"
        options={advanceOptions}
        value={settings.defaultAdvance}
        onSelect={(value) => updateSettings({ defaultAdvance: Number(value) })}
      />
      <SelectSheet
        open={sheet === 'time'}
        onClose={() => setSheet(null)}
        title="默认提醒时间"
        options={timeOptions}
        value={settings.reminderTime}
        onSelect={(value) => updateSettings({ reminderTime: value })}
        columns={2}
      />
      <SelectSheet
        open={sheet === 'dateFormat'}
        onClose={() => setSheet(null)}
        title="日期显示格式"
        options={dateFormatOptions}
        value={settings.dateFormat}
        onSelect={(value) => updateSettings({ dateFormat: value })}
      />
    </div>
  )
}
