module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum 页码
   * @param {number} pageSize 一页多少数据
   * @return 一个通用的分页结构对象
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    pageNum *= 1; // 确保为数字类型
    pageSize *= 1;
    const skipIndex = (pageNum - 1) * pageSize;
    return {
      page: {
        pageNum,
        pageSize,
      },
      skipIndex,
    };
  },
  /**
   * 按指定规则格式化日期对象，返回格式化后的字符串
   * @param {Date} date 日期对象
   * @param {string} rule 格式化规则
   * @return 格式化后的日期字符串
   */
  formateDate (date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss';

    // 年份不放进 obj 中循环来替换，是因为会受到补零操作的影响，2022 => 22
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, date.getFullYear());

    const obj = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    };

    for (const key in obj) {
      if (new RegExp(`(${key})`).test(fmt)) {
        const val = obj[key] + '';
        // ('00' + val).substring(val.length) 是一种补零的方法
        fmt = fmt.replace(RegExp.$1, ('00' + val).substring(val.length));
      }
    }

    return fmt;
  },
};
