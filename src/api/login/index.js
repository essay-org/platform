import { request } from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data,
  }, {
    isGetDataDirectly: false
  })
}


export function getImageCaptcha(params) {
  return request({
    url: 'captcha/img',
    method: 'get',
    params
  })
}
