import moment from 'moment';
import { parse } from 'qs';
import appConfig from '@/app.config';

/** 深度优先搜索处理 func */
export const DFSFunc = (tree: any[] = [], childKey: string = 'children', func: (treeNode: any) => void) => {
  tree.forEach((node) => {
    if (node[childKey]) {
      DFSFunc(node[childKey], childKey, func);
    }

    func(node);
  });
};

/**
 * 获取 url params
 */
export const getUrlParams = (keys?: string[]) => {
  const urlParams = parse(window.location.search.split('?')[1]);

  if (keys) {
    const target: { [key: string]: string } = {};
    keys.forEach((el) => {
      target[el] = urlParams[el] || '';
    });

    return target;
  }

  return urlParams;
};

/** 给接口增加统一前缀 */
export const addAPIPrefix = (api: string) => {
  const origin = '';
  if (/^(https?:)?\/\//.test(api)) return api;
  if (!/^\//.test(api)) {
    api = `/${api}`;
  }

  return `${origin}${appConfig.apiPrefix}${api}`;
};

/** 将 options 转换为 map 映射，用于渲染 */
export const optionsToLabelMap = (options: IOption<any>[]) => {
  return options.reduce((prev, curr) => {
    prev[curr.value] = curr.label;
    return prev;
  }, {} as Record<string, string>);
};

/** 使用浏览器原生的方法进行 base64 编码 */
export const base64Encode = (str: string) => {
  return window.btoa(window.unescape(window.encodeURIComponent(str)));
};

/** 使用浏览器原生方法进行 base64 解码 */
export const base64Decode = (str: string) => {
  return window.decodeURIComponent(window.escape(window.atob(str)));
};

/** 标准化 日期+时间 字符串输出 */
export const datetimeCellRender = (str: string) => {
  return (str && moment(str).format('YYYY-MM-DD HH:mm:ss')) || '';
};

/** 标准化 日期 字符串 输出 */
export const dateCellRender = (str: string) => {
  return (str && moment(str).format('YYYY-MM-DD')) || '';
};
/**
 * 获取发布环境name
 */
export const getEnvName = (envList: any[] = [], text: string) => {
  const namesArr: any[] = [];
  if (text?.indexOf(',') > -1) {
    const list = text?.split(',') || [];
    envList?.forEach((item: any) => {
      list?.forEach((v: any) => {
        if (item?.envCode === v) {
          namesArr.push(item.envName);
        }
      });
    });
    return namesArr.join(',');
  }

  return (envList as any).find((v: any) => v.envCode === text)?.envName;
};

// 处理时间 让时间倒叙排列
export const sortTime = (arr: any) => {
  (arr || []).sort((a: any, b: any) => {
    return moment(a.time).unix() - moment(b.time).unix();
  });
  return arr
}
