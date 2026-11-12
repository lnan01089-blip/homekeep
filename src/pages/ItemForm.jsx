import { useRef, useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImagePlus,
  PackageOpen,
  ScanLine,
  Sparkles,
  X,
} from 'lucide-react'
import {
  addDays,
  categories,
  dateKey,
  findCategory,
  findLocation,
  formatDate,
  locations,
  parseDate,
  units,
} from '../data'
import { useStore } from '../store'
import {
  CategoryIcon,
  CategorySelectRender,
  DatePickerSheet,
  FixedAction,
  LocationIcon,
  LocationSelectRender,
  ProductMedia,
  SelectSheet,
} from '../components/ui'

const blankForm = {
  name: '',
  category: 'food',
  quantity: 1,
  unit: '个',
  location: 'fridge',
  purchaseDate: '',
  expiryDate: '',
  openedDate: '',
  afterOpenDays: '',
  note: '',
}

const dateFieldMeta = {
  purchaseDate: '购买日期',
  expiryDate: '有效期',
  openedDate: '开封日期',
}

export default function ItemForm() {
  const {
    route,
    items,
    back,
    goTab,
    navigate,
    settings,
    addItem,
    updateItem,
    toast,
  } = useStore()
  const isEdit = route.name === 'edit'
  const editingItem = isEdit ? items.find((item) => item.id === route.params?.id) : null
  const scanned = Boolean(route.params?.scanned)
  const [imageKey, setImageKey] = useState(editingItem?.imageKey || (scanned ? 'milk' : null))
  const [photoUrl, setPhotoUrl] = useState(
    route.params?.imageUrl || editingItem?.imageUrl || '',
  )
  const [form, setForm] = useState(() => {
    if (editingItem) {
      return {
        name: editingItem.name || '',
        category: editingItem.category || 'food',
        quantity: editingItem.quantity ?? 1,
        unit: editingItem.unit || '个',
        location: editingItem.location || 'fridge',
        purchaseDate: editingItem.purchaseDate || '',
        expiryDate: editingItem.expiryDate || '',
        openedDate: editingItem.openedDate || '',
        afterOpenDays: editingItem.afterOpenDays ? String(editingItem.afterOpenDays) : '',
        note: editingItem.note || '',
      }
    }
    if (scanned) {
      return {
        ...blankForm,
        name: '鲜牛奶',
        category: 'food',
        quantity: 1,
        unit: '瓶',
        location: 'fridge',
        purchaseDate: dateKey(),
        expiryDate: addDays(7),
        openedDate: '',
        afterOpenDays: '',
        note: '由扫描识别导入，请确认包装上的有效期是否准确。',
      }
    }
    return {
      ...blankForm,
      category: route.params?.category || 'food',
      location: route.params?.location || 'fridge',
      unit: route.params?.category
        ? findCategory(route.params.category).id === 'food'
          ? '个'
          : '瓶'
        : '个',
    }
  })
  const [sheet, setSheet] = useState(null)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const category = findCategory(form.category)
  const location = findLocation(form.location)
  const recommendedDate =
    form.openedDate && Number(form.afterOpenDays) > 0
      ? addDays(Number(form.afterOpenDays), parseDate(form.openedDate))
      : null
  const previewItem = {
    name: form.name || '物品',
    category: form.category,
    glyph: editingItem?.glyph || (scanned ? 'milk' : 'package'),
    imageKey,
    imageUrl: photoUrl,
  }

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoUrl(reader.result)
      setImageKey(null)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const removeImage = () => {
    setPhotoUrl('')
    setImageKey(null)
  }

  const openDate = (key) => {
    setSheet(key)
  }

  const submit = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = '请填写物品名称'
    if (!form.category) nextErrors.category = '请选择分类'
    if (!form.location) nextErrors.location = '请选择位置'
    if (form.quantity === '' || Number(form.quantity) < 0 || Number.isNaN(Number(form.quantity))) {
      nextErrors.quantity = '请输入有效数量'
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      toast('还有信息需要补充')
      return
    }
    const payload = {
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location,
      purchaseDate: form.purchaseDate || null,
      expiryDate: form.expiryDate || null,
      openedDate: form.openedDate || null,
      afterOpenDays: form.afterOpenDays ? Number(form.afterOpenDays) : null,
      note: form.note.trim(),
      imageKey,
      imageUrl: photoUrl || null,
      spec: editingItem?.spec || (scanned ? '全脂鲜牛奶 · 950ml' : `${category.name} · ${form.unit}`),
      glyph: editingItem?.glyph || (scanned ? 'milk' : form.category),
      accent: editingItem?.accent || category.tint,
    }
    if (isEdit) {
      updateItem(editingItem.id, payload)
      toast('物品信息已更新')
      back()
    } else {
      addItem(payload)
      toast(`「${payload.name}」已放入${findLocation(payload.location).name}`)
      goTab('items')
    }
  }

  return (
    <div className="page item-form-page">
      <header className="form-header">
        <button className="icon-button soft" onClick={back} aria-label="返回">
          <ChevronLeft size={21} />
        </button>
        <div className="form-header-title">
          <span>{scanned ? 'SCAN & CONFIRM' : isEdit ? 'EDIT ITEM' : 'NEW ITEM'}</span>
          <h1>{isEdit ? '编辑物品' : '添加物品'}</h1>
        </div>
        {isEdit ? (
          <span className="form-header-spacer" aria-hidden="true" />
        ) : (
          <button
            className="icon-button ghost"
            onClick={() => navigate('scan')}
            aria-label="扫描录入"
          >
            <ScanLine size={20} />
          </button>
        )}
      </header>

      <div className="form-photo-section">
        <div className="form-photo-wrap">
          {photoUrl || imageKey ? (
            <div className="form-photo">
              {photoUrl ? (
                <img src={photoUrl} alt="物品照片预览" />
              ) : (
                <ProductMedia item={previewItem} size={112} rounded={26} />
              )}
              {photoUrl && (
                <button className="remove-photo" onClick={removeImage} aria-label="移除照片">
                  <X size={13} />
                </button>
              )}
            </div>
          ) : (
            <button className="photo-placeholder" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={23} />
              <span>添加照片</span>
            </button>
          )}
          <div className="form-photo-copy">
            <span className="photo-label">
              {scanned ? (
                <>
                  <Sparkles size={13} />
                  扫描照片
                </>
              ) : (
                '物品照片'
              )}
            </span>
            <p>
              {scanned
                ? '从刚刚拍摄的照片中，已为你填入可识别的信息。'
                : '一张照片，让下次寻找时更容易想起来。'}
            </p>
            <button className="change-photo-button" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={14} />
              {photoUrl || imageKey ? '更换照片' : '选择照片'}
            </button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} hidden />
      </div>

      {scanned && (
        <div className="scan-result-banner">
          <span className="scan-result-icon">
            <Check size={16} />
          </span>
          <div>
            <strong>已模拟识别 4 项信息</strong>
            <p>请核对名称、数量、位置和日期后再保存。</p>
          </div>
          <span className="scan-confidence">演示</span>
        </div>
      )}

      <section className="form-section">
        <div className="form-section-heading">
          <span className="form-section-index">01</span>
          <div>
            <h2>基本信息</h2>
            <p>给它一个名字，和在家里的位置</p>
          </div>
        </div>

        <label className={`form-field ${errors.name ? 'has-error' : ''}`}>
          <span className="form-label">
            物品名称 <em>必填</em>
          </span>
          <div className="text-input-wrap">
            <input
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="例如：鲜牛奶、维生素C"
              maxLength={24}
            />
            {form.name && (
              <button type="button" onClick={() => setField('name', '')} aria-label="清空名称">
                <X size={14} />
              </button>
            )}
          </div>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <div className="form-field">
          <span className="form-label">
            物品分类 <em>必填</em>
          </span>
          <button className="form-select" onClick={() => setSheet('category')}>
            <span className="form-select-value">
              <span
                className="form-select-icon"
                style={{ background: category.tint, color: category.color }}
              >
                <CategoryIcon category={category} size={18} />
              </span>
              <span>{category.name}</span>
            </span>
            <ChevronDown size={17} />
          </button>
        </div>

        <div className="form-two-columns">
          <div className={`form-field ${errors.quantity ? 'has-error' : ''}`}>
            <span className="form-label">
              数量 <em>必填</em>
            </span>
            <div className="number-field">
              <button
                type="button"
                onClick={() => setField('quantity', Math.max(0, Number(form.quantity) - 1))}
                disabled={Number(form.quantity) <= 0}
                aria-label="减少数量"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={form.quantity}
                onChange={(event) => setField('quantity', event.target.value)}
              />
              <button
                type="button"
                onClick={() => setField('quantity', Number(form.quantity || 0) + 1)}
                aria-label="增加数量"
              >
                +
              </button>
            </div>
            {errors.quantity && <span className="field-error">{errors.quantity}</span>}
          </div>

          <div className="form-field">
            <span className="form-label">单位</span>
            <button className="form-select compact" onClick={() => setSheet('unit')}>
              <span>{form.unit}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="form-field">
          <span className="form-label">
            存放位置 <em>必填</em>
          </span>
          <button className="form-select" onClick={() => setSheet('location')}>
            <span className="form-select-value">
              <span
                className="form-select-icon"
                style={{ background: location.tint, color: location.color }}
              >
                <LocationIcon location={location} size={18} />
              </span>
              <span>
                {location.name}
                <small>{location.room}</small>
              </span>
            </span>
            <ChevronDown size={17} />
          </button>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading">
          <span className="form-section-index">02</span>
          <div>
            <h2>效期与时间</h2>
            <p>所有日期均为选填，不填写也不会影响保存</p>
          </div>
          <span className="optional-tag">选填</span>
        </div>

        <div className="date-fields-stack">
          {Object.entries(dateFieldMeta).map(([key, label]) => (
            <div className="form-field" key={key}>
              <span className="form-label">{label}</span>
              <button
                className={`date-field ${form[key] ? 'has-date' : ''}`}
                onClick={() => openDate(key)}
              >
                <span>
                  <CalendarDays size={17} />
                  {form[key] ? formatDate(form[key], settings.dateFormat) : `选择${label}`}
                </span>
                {form[key] ? (
                  <span
                    className="date-clear"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      setField(key, '')
                    }}
                    onKeyDown={(event) => event.key === 'Enter' && setField(key, '')}
                  >
                    <X size={14} />
                  </span>
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="form-field">
          <span className="form-label">开封后使用期限</span>
          <div className="after-open-field">
            <div className="inline-number">
              <input
                inputMode="numeric"
                type="number"
                min="0"
                value={form.afterOpenDays}
                onChange={(event) => setField('afterOpenDays', event.target.value)}
                placeholder="例如 30"
              />
              <span>天</span>
            </div>
            <div className="quick-days">
              {[3, 7, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={String(form.afterOpenDays) === String(days) ? 'is-active' : ''}
                  onClick={() => setField('afterOpenDays', String(days))}
                >
                  {days}天
                </button>
              ))}
            </div>
          </div>
          <p className="field-hint">
            <Clock3 size={12} />
            填写开封日期与期限后，会显示系统计算的建议日期
          </p>
        </div>

        {recommendedDate && (
          <div className="suggested-date-card">
            <span className="suggested-date-icon">
              <Sparkles size={16} />
            </span>
            <div>
              <span>建议使用截止</span>
              <strong>{formatDate(recommendedDate, settings.dateFormat)}</strong>
              <small>按开封日期与使用期限计算，仅供参考</small>
            </div>
            <button onClick={() => setField('expiryDate', recommendedDate)}>
              {form.expiryDate === recommendedDate ? '已填入' : '填入有效期'}
            </button>
          </div>
        )}
      </section>

      <section className="form-section">
        <div className="form-section-heading">
          <span className="form-section-index">03</span>
          <div>
            <h2>生活小记</h2>
            <p>添加一条只属于这件物品的备注</p>
          </div>
          <span className="optional-tag">选填</span>
        </div>
        <div className="form-field">
          <div className="textarea-wrap">
            <textarea
              value={form.note}
              onChange={(event) => setField('note', event.target.value)}
              placeholder="例如：开封后需冷藏，早餐搭配燕麦刚刚好。"
              rows={4}
              maxLength={160}
            />
            <span className="char-count">{form.note.length}/160</span>
          </div>
        </div>

        <div className="form-tip-card">
          <PackageOpen size={17} />
          <p>保存后会自动同步到首页、分类与存放位置，并根据有效期更新提醒。</p>
        </div>
      </section>

      <div className="form-bottom-spacer" />

      <FixedAction>
        <button className="primary-action save-item-button" onClick={submit}>
          <Check size={18} />
          {isEdit ? '保存修改' : '保存物品'}
        </button>
      </FixedAction>

      <SelectSheet
        open={sheet === 'category'}
        onClose={() => setSheet(null)}
        title="选择物品分类"
        options={categories.map((option) => ({
          value: option.id,
          render: <CategorySelectRender category={option} />,
        }))}
        value={form.category}
        onSelect={(value) => setField('category', value)}
      />

      <SelectSheet
        open={sheet === 'location'}
        onClose={() => setSheet(null)}
        title="选择存放位置"
        subtitle="之后也可以随时更换"
        options={locations.map((option) => ({
          value: option.id,
          render: <LocationSelectRender location={option} />,
        }))}
        value={form.location}
        onSelect={(value) => setField('location', value)}
      />

      <SelectSheet
        open={sheet === 'unit'}
        onClose={() => setSheet(null)}
        title="选择单位"
        options={units.map((unit) => ({ value: unit, label: unit }))}
        value={form.unit}
        onSelect={(value) => setField('unit', value)}
        columns={2}
      />

      <DatePickerSheet
        open={Boolean(sheet && dateFieldMeta[sheet])}
        onClose={() => setSheet(null)}
        title={`选择${dateFieldMeta[sheet] || '日期'}`}
        value={sheet && dateFieldMeta[sheet] ? form[sheet] : ''}
        onSelect={(value) => {
          if (sheet && dateFieldMeta[sheet]) setField(sheet, value)
        }}
      />
    </div>
  )
}
