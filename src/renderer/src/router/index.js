import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/', component: () => import('../views/Home.vue'),
    name: 'home'
  },
  {
    path: '/setting', component: () => import('../views/Setting.vue'),
    name: 'setting',
  },
  {
    path: '/local', component: () => import('../views/Local.vue'),
    name: 'local',
  },
  {
    path: '/favorites', component: () => import('../views/Favorites.vue'),
    name: 'favorites',
  },
  {
    path: '/cursor', component: () => import('../views/cursor.vue'),
    name: 'cursor',
  },
  {
    path: '/cursorWindow', component: () => import('../windowPage/cursorWindow.vue'),
    name: 'cursorWindow',
  },
  {
    path: '/liveWindow', component: () => import('../windowPage/liveWindow.vue'),
    name: 'liveWindow',
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router