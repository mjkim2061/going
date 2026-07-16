<script setup>
defineProps({
  option: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="summary">
    <h2>여행 조건</h2>

    <div class="summary-grid">
      <div class="item">
        <i class="fa-regular fa-calendar"></i>
        <div>
          <h3>여행 일정</h3>
          <p>
            {{ option.startDate || '미정' }}
            <span v-if="!option.dayTrip && option.endDate">~ {{ option.endDate }}</span>
            <span v-if="option.dayTrip">(당일치기)</span>
          </p>
        </div>
      </div>

      <!-- 동행 항목 제거 -->

      <div class="item">
        <i class="fa-solid fa-location-dot"></i>
        <div>
          <h3>지역</h3>
          <p>{{ option.district || '전체' }}</p>
        </div>
      </div>

      <div class="item">
        <i class="fa-solid fa-map-pin"></i>
        <div>
          <h3>방문 장소</h3>
          <p>{{ option.placeCount }}곳</p>
        </div>
      </div>

      <div class="item">
        <i class="fa-solid fa-utensils"></i>
        <div>
          <h3>맛집</h3>
          <p>{{ option.food ? '포함' : '미포함' }}</p>
        </div>
      </div>

      <div class="item">
        <i class="fa-solid fa-bed"></i>
        <div>
          <h3>숙박</h3>
          <p>{{ option.hotel ? '포함' : '미포함' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.summary {
  margin-bottom: 32px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 6%);
}

.summary h2 {
  margin: 0 0 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
}

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f8f9fb;
  border-radius: 8px;
}

.item i {
  color: var(--color-primary);
  font-size: 24px;
}

.item h3 {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
}

.item p {
  margin: 5px 0 0;
  font-weight: 800;
}
</style>
