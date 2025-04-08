import { createApp } from 'vue'
import App from './App.vue'
import "@renderer/assets/css/style.css"
import router from './router/index'

const app = createApp(App)

app.use(router).mount('#app')
