import { createContext } from 'react';

export interface ContextTypes {
  /** 应用数据 */
  appData?: {
    /** 数据库自增ID */
    id: number;
    /** 应用CODE */
    appCode: string;
    /** 应用名称    ---支持模糊搜索 */
    appName: string;
    /** 应用类型 */
    appType: 'frontend' | 'backend';
    /** 所属 */
    belong: string;
    /** 业务线CODE */
    lineCode: string;
    /** 业务模块CODE */
    sysCode: string;
    /** 应用负责人   ---支持模糊搜索 */
    owner: string;
    /** gitlab 中项目http地址 */
    gitlab: string;
    /** jar包路径 ---只有后端应用才需要 */
    jarPath: string;
    /** 是否包含二方包 ---只有后端应用才需要 */
    isClient: number;
    /** 应用所属的组  ---只有前端的应用才有 */
    group: string;
    /** 描述 */
    desc: string;
  };
  /** 请求应用数据 */
  queryAppData?: () => void;
}

export default createContext<ContextTypes>({});
