import { createContext } from 'react';


export interface ContextTypes {
  /** 应用数据 */
  appData?: any;
  /** 请求应用数据 */
  queryAppData?: () => void;
}

export default createContext<ContextTypes>({});