import { createApp } from 'vue'
import App from './App.vue'
import "@renderer/assets/css/style.scss"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-message.css';
import { ElMessage, ElMessageBox } from 'element-plus';

const app = createApp(App)
app.use(ElMessage).use(ElMessageBox)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
