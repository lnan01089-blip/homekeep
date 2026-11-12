import { useState } from 'react'
import {
  AlarmClock,
  Bell,
  Check,
  Clock3,
  Package,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { useStore } from '../store'
import { ScreenHeader, SelectSheet } from '../components/ui'

const advanceOptions = [
  { value: 3, label: '3 天', description: '只在临近时提醒' },
  { value: 5, label: '5 天', description: '提前一点准备' },
  { value: 7, label: '7 天', description: '提前一周提醒' },
  { value: 14, label: '14 天', description: '默认，较从容' },
  { value: 30, label: '30 天', description: '给长期储备留足时间' },
]

const timeOptions = ['08:00', '09:00', '12:00', '18:00', '20:00', '21:00'].map((time) => ({
  value: time,
  label: time,
}))

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
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

function ReminderTypeRow({ icon: Icon, color, tint, title, description, checked, onChange }) {
  return (
    <div className={`reminder-setting-row ${checked ? '' : 'is-muted'}`}>
      <span className="reminder-setting-icon" style={{ color, background: tint }}>
        <Icon size={18} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

export default function ReminderSettings() {
  const { settings, updateSettings, back, helpers } = useStore()
  const [sheet, setSheet] = useState(null)

  const nextItem = helpers.soonItems[0]
  const nextDays = nextItem ? helpers.daysLeft(nextItem) : null

  return (
    <div className="page reminder-settings-page">
      <ScreenHeader
        onBack={back}
        eyebrow="NOTIFICATIONS"
        title="通知设置"
      />

      <section className="reminder-preview-card">
        <div className="reminder-preview-orbit" />
        <span className="reminder-preview-icon">
          <Bell size={24} />
          <span />
        </span>
        <div className="reminder-preview-copy">
          <span>下一次提醒</span>
          <strong>
            {settings.remindersOn && nextItem
              ? `${nextDays === 0 ? '今天' : `还有 ${nextDays} 天`} · ${nextItem.name}`
              : settings.remindersOn
                ? '暂时没有待提醒事项'
                : '提醒目前处于暂停状态'}
          </strong>
          <small>
            {settings.remindersOn
              ? `每天 ${settings.reminderTime} 汇总提醒`
              : '开启总开关后会恢复'}
          </small>
        </div>
        <Sparkles size={15} className="reminder-preview-sparkle" />
      </section>

      <section className="reminder-settings-card">
        <div className="reminder-master-row">
          <div>
            <span className="overline">总开关</span>
            <h2>开启提醒</h2>
            <p>关闭后所有提醒会安静下来，数据仍会保留。</p>
          </div>
          <Toggle
            checked={settings.remindersOn}
            onChange={(value) => updateSettings({ remindersOn: value })}
            label="开启提醒"
          />
        </div>

        <div className={`reminder-type-list ${settings.remindersOn ? '' : 'is-disabled'}`}>
          <ReminderTypeRow
            icon={AlarmClock}
            color="#B67F4D"
            tint="#F7EEDF"
            title="临近过期"
            description="在有效期到来前提醒你优先使用"
            checked={settings.expiryReminders}
            onChange={(value) => updateSettings({ expiryReminders: value })}
          />
          <ReminderTypeRow
            icon={ShoppingBasket}
            color="#A78A50"
            tint="#F6F0DD"
            title="库存不足"
            description="当数量低于你设置的库存线时提醒"
            checked={settings.stockReminders}
            onChange={(value) => updateSettings({ stockReminders: value })}
          />
          <ReminderTypeRow
            icon={Wrench}
            color="#758993"
            tint="#EAF0F2"
            title="需要更换"
            description="按维护周期提醒更换或补充耗材"
            checked={settings.replaceReminders}
            onChange={(value) => updateSettings({ replaceReminders: value })}
          />
        </div>
      </section>

      <section className="reminder-settings-card simple">
        <div className="reminder-settings-title">
          <span>
            <Clock3 size={15} />
            提醒节奏
          </span>
          <em>只影响之后的提醒</em>
        </div>
        <button className="settings-value-row" onClick={() => setSheet('advance')}>
          <span>
            <strong>默认提前提醒</strong>
            <small>有效期到达前的提醒时间窗口</small>
          </span>
          <span className="settings-row-value">
            {settings.defaultAdvance} 天
            <span className="chevron-dot">›</span>
          </span>
        </button>
        <button className="settings-value-row" onClick={() => setSheet('time')}>
          <span>
            <strong>默认提醒时间</strong>
            <small>每天集中查看需要留意的事项</small>
          </span>
          <span className="settings-row-value">
            {settings.reminderTime}
            <span className="chevron-dot">›</span>
          </span>
        </button>
      </section>

      <div className="reminder-policy-note">
        <ShieldCheck size={19} />
        <div>
          <strong>你会一直拥有决定权</strong>
          <p>HomeKeep 不会因为过期而自动删除任何物品。过期物品只会进入暂存区，等待你选择保留或彻底删除。</p>
        </div>
      </div>

      <div className="reminder-settings-footer">
        <span className="mini-check">
          <Check size={11} />
        </span>
        修改会立即保存
      </div>

      <button className="reminder-manage-back" onClick={back}>
        <Package size={15} />
        返回待办中心
      </button>

      <SelectSheet
        open={sheet === 'advance'}
        onClose={() => setSheet(null)}
        title="提前提醒天数"
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
    </div>
  )
}
