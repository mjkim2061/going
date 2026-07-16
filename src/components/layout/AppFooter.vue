<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="footer-brand">
        <img src="/logo-gajaing.png" alt="가자잉 로고" class="footer-logo" />
        <div>
          <strong>가자잉</strong>
          <p>관광정보, 추천 코스, 커뮤니티를 한 곳에서 이용하세요.</p>
        </div>
      </div>

      <nav aria-label="하단 메뉴">
        <RouterLink to="/travel">관광정보</RouterLink>
        <RouterLink to="/course">여행코스</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
      </nav>
    </div>

    <p class="copyright">© 2026 가자잉</p>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #ffffff;
  border-top: 1px solid var(--color-line);
}

.app-footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  padding: 38px 0;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 8px;
}

.app-footer strong {
  color: var(--color-primary);
  font-size: 22px;
}

.app-footer p {
  margin: 8px 0 0;
  color: var(--color-muted);
}

.app-footer nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
}

.app-footer a {
  color: #4f5a61;
  font-weight: 700;
  text-decoration: none;
}

.copyright {
  margin: 0;
  padding: 16px;
  text-align: center;
  background: #f3f6f8;
  border-top: 1px solid var(--color-line);
}

@media (max-width: 720px) {
  .app-footer {
    padding-bottom: 58px;
  }

  .app-footer__inner {
    display: block;
    width: min(100% - 28px, 1240px);
  }

  .app-footer nav {
    margin-top: 20px;
  }
}
</style>
