import { ReactNode } from 'react';

export interface IProps {
  visible: boolean;
  deployInfo: Record<string, any>;
  onCancel: () => void;
  onOperate: (type: 'deployEnd') => void;
}
