import { PaginationProps } from 'antd';

export interface IProps {
  dataSource: Array<{
    id: string | number;
    /** 应用名 */
    appName: string;
    /** 应用类型 */
    appType: string;
    owner: string;
  }>;
  /** 分页 */
  pagination: PaginationProps;
}
