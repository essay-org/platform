import { isUrl } from '@/utils/index';
import RouterView from '@/layout/routerView/index.vue';
import NotFound from '@/views/error/404.vue';
import { Result } from 'ant-design-vue';
import { constantRouterComponents} from './asyncModules/index';
import router, { routes } from './index';
import { uniqueSlash } from '@/utils/index'

const filterAsyncRoute = (routes, parentRoute, lastNamePath) => {
  return routes.filter(item => item.type !== 2 && item.isShow && item.parerntId == parentRoute?.id).map(item => {
    const { router, viewPath, name, icon, orderNum, keepAlive } = item
    let fullPath = ''
    if(isUrl(router)) {
      fullPath = router
    } else {
      fullPath = router.startsWith('/') ? router : `/${router}`;
    }

    let realRoutePath = router
    if(parentRoute) {
      // 分割出子路由路径
      if(fullPath.startsWith(parentRoute?.router)) {
        realRoutePath = fullPath.split(parentRoute.router)[1]
      }
    }

    // 移除路径前面的斜杆
    realRoutePath = realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath;

    const route = {
      path: realRoutePath,
      name: fullPath,
      meta: {
        orderNum,
        title: name,
        type: item.type,
        perms: [],
        icon,
        namePath: lastNamePath.concat(fullPath),
        keepAlive,
      }
    }

    // 目录
    if(item.type === 0) {
      const children = filterAsyncRoute(routes, item, lastNamePath.concat(fullPath));
      // TODO: 功能确认
      if(children?.length) {
        route.component = RouterView
        route.children = children
        route.redirect = { name: children[0].name }
      } else {
        route.component = (
          <Result
            status="500"
            title={name}
            subTitle="目录类型菜单不是真实页面，请为当前目录添加页面级子菜单或更改当前菜单类型"
          ></Result>
        )
      }

      return route
    }

    // 页面
    if(item.type === 1) {
      const Component = constantRouterComponents[viewPath] || NotFound;
      route.component = Component

      // 获取扁平权限数组
      const perms = routes.filter((n) => n.parentId === item.id).flatMap(n => n.perms?.split(','));

      // 设置当前页面的权限
      if(route.meta && perms) {
        route.meta.perms = perms
      }

      return route
    }

    return undefined
  }).filter(item => !!item)
}

/**
 * 控制a-menu的open-keys，即控制左侧菜单应当展开哪些菜单
 * @param {*} routes 需要添加namePath的路由
 * @param {*} namePath
 * @param {*} parent
 */
const generatorNamePath = (routes, namePath, parent) => {
  routes.forEach(item => {
    if(item.children?.length) {
      if(item.meta && typeof item.name === 'string') {
        item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name]
        item.meta.fullPath = parent?.meta?.fullPath ? [parent.meta.fullPath, item.path].join('/') : item.path;
        item.meta.fullPath = uniqueSlash(item.meta.fullPath)

        generatorNamePath(item.children, item.meta.namePath, item)
      }
    } else {
      if(item.meta && typeof item.name === 'string') {
        item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name]
        item.meta.fullPath = parent?.meta?.fullPath ? [parent.meta.fullPath, item.path].join('/') : item.path;
        item.meta.fullPath = uniqueSlash(item.meta.fullPath)
      }
    }
  });
}

// 生成动态路由
export const generatorDynamicRouter = (asyncMenus) => {
  try {
    const routeList = filterAsyncRoute(asyncMenus)
    const layout = routes.find(item => item.name === 'Layout')

    // generatorNamePath()

    return {
      menus,
      routes: layout.children
    }
  } catch (error) {
    console.log('生成路由出错：', error)
    return {
      menus: [],
      routes: []
    }
  }
}
