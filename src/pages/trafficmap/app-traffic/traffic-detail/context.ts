import { createContext } from 'react';


export interface ContextTypes {
  /** 共享数据 */
  appCode?: string;
  appId?:string
  envCode?:string;
  startTime?:number;
  endTime?:number;
  hostIP?:string;
  hostName?:string
  currentTableData?:any;
  deployName?:string;
  count?:number;
  isClick?:string|number;
  podIps?:any
}

export default createContext<ContextTypes>({});