<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="course-card">
    <div class="timeline">
      <div class="time">{{ item.time }}</div>
      <div class="line"></div>
    </div>

    <img
      class="image"
      :src="item.firstimage || 'https://placehold.co/220x150?text=No+Image'"
      :alt="`${item.title} 이미지`"
    />

    <div class="content">
      <span class="badge">{{ item.type }}</span>
      <h2>{{ item.title }}</h2>
      <p class="address" v-if="item.addr1">{{ item.addr1 }}</p>
      <RouterLink v-else :to="{ name: 'travel-detail', params: { id: item.contentid } }" class="detail-btn">상세보기</RouterLink>
      <p v-if="item.overview" class="overview">{{ item.overview }}</p>
      <div class="bottom">
        <span v-if="item.tel">연락처 {{ item.tel }}</span>
        <span v-if="item.mapx">위치정보 제공</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.course-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin-bottom: 22px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 7%);
}

.timeline {
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  padding: 10px 14px;
  color: #ffffff;
  font-weight: 800;
  background: var(--color-primary);
  border-radius: 999px;
}

.line {
  flex: 1;
  width: 3px;
  margin-top: 12px;
  background: #d9d9d9;
}

.image {
  width: 220px;
  height: 150px;
  object-fit: cover;
  background: #eeeeee;
  border-radius: 8px;
  flex-shrink: 0;
}

.content {
  min-width: 0;
  flex: 1;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  background: var(--color-primary);
  border-radius: 999px;
}

h2 {
  margin: 10px 0 12px;
  font-size: 24px;
}

.address,
.overview {
  color: var(--color-muted);
  line-height: 1.7;
}

.overview {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 14px;
  padding-top: 12px;
  color: var(--color-muted);
  border-top: 1px solid #eeeeee;
}

.detail-btn {
  display: inline-block;
  padding: 8px 12px;
  background: var(--color-primary);
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 800;
}

@media (max-width: 760px) {
  .course-card {
    flex-direction: column;
  }

  .timeline {
    width: 100%;
    align-items: flex-start;
  }

  .line {
    display: none;
  }

  .image {
    width: 100%;
    height: 220px;
  }
}
</style>
