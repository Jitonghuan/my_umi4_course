// 常用工具方法集合
// @author Pluto <huarse@gmail.com>
// @create 2017/03/07

/**
 * 解析URL search
 * @param str 要解析的字符串
 * @param isDecode  是否 decode
 */
export function parseParam(str = location.search, isDecode = true): Record<string, string> {
  const ary = str.split(/[?&]/);
  const result: Record<string, any> = {};
  for (let i = 0, j = ary.length; i < j; i++) {
    const n = ary[i];
    if (!n) continue;
    const tmp = n.split('=');
    result[tmp[0]] = isDecode && !!tmp[1] ? decodeURIComponent(tmp[1]) : tmp[1];
  }
  return result;
}

/**
 * 解析cookie
 */
export function parseCookie(): Record<string, string> {
  const cookieStr = window.document ? document.cookie : '';
  const cookieAry = cookieStr.split(/\s?;\s?/);
  const cookieMap: Record<string, any> = {};
  cookieAry.forEach(function (x) {
    const i = x.indexOf('=');
    if (i >= 0) {
      cookieMap[x.substring(0, i)] = x.substring(i + 1);
    }
  });
  return cookieMap;
}

let SEED = Math.round(Date.now() * Math.random());

/** 返回一个唯一的key */
export function uniqueKey() {
  return 'CC' + (SEED++).toString(36).toUpperCase();
}

/**
 * 保留几位小数点
 */
export function toFixed(num: number, fix = 2): number {
  const unit = Math.pow(10, fix);
  return Math.round(num * unit) / unit;
}

// 复制文本到剪贴板
export function copy2Clipboard(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy') ? resolve(true) : reject(false);
    document.body.removeChild(input);
  });
}

/** 深度优先搜索处理 func */
export const DFSFunc = (tree: any[], childKey: string = 'children', func: (treeNode: any) => void) => {
  tree.forEach((node) => {
    if (node[childKey]) {
      DFSFunc(node[childKey], childKey, func);
    }

    func(node);
  });
};

/** 使用浏览器原生的方法进行 base64 编码 */
export const base64Encode = (str: string) => {
  return window.btoa(window.unescape(window.encodeURIComponent(str)));
};

/** 使用浏览器原生方法进行 base64 解码 */
export const base64Decode = (str: string) => {
  return window.decodeURIComponent(window.escape(window.atob(str)));
};

/** 替换字符串 */
export const strSplice = (str: string, index: number, count: number, add: string) => {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || '') + str.slice(index + count);
};
