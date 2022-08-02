import RouterView from '@/layout/routerView/index.vue';
import Welcome from '@/views/dashboard/welcome/index.vue';
import Error404 from '@/views/error/404.vue';



export const dashboard = {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard/welcome',
  component: RouterView,
  meta: {
    title: '控制面板',
    icon: 'icon-yibiaopan',
  },
  children: [
    {
      path: 'welcome',
      name: 'DashboardWelcome',
      meta: {
        title: '首页',
        icon: 'icon-shouye'
      },
      component: Welcome
    }
  ]
}

export const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: Error404,
  redirect: '/error/404',
  meta: {
    title: 'NotFound',
    hideInMenu: true,
    hideInTabs: true,
  },
}

export const errorRoute =
{
  path: '/error',
  name: 'Error',
  redirect: '/error/404',
  component: RouterView,
  meta: {
    title: '错误页',
    icon: 'EditOutlined',
    hideInMenu: true,
    hideInTabs: true,
  },
  children: [
    {
      path: '404',
      name: 'PageNotFound',
      meta: {
        title: '404',
        icon: 'UserOutlined',
        hideInTabs: true,
        hideInMenu: true,
      },
      component: Error404,
    },
  ],
}

export const redirectRoute = {
  path: '/redirect',
  component: RouterView,
  name: 'RedirectTo',
  meta: {
    title: 'redirect',
    hideInMenu: true,
    hideInBreadcrumb: true
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: 'RedirectTo',
      meta: {
        title: 'redirect',
        hideInMenu: true,
      },
      beforeEnter(to) {
        const { params, query} = to
        const { path, redirectType = 'path'} = params
        // TODO: 功能确认
        Reflect.deleteProperty(params, 'path')
        Reflect.deleteProperty(params, '_redirect_type')
        const fixPath = Array.isArray(path) ? path.join('/') : path
        setTimeout(() => {
          if(redirectType === 'name') {
            router.replace({
              name: fixPath,
              query,
              params
            })
          } else {
            router.replace({
              path: fixPath.startsWith('/') ? fixPath : `/${fixPath}`,
              query
            })
          }
        })

        return true
      }
    }
  ]
}


export default [dashboard, notFound, errorRoute, redirectRoute]
