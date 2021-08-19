import { IStatusInfoProps } from '../../../types';

export interface GroupedStatusInfoProps {
  envCode: string;
  envName: string;
  list: IStatusInfoProps[];
}
