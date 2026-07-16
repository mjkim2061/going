<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import CourseCard from '@/components/result/CourseCard.vue'
import SummaryBar from '@/components/result/SummaryBar.vue'
import { recommendCourse } from '@/services/recommend'
import { useCourseStore } from '@/stores/course'

const router = useRouter()
const store = useCourseStore()
const schedule = computed(() => recommendCourse(store.option))

// group schedule by date label (schedule items must include `date`)
const grouped = computed(() => {
  const list = schedule.value || []
  const map = new Map()
  list.forEach((item) => {
    const date = item.date || '일정'
    if (!map.has(date)) map.set(date, [])
    map.get(date).push(item)
  })
  // return array of { date, items }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }))
})

function saveCourse() {
  const savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]')

  savedCourses.push({
    id: Date.now(),
    option: { ...store.option },
    schedule: schedule.value,
  })

  localStorage.setItem('savedCourses', JSON.stringify(savedCourses))
  alert('여행 코스가 저장되었습니다.')
}
</script>

<template>
  <section class="page-section result-page">
    <div class="container">
      <h1>맞춤 여행 코스</h1>
      <SummaryBar :option="store.option" />

      <div class="content">
        <section class="course-area">
          <h2>추천 일정</h2>

          <div v-if="schedule.length === 0" class="empty">
            조건에 맞는 추천 데이터가 없습니다. 지역을 전체로 바꾸거나 옵션을 조정해 주세요.
          </div>

          <div v-else>
            <div v-for="group in grouped" :key="group.date">
              <h3 class="schedule-date">{{ group.date }}</h3>
              <CourseCard v-for="item in group.items" :key="`${item.contentid}-${item.time}-${item.title}`" :item="item" />
            </div>
          </div>
        </section>

        <aside class="map-area">
          <div class="map-placeholder">
            <i class="fa-solid fa-map-location-dot"></i>
            <h3>지도 영역</h3>
            <p>Kakao Map API 연동이 필요한 코스 지도 표시 영역입니다.</p>
          </div>
        </aside>
      </div>

      <div class="button-container">
        <button type="button" class="secondary" @click="router.push('/course')">다시 생성</button>
        <button type="button" class="primary" @click="saveCourse">저장하기</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin: 0 0 28px;
  font-size: 34px;
}

.content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 30px;
  align-items: start;
}

.course-area h2 {
  margin-top: 0;
}

.schedule-date {
  margin: 18px 0 8px;
  padding: 8px 12px;
  background: #f3f7f7;
  border-radius: 6px;
  color: var(--color-primary);
  font-weight: 800;
}

.map-area {
  position: sticky;
  top: 90px;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 520px;
  padding: 30px;
  color: var(--color-muted);
  text-align: center;
  background: #ffffff;
  border: 2px dashed #cfcfcf;
  border-radius: 8px;
}

.map-placeholder i {
  color: var(--color-primary);
  font-size: 58px;
}

.empty {
  padding: 36px;
  color: var(--color-muted);
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 40px;
}

.button-container button {
  min-height: 48px;
  padding: 0 26px;
  font-weight: 800;
  border-radius: 8px;
}

.primary {
  color: #ffffff;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.secondary {
  color: var(--color-primary);
  background: #ffffff;
  border: 1px solid var(--color-primary);
}

@media (max-width: 980px) {
  .content {
    grid-template-columns: 1fr;
  }

  .map-area {
    position: static;
  }
}

@media (max-width: 620px) {
  .button-container {
    flex-direction: column;
  }
}
</style>
