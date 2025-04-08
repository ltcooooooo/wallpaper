import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from '../views/Home.vue'
// import AboutView from './AboutView.vue'

const routes = [
  {
    path: '/', component: HomeView,
    meta: { keepAlive: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router