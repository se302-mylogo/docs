import {request} from 'umi';
import {UserRegisterParams} from "@/pages/user/Register";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

export async function register(params: UserRegisterParams): Promise<any> {
  return request('/auth/register', {
    method: 'POST',
    data: params,
  });
}
