import RouterView from '@/layout/routerView/index.vue';
import Welcome from '@/views/dashboard/welcome/index.vue';
import Error404 from '@/views/error/404.vue';

const routes = [
  {
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
  },
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
  },
  {
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
]


