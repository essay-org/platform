import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import store from '@/store'
import API from '@/api'
import util from '@/utils/util'

const routes = [{
  name: 'home',
  path: '/',
  meta: {
    title: '首页'
  },
  component: Home,
  redirect: '/welcome',  // 重定向
  children: [{
    name: 'welcome',
    path: '/welcome',
    meta: {
      title: '欢迎页'
    },
    component: () => import('@/views/Welcome.vue')  // 按需加载
  }, 
  /* {
    name: 'user',
    path: '/system/user',
    meta: {
      title: '用户管理'
    },
    component: () => import('@/views/User.vue')
  }, {
    name: 'menu',
    path: '/system/menu',
    meta: {
      title: '菜单管理'
    },
    component: () => import('@/views/Menu.vue')
  }, {
    name: 'role',
    path: '/system/role',
    meta: {
      title: '角色管理'
    },
    component: () => import('@/views/Role.vue')
  }, {
    name: 'dept',
    path: '/system/dept',
    meta: {
      title: '部门管理'
    },
    component: () => import('@/views/Dept.vue')
  } */]
}, {
  name: 'login',
  path: '/login',
  meta: {
    title: '登录'
  },
  component: () => import('@/views/Login.vue')  // 按需加载
}, {
  name: '404',
  path: '/404',
  meta: {
    title: '页面不存在'
  },
  component: () => import('@/views/404.vue')
}]

const router = createRouter({
  history: createWebHashHistory(),  // hash 模式路由
  routes
})

// 导航守卫，用于判断路径是否存在以及设置页面 title
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()  // 页面存在，next 进入
  } else {  // 要访问的页面不存在，没有在 routes 中定义过
    next('/404')  // 跳转到 404 页面
  }
})

// 判断当前地址是否可以访问
function checkPermission (path) {
  return router.getRoutes().some(route => route.path === path)
}

async function loadAsyncRoutes () {
  const userInfo = store.state.userInfo
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPermissionList()
      const routes = util.generateRoute(menuList)
      routes.map(route => {
        // 这里不能用 @，且要用变量形式放入 import 中，否则加载不出来
        const url = `@/views/${route.component}.vue`
        route.component = () => import(/* @vite-ignore */ url)
        router.addRoute('home', route)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

// 这里只会加载一次，如果加载时未登录，token 为空就无法动态加载，所以需要在登录时也调用一次该方法
loadAsyncRoutes()

export default router
