import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/travel',
    name: 'travel-list',
    component: () => import('@/views/TravelListView.vue'),
  },
  {
    path: '/travel/:id',
    name: 'travel-detail',
    component: () => import('@/views/TravelDetailView.vue'),
  },
  {
    path: '/course',
    name: 'course',
    component: () => import('@/views/CourseView.vue'),
  },
  {
    path: '/course/result',
    name: 'course-result',
    component: () => import('@/views/CourseResultView.vue'),
  },
  {
    path: '/saved-courses',
    name: 'saved-courses',
    component: () => import('@/views/SavedCoursesView.vue'),
  },
  {
    path: '/community',
    name: 'community-list',
    component: () => import('@/views/CommunityListView.vue'),
  },
  {
    path: '/community/write',
    name: 'community-write',
    component: () => import('@/views/CommunityWriteView.vue'),
  },
  {
    path: '/community/:id',
    name: 'community-detail',
    component: () => import('@/views/CommunityDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
