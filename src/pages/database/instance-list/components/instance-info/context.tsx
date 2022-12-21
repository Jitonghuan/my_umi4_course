import { createContext } from 'react';
export interface ContextTypes {
    /** 所属集群Id */
    clusterId?: number;
    clusterRole?:number;
    /** 请求应用数据 */
    // queryAppData?: () => void;
  }
  export default createContext<ContextTypes>({});