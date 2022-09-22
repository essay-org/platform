import {request } from '@/utils/request'

export function getUserListPage(data) {
  return request({
    url: 'sys/user/page',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request(
    {
      url: 'sys/user/add',
      method: 'post',
      data,
    },
    {
      successMsg: '创建用户成功',
    },
  );
}

export function getUserInfo(params) {
  return request({
    url: 'sys/user/info',
    method: 'get',
    params,
  });
}

export function updateUser(data) {
  return request(
    {
      url: 'sys/user/update',
      method: 'post',
      data,
    },
    {
      successMsg: '修改用户成功',
    },
  );
}

export function updateUserPassword(data) {
  return request(
    {
      url: 'sys/user/password',
      method: 'post',
      data,
    },
    {
      successMsg: '操作成功',
    },
  );
}

export function deleteUsers(data) {
  return request({
    url: 'sys/user/delete',
    method: 'post',
    data
  })
}
