const env = import.meta.env.MODE || 'production'  // 给一个线上的默认值，防止上线时出现意外
const EnvConfig = {
  development: {
    baseApi: '/api',  // 举例说明
    mockApi: '//dev.mock.com/api'
  },
  test: {
    baseApi: '//test.demo.com/api',
    mockApi: '//test.mock.com/api'
  },
  production: {
    baseApi: '//pro.demo.com/api',
    mockApi: '//pro.mock.com/api'
  }
}

export default {
  env,
  mock: false,  // 是否用 mock 接口
  namespace: 'manager',  // storage 用到的命名空间
  ...EnvConfig[env]
}
