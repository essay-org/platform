import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import { setupRouter } from './router/index'
import 'ant-design-vue/dist/antd.css'
import { steupStore } from './store/index'
const app = createApp(App)

async function setupApp() {
  app.use(Antd)
  steupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
