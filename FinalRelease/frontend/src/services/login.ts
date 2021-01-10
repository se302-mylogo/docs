import {request} from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function login(params: LoginParamsType) {
  return request('/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function refreshToken() {
  return request('/auth/refresh', {
    method: 'GET',
    skipErrorHandler: true
  });
}

export async function outLogin() {
  return request('/auth/logout');
}
