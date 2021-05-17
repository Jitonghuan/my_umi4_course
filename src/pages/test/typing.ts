import { Moment } from 'moment';

export interface Item {
  key?: React.Key;
  createtime?: Moment | string;
  id?: React.Key;
  status?: React.Key;
  detail?: string;
  factoryName?: string;
  environment?: string;
  own?: string;
  creator?: string;
  params?: string;
  log?: string;
}
