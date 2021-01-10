/* eslint no-useless-escape:0 import/prefer-default-export:0 */
/* eslint-disable */
import {UploadFile} from "antd/es/upload/interface";

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const transMedia = (media: Media): UploadFile<any> => {
  const thumbUrl = media.filename.split('.')[-1] === 'jpg' || 'jpeg' || 'png' ? media.url : undefined;
  const trans: UploadFile = {
    uid: media.id.toString(),
    name: media.filename,
    size: media.size,
    type: "picture",
    url: media.downloadUrl,
    thumbUrl,
  }
  return trans
}

export const setTimeRange = (status: number) => {
  let available_since: undefined | string = undefined;
  let available_before: undefined | string = undefined;
  let deadline_since: undefined | string = undefined;
  let deadline_before: undefined | string = undefined;
  if (status === 1) { // lock
    available_since = Date.now().toString();
  } else if (status === 2) { // open
    deadline_since = available_before = Date.now().toString();
  } else {
    deadline_before = Date.now().toString();
  }
  return {
    available_since,
    available_before,
    deadline_since,
    deadline_before,
  }
}

export const removeUndefined = (obj: Object): Object => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeUndefined(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

export const parseURL: (url: string) => { id: number } = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    id: parseInt((a.pathname.match(/([^/?#]+)$/i) || [, ''])[1] as string)
  }
}
