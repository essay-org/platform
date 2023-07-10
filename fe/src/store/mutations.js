/**
 * 业务层数据提交文件
 */
import storage from '../utils/storage'

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  },
  saveUserMenu(state, menuList) {
    state.menuList = menuList
    storage.setItem('menuList', menuList)
  },
  saveUserAction(state, actionList) {
    state.actionList = actionList
    storage.setItem('actionList', actionList)
  },
  saveNoticeCount(state, noticeCount) {
    state.noticeCount = noticeCount
  }
}
