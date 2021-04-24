import { ReactNode } from 'react';

export interface IProps {
  appCode: string;
  env: string;
  dataSource: Array<{
    id: string | number;
    branchName: string;
    desc: string;
    createUser: string;
    gmtCreate: string;
  }>;
  /** 提交分支事件 */
  onSubmitBranch: (status: 'start' | 'end') => void;
}
