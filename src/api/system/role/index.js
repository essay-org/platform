import { request } from '@/utils/request'

export function getRoleInfo(params) {
  return request({
    url: 'sys/role/info',
    method: 'get',
    params
  })
}


export function getRoleList(data) {
  return request({
    url: 'sys/role/list',
    method: 'get',
    data
  })
}



export function getRoleListByPage(params) {
  return request({
    url: 'sys/role/page',
    method: 'get',
    params
  })
}



export function createRole(params) {
  return request({
    url: 'sys/role/add',
    method: 'get',
    params
  }, {
    successMsg: '创建角色成功'
  })
}



export function updateRole(params) {
  return request({
    url: 'sys/role/update',
    method: 'get',
    params
  }, {
    successMsg: '更新角色成功'
  })
}

export function deleteRole(data) {
  return request({
    url: 'sys/role/delete',
    method: 'post',
    data
  }, {
    successMsg: '删除角色成功'
  })
}
