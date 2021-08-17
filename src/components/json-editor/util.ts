import isNaN from 'lodash/isNaN';
import flattenDepth from 'lodash/flattenDepth';
// \$\{[^\$\(\)\+\-\*\/
/** 切片正则 */
// /\$[\{][^\}]*[\}]|\w+|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g
/** 变量（指标）正则 */
// /\n|\$[\{][^\}]*[\}]|((?!\$\{).)*((?!\$\{).)|\$[^\{]*[^\$\{]/g
// /\$[\{][^\}]*[\}]|\w+|\$\{[^\$)\$,]*\w\}|\$\{[^\$]*\w\}|\$\{[^\$]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g
/** 操作符正则 */
// /\n|\+\-\*\/|((?!\+\-\*\/).)*((?!\+\-\*\/).)|[^\+\-\*\/]*[^\+\-\*\/]/g

// export const getRegExpValue = (
//   value: string,
//   operateArr: string[],
//   bracketsArr: string[],
// ) => {
//   const variableRegExp = /\n|\$[\{][^\}]*[\}]|((?!\$\{).)*((?!\$\{).)|\$[^\{]*[^\$\{]/g;
//   const operateAllRegExpStr =
//     operateArr.map(el => `${el}`).join('|') + bracketsArr.map(el => `\\${el}`).join('|');

//   const operateRegExpStr = `\\n|${operateAllRegExpStr}|((?!${operateAllRegExpStr}).)*((?!${operateAllRegExpStr}).)|[^${operateAllRegExpStr}]*[^${operateAllRegExpStr}]`;
//   const operateRegExp = new RegExp(operateRegExpStr, 'g');
//   console.log(operateRegExpStr, 'operateRegExpStr', operateRegExp);

//   // const regExpStr = `\\$[\\{][^\\}]*[\\}]|\\w+|\\$\\{[^\\$${operateAllRegExpStr})\\$,]*\\w\\}|\\$\\{[^\\$${operateAllRegExpStr}]*\\w\\}|\\$\\{[^\\$${operateAllRegExpStr}]*[\\u4e00-\\u9fa5]\\}|\\w|(.)|\\n`;
//   return flattenDepth(
//     (value.match(variableRegExp) || []).map(el => {
//       if (el.startsWith('${') && el.endsWith('}')) return el
//       return value.match(operateRegExp) || [];
//     }),
//     Infinity,
//   );
//   // return value.match(new RegExp(regExpStr, 'g')) || [];
// };

export const getRegExpValue = (value: string, operateArr: string[], bracketsArr: string[]) => {
  const variableRegExp =
    /\$[\{][^\}]*[\}]|\w+|\$\{[^\$)\$,]*\w\}|\$\{[^\$]*\w\}|\$\{[^\$]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g;
  const operateRegStr = operateArr
    .map((el) => {
      return /\W/.test(el) ? `\\${el}` : el;
    })
    .join('|');
  const bracketRegStr = bracketsArr.map((el) => `\\${el}`).join('|');

  const regExpStr = operateRegStr + `${bracketRegStr.length ? '|' : ''}` + bracketRegStr;

  const operateRegExpStr = `\\n|${regExpStr}|((?!${regExpStr}).)*((?!${regExpStr}).)|[^${regExpStr}]*[^${regExpStr}]`;

  const operateRegExp = new RegExp(operateRegExpStr, 'g');

  return flattenDepth(
    (value.match(variableRegExp) || []).map((el) => {
      if (el.startsWith('${') && el.endsWith('}')) return el;
      return el.match(operateRegExp) || [];
    }),
    Infinity,
  );
};

// export const getRegExpValue = (
//   value: string,
//   operateArr: string[],
//   bracketsArr: string[],
// ) => {
//   const operateRegExpStr = operateArr.map(el => `\\${el}`).join('|');
//   const bracketsRegExpStr = bracketsArr.map(el => `\\${el}`).join('|');

//   const operateAllRegExpStr = bracketsRegExpStr + operateRegExpStr;

//   const regExpStr = `\\$[\\{][^\\}]*[\\}]|\\w+|\\$\\{[^\\$${operateAllRegExpStr})\\$,]*\\w\\}|\\$\\{[^\\$${operateAllRegExpStr}]*\\w\\}|\\$\\{[^\\$${operateAllRegExpStr}]*[\\u4e00-\\u9fa5]\\}|\\w|(.)|\\n`;

//   return value.match(new RegExp(regExpStr, 'g')) || [];
// };

interface IvalidateConf {
  /** 操作符集合 */
  operateArr: string[];
  /** 括号集合 */
  bracketsArr: string[];
  /** 校验数字
   * @default false
   */
  allowNumber?: boolean;
}

/**
 * 校验值是否合法
 * @param valuesArr
 * @param config
 */
export const validateValue = (valuesArr: string[], config: IvalidateConf): [boolean, string[]?] => {
  const { operateArr = [], bracketsArr = [], allowNumber = false } = config;

  const bracketsStack: string[] = [];
  const [startBracket, endBracket] = bracketsArr;
  let errStatus = false;

  if (!operateArr?.length) return [false, valuesArr];

  for (let i = 0; i < valuesArr.length; i++) {
    const prevValStr = valuesArr[i - 1];
    const currValStr = valuesArr[i];
    const nextValStr = valuesArr[i + 1];

    /** 校验括号
     * @todo 多对括号匹配
     */
    if (bracketsArr?.length && bracketsArr.includes(currValStr)) {
      // 括号
      if (currValStr === startBracket) {
        // 开始括号前后都不能有结束括号
        if ([prevValStr, nextValStr].includes(endBracket)) return [true];
        if (prevValStr) {
          // 开始括号前面不为开始括号&&不是操作符
          if (prevValStr !== startBracket && !operateArr.includes(prevValStr)) return [true];
        }
        bracketsStack.push(currValStr);
      } else {
        if (nextValStr) {
          // 结束括号后面不能为开始括号
          if (nextValStr === startBracket) return [true];
          // 结束括号后面不为结束括号 && 不是操作符
          if (nextValStr !== endBracket && !operateArr.includes(nextValStr)) return [true];
        }
        if (!bracketsStack.length) return [true];
        bracketsStack.pop();
      }
      continue;
    }

    /** 校验操作符 */
    if (operateArr.includes(currValStr)) {
      /** 首尾有操作符 || 操作符后面紧跟结束括号 [err] */
      const operatePositionErr = [0, valuesArr.length - 1].includes(i) || nextValStr === endBracket;

      if (operateArr.includes(nextValStr) || operatePositionErr) {
        return [true];
      }
      continue;
    }

    /** 校验变量 ${code_name} */
    if (currValStr.startsWith('${')) {
      if (!currValStr.endsWith('}')) {
        return [true];
      }

      /** 变量前面必须跟操作符 */
      if (prevValStr && prevValStr !== startBracket && !operateArr.includes(prevValStr)) return [true];

      /** 变量后面必须跟操作符 */
      if (nextValStr && nextValStr !== endBracket && !operateArr.includes(nextValStr)) return [true];
      continue;
    }

    if (allowNumber) {
      if (isNaN(+currValStr)) return [true];
      continue;
    }

    /** 条件都不通过 */
    return [true];
  }

  errStatus = errStatus || !!bracketsStack.length;

  if (errStatus) {
    return [true];
  }

  return [false, valuesArr];
};

/**
 * generateUUID 生成UUID
 * @returns {string} 返回字符串
 */
export function generateUUID(): string {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}
