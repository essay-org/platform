import { request } from '@/utils/request'

export function getMenuList() {
  return request({
    url: 'sys/menu/list',
    method: 'get'
  })
}

export function getMenuInfo(params) {
  return request({
    url: 'sys/menu/info',
    method: 'get',
    params
  })
}


export function createMenu(data) {
  return request({
    url: 'sys/menu/add',
    method: 'post',
    data
  }, {
    successMsg: '创建成功'
  })
}

export function updateMenu(data) {
  return request({
    url: 'sys/menu/update',
    method: 'post',
    data
  }, {
    successMsg: '更新成功'
  })
}


export function deleteMenu(data) {
  return request({
    url: 'sys/menu/delete',
    method: 'post',
    data
  }, {
    successMsg: '删除成功'
  })
}
