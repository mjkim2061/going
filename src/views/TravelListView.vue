<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import TravelCard from '@/components/travel/TravelCard.vue'
import { categories, regions, travelItems } from '@/data/travelData'

const route = useRoute()

const searchText = ref('')
const selectedCategory = ref('전체')
const selectedRegion = ref('전체')
const sortOption = ref('title')
const currentPage = ref(1)
const pageSize = 8

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] || '' : typeof value === 'string' ? value : ''
}

watch(
  () => route.query.category,
  (value) => {
    const category = getQueryValue(value)
    selectedCategory.value = categories.includes(category) ? category : '전체'
  },
  { immediate: true },
)

watch(
  () => route.query.keyword,
  (value) => {
    searchText.value = getQueryValue(value)
  },
  { immediate: true },
)

const filteredItems = computed(() => {
  try {
    const keyword = searchText.value.trim().toLocaleLowerCase('ko')

    const result = travelItems.filter((item) => {
      // guard against missing fields
      const title = (item.title || '').toLocaleLowerCase('ko')
      const address = (item.address || '').toLocaleLowerCase('ko')

      const matchesKeyword = !keyword || title.includes(keyword) || address.includes(keyword)

      const matchesCategory = selectedCategory.value === '전체' || (item.category || '') === selectedCategory.value
      const matchesRegion = selectedRegion.value === '전체' || (item.region || '') === selectedRegion.value

      return matchesKeyword && matchesCategory && matchesRegion
    })

    return [...result].sort((a, b) => {
      if (sortOption.value === 'recent') {
        // sort by registration/created time (newest first), fallback to modifiedTime
        const aTime = a.createdTime || a.modifiedTime || ''
        const bTime = b.createdTime || b.modifiedTime || ''
        return bTime.localeCompare(aTime)
      }

      return a.title.localeCompare(b.title, 'ko')
    })
  } catch (err) {
    // Prevent UI crash and log error for debugging
    // eslint-disable-next-line no-console
    console.error('[TravelList] filter error:', err)
    return []
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(startIndex, startIndex + pageSize)
})

const visiblePages = computed(() => {
  const pageCount = Math.min(5, totalPages.value)
  let startPage = Math.max(1, currentPage.value - 2)

  if (startPage + pageCount - 1 > totalPages.value) {
    startPage = Math.max(1, totalPages.value - pageCount + 1)
  }

  return Array.from({ length: pageCount }, (_, index) => startPage + index)
})

watch([searchText, selectedCategory, selectedRegion, sortOption], () => {
  currentPage.value = 1
})

function movePage(page) {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <section class="page-section travel-list">
    <div class="container">
      <header class="page-heading">
        <h1>관광정보</h1>
        <p>광주·전라권의 관광지, 맛집, 숙소, 축제 정보를 찾아보세요.</p>
      </header>

      <form class="search-box" @submit.prevent>
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input v-model="searchText" type="search" placeholder="장소명이나 주소로 검색" />
        <button type="submit">검색</button>
      </form>

      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="['filter-chip', { 'filter-chip--active': selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="region-filter">
        <strong>지역</strong>
        <button
          v-for="region in regions"
          :key="region"
          type="button"
          :class="['region-chip', { 'region-chip--active': selectedRegion === region }]"
          @click="selectedRegion = region"
        >
          {{ region }}
        </button>
      </div>

      <div class="result-header">
        <p>
          총 <strong>{{ filteredItems.length }}</strong>개의 검색 결과가 있습니다.
        </p>

        <select v-model="sortOption" aria-label="관광정보 정렬">
          <option value="title">가나다순</option>
          <option value="recent">등록일순</option>
        </select>
      </div>

      <div v-if="paginatedItems.length" class="travel-grid">
        <TravelCard v-for="item in paginatedItems" :key="item.id" :item="item" />
      </div>

      <div v-else class="empty-result">
        <strong>검색 결과가 없습니다.</strong>
        <p>검색어나 선택한 조건을 변경해 주세요.</p>
      </div>

      <nav v-if="filteredItems.length > pageSize" class="pagination" aria-label="페이지 이동">
        <button type="button" :disabled="currentPage === 1" @click="movePage(currentPage - 1)">
          이전
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          :class="{ pagination__active: currentPage === page }"
          @click="movePage(page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          @click="movePage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
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

.page-heading p {
  margin: 12px 0 0;
  color: var(--color-muted);
}

.search-box {
  display: flex;
  align-items: center;
  width: min(780px, 100%);
  height: 66px;
  margin: 35px auto 42px;
  padding: 8px 9px 8px 20px;
  background: #ffffff;
  border: 1px solid #ccd8dc;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgb(35 73 90 / 8%);
}

.search-box i {
  margin-right: 12px;
  color: var(--color-muted);
}

.search-box input {
  min-width: 0;
  flex: 1;
  height: 100%;
  background: transparent;
  border: 0;
  outline: 0;
}

.search-box button {
  width: 96px;
  height: 48px;
  color: #ffffff;
  font-weight: 800;
  background: var(--color-primary);
  border: 0;
  border-radius: 999px;
}

.category-filter,
.region-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.region-filter {
  align-items: center;
  margin-top: 24px;
}

.filter-chip,
.region-chip {
  color: #53616a;
  background: #ffffff;
  border: 1px solid #cbd5da;
}

.filter-chip {
  padding: 10px 19px;
  border-radius: 999px;
}

.filter-chip--active,
.region-chip--active {
  color: #ffffff;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.region-chip {
  padding: 6px 11px;
  border-radius: 7px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 38px;
  padding-bottom: 17px;
  border-bottom: 1px solid #ced7dc;
}

.result-header p {
  margin: 0;
  color: var(--color-muted);
}

.result-header strong {
  color: var(--color-primary);
}

.result-header select {
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #d3dde1;
  border-radius: 8px;
}

.travel-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 22px;
  margin-top: 24px;
}

.empty-result {
  padding: 90px 20px;
  color: var(--color-muted);
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 44px;
}

.pagination button {
  min-width: 42px;
  height: 40px;
  color: #546169;
  background: #ffffff;
  border: 1px solid #cbd6da;
  border-radius: 8px;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

.pagination .pagination__active {
  color: #ffffff;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

@media (max-width: 1020px) {
  .travel-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-heading h1 {
    font-size: 30px;
  }

  .travel-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .travel-grid {
    grid-template-columns: 1fr;
  }

  .result-header {
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
