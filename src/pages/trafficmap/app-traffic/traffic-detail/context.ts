import { createContext } from 'react';


export interface ContextTypes {
  /** 共享数据 */
  appCode?: string;
  appID?:string
  envCode?:string;
  startTime?:number;
  endTime?:number;
  hostIP?:string;
  hostName?:string
  /** 请求应用数据 */
  //queryAppData?: () => void;
}

export default createContext<ContextTypes>({});