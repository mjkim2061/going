import { ref } from 'vue'

const STORAGE_KEY = 'community-posts'
const posts = ref([])

function loadPosts() {
  try {
    posts.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    posts.value = []
  }
  // ensure default dummy posts exist (add missing defaults, keep user posts)
  const defaults = [
    {
      title: '광주의 숨은 명소 소개',
      writer: '관리자',
      content: '광주에서 꼭 가봐야 할 숨은 명소들을 소개합니다. 지역 특색과 추천 시간을 함께 안내해 드립니다.',
      password: 'admin',
    },
    {
      title: '맛집 추천 - 동구 편',
      writer: '관리자',
      content: '동구 지역의 인기 맛집 리스트와 메뉴 추천을 정리했습니다.',
      password: 'admin',
    },
    {
      title: '주말 코스 아이디어',
      writer: '관리자',
      content: '가벼운 주말 나들이 코스를 날짜별로 제안합니다. 가족 단위로 가기 좋은 장소 위주.',
      password: 'admin',
    },
  ]

  let added = false
  defaults.forEach((d, idx) => {
    const exists = posts.value.some((p) => p.title === d.title)
    if (!exists) {
      posts.value.push({
        id: Date.now() + idx + 1,
        title: d.title,
        writer: d.writer,
        content: d.content,
        password: d.password,
        createdAt: getCurrentDate(),
      })
      added = true
    }
  })

  if (added) savePosts()
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
}

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')

  return `${year}.${month}.${day} ${hour}:${minute}`
}

function addPost({ title, writer, content, password }) {
  const newPost = {
    id: Date.now(),
    title,
    writer,
    content,
    password,
    createdAt: getCurrentDate(),
  }

  posts.value.unshift(newPost)
  savePosts()
  return newPost
}

function updatePost(id, { title, writer, content }) {
  const post = posts.value.find((item) => item.id === Number(id))
  if (!post) return false

  post.title = title
  post.writer = writer
  post.content = content
  savePosts()
  return true
}

function deletePost(id) {
  posts.value = posts.value.filter((post) => post.id !== Number(id))
  savePosts()
}

function checkPassword(id, password) {
  const post = posts.value.find((item) => item.id === Number(id))
  return Boolean(post && post.password === password)
}

function getPost(id) {
  return posts.value.find((post) => post.id === Number(id))
}

export function useCommunity() {
  loadPosts()

  return {
    posts,
    loadPosts,
    addPost,
    updatePost,
    deletePost,
    checkPassword,
    getPost,
  }
}
