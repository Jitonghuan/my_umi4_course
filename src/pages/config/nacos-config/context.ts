import { createContext } from 'react';

export interface ContextTypes{
    envCode?:string//选择环境
    tabKey?:string//活跃key
    
  }

export default createContext<ContextTypes>({});
