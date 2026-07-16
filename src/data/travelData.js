import attractions from './raw/attractions.json'
import culture from './raw/culture.json'
import festivals from './raw/festivals.json'
import leisure from './raw/leisure.json'
import lodging from './raw/lodging.json'
import restaurants from './raw/restaurants.json'
import shopping from './raw/shopping.json'

const sources = [
  { key: 'attraction', label: '관광지', data: attractions },
  { key: 'leisure', label: '레포츠', data: leisure },
  { key: 'culture', label: '문화시설', data: culture },
  { key: 'shopping', label: '쇼핑', data: shopping },
  { key: 'lodging', label: '숙박', data: lodging },
  { key: 'restaurant', label: '음식점', data: restaurants },
  { key: 'festival', label: '축제·공연행사', data: festivals },
]

function convertImageUrl(url) {
  return url ? url.replace(/^http:\/\//, 'https://') : ''
}

function parseCoordinate(value) {
  const coordinate = Number.parseFloat(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

function extractRegion(address) {
  if (!address) return '기타'

  const tokens = address.split(/\s+/)
  const region = tokens.find((token) => /구$/.test(token))
  return region || '기타'
}

function normalizeItem(item, categoryKey, categoryLabel) {
  const address = [item.addr1, item.addr2].filter(Boolean).join(' ').trim()

  return {
    id: String(item.contentid),
    categoryKey,
    category: categoryLabel,
    title: item.title || '이름이 등록되지 않은 장소',
    address,
    region: extractRegion(item.addr1),
    postalCode: item.zipcode || '',
    telephone: item.tel || '',
    image: convertImageUrl(item.firstimage || item.firstimage2),
    thumbnail: convertImageUrl(item.firstimage2 || item.firstimage),
    longitude: parseCoordinate(item.mapx),
    latitude: parseCoordinate(item.mapy),
    modifiedTime: item.modifiedtime || '',
    createdTime: item.createdtime || item.createdTime || '',
    raw: item,
  }
}

const allowedDistricts = ['동구', '서구', '남구', '북구', '광산구']

export const travelItems = sources.flatMap((source) => {
  const items = Array.isArray(source.data.items) ? source.data.items : []
  return items.map((item) => normalizeItem(item, source.key, source.label))
})
.filter((item) => {
  // Include item when its parsed region is one of the allowed 광주 districts
  // or when the original address explicitly mentions '광주' (fallback)
  const inDistrict = allowedDistricts.includes(item.region)
  // Only allow when the address contains one of the allowed 광주 districts.
  // This prevents addresses like '전남광주통합특별시 순천시 ...' from being included.
  const addr = (item.raw && item.raw.addr1) || ''
  const addrContainsAllowedDistrict = allowedDistricts.some((d) => addr.includes(d))
  return inDistrict || addrContainsAllowedDistrict
})

export const categories = ['전체', ...sources.map((source) => source.label)]

const preferredRegions = ['동구', '서구', '남구', '북구', '광산구']
const discoveredRegions = [
  ...new Set(travelItems.map((item) => item.region).filter((region) => region !== '기타')),
]

export const regions = [
  '전체',
  ...preferredRegions.filter((region) => discoveredRegions.includes(region)),
  ...discoveredRegions
    .filter((region) => !preferredRegions.includes(region))
    .sort((a, b) => a.localeCompare(b, 'ko')),
]

export function findTravelItemById(id) {
  return travelItems.find((item) => item.id === String(id))
}

export function findRelatedTravelItems(currentItem, limit = 4) {
  if (!currentItem) return []

  return travelItems
    .filter((item) => item.id !== currentItem.id && item.category === currentItem.category)
    .slice(0, limit)
}
