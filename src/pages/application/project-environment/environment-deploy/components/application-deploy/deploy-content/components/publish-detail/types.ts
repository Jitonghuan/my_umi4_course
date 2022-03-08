import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';

export interface IProps {
  deployInfo: DeployInfoVO;
  envTypeCode: any;
  // nextEnvTypeCode?: string;
  // appStatusInfo: IStatusInfoProps[];
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
