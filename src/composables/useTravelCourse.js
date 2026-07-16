import { ref } from 'vue'

const STORAGE_KEY = 'travel-course-place-ids'
const placeIds = ref([])

function loadCoursePlaces() {
  try {
    placeIds.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    placeIds.value = []
  }
}

function saveCoursePlaces() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(placeIds.value))
}

export function useTravelCourse() {
  loadCoursePlaces()

  const addPlace = (id) => {
    const normalizedId = String(id)

    if (placeIds.value.includes(normalizedId)) {
      return false
    }

    placeIds.value.push(normalizedId)
    saveCoursePlaces()
    return true
  }

  const isAdded = (id) => placeIds.value.includes(String(id))

  return {
    placeIds,
    addPlace,
    isAdded,
    loadCoursePlaces,
  }
}
