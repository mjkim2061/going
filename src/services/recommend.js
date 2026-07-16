import { travelItems } from '@/data/travelData'

function includesDistrict(item, district) {
  return !district || (item.address && item.address.includes(district))
}

function withScheduleMeta(item, type, hour) {
  return {
    ...item,
    type,
    time: `${String(hour).padStart(2, '0')}:00`,
    firstimage: item.image || item.thumbnail || '',
    title: item.title,
    addr1: item.address || '',
    contentid: item.id,
  }
}

export function recommendCourse(option) {
  const district = option.district || ''
  const placeCount = Number(option.placeCount || 3)
  const schedule = []

  // determine number of days
  const dayTrip = Boolean(option.dayTrip)
  let days = 1
  if (!dayTrip && option.startDate && option.endDate) {
    try {
      const s = new Date(option.startDate)
      const e = new Date(option.endDate)
      // inclusive days
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24))
      days = Math.max(1, diff + 1)
    } catch (e) {
      days = 1
    }
  }

  // use normalized travelItems so detail pages can look up data
  const courseList = travelItems.filter((it) => it.categoryKey === 'course' && includesDistrict(it, district))
  const attractionList = travelItems.filter((it) => it.categoryKey === 'attraction' && includesDistrict(it, district))
  const restaurantList = travelItems.filter((it) => it.categoryKey === 'restaurant' && includesDistrict(it, district))
  const lodgingList = travelItems.filter((it) => it.categoryKey === 'lodging' && includesDistrict(it, district))
  const festivalList = travelItems.filter((it) => it.categoryKey === 'festival' && includesDistrict(it, district))

  // create merged pool of normalized items preserving priority order
  const merged = []
  attractionList.forEach((it) => merged.push({ src: 'attraction', item: it }))
  restaurantList.forEach((it) => merged.push({ src: 'restaurant', item: it }))
  festivalList.forEach((it) => merged.push({ src: 'festival', item: it }))
  lodgingList.forEach((it) => merged.push({ src: 'lodging', item: it }))
  courseList.forEach((it) => merged.unshift({ src: 'course', item: it }))

  // helper: format date string YYYY.MM.DD
  function formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}.${m}.${d}`
  }

  // build schedules per day using merged pool
  let poolIdx = 0
  for (let d = 0; d < days; d++) {
    let hour = 9
    // compute date label
    let dateLabel = ''
    if (option.startDate) {
      const base = new Date(option.startDate)
      base.setDate(base.getDate() + d)
      dateLabel = formatDate(base)
    }

    // if first day and there is a course entry, add it first (do not count against placeCount)
    if (d === 0 && courseList.length) {
      schedule.push({ ...withScheduleMeta(courseList[0], '추천코스', hour), date: dateLabel })
      hour += 2
    }

    // fill up to placeCount items for this day from merged pool
    let added = 0
    while (added < placeCount && poolIdx < merged.length) {
      const entry = merged[poolIdx++]
      if (!entry) break
      const typeLabel =
        entry.src === 'attraction'
          ? '관광지'
          : entry.src === 'restaurant'
          ? '맛집'
          : entry.src === 'festival'
          ? '축제'
          : entry.src === 'lodging'
          ? '숙박'
          : '기타'

      schedule.push({ ...withScheduleMeta(entry.item, typeLabel, hour), date: dateLabel })
      added += 1
      hour += 2
    }

    // if hotel option and there is lodging left, optionally ensure a lodging at night (doesn't count against placeCount)
    if (option.hotel && d < days - 1) {
      const lodge = lodgingList.shift()
      if (lodge) {
        schedule.push({ ...withScheduleMeta(lodge, '숙박', hour), date: dateLabel })
        hour += 2
      }
    }
  }

  return schedule
}
