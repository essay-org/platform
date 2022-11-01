import { request } from '@/utils/request'

export function getDeptList() {
  return request({
    url: 'sys/dept/list',
    method: 'get'
  })
}

export function moveDeptList(data) {
  return request({
    url: 'sys/dept/move',
    method: 'post',
    data
  })
}

export function deleteDept(data) {
  return request({
    url: 'sys/dept/delete',
    method: 'post',
    data
  }, {
    successMsg: '删除成功'
  })
}


export function updateDept(data) {
  return request({
    url: 'sys/dept/update',
    method: 'post',
    data,
  });
}

export function createDept(data) {
  return request({
    url: 'sys/dept/add',
    method: 'post',
    data
  })
}


export function getDeptInfo(params) {
  return request({
    url: 'sys/dept/info',
    method: 'get',
    params
  })
}

export function transferDept(data) {
  return request({
    url: 'sys/dept/transfer',
    method: 'post',
    data
  })
}
