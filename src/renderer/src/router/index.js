import { createWebHashHistory, createRouter } from 'vue-router'

import ListView from '../views/List.vue'
// import AboutView from './AboutView.vue'

const routes = [
  {
    path: '/', component: ListView,
    meta: { keepAlive: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router