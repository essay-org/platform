import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { generatorDynamicRouter } from '@/router/generatorRouter.jsx'
import { logout, getInfo, permmenu } from '@/api/account'
import { login } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    name: 'admin',
    avatar: '',
    menus: [],
    perms: [], // 权限
    userInfo: {}
  }),
  getters: {

  },
  actions: {
    resetToken() {
      this.token = window.localStorage.getItem('ACCESS_TOKEN')
      this.name = ''
      this.avatar = ''
      this.menus = []
      this.perms = []
      this.userInfo = {}
      window.localStorage.clear('ACCESS_TOKEN')
    },
    setToken(token = '') {
      window.localStorage.setItem('ACCESS_TOKEN', token)
    },
    async afterLogin() {
      const [ userInfo, {perms, menus}]  = await Promise.all([getInfo(), permmenu()]);
      this.perms = perms
      this.name = userInfo.name
      this.avatar = userInfo.headImg
      this.userInfo = userInfo

      // 生成路由
      const generatorResult = generatorDynamicRouter(menus)
      this.menus = generatorResult.menus.filter(item => !item.meta?.hideInMenu)

      return {
        menus,
        perms,
        userInfo
      }
    },
    async login(params) {
      try {
        const { data } = await login(params)
        this.setToken(data.token)
        return this.afterLogin()
      } catch(error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      await logout()
      this.resetToken()
      resetRouter()
    }
  },
})
