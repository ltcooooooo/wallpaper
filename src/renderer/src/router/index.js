import { createWebHashHistory, createRouter } from 'vue-router'

import ListView from '../views/List.vue'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router