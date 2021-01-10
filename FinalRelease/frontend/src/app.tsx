import React from 'react';
import {BasicLayoutProps, Settings as LayoutSettings} from '@ant-design/pro-layout';
import {notification} from 'antd';
import {history, RequestConfig} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {ResponseError} from 'umi-request';
import {jwtMonitor, monitorId, setMonitorId} from '@/utils/jwtMonitor'
import defaultSettings from '../config/defaultSettings';
import {jwtConfig} from "../config/jwtConfig";

const jwt = require('jsonwebtoken');

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = await jwtMonitor();
      if (token) {
        const decode = jwt.decode(token);
        setMonitorId(setInterval(jwtMonitor, jwtConfig.jwtMonitorRate, () => {
          clearInterval(monitorId);
          setMonitorId(0);
        }));
        const currentUser = {
          id: decode.id,
          username: decode.username,
          email: decode.email,
          password: decode.password,
          name: decode.name,
          gender: decode.gender,
          role: decode.role,
          school: decode.school,
          age: decode?.age,
          grade: decode?.grade,
          className: decode?.className,
          telephone: decode?.telephone,
          title: decode?.title,
        }
        return currentUser
      }
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  }
  //   try {
  //     const currentUser = await queryCurrent();
  //     return currentUser;
  //   } catch (error) {
  //     history.push('/user/login');
  //   }
  //   return undefined;
  // };
  // 如果是登录页面，不执行
  if (!(history.location.pathname === '/user/login' || history.location.pathname === '/user/register')) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
                         initialState,
                       }: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {currentUser} = initialState;
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!currentUser && (location.pathname !== '/user/login' && location.pathname !== '/user/register')) {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const {response} = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// @ts-ignore
export const request: RequestConfig = {
  errorHandler,
  credentials: 'include', // 默认请求是否带上cookie
  prefix: 'https://api.fourstring.dev',
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: true,
      };
    },
  },
  requestInterceptors: [
    // @ts-ignore
    async (url, options) => {
      // Due to cross domain restriction of Cookies, we use localStorage to store CSRFtoken.
      const accessToken: string | null = localStorage.getItem('access_token');
      const headers = {};
      if (accessToken) {
        // @ts-ignore
        headers.Authorization = `Bearer ${accessToken}`;
      }
      return {
        url,
        options: {...options, headers},
      };
    }
  ]
};

// const request: RequestMethod = extend({
//   errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie
// });
//
// request拦截器, 改变url 或 options.
// @ts-ignore
// request.interceptors.request.use( async (url, options) => {
//   // Due to cross domain restriction of Cookies, we use localStorage to store CSRFtoken.
//   const csrfToken: string | null = localStorage.getItem('csrf_token');
//   const accessToken: string | null = localStorage.getItem('access_token');
//   let headers;
//   if (csrfToken) {
//     headers = {
//       'X-CSRFToken': csrfToken
//     };
//   }
//   if (accessToken) {
//     // @ts-ignore
//     headers.Authorization = `Bearer ${accessToken}`;
//   }
//   if (url && ! url.endsWith('/')) {
//     url += '/';
//   }
//   return {
//     url,
//     options: { ...options, headers },
//   };
// })
//
// // response拦截器, 处理response
// request.interceptors.response.use((response) => {
//   const accessToken = response.headers.get('access_token');
//   if (accessToken) {
//     localStorage.setItem('access_token', accessToken);
//   }
//
//   const csrfToken = response.headers.get('X-CSRFToken');
//   if (csrfToken) {
//     localStorage.setItem('X-CSRFToken', csrfToken);
//   }
//   return response;
// });
//
//
// export request;
