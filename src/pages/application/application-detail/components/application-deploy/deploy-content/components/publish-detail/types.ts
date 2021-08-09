import { IStatusInfoProps } from '../../types';

export interface IProps {
  deployInfo: any;
  envTypeCode: string;
  nextEnvTypeCode?: string;
  appStatusInfo: IStatusInfoProps[];
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
      | 'reloadServer',
  ) => void;
}
