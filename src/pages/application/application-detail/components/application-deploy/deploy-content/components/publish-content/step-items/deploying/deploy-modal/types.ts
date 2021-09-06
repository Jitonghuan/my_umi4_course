import { ReactNode } from 'react';

export interface IProps {
  envTypeCode: string;
  visible: boolean;
  deployInfo: Record<string, any>;
  onCancel: () => void;
  onOperate: (type: 'deployEnd') => void;
}
