import { createContext } from 'react';
import { AppItemVO } from '../interfaces';

export interface ContextTypes {
  /** 应用数据 */
  appData?: AppItemVO;
  /** 请求应用数据 */
  queryAppData?: () => void;
}

export default createContext<ContextTypes>({});
