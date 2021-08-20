import { IStatusInfoProps } from '@/pages/application/application-detail/types';

export interface GroupedStatusInfoProps {
  envCode: string;
  envName: string;
  list: IStatusInfoProps[];
}
