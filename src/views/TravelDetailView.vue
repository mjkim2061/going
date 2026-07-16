<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PlaceMap from '@/components/travel/PlaceMap.vue'
import TravelCard from '@/components/travel/TravelCard.vue'
import { findRelatedTravelItems, findTravelItemById } from '@/data/travelData'

const route = useRoute()
const router = useRouter()
// travel course integration removed from detail view

const imageFailed = ref(false)
// notification removed

const place = computed(() => findTravelItemById(route.params.id))
const relatedItems = computed(() => findRelatedTravelItems(place.value, 4))

const description = computed(() => {
  if (!place.value) return ''
  return `${place.value.title}은(는) 광주·전라권의 ${place.value.category} 정보입니다. 주소와 위치를 확인하고 여행 코스에 추가해 나만의 일정을 만들어 보세요.`
})

// handleAddCourse removed
</script>

<template>
  <section class="page-section detail-page">
    <div v-if="place" class="container">
      <button type="button" class="back-button" @click="router.back()">관광정보 목록으로</button>

      <div class="detail-hero">
        <div class="detail-hero__image-area">
          <img
            v-if="place.image && !imageFailed"
            :src="place.image"
            :alt="`${place.title} 대표 이미지`"
            @error="imageFailed = true"
          />
          <div v-else class="detail-hero__fallback">광주·전라 여행</div>
          <span class="detail-hero__category">{{ place.category }}</span>
        </div>

        <div class="detail-hero__summary">
          <p class="detail-hero__eyebrow">광주 관광정보</p>
          <h1>{{ place.title }}</h1>
          <p class="detail-hero__address">{{ place.address || '주소 정보가 없습니다.' }}</p>

          <!-- 여행 코스에 추가 버튼 제거 -->
        </div>
      </div>

      <div class="detail-content">
        <article class="information-card">
          <h2>기본 정보</h2>
          <dl>
            <div>
              <dt>구분</dt>
              <dd>{{ place.category }}</dd>
            </div>
            <div>
              <dt>주소</dt>
              <dd>{{ place.address || '정보 없음' }}</dd>
            </div>
            <div>
              <dt>우편번호</dt>
              <dd>{{ place.postalCode || '정보 없음' }}</dd>
            </div>
            <div v-if="place.telephone">
              <dt>연락처</dt>
              <dd>{{ place.telephone }}</dd>
            </div>
          </dl>

          <div class="description">
            <h3>소개</h3>
            <p>{{ description }}</p>
          </div>
        </article>

        <aside class="map-card">
          <div class="map-card__heading">
            <h2>위치 지도</h2>
          </div>

          <PlaceMap :latitude="place.latitude" :longitude="place.longitude" :title="place.title" />

          <div class="map-card__address">
            <strong>{{ place.title }}</strong>
            <p>{{ place.address || '주소 정보 없음' }}</p>
          </div>
        </aside>
      </div>

      <section v-if="relatedItems.length" class="related-section">
        <div class="related-section__heading">
          <div>
            <p>함께 둘러보기</p>
            <h2>같은 카테고리의 다른 장소</h2>
          </div>
          <RouterLink to="/travel">전체보기</RouterLink>
        </div>

        <div class="related-grid">
          <TravelCard v-for="item in relatedItems" :key="item.id" :item="item" />
        </div>
      </section>
    </div>

    <div v-else class="not-found">
      <h1>관광정보를 찾을 수 없습니다.</h1>
      <RouterLink to="/travel" class="primary-button">관광정보 목록으로 이동</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.back-button {
  margin-bottom: 20px;
  padding: 6px 0;
  color: var(--color-primary);
  font-weight: 800;
  background: transparent;
  border: 0;
}

.detail-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  align-items: center;
  gap: 34px;
}

.detail-hero__image-area {
  position: relative;
  overflow: hidden;
  height: 440px;
  background: #dcefed;
  border-radius: 8px;
  box-shadow: 0 13px 30px rgb(35 73 90 / 10%);
}

.detail-hero__image-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-hero__fallback {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--color-primary);
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #d6ecea, #f2f8f7);
}

.detail-hero__category {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 8px 17px;
  color: #ffffff;
  font-weight: 700;
  background: var(--color-primary);
  border-radius: 999px;
}

.detail-hero__eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-weight: 800;
}

.detail-hero__summary h1 {
  margin: 0;
  font-size: clamp(34px, 4vw, 48px);
  line-height: 1.2;
}

.detail-hero__address {
  margin: 15px 0 26px;
  color: var(--color-muted);
  line-height: 1.6;
}

.course-button {
  width: 100%;
  height: 58px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  background: var(--color-primary);
  border: 0;
  border-radius: 8px;
}

.course-button--added {
  color: var(--color-primary);
  background: #dff1ef;
}



.detail-content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  align-items: start;
  gap: 34px;
  margin-top: 42px;
}

.information-card,
.map-card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8eef1;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(35 73 90 / 7%);
}

.information-card {
  padding: 28px;
}

.information-card h2,
.map-card h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 23px;
}

.information-card dl {
  margin: 22px 0 0;
  padding-top: 8px;
  border-top: 1px solid #d8e0e3;
}

.information-card dl > div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  padding: 11px 0;
}

.information-card dt {
  font-weight: 800;
}

.information-card dd {
  margin: 0;
  color: #59666e;
}

.description {
  margin-top: 18px;
}

.description p {
  color: #59666e;
  line-height: 1.8;
}

.map-card__heading {
  padding: 20px 22px;
  background: #ffffff;
  border-bottom: 1px solid #e8eef1;
}

.map-card__address {
  padding: 18px 22px;
  text-align: center;
}

.map-card__address strong {
  color: var(--color-primary);
}

.related-section {
  margin-top: 56px;
}

.related-section__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.related-section__heading p {
  margin: 0 0 5px;
  color: var(--color-primary);
  font-weight: 800;
}

.related-section__heading h2 {
  margin: 0;
}

.related-section__heading a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.not-found {
  padding: 120px 20px;
  text-align: center;
}

@media (max-width: 920px) {
  .detail-hero,
  .detail-content {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .detail-hero__image-area {
    height: 270px;
  }

  .information-card dl > div {
    grid-template-columns: 90px 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
