import { Moment } from 'moment';

export interface Item {
  key?: React.Key;
  value?: string;
  ruleName?: string;
  classify?: string;
  expression?: string;
  news?: string;
  time?: Moment | string;
  id?: React.Key;
  status?: number;
  applyName?: string;
  environmentName?: string;
  alertName?: string;
  alertRank?: string;
  eventNum?: string;
  createTime?: string;
  notifyObject?: string;
  monitorName?: string;
  matchlabels?: string;
  alarmRules?: string;
  children?: Item[];
}

export interface InitValue {
  useName?: string;
  version?: string;
  branch?: string;
  modules?: string;
  develop?: string;
  test?: string;
  publisher?: string;
  planTime?: Moment;
}

export interface BaseFormProps {
  initValueObj?: InitValue;
  isCheck?: boolean;
}
