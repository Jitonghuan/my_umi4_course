import { createContext } from 'react';
import { AppItemVO } from './interfaces';

export interface ContextTypes {
  /** 应用数据 */
  appData?: AppItemVO;
  /** 请求应用数据 */
  queryAppData?: () => void;
  projectEnvCode?: string;
  projectEnvName?: string;
  benchmarkEnvCode?: string;
}

export default createContext<ContextTypes>({});
