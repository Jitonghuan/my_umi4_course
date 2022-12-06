import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';

export interface IProps {
  deployInfo: DeployInfoVO;
  envTypeCode: string;
  // nextEnvTypeCode?: string;
  appStatusInfo: IStatusInfoProps[];
  nextTab: string;
  pipelineCode: string;
  versionData:any;
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
      | 'mergeEnd'
      | 'versionPublishStart'
      | 'versionPublishEnd'
  ) => void;
}
