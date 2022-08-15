import { createRouter, createWebHashHistory, isNavigationFailure } from "vue-router";
import { useUserStore } from '@/store/modules/user';
import NProgress from 'nprogress';
import Layout from "@/layout/index.vue";
import Login from '@/views/login/index.vue';
// import Welcome from '@/views/dashboard/welcome/index.vue';

// 无需登录验证的路由
const whiteNameList = ['Login', 'error', 'error-404'];

const createRouterGuards = function(router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    const token = window.localStorage.getItem('ACCESS_TOKEN')
    // 已经登录
    if(token) {
      const hasRoute = router.hasRoute(to.name)

      if(to.name === 'Login') {
        next({path: '/dashboard/welcome'})
        NProgress.done()
        // debugger
      } else {
        if(userStore.menus.length === 0) {
          // 获取最新菜单
          await userStore.afterLogin()
          // debugger
          if(!hasRoute) {
            // const redirect = decodeURIComponent(from.query.redirect || '')
            next({...to, replace: true})
          }

          // 在白名单
          if(whiteNameList.some((n) => n === to.name)) {
            next()
          }
        } else {
          next()
        }
      }
    } else {
      if(whiteNameList.some((n) => n === to.name)) {
        next()
      } else {
        next({ name: 'Login', query: { redirect: to.fullPath }, replace: true });
        NProgress.done()
      }
    }
  });


  router.afterEach((to, from, failure) => {
    if(isNavigationFailure(failure)) {
      console.error('路由导航失败：', failure)
    }

    NProgress.done()
  })

  router.onError(error => {
    console.log('路由错误：', error)
  })
}

export const loginRoute = [{
  path: '/login',
  name: 'Login',
  meta: {
    title: '登录',
  },
  component: Login
}]

export const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/dashboard/welcome", // 登录成功，默认跳转到面板页面
    component: Layout,
    meta: {
      title: "首页",
    },
  },
  ...loginRoute
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


// 移除路由表中有权限设置的路由
export const resetRouter = () => {
  router.getRoutes().forEach(route => {
    const { name } = route
    if(name && !whiteNameList.some(n => n === name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
};

export async function setupRouter(app) {
  // TODO: 位置确认
  createRouterGuards(router)
  app.use(router)
  await router.isReady()
}

export default router
