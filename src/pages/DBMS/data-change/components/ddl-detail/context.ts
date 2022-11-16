import { createContext } from 'react';


export interface ContextTypes {
  /** 应用数据 */
  tabKey?: string;
  changeTabKey?:(next:string)=>any;
  parentWfId?:number

 
}

export default createContext<ContextTypes>({});