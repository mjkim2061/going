<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCommunity } from '@/composables/useCommunity'

const route = useRoute()
const router = useRouter()
const { getPost, updatePost, deletePost, checkPassword } = useCommunity()

const password = ref('')
const isEditing = ref(false)
const post = computed(() => getPost(route.params.id))

const form = reactive({
  title: '',
  writer: '',
  content: '',
})

function requirePassword() {
  if (!checkPassword(route.params.id, password.value)) {
    alert('비밀번호가 일치하지 않습니다.')
    return false
  }

  return true
}

function startEdit() {
  if (!post.value || !requirePassword()) return

  form.title = post.value.title
  form.writer = post.value.writer
  form.content = post.value.content
  isEditing.value = true
}

// Auto-start edit if navigated with query edit and pwd
if (route.query && route.query.edit === '1' && route.query.pwd) {
  // set password and attempt to start editing after next tick
  password.value = route.query.pwd
  // attempt startEdit; if password matches, startEdit will set isEditing
  // wrap in setTimeout to ensure computed post is ready
  setTimeout(() => {
    startEdit()
    // clear query params from URL to avoid re-trigger
    router.replace({ name: 'community-detail', params: { id: route.params.id } })
  }, 50)
}

function submitEdit() {
  if (!form.title.trim() || !form.writer.trim() || !form.content.trim()) {
    alert('제목, 작성자, 내용을 모두 입력해 주세요.')
    return
  }

  updatePost(route.params.id, {
    title: form.title.trim(),
    writer: form.writer.trim(),
    content: form.content.trim(),
  })

  isEditing.value = false
  password.value = ''
}

function removePost() {
  if (!requirePassword()) return
  if (!confirm('게시글을 삭제할까요?')) return

  deletePost(route.params.id)
  router.push('/community')
}
</script>

<template>
  <section class="page-section">
    <div class="container narrow">
      <div v-if="post && !isEditing" class="detail-card">
        <div class="detail-top">
          <RouterLink to="/community" class="back-link">커뮤니티 목록</RouterLink>
          <RouterLink to="/community" class="primary-button list-button">목록으로</RouterLink>
        </div>
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>{{ post.writer }}</span>
          <time>{{ post.createdAt }}</time>
        </div>
        <p class="content">{{ post.content }}</p>

        <div class="password-box">
          <input v-model="password" type="password" placeholder="수정/삭제 비밀번호" />
          <button type="button" class="secondary-button" @click="startEdit">수정</button>
          <button type="button" class="danger-button" @click="removePost">삭제</button>
        </div>
      </div>

      <form v-else-if="post && isEditing" class="detail-card edit-form" @submit.prevent="submitEdit">
        <h1>게시글 수정</h1>
        <label>
          제목
          <input v-model="form.title" type="text" maxlength="80" />
        </label>
        <label>
          작성자
          <input v-model="form.writer" type="text" maxlength="30" />
        </label>
        <label>
          내용
          <textarea v-model="form.content" rows="10"></textarea>
        </label>

        <div class="actions">
          <button type="button" class="secondary-button" @click="isEditing = false">취소</button>
          <button type="submit" class="primary-button">저장</button>
        </div>
      </form>

      <div v-else class="detail-card not-found">
        <h1>게시글을 찾을 수 없습니다.</h1>
        <RouterLink to="/community" class="primary-button">목록으로 이동</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.narrow {
  max-width: 860px;
}

.detail-card {
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.back-link {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-button {
  padding: 8px 14px;
  font-weight: 800;
  border-radius: 8px;
}

h1 {
  margin: 18px 0 12px;
  font-size: 36px;
}

.meta {
  display: flex;
  gap: 14px;
  color: var(--color-muted);
}

.content {
  min-height: 220px;
  margin: 30px 0;
  color: #3c464c;
  line-height: 1.9;
  white-space: pre-wrap;
}

.password-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e3ecee;
}

input,
textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #d6dde1;
  border-radius: 8px;
}

.password-box input {
  flex: 1;
  min-width: 200px;
}

.danger-button {
  min-height: 46px;
  padding: 0 18px;
  color: #ffffff;
  font-weight: 800;
  background: #c2410c;
  border: 1px solid #c2410c;
  border-radius: 8px;
}

.edit-form {
  display: grid;
  gap: 18px;
}

.edit-form label {
  font-weight: 800;
}

.edit-form input,
.edit-form textarea {
  margin-top: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  min-height: 46px;
}
</style>
