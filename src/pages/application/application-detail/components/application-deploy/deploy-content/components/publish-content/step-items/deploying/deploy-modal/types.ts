import { DeployInfoVO } from '@/pages/application/application-detail/types';

export interface IProps {
  envTypeCode: string;
  visible: boolean;
  deployInfo: DeployInfoVO;
  onCancel: () => void;
  onOperate: (type: 'deployEnd') => void;
}
