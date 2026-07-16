<script setup>
const navItems = [
  { label: '메인', to: '/' },
  { label: '관광정보', to: '/travel' },
  { label: '여행코스', to: '/course' },
  { label: '커뮤니티', to: '/community' },
]
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="brand">
        <img src="/logo-gajaing.png" onerror="this.onerror=null;this.src='/logo-gajaing.svg'" alt="가자잉 로고" class="brand__logo" />
        <strong>가자잉</strong>
      </RouterLink>

      <nav class="navigation" aria-label="주요 메뉴">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 70px;
  background: rgb(255 255 255 / 94%);
  border-bottom: 1px solid var(--color-line);
  backdrop-filter: blur(10px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1240px, calc(100% - 40px));
  height: 100%;
  margin: 0 auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-primary);
  font-size: 22px;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #ffffff;
  font-weight: 900;
  background: var(--color-primary);
  border-radius: 8px;
}

.brand__logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  display: inline-block;
}

.navigation {
  display: flex;
  align-items: stretch;
  gap: 30px;
  height: 100%;
}

.navigation a {
  display: flex;
  align-items: center;
  color: #4c575e;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid transparent;
}

.navigation a.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

@media (max-width: 720px) {
  .app-header__inner {
    width: min(100% - 28px, 1240px);
  }

  .brand strong {
    font-size: 18px;
  }

  .navigation {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    justify-content: space-around;
    height: 58px;
    background: #ffffff;
    border-top: 1px solid var(--color-line);
  }

  .navigation a {
    font-size: 13px;
    border-bottom: 0;
  }
}
</style>
