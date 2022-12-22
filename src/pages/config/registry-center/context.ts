import { createContext } from 'react';

export interface ContextTypes {
    envCode?: string//选择环境
    tabKey?: string//活跃key
    clickNamespace: any
    loading: boolean

}

export default createContext<ContextTypes>({ envCode: '', tabKey: '', clickNamespace: {}, loading: false });