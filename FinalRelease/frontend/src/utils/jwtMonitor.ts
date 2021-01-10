// eslint-disable-next-line import/no-unresolved
import {jwtConfig} from "../../config/jwtConfig";
import {refreshToken} from "@/services/login";

const jwt = require('jsonwebtoken');

export async function jwtMonitor(onFailed?: () => void): Promise<string> {
  const accessToken: string | null = localStorage.getItem('access_token');
  if (!accessToken) return '';
  const decode = jwt.decode(accessToken);
  if (!decode) {
    return ''
  }
  if (Date.now() - decode.exp * 1000 <= jwtConfig.jwtRefreshThreshold) {
    return accessToken;
  }
  const refresh = await refreshToken();
  //const refresh = true
  if (refresh.status === 200) {
    const {data} = refresh;
    localStorage.setItem('access_token', data.accessToken);
    return data.accessToken;
  }
  // 刷新失败
  localStorage.removeItem('access_token');
  if (onFailed) onFailed();
  return '';
}

export let monitorId: number = 0;

export function setMonitorId(value: number) {
  monitorId = value;
}
