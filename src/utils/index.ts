import { parse } from 'qs';
import rjson from 'relaxed-json';
import ds from '@config/defaultSettings';

/** 深度优先搜索处理 func */
export const DFSFunc = (
  tree: any[],
  childKey: string = 'children',
  func: (treeNode: any) => void,
) => {
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

/**
 * jsonParse error-first
 * @param jsonStr
 * @param {boolean} relaxed 松散校验（非严格）
 */
export const JsonParse = (jsonStr: string, relaxed?: boolean) => {
  try {
    if (relaxed) {
      jsonStr = rjson.transform(jsonStr);
    }

    let value = JSON.parse(jsonStr);
    return [null, value];
  } catch (e) {
    return [true];
  }
};

/** 给接口增加统一前缀 */
export const addAPIPrefix = (api: string) => {
  const origin = '';
  if (/^(https?:)?\/\//.test(api)) return api;
  if (!/^\//.test(api)) {
    api = `/${api}`;
  }

  return `${origin}${ds.apiPrefix}${api}`;
};
