<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCommunity } from '@/composables/useCommunity'

const router = useRouter()
const { posts, checkPassword, deletePost } = useCommunity()
const keyword = ref('')

const filteredPosts = computed(() => {
  const value = keyword.value.trim().toLocaleLowerCase('ko')
  if (!value) return posts.value

  return posts.value.filter(
    (post) =>
      post.title.toLocaleLowerCase('ko').includes(value) ||
      post.writer.toLocaleLowerCase('ko').includes(value) ||
      post.content.toLocaleLowerCase('ko').includes(value),
  )
})

function openDetail(post) {
  router.push({ name: 'community-detail', params: { id: post.id } })
}

async function onEdit(post) {
  const pwd = window.prompt('수정 비밀번호를 입력하세요')
  if (pwd == null) return
  if (!checkPassword(post.id, pwd)) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  // pass pwd as query so detail view auto-starts edit
  router.push({ name: 'community-detail', params: { id: post.id }, query: { edit: '1', pwd } })
}

async function onDelete(post) {
  const pwd = window.prompt('삭제 비밀번호를 입력하세요')
  if (pwd == null) return
  if (!checkPassword(post.id, pwd)) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  if (!confirm('게시글을 삭제하시겠습니까?')) return
  deletePost(post.id)
}
</script>

<template>
  <section class="page-section community-page">
    <div class="container">
      <header class="page-heading">
        <div>
          <h1>커뮤니티</h1>
          <p>여행 후기와 질문을 자유롭게 나눠보세요.</p>
        </div>
        <RouterLink to="/community/write" class="primary-button">게시글 작성</RouterLink>
      </header>

      <form class="search-box" @submit.prevent>
        <input v-model="keyword" type="search" placeholder="제목, 작성자, 내용 검색" />
      </form>

      <div v-if="filteredPosts.length === 0" class="empty">
        아직 게시글이 없습니다. 첫 여행 이야기를 남겨보세요.
      </div>

      <div v-else class="post-list">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="post-card"
          @click="openDetail(post)"
        >
          <div class="post-main">
            <h2>{{ post.title }}</h2>
            <p>{{ post.content }}</p>
          </div>
          <footer>
            <span>{{ post.writer }}</span>
            <time>{{ post.createdAt }}</time>
          </footer>

          <div class="action-btns" @click.stop>
            <button class="icon-btn edit" @click="onEdit(post)" aria-label="수정"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn delete" @click="onDelete(post)" aria-label="삭제"><i class="fa-solid fa-trash"></i></button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.page-heading h1 {
  margin: 0;
  font-size: 38px;
}

.page-heading p {
  color: var(--color-muted);
}

.search-box input {
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #d6dde1;
  border-radius: 8px;
}

.empty,
.post-card {
  margin-top: 18px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.empty {
  color: var(--color-muted);
  text-align: center;
}

.post-list {
  display: grid;
  gap: 14px;
  margin-top: 22px;
}

.post-card {
  display: block;
  margin-top: 0;
  color: inherit;
  text-decoration: none;
  position: relative;
}

.post-card .action-btns {
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 120ms ease;
}

.post-card:hover .action-btns {
  opacity: 1;
}

.post-card .icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  color: var(--color-primary);
}

.post-card .icon-btn.delete {
  color: #c2410c;
}

.post-card h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

.post-card p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-card footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  color: var(--color-muted);
  font-size: 14px;
}

@media (max-width: 640px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
