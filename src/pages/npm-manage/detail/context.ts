import { createContext } from 'react';
import { AppItemVO } from './interfaces';

export interface ContextTypes {
  /** 应用数据 */
  npmData?: AppItemVO;
  /** 请求应用数据 */
  queryNpmData?: () => void;
}

export default createContext<ContextTypes>({});
