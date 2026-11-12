import milkImg from './assets/products/milk.jpg'
import breadImg from './assets/products/bread.jpg'
import vitaminsImg from './assets/products/vitamins.jpg'
import creamImg from './assets/products/cream.jpg'
import waterImg from './assets/products/water.jpg'
import bathroomImg from './assets/products/bathroom.jpg'
import soapImg from './assets/products/soap.jpg'
import pantryImg from './assets/products/pantry.jpg'
import linenImg from './assets/products/linen.jpg'
import kitchenImg from './assets/products/kitchen.jpg'

export const images = {
  milk: milkImg,
  bread: breadImg,
  vitamins: vitaminsImg,
  cream: creamImg,
  water: waterImg,
  bathroom: bathroomImg,
  soap: soapImg,
  pantry: pantryImg,
  linen: linenImg,
  kitchen: kitchenImg,
}

export const categories = [
  {
    id: 'food',
    name: '食品',
    icon: 'utensils',
    color: '#708C76',
    tint: '#E7EEE5',
    soft: '#F3F6F0',
    description: '新鲜与常温食材',
  },
  {
    id: 'medicine',
    name: '药品',
    icon: 'pill',
    color: '#718894',
    tint: '#E7EDF0',
    soft: '#F1F5F6',
    description: '安心备用药箱',
  },
  {
    id: 'beauty',
    name: '化妆品',
    icon: 'sparkles',
    color: '#A87D76',
    tint: '#F1E7E4',
    soft: '#F8F1EF',
    description: '认真照顾自己',
  },
  {
    id: 'cleaning',
    name: '清洁用品',
    icon: 'spray',
    color: '#768D9A',
    tint: '#E6EDF1',
    soft: '#F1F5F7',
    description: '让家保持清爽',
  },
  {
    id: 'home',
    name: '家庭用品',
    icon: 'home',
    color: '#A18A61',
    tint: '#F1EBDE',
    soft: '#F8F4EA',
    description: '日常安心储备',
  },
]

export const locations = [
  {
    id: 'fridge',
    name: '冰箱',
    room: '厨房',
    mapLabel: '冰箱',
    icon: 'refrigerator',
    tint: '#E6EFEA',
    color: '#6F9682',
  },
  {
    id: 'kitchenCabinet',
    name: '厨房柜',
    room: '厨房',
    mapLabel: '厨房柜',
    icon: 'cabinet',
    tint: '#F0E8D9',
    color: '#A4885C',
  },
  {
    id: 'sideboard',
    name: '餐边柜',
    room: '餐厅',
    mapLabel: '餐边柜',
    icon: 'sideboard',
    tint: '#EFE6D8',
    color: '#A48E69',
  },
  {
    id: 'livingCabinet',
    name: '客厅柜',
    room: '客厅',
    mapLabel: '客厅柜',
    icon: 'archive',
    tint: '#E7EBE6',
    color: '#748B79',
  },
  {
    id: 'tvStand',
    name: '电视柜',
    room: '客厅',
    mapLabel: '电视柜',
    icon: 'tv',
    tint: '#ECE8DE',
    color: '#96866C',
  },
  {
    id: 'storageCabinet',
    name: '储物柜',
    room: '储物间',
    mapLabel: '储物柜',
    icon: 'boxes',
    tint: '#E6EAEB',
    color: '#7A8B91',
  },
  {
    id: 'bathroomCabinet',
    name: '浴室柜',
    room: '浴室',
    mapLabel: '浴室柜',
    icon: 'bath',
    tint: '#E5EEED',
    color: '#6F918E',
  },
  {
    id: 'wardrobe',
    name: '衣柜',
    room: '卧室',
    mapLabel: '衣柜',
    icon: 'door',
    tint: '#EEE8E0',
    color: '#9A8368',
  },
  {
    id: 'bedsideTable',
    name: '床头柜',
    room: '卧室',
    mapLabel: '床头柜',
    icon: 'lamp',
    tint: '#F0E9DD',
    color: '#A18A68',
  },
  {
    id: 'bedroomCabinet',
    name: '卧室柜',
    room: '卧室',
    mapLabel: '卧室柜',
    icon: 'sparkles',
    tint: '#EFE8E7',
    color: '#9B7F7A',
  },
  {
    id: 'other',
    name: '其他位置',
    room: '家中',
    mapLabel: '其他位置',
    icon: 'pin',
    tint: '#EEEFEB',
    color: '#7F8982',
  },
]

export const units = ['瓶', '盒', '袋', '个', '支', '包', '片', '罐', '杯', '卷', '块', '节']

export const glyphMap = {
  milk: 'milk',
  eggs: 'egg',
  bread: 'croissant',
  apple: 'apple',
  yogurt: 'cup',
  juice: 'cup-soda',
  lettuce: 'leaf',
  cheese: 'cheese',
  water: 'droplets',
  coffee: 'coffee',
  cookies: 'cookie',
  vitamins: 'pill',
  bandage: 'bandage',
  ibuprofen: 'tablets',
  thermometer: 'thermometer',
  cream: 'sparkles',
  serum: 'dropper',
  handcream: 'flask',
  shampoo: 'bottle',
  cleanser: 'tube',
  bodywash: 'bottle',
  lotion: 'bottle',
  detergent: 'bottle',
  dishsoap: 'bottle',
  disinfectant: 'spray',
  cloth: 'layers',
  pods: 'wash',
  tissues: 'package',
  backupTissues: 'package',
  batteries: 'battery',
  bulbs: 'lightbulb',
  trashbags: 'trash',
  toast: 'croissant',
}

export const categoryDefaults = {
  food: { unit: '个', lowStockAt: null },
  medicine: { unit: '盒', lowStockAt: null },
  beauty: { unit: '瓶', lowStockAt: null },
  cleaning: { unit: '瓶', lowStockAt: null },
  home: { unit: '包', lowStockAt: null },
}

const D = 86_400_000
export const dateKey = (date = new Date()) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const addDays = (days, base = new Date()) => {
  const d = new Date(base)
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return dateKey(d)
}

export const parseDate = (key) => {
  if (!key) return null
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export const daysUntil = (key) => {
  if (!key) return null
  const today = parseDate(dateKey())
  const target = parseDate(key)
  return Math.round((target.getTime() - today.getTime()) / D)
}

export const formatDate = (key, format = 'zh') => {
  if (!key) return '未记录'
  const d = parseDate(key)
  if (!d) return '未记录'
  if (format === 'iso') return key
  if (format === 'short') return `${d.getMonth() + 1}月${d.getDate()}日`
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export const formatMonthDay = (key) => {
  if (!key) return '—'
  const d = parseDate(key)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const baseItems = [
  {
    id: 'milk',
    name: '鲜牛奶',
    variant: '原味',
    spec: '全脂鲜牛奶 · 950ml',
    category: 'food',
    location: 'fridge',
    quantity: 2,
    unit: '瓶',
    productionDate: addDays(-2),
    expiryDate: addDays(2),
    openedDate: addDays(-1),
    afterOpenDays: 3,
    note: '开盖后请冷藏，建议三天内喝完。早餐搭配燕麦刚刚好。',
    imageKey: 'milk',
    glyph: 'milk',
    accent: '#DCE9E2',
  },
  {
    id: 'eggs',
    name: '鸡蛋',
    spec: '谷物鲜鸡蛋 · 10枚装',
    category: 'food',
    location: 'fridge',
    quantity: 1,
    unit: '盒',
    productionDate: addDays(-6),
    expiryDate: addDays(28),
    note: '放在冰箱门内侧，记得小头朝下。',
    glyph: 'eggs',
    accent: '#F1EDE2',
  },
  {
    id: 'bread',
    name: '全麦面包',
    spec: '无糖全麦吐司',
    category: 'food',
    location: 'kitchenCabinet',
    quantity: 1,
    unit: '袋',
    productionDate: addDays(-1),
    expiryDate: addDays(18),
    note: '早餐主食，开封后密封保存。',
    imageKey: 'bread',
    glyph: 'bread',
    accent: '#F1EDE2',
  },
  {
    id: 'apples',
    name: '苹果',
    spec: '红富士 · 脆甜',
    category: 'food',
    location: 'fridge',
    quantity: 6,
    unit: '个',
    productionDate: addDays(-4),
    expiryDate: addDays(21),
    note: '与香蕉分开放，可以保存得更久。',
    glyph: 'apple',
    accent: '#F0E6DC',
  },
  {
    id: 'yogurt',
    name: '希腊酸奶',
    spec: '原味 · 100g × 4',
    category: 'food',
    location: 'fridge',
    quantity: 4,
    unit: '杯',
    productionDate: addDays(-3),
    expiryDate: addDays(17),
    note: '',
    glyph: 'yogurt',
    accent: '#EEF1EA',
  },
  {
    id: 'juice',
    name: '橙汁',
    spec: 'NFC鲜榨橙汁',
    category: 'food',
    location: 'fridge',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-2),
    expiryDate: addDays(25),
    note: '开封后两天内饮用完。',
    imageKey: 'water',
    glyph: 'juice',
    accent: '#F3EAD9',
  },
  {
    id: 'lettuce',
    name: '生菜',
    spec: '有机奶油生菜',
    category: 'food',
    location: 'fridge',
    quantity: 1,
    unit: '颗',
    productionDate: addDays(-1),
    expiryDate: addDays(16),
    note: '',
    glyph: 'lettuce',
    accent: '#E8EFE4',
  },
  {
    id: 'strawberryMilk',
    name: '鲜牛奶',
    variant: '草莓味',
    spec: '草莓风味鲜牛奶 · 950ml',
    category: 'food',
    location: 'fridge',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-2),
    expiryDate: addDays(16),
    note: '与鲜牛奶同属一个商品，按口味单独统计。',
    imageKey: 'milk',
    glyph: 'milk',
    accent: '#F4E7E1',
  },
  {
    id: 'water',
    name: '矿泉水',
    spec: '天然矿泉水 · 500ml',
    category: 'food',
    location: 'sideboard',
    quantity: 6,
    unit: '瓶',
    productionDate: addDays(-10),
    expiryDate: addDays(300),
    note: '',
    imageKey: 'water',
    glyph: 'water',
    accent: '#E8EEF0',
  },
  {
    id: 'coffee',
    name: '咖啡豆',
    spec: '中度烘焙 · 250g',
    category: 'food',
    location: 'sideboard',
    quantity: 1,
    unit: '袋',
    productionDate: addDays(-8),
    expiryDate: addDays(120),
    note: '开封后放进密封罐，四周内风味最佳。',
    glyph: 'coffee',
    accent: '#EDE4D8',
  },
  {
    id: 'cookies',
    name: '黄油饼干',
    spec: '海盐黄油曲奇',
    category: 'food',
    location: 'sideboard',
    quantity: 2,
    unit: '盒',
    productionDate: addDays(-12),
    expiryDate: addDays(60),
    note: '',
    glyph: 'cookies',
    accent: '#F2E9D8',
  },
  {
    id: 'vitamins',
    name: '维生素C',
    spec: '泡腾片 · 30片',
    category: 'medicine',
    location: 'bathroomCabinet',
    quantity: 30,
    unit: '片',
    productionDate: addDays(-25),
    expiryDate: addDays(5),
    note: '每日一片，请勿超量。放在儿童接触不到的地方。',
    imageKey: 'vitamins',
    glyph: 'vitamins',
    accent: '#F0E9DB',
  },
  {
    id: 'bandage',
    name: '创可贴',
    spec: '防水透气 · 混合装',
    category: 'medicine',
    location: 'bathroomCabinet',
    quantity: 20,
    unit: '片',
    productionDate: addDays(-90),
    expiryDate: addDays(500),
    note: '',
    glyph: 'bandage',
    accent: '#F3E9E5',
  },
  {
    id: 'ibuprofen',
    name: '布洛芬',
    spec: '缓释胶囊 · 12粒',
    category: 'medicine',
    location: 'bedsideTable',
    quantity: 1,
    unit: '盒',
    productionDate: addDays(-30),
    expiryDate: addDays(210),
    note: '仅在需要时服用，用药前请阅读说明书。',
    glyph: 'ibuprofen',
    accent: '#E8EBEF',
  },
  {
    id: 'thermometer',
    name: '电子体温计',
    spec: '快速测温 · 1支',
    category: 'medicine',
    location: 'bedsideTable',
    quantity: 1,
    unit: '支',
    productionDate: addDays(-390),
    expiryDate: null,
    note: '电池电量偏低，建议更换电池后继续使用。',
    glyph: 'thermometer',
    accent: '#EBF0F1',
    replaceAt: addDays(1),
    replaceCycle: 365,
    replaceLabel: '电池电量偏低',
  },
  {
    id: 'cream',
    name: '面霜',
    variant: '欧莱雅',
    spec: '修护保湿面霜 · 50g',
    category: 'beauty',
    location: 'bedroomCabinet',
    quantity: 1,
    unit: '罐',
    productionDate: addDays(-20),
    expiryDate: addDays(12),
    openedDate: addDays(-15),
    afterOpenDays: 60,
    note: '开封后请在三个月内使用完。晚间护肤最后一步。',
    imageKey: 'cream',
    glyph: 'cream',
    accent: '#F2E8E3',
  },
  {
    id: 'serum',
    name: '精华液',
    spec: '玻尿酸保湿精华 · 30ml',
    category: 'beauty',
    location: 'bedroomCabinet',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-36),
    expiryDate: addDays(90),
    openedDate: addDays(-12),
    afterOpenDays: 180,
    note: '',
    glyph: 'serum',
    accent: '#EFE8EA',
  },
  {
    id: 'handcream',
    name: '护手霜',
    spec: '木质香 · 50ml',
    category: 'beauty',
    location: 'bedsideTable',
    quantity: 2,
    unit: '支',
    productionDate: addDays(-14),
    expiryDate: addDays(150),
    note: '',
    imageKey: 'bathroom',
    glyph: 'handcream',
    accent: '#F1EBE8',
  },
  {
    id: 'shampoo',
    name: '洗发水',
    spec: '氨基酸温和洗发露',
    category: 'beauty',
    location: 'bathroomCabinet',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-30),
    expiryDate: addDays(180),
    note: '',
    imageKey: 'bathroom',
    glyph: 'shampoo',
    accent: '#E6EFF0',
  },
  {
    id: 'cleanser',
    name: '洗面奶',
    spec: '氨基酸洁面乳',
    category: 'beauty',
    location: 'bathroomCabinet',
    quantity: 1,
    unit: '支',
    productionDate: addDays(-20),
    expiryDate: addDays(100),
    note: '',
    glyph: 'cleanser',
    accent: '#EFEDE8',
  },
  {
    id: 'bodywash',
    name: '沐浴露',
    spec: '白桃乌龙香型',
    category: 'beauty',
    location: 'bathroomCabinet',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-55),
    expiryDate: addDays(160),
    note: '',
    imageKey: 'soap',
    glyph: 'bodywash',
    accent: '#EDEDE6',
  },
  {
    id: 'lotion',
    name: '身体乳',
    spec: '乳木果滋润身体乳',
    category: 'beauty',
    location: 'wardrobe',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-8),
    expiryDate: addDays(240),
    note: '',
    imageKey: 'linen',
    glyph: 'lotion',
    accent: '#F0EBE3',
  },
  {
    id: 'detergent',
    name: '洗衣液',
    spec: '天然酵素洗衣液 · 1L',
    category: 'cleaning',
    location: 'storageCabinet',
    quantity: 2,
    unit: '瓶',
    productionDate: addDays(-25),
    expiryDate: addDays(360),
    note: '低泡配方，适合机洗。余量不足时记得提前补充。',
    imageKey: 'kitchen',
    glyph: 'detergent',
    accent: '#E7EDEF',
    lowStockAt: 3,
  },
  {
    id: 'dishsoap',
    name: '洗洁精',
    spec: '柚子香型 · 450ml',
    category: 'cleaning',
    location: 'kitchenCabinet',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-12),
    expiryDate: addDays(90),
    note: '',
    imageKey: 'soap',
    glyph: 'dishsoap',
    accent: '#EDF1E9',
  },
  {
    id: 'disinfectant',
    name: '消毒液',
    spec: '衣物家居消毒液',
    category: 'cleaning',
    location: 'storageCabinet',
    quantity: 1,
    unit: '瓶',
    productionDate: addDays(-50),
    expiryDate: addDays(240),
    note: '请按说明稀释使用。',
    glyph: 'disinfectant',
    accent: '#E9EFF2',
  },
  {
    id: 'cloth',
    name: '抹布',
    spec: '超细纤维 · 3条装',
    category: 'cleaning',
    location: 'storageCabinet',
    quantity: 3,
    unit: '块',
    productionDate: addDays(-38),
    expiryDate: addDays(365),
    note: '日常清洁使用，建议每四周更换一次。',
    imageKey: 'linen',
    glyph: 'cloth',
    accent: '#EDEFEA',
    replaceAt: addDays(-3),
    replaceCycle: 30,
    replaceLabel: '已使用 38 天',
  },
  {
    id: 'pods',
    name: '洗衣凝珠',
    spec: '清新皂香 · 30颗',
    category: 'cleaning',
    location: 'storageCabinet',
    quantity: 1,
    unit: '盒',
    productionDate: addDays(-22),
    expiryDate: addDays(180),
    note: '请存放在儿童接触不到的地方。',
    glyph: 'pods',
    accent: '#E6EEEF',
    lowStockAt: 2,
  },
  {
    id: 'tissues',
    name: '纸巾',
    spec: '原生木浆 · 3层',
    category: 'home',
    location: 'livingCabinet',
    quantity: 3,
    unit: '包',
    productionDate: addDays(-10),
    expiryDate: null,
    note: '',
    glyph: 'tissues',
    accent: '#F0EBDD',
  },
  {
    id: 'backupTissues',
    name: '备用纸巾',
    spec: '家庭装 · 12包',
    category: 'home',
    location: 'storageCabinet',
    quantity: 4,
    unit: '包',
    productionDate: addDays(-12),
    expiryDate: null,
    note: '',
    imageKey: 'pantry',
    glyph: 'backupTissues',
    accent: '#F0EBDD',
  },
  {
    id: 'batteries',
    name: '电池',
    spec: '5号碱性电池',
    category: 'home',
    location: 'tvStand',
    quantity: 8,
    unit: '节',
    productionDate: addDays(-20),
    expiryDate: null,
    note: '遥控器和体温计的备用电池。',
    glyph: 'batteries',
    accent: '#ECEBE6',
  },
  {
    id: 'bulbs',
    name: '灯泡',
    spec: '暖光LED · E27',
    category: 'home',
    location: 'storageCabinet',
    quantity: 2,
    unit: '个',
    productionDate: addDays(-40),
    expiryDate: null,
    note: '',
    glyph: 'bulbs',
    accent: '#F2ECDC',
  },
  {
    id: 'trashbags',
    name: '垃圾袋',
    spec: '加厚抽绳款',
    category: 'home',
    location: 'kitchenCabinet',
    quantity: 1,
    unit: '卷',
    productionDate: addDays(-8),
    expiryDate: null,
    note: '',
    glyph: 'trashbags',
    accent: '#E9ECE7',
  },
  {
    id: 'toast',
    name: '全麦吐司',
    spec: '厚切 · 6片装',
    category: 'food',
    location: 'kitchenCabinet',
    quantity: 1,
    unit: '袋',
    productionDate: addDays(-6),
    expiryDate: addDays(-3),
    note: '已过期，等待你决定是否保留。',
    imageKey: 'bread',
    glyph: 'toast',
    accent: '#F1EBDD',
  },
]

const daysBetween = (start, end) => {
  if (!start || !end) return null
  return Math.max(1, Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / D))
}

export const seedItems = baseItems.map((item, index) => {
  const productionDate = item.productionDate || null
  const expiryDate = item.expiryDate || null
  const shelfLifeValue =
    item.shelfLifeValue ??
    (productionDate && expiryDate ? daysBetween(productionDate, expiryDate) : null)

  return {
    id: item.id,
    createdAt: addDays(-(40 - index)),
    retained: false,
    variant: '',
    shelfLifeUnit: '天',
    ...item,
    productionDate,
    shelfLifeValue,
    shelfLifeUnit: item.shelfLifeUnit || '天',
  }
})

export const defaultSettings = {
  remindersOn: true,
  expiryReminders: true,
  stockReminders: true,
  replaceReminders: true,
  defaultAdvance: 14,
  reminderTime: '09:00',
  dateFormat: 'zh',
  sound: true,
}

export const shelfLifeUnits = ['天', '个月', '年']

export const calculateExpiryDate = (productionDate, value, unit = '天') => {
  if (!productionDate || value === '' || value === null || value === undefined) return ''
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const base = parseDate(productionDate)
  if (!base) return ''
  if (unit === '个月' || unit === '年') {
    const months = unit === '年' ? amount * 12 : amount
    const originalDay = base.getDate()
    base.setDate(1)
    base.setMonth(base.getMonth() + Math.round(months))
    const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
    base.setDate(Math.min(originalDay, lastDay))
  } else {
    base.setDate(base.getDate() + Math.round(amount))
  }
  return dateKey(base)
}

const normalizeProductKey = (item) =>
  `${item.category}::${(item.name || '').trim().toLocaleLowerCase('zh-CN')}`

export const groupItemsByProduct = (items) => {
  const groups = new Map()
  items.forEach((item) => {
    const key = normalizeProductKey(item)
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: item.name,
        category: item.category,
        items: [],
      })
    }
    groups.get(key).items.push(item)
  })

  return [...groups.values()].map((group) => {
    const sortedItems = [...group.items].sort((a, b) => {
      const da = daysUntil(a.expiryDate)
      const db = daysUntil(b.expiryDate)
      if (da === null) return 1
      if (db === null) return -1
      return da - db
    })
    const quantities = sortedItems.map((item) =>
      item.quantity === null || item.quantity === '' || item.quantity === undefined
        ? null
        : Number(item.quantity),
    )
    const units = [...new Set(sortedItems.map((item) => item.unit || '').filter(Boolean))]
    const completeQuantities = quantities.every((quantity) => quantity !== null)
    return {
      ...group,
      items: sortedItems,
      variantCount: sortedItems.length,
      unit: units.length === 1 ? units[0] : '',
      totalQuantity: completeQuantities && units.length === 1
        ? quantities.reduce((sum, quantity) => sum + quantity, 0)
        : null,
    }
  })
}

let customCategoryRegistry = []
let customLocationRegistry = []

export const setCustomTaxonomy = (nextCategories = [], nextLocations = []) => {
  customCategoryRegistry = nextCategories
  customLocationRegistry = nextLocations
}

export const getAllCategories = () => [...categories, ...customCategoryRegistry]
export const getAllLocations = () => [...locations, ...customLocationRegistry]
export const findCategory = (id) =>
  getAllCategories().find((category) => category.id === id) || categories[0]
export const findLocation = (id) => {
  const allLocations = getAllLocations()
  return allLocations.find((location) => location.id === id) || allLocations[allLocations.length - 1]
}
export const getItemImage = (item) => item?.imageUrl || (item?.imageKey ? images[item.imageKey] : null)
