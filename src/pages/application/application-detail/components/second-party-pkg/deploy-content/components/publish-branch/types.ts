import { ReactNode } from 'react';

export interface IProps {
  /** 是否有发布内容 */
  hasPublishContent: boolean;
  deployInfo: Record<string, any>;
  env: string;
  onSearch: string;
  masterBranchChange: any;
  dataSource: Array<{
    id: string | number;
    branchName: string;
    desc: string;
    createUser: string;
    gmtCreate: string;
  }>;
  /** 提交分支事件 */
  onSubmitBranch: (status: 'start' | 'end') => void;
  pipelineCode: string;
  newPublish:any 
}
