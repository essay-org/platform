/**
 * 工具函数封装
 */
import dayjs from 'dayjs'
export default {
  /**
   * 按指定规则格式化日期对象，返回格式化后的字符串
   * @param {Date} date 日期对象
   * @param {string} rule 格式化规则
   * @returns 格式化后的日期字符串
   */
  formateDate (date, rule = 'YYYY-MM-DD hh:mm:ss') {
    return dayjs(date).format(rule)
  },
  generateRoute (menuList) {
    const routes = []
    const deepList = list => {
      while (list.length) {
        const item = list.pop()
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName
            },
            component: item.component
          })
        }
        if (item.children && !item.action) {
          deepList(item.children)
        }
      }
    }
    deepList(menuList)
    return routes
  }
}
