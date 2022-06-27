import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';

export interface IProps {
  deployInfo: DeployInfoVO;
  envTypeCode: string;
  // nextEnvTypeCode?: string;
  appStatusInfo: IStatusInfoProps[];
  nextTab: string;
  pipelineCode: string;
  onOperate: (
    type:
      | 'deployNextEnvStart'
      | 'deployNextEnvEnd'
      | 'deployNextEnvSuccess'
      | 'deployMasterStart'
      | 'deployMasterEnd'
      | 'cancelDeployStart'
      | 'cancelDeployEnd'
      | 'rollbackVersion'
      | 'reloadServer'
      | 'uploadImageStart'
      | 'uploadImageEnd'
      | 'mergeStart'
      | 'mergeEnd',
  ) => void;
}
