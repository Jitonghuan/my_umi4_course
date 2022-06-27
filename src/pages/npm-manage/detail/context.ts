import { createContext } from 'react';

export interface ContextTypes {
  /** 应用数据 */
  npmData?: any;
  /** 请求应用数据 */
  queryNpmData?: () => void;
}

export default createContext<ContextTypes>({});
