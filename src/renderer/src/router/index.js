import { createWebHashHistory, createRouter } from 'vue-router'

import ListView from '../views/wallpaperList.vue'

const routes = [
  {
    path: '/', component: ListView,
    name: 'list'
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router