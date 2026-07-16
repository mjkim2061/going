<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const imageFailed = ref(false)

watch(
  () => props.item.id,
  () => {
    imageFailed.value = false
  },
)
</script>

<template>
  <article class="travel-card">
    <RouterLink
      :to="{ name: 'travel-detail', params: { id: item.id } }"
      class="travel-card__image-area"
    >
      <img
        v-if="item.image && !imageFailed"
        :src="item.image"
        :alt="`${item.title} 대표 이미지`"
        class="travel-card__image"
        @error="imageFailed = true"
      />

      <div v-else class="travel-card__fallback">
        <img
          src="/logo-gajaing.png"
          onerror="this.onerror=null;this.src='/logo-gajaing.svg'"
          alt="가자잉 로고"
          class="travel-card__fallback-logo"
        />
      </div>

      <span class="travel-card__category">{{ item.category }}</span>
    </RouterLink>

    <div class="travel-card__body">
      <h2 class="travel-card__title">{{ item.title }}</h2>
      <p class="travel-card__address">{{ item.address || '주소 정보가 없습니다.' }}</p>

      <RouterLink
        :to="{ name: 'travel-detail', params: { id: item.id } }"
        class="travel-card__button"
      >
        상세보기
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.travel-card {
  overflow: hidden;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #edf1f4;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgb(15 118 110 / 8%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.travel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgb(15 118 110 / 14%);
}

.travel-card__image-area {
  position: relative;
  display: block;
  height: 220px;
  overflow: hidden;
  background: #dcefed;
  text-decoration: none;
}

.travel-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.travel-card:hover .travel-card__image {
  transform: scale(1.04);
}

.travel-card__fallback {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--color-primary);
  font-weight: 800;
  background: linear-gradient(135deg, #d9efed, #eef7f6);
}

.travel-card__fallback-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.travel-card__category {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 6px 13px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  background: var(--color-primary);
  border-radius: 999px;
}

.travel-card__body {
  padding: 20px;
}

.travel-card__title {
  overflow: hidden;
  margin: 0;
  font-size: 21px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.travel-card__address {
  overflow: hidden;
  min-height: 44px;
  margin: 9px 0 18px;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.5;
}

.travel-card__button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
}

.travel-card__button:hover {
  color: #ffffff;
  background: var(--color-primary);
}
</style>
