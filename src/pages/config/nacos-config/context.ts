import { createContext } from 'react';

export interface ContextTypes{
    envCode?:string//选择环境
    
  }

export default createContext<ContextTypes>({});
