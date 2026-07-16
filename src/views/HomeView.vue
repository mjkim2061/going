<script setup>
import { computed } from 'vue'

import TravelCard from '@/components/travel/TravelCard.vue'
import { travelItems } from '@/data/travelData'

const categories = [
  { label: '관광지', icon: 'fa-map-location-dot', query: { category: '관광지' } },
  { label: '맛집', icon: 'fa-utensils', query: { category: '음식점' } },
  { label: '숙박', icon: 'fa-bed', query: { category: '숙박' } },
  { label: '축제', icon: 'fa-masks-theater', query: { category: '축제·공연행사' } },
]

const featuredPlaces = computed(() => travelItems.filter((item) => item.image).slice(0, 4))

const communityPreview = [
  {
    id: 'preview-1',
    title: '광주 당일치기 코스 추천',
    content: '동명동 카페거리와 국립아시아문화전당을 함께 묶으면 걷기 좋은 일정이 됩니다.',
  },
  {
    id: 'preview-2',
    title: '가족 여행 숙소 고민',
    content: '아이와 이동하기 편한 위치의 숙소 정보를 서로 공유해 보세요.',
  },
]
</script>

<template>
  <section class="home-hero">
    <div class="container home-hero__inner">
      <p>광주의 매력을 발견하는 로컬 여행 플랫폼</p>
      <h1>
        관광정보부터 코스 추천,
        <span class="h1-break">여행 후기까지 한 번에</span>
      </h1>
      <div class="hero-actions">
        <RouterLink to="/travel" class="primary-button">관광정보 보기</RouterLink>
        <RouterLink to="/course" class="secondary-button">여행코스 만들기</RouterLink>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="container">
      <div class="category-menu">
        <RouterLink
          v-for="category in categories"
          :key="category.label"
          :to="{ path: '/travel', query: category.query }"
          class="category-card"
        >
          <i :class="['fa-solid', category.icon]" aria-hidden="true"></i>
          <span>{{ category.label }}</span>
        </RouterLink>
      </div>

      <div class="section-heading">
        <div>
          <h2 class="section-title">인기 여행지</h2>
        </div>
        <RouterLink to="/travel" class="cta-link"><span class="arrow">›</span> 전체보기</RouterLink>
      </div>

      <div class="travel-grid">
        <TravelCard v-for="item in featuredPlaces" :key="item.id" :item="item" />
      </div>
    </div>
  </section>

  <section class="home-band">
    <div class="container home-band__inner">
      <div>
        <h2 class="section-title">여행 코스 추천</h2>
      </div>
      <RouterLink to="/course" class="secondary-button cta-link"><span class="arrow">›</span> 코스 만들기</RouterLink>
    </div>
  </section>

  <section class="page-section">
    <div class="container">
      <div class="section-heading">
        <div>
          <h2 class="section-title">커뮤니티</h2>
        </div>
        <RouterLink to="/community" class="cta-link"><span class="arrow">›</span> 게시글 보기</RouterLink>
      </div>

      <div class="community-preview">
        <article v-for="post in communityPreview" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  min-height: 430px;
  display: grid;
  align-items: center;
  color: #ffffff;
  background:
    linear-gradient(90deg, rgb(0 55 55 / 78%), rgb(0 55 55 / 24%)),
    url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80")
      center/cover;
}

.home-hero__inner {
  padding: 64px 0;
}

.home-hero p {
  margin: 0 0 12px;
  font-weight: 800;
}

.home-hero h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 1.16;
}

.section-title {
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 800;
}

.home-hero h1 .h1-break {
  display: block;
  margin-top: 5pt;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-actions .primary-button,
.hero-actions .secondary-button {
  color: #ffffff;
  background: rgb(255 255 255 / 14%);
  border-color: rgb(255 255 255 / 60%);
  transition: background-color 160ms ease, color 160ms ease;
}

.hero-actions .primary-button:hover,
.hero-actions .secondary-button:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.category-menu {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 56px;
}

.category-card {
  display: grid;
  min-height: 126px;
  place-items: center;
  gap: 12px;
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgb(0 0 0 / 6%);
}

.category-card i {
  font-size: 34px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.section-heading p,
.home-band p {
  margin: 0 0 6px;
  color: var(--color-primary);
  font-weight: 800;
}

.arrow {
  font-size: 200%;
  line-height: 0.8;
  margin-right: 6px;
  vertical-align: middle;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.cta-link .arrow { margin-right: 8px; }

.section-heading h2,
.home-band h2 {
  margin: 0;
  font-size: 30px;
}

.section-heading a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.travel-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.home-band {
  padding: 48px 0;
  background: #ffffff;
  border-block: 1px solid var(--color-line);
}

.home-band__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.home-band .secondary-button {
  border: 0;
}

.community-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.community-preview article {
  min-height: 150px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.community-preview h3 {
  margin: 0 0 12px;
}

.community-preview p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .category-menu,
  .travel-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-band__inner,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .category-menu,
  .travel-grid,
  .community-preview {
    grid-template-columns: 1fr;
  }
}
</style>
