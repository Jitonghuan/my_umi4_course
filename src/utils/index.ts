import { parse } from 'qs';
import rjson from 'relaxed-json';

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
