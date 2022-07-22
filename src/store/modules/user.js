import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: '',
    name: 'admin',
    avatar: '',
    menus: [],
    userInfo: {}
  }),
  getters: {

  },
  actions: {

  },

})
