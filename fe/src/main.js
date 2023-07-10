import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import request from './utils/request'
import api from './api'
import storage from './utils/storage'
import packages from '../packages'

const app = createApp(App)
app.use(router)  // 引入 vue-router 并挂载到 app 实例上
app.use(store)  // 引入 vuex 并挂载到 app 实例上
app.use(ElementPlus)
app.use(packages)  // app.use 会调用插件的 install 方法

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// app.config.globalProperties 可以往全局实例挂载东西
app.config.globalProperties.$request = request  // 以后可以通过 vm.$request 访问 request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage

// 权限控制全局可用
app.directive('has', {
  // el 是指令绑定的 dom 元素，binding 包含指令的各项参数如 v-has:add="'user-create'" 的 add 和 user-create
  beforeMount: (el, binding) => {
    const userAction = storage.getItem('actionList')  // 获取用户按钮权限
    const value = binding.value  // 指令传过来的值
    if (!userAction.includes(value)) {  // 判断是否有权限，没有就不显示按钮
      el.style = 'display: none'
      setTimeout(() => {  // beforeMount 时还没有挂载，通过 setTimeout 宏任务等挂载后再 remove 掉
        el.parentNode.removeChild(el)
      })
    }
  }
})

app.mount('#app')
