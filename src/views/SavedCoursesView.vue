<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCourseStore } from '@/stores/course'

const router = useRouter()
const store = useCourseStore()
const savedCourses = ref([])
const savedPage = ref(1)
const savedPerPage = 2

const totalPages = computed(() => Math.max(1, Math.ceil(savedCourses.value.length / savedPerPage)))

const pagedSaved = computed(() => {
  const s = (savedPage.value - 1) * savedPerPage
  return savedCourses.value.slice(s, s + savedPerPage)
})

function loadSavedCourses() {
  savedCourses.value = JSON.parse(localStorage.getItem('savedCourses') || '[]')
}

function viewCourse(course) {
  store.setOption(course.option)
  router.push('/course/result')
}

function editCourse(course) {
  store.setOption(course.option)
  router.push('/course')
}

function deleteCourse(id) {
  savedCourses.value = savedCourses.value.filter((course) => course.id !== id)
  localStorage.setItem('savedCourses', JSON.stringify(savedCourses.value))
}

onMounted(loadSavedCourses)
</script>

<template>
  <section class="page-section saved-page">
    <div class="container">
      <header class="page-heading">
        <h1>저장된 여행 코스</h1>
        <p>localStorage에 저장한 코스를 다시 확인할 수 있습니다.</p>
      </header>

      <div v-if="savedCourses.length === 0" class="empty">저장된 여행 코스가 없습니다.</div>

      <div v-else class="saved-grid">
            <article v-for="course in pagedSaved" :key="course.id" class="saved-card">
              <div class="saved-info">
                <h2>{{ course.option.district || '전체 지역' }}</h2>
                <p>{{ course.option.startDate || '일정 미정' }}</p>
              </div>
              <div class="actions">
                <button type="button" class="icon-btn edit" @click="editCourse(course)" aria-label="수정">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="icon-btn delete" @click="deleteCourse(course.id)" aria-label="삭제">
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="view-btn" @click="viewCourse(course)">보기</button>
              </div>
            </article>
          </div>

          <div v-if="totalPages > 1" class="pagination">
            <button
              v-for="p in totalPages"
              :key="p"
              :class="{ active: p === savedPage }"
              type="button"
              @click="savedPage = p"
            >
              {{ p }}
            </button>
          </div>
    </div>
  </section>
</template>

<style scoped>
.page-heading {
  text-align: center;
}

.page-heading h1 {
  margin: 0;
  font-size: 38px;
}

.page-heading p,
.empty,
.saved-card small {
  color: var(--color-muted);
}

.empty,
.saved-card {
  margin-top: 30px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.saved-card {
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--color-primary);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(10,139,139,0.06);
}

.saved-card h2 {
  margin: 0 0 10px;
  font-size: 21px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 0;
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

.view-btn {
  padding: 12px 22px;
  color: #ffffff;
  background: var(--color-primary);
  border: 0;
  border-radius: 8px;
  font-weight: 800;
}

.danger {
  padding: 12px 18px;
  background: #c2410c;
  color: #ffffff;
  border: 0;
  border-radius: 8px;
}

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 18px;
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
</style>
