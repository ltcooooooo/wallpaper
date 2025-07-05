import { createApp } from 'vue'
import App from './App.vue'
import "@renderer/assets/css/style.css"
import router from './router/index'
import { createPinia } from 'pinia'
import 'animate.css';

const pinia = createPinia()
const app = createApp(App)

app.use(router).use(pinia).mount('#app')
