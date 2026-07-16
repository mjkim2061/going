<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useCourseStore } from '@/stores/course'

const router = useRouter()
const store = useCourseStore()

const startDate = ref('')
const endDate = ref('')
const dayTrip = ref(false)
const district = ref('')
const placeCount = ref(3)
const food = ref(true)
const hotel = ref(false)
const transport = ref(true)
const savedCourses = ref([])
const savedPage = ref(1)
const savedPerPage = 2

const totalSavedPages = computed(() => Math.max(1, Math.ceil(savedCourses.value.length / savedPerPage)))

const pagedSavedPreview = computed(() => {
  const start = (savedPage.value - 1) * savedPerPage
  return savedCourses.value.slice(start, start + savedPerPage)
})


const districts = ['동구', '서구', '남구', '북구', '광산구']

function loadSavedCourses() {
  savedCourses.value = JSON.parse(localStorage.getItem('savedCourses') || '[]')
}

function setStoreOption() {
  store.setOption({
    startDate: startDate.value,
    endDate: dayTrip.value ? startDate.value : endDate.value,
    dayTrip: dayTrip.value,
    // companion removed
    district: district.value,
    placeCount: Number(placeCount.value),
    food: food.value,
    hotel: hotel.value,
    transport: transport.value,
  })
}

function goResult() {
  setStoreOption()
  router.push('/course/result')
}

function resetForm() {
  startDate.value = ''
  endDate.value = ''
  dayTrip.value = false
  district.value = ''
  placeCount.value = 3
  food.value = true
  hotel.value = false
  transport.value = true
}

function viewSavedCourse(course) {
  store.setOption(course.option)
  router.push('/course/result')
}

function editSavedCourse(course) {
  store.setOption(course.option)
  router.push('/course')
}

function deleteSavedCourse(id) {
  const idx = savedCourses.value.findIndex((c) => c.id === id)
  if (idx === -1) return
  if (!confirm('정말로 저장된 코스를 삭제하시겠습니까?')) return
  savedCourses.value.splice(idx, 1)
  localStorage.setItem('savedCourses', JSON.stringify(savedCourses.value))
}

onMounted(loadSavedCourses)

// Compute minimum selectable end date: one day after startDate
const minEndDate = computed(() => {
  if (!startDate.value) return ''
  try {
    const d = new Date(startDate.value)
    // add 1 day
    d.setDate(d.getDate() + 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  } catch (e) {
    return ''
  }
})

// When startDate changes, ensure endDate is at least minEndDate
watch(startDate, (newVal) => {
  if (!newVal) {
    if (dayTrip.value) endDate.value = ''
    return
  }

  // if day trip is selected, keep endDate equal to startDate
  if (dayTrip.value) {
    endDate.value = startDate.value
    return
  }

  const min = minEndDate.value
  if (!endDate.value) return
  if (min && endDate.value < min) {
    // clear endDate so user reselects valid date
    endDate.value = ''
  }
})

// When dayTrip toggles on, set endDate = startDate; when toggles off, clear endDate
watch(dayTrip, (val) => {
  if (val) {
    endDate.value = startDate.value || ''
  } else {
    // do not override an explicitly set endDate when turning off
    // if endDate equals startDate (set by dayTrip), clear it so user must pick
    if (endDate.value === startDate.value) endDate.value = ''
  }
})

// When store.option changes (e.g. user clicked edit), populate form fields
watch(
  () => store.option,
  (opt) => {
    if (!opt) return
    // set startDate first
    startDate.value = opt.startDate || ''
    dayTrip.value = !!opt.dayTrip
    district.value = opt.district || ''
    placeCount.value = Number(opt.placeCount || 3)
    food.value = !!opt.food
    hotel.value = !!opt.hotel
    transport.value = !!opt.transport

    // compute min end date based on startDate
    let min = ''
    if (startDate.value) {
      try {
        const d = new Date(startDate.value)
        d.setDate(d.getDate() + 1)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        min = `${yyyy}-${mm}-${dd}`
      } catch (e) {
        min = ''
      }
    }

    // set endDate only if it's valid (>= min), otherwise clear it
    if (opt.endDate && min && opt.endDate >= min) {
      endDate.value = opt.endDate
    } else if (opt.endDate && !min) {
      endDate.value = opt.endDate
    } else {
      endDate.value = ''
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <section class="page-section course-page">
    <div class="container">
      <header class="page-heading">
        <h1>나만의 광주 여행 코스 만들기</h1>
        <p>취향에 맞는 맞춤형 광주 여행 일정을 추천해 드립니다.</p>
      </header>

      <div class="card">
        <section class="form-section">
          <h2>여행 일정</h2>
          <div class="date-row">
            <label>
              시작일
              <input v-model="startDate" type="date" />
            </label>
            <label>
              종료일
              <input v-model="endDate" type="date" :disabled="dayTrip" :min="minEndDate" />
            </label>
          </div>
          <label class="check-row">
            <input v-model="dayTrip" type="checkbox" />
            당일치기
          </label>
        </section>

        <!-- 동행 유형 섹션 제거 -->

        <section class="form-section">
          <h2>희망 지역</h2>
          <select v-model="district">
            <option value="">전체 지역</option>
            <option v-for="item in districts" :key="item" :value="item">{{ item }}</option>
          </select>
        </section>

        <div class="option-row">
          <section class="form-section">
            <h2>하루 방문 장소</h2>
            <input v-model="placeCount" type="range" min="1" max="6" class="range" />
            <strong>{{ placeCount }}곳</strong>
          </section>

          <section class="form-section detail-options">
            <h2>세부 옵션</h2>
            <label class="toggle-row">
              <span>맛집 추천 포함</span>
              <input v-model="food" type="checkbox" />
            </label>
            <label class="toggle-row">
              <span>숙박 정보 포함</span>
              <input v-model="hotel" type="checkbox" />
            </label>
            <label class="toggle-row">
              <span>대중교통 우선 경로</span>
              <input v-model="transport" type="checkbox" />
            </label>
          </section>
        </div>

        <div class="button-row">
          <button type="button" class="create-btn" @click="goResult">여행 코스 생성</button>
          <button type="button" class="reset-btn" @click="resetForm">초기화</button>
        </div>
      </div>

      <section class="saved-course">
        <div class="section-heading">
          <h2>저장된 여행 코스</h2>
          <RouterLink to="/saved-courses">전체보기</RouterLink>
        </div>

        <div v-if="savedCourses.length === 0" class="empty">저장된 여행 코스가 없습니다.</div>

        <article v-for="course in pagedSavedPreview" :key="course.id" class="saved-card">
          <div class="saved-info">
            <h3>{{ course.option.district || '전체 지역' }}</h3>
            <p>{{ course.option.startDate || '일정 미정' }}</p>
          </div>
          <div class="actions">
            <button type="button" class="icon-btn edit" @click="editSavedCourse(course)" aria-label="수정">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="icon-btn delete" @click="deleteSavedCourse(course.id)" aria-label="삭제">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button type="button" class="view-btn" @click="viewSavedCourse(course)">보기</button>
          </div>
        </article>

        <div v-if="totalSavedPages > 1" class="pagination">
          <button
            v-for="p in totalSavedPages"
            :key="p"
            :class="{ active: p === savedPage }"
            type="button"
            @click="savedPage = p"
          >
            {{ p }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.page-heading {
  text-align: center;
}

.page-heading h1 {
  margin: 0;
  font-size: clamp(34px, 5vw, 48px);
}

.page-heading p {
  color: var(--color-muted);
}

.card {
  margin-top: 38px;
  padding: 36px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 7%);
}

.form-section {
  margin-bottom: 34px;
}

.form-section h2 {
  margin: 0 0 18px;
  color: var(--color-primary);
  font-size: 24px;
}

.date-row,
.option-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

label {
  color: #333333;
  font-weight: 700;
}

input,
select {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 1px solid #d6dde1;
  border-radius: 8px;
}

.check-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.check-row input,
.toggle-row input {
  width: auto;
  margin: 0;
}

/* companion buttons removed */

.range {
  accent-color: var(--color-primary);
}

.detail-options {
  padding: 22px;
  background: #f5f7fa;
  border-radius: 8px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 16px;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.create-btn,
.reset-btn {
  min-height: 58px;
  padding: 0 34px;
  font-weight: 800;
  border-radius: 999px;
}

.create-btn {
  color: #ffffff;
  background: var(--color-primary);
  border: 0;
}

.reset-btn {
  color: #555555;
  background: #eceff4;
  border: 0;
}

.saved-course {
  margin-top: 56px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-heading a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.empty,
.saved-card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.saved-card {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--color-primary);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(10,139,139,0.06);
}

.saved-card h3,
.saved-card p {
  margin: 0 0 8px;
}

.saved-card small {
  color: var(--color-muted);
}

.view-btn {
  padding: 12px 22px;
  font-weight: 800;
  color: #ffffff;
  background: var(--color-primary);
  border: 0;
  border-radius: 8px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-size: 16px;
  margin-right: 8px;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 140ms ease, transform 140ms ease;
}

.saved-card:hover .icon-btn {
  opacity: 1;
  transform: translateX(0);
}

.icon-btn.delete {
  color: #c2410c;
}

.icon-btn.edit {
  color: var(--color-primary-dark);
}

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}

.pagination button {
  min-width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #d6dde1;
  background: #fff;
}

.pagination button.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

@media (max-width: 760px) {
  .card {
    padding: 24px;
  }

  .date-row,
  .option-row {
    grid-template-columns: 1fr;
  }

  .button-row {
    flex-direction: column;
  }
}
</style>
