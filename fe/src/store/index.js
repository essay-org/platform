/**
 * vuex 入口文件
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage' // vuex 配合 storage 实现持久存储

const state = {
  userInfo: storage.getItem('userInfo') || {}, // 获取用户信息，如果取不到就到 storage 中取
  menuList: storage.getItem('menuList') || [],
  actionList: storage.getItem('actionList') || [],
  noticeCount: 0
}

export default createStore({
  state,
  mutations
})
