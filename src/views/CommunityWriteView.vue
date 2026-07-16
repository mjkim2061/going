<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useCommunity } from '@/composables/useCommunity'

const router = useRouter()
const { addPost } = useCommunity()

const form = reactive({
  title: '',
  writer: '',
  password: '',
  content: '',
})

function submitPost() {
  if (!form.title.trim() || !form.writer.trim() || !form.password.trim() || !form.content.trim()) {
    alert('제목, 작성자, 비밀번호, 내용을 모두 입력해 주세요.')
    return
  }

  const post = addPost({
    title: form.title.trim(),
    writer: form.writer.trim(),
    password: form.password,
    content: form.content.trim(),
  })

  // reset writer and password fields per requirement
  form.writer = ''
  form.password = ''

  router.push({ name: 'community-detail', params: { id: post.id } })
}
</script>

<template>
  <section class="page-section">
    <div class="container narrow">
      <h1>게시글 작성</h1>

      <form class="post-form" @submit.prevent="submitPost">
        <label>
          제목
          <input v-model="form.title" type="text" maxlength="80" />
        </label>

        <div class="form-grid">
          <label>
            작성자
            <input v-model="form.writer" type="text" maxlength="30" />
          </label>
          <label>
            비밀번호
            <input v-model="form.password" type="password" maxlength="30" />
          </label>
        </div>

        <label>
          내용
          <textarea v-model="form.content" rows="10"></textarea>
        </label>

        <div class="actions">
          <RouterLink to="/community" class="secondary-button">취소</RouterLink>
          <button type="submit" class="primary-button">등록</button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.narrow {
  max-width: 820px;
}

h1 {
  margin: 0 0 24px;
  font-size: 36px;
}

.post-form {
  display: grid;
  gap: 18px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e3ecee;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label {
  font-weight: 800;
}

input,
textarea {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 1px solid #d6dde1;
  border-radius: 8px;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  min-height: 46px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
