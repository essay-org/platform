import axios from 'axios'
import { message} from 'ant-design-vue'

const UNKNOWN_ERROR = '未知错误，请重试';

const service = axios.create({
  timeout: 6000,
})


service.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN')
  if(token && config.headers) {
    config.headers['Authorization'] = token
  }

  return config
}, (error) => {
  Promise.reject(error)
})


service.interceptors.response.use((response) => {
  // 全局错误提示
  const res = response.data
  if(res.code !== 200) {
    message.error(res.message || UNKNOWN_ERROR)

    // 无效的token
    if(res.code === 11001 || res.code === 11002) {
      window.localStorage.clear()
      window.location.reload()
    }
    return Promise.reject(res.message || UNKNOWN_ERROR)
  } else {
    return res
  }
}, (error) => {
  const errorMsg = error?.response?.data?.message ?? UNKNOWN_ERROR
  message.error(errorMsg)
  error.message = errorMsg
  return Promise.reject(error)
})


export const request = async (config, options) => {
  try {
    const { successMsg, errorMsg, permCode, isMock, isGetDataDirectly = true } = options
    if(permCode) {

    }
  } catch(error) {

  }
}
