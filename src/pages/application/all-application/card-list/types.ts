import { PaginationProps } from 'antd';

export interface IProps {
  dataSource: Array<{
    id: string | number;
    /** 应用Code */
    appCode: string;
    /** 应用名 */
    appName: string;
    /** 应用类型 */
    appType: 'frontend' | 'backend';
    /** 是否为二方包 */
    isClient?: number;
    /** 是否包含二方包 */
    isContainClient?: number;
    owner: string;
  }>;
}
