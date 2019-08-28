import {stringify} from 'qs';
import request from '@/utils/request';
import headerRequest from '@/utils/HeaderRequest';

// 用户登录
export function loginUser({username, password, service, ip, city}) {
  return request({
    url: '/v1.0/api/user/login',
    method: 'POST',
    data: {
      username,
      password,
      service,
      ip,
      city,
    },
  });
}

// 用户注册
export function registerUser(data) {
  return request({
    url: '/v2.0/api/user/register',
    method: 'POST',
    data:{...data},
  });
}

// 用户登出
export function logoutUser() {
  return request({url: '/v1.0/api/user/logout', method: 'GET'});
}

// 获取用户详细信息
export function getUserInfo() {
  return headerRequest({url: '/v2.0/api/user', method: 'GET'});
}
