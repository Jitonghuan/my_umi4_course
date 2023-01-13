import type { Moment } from 'moment';
import React from 'react';

export interface AlertNameProps {
  key?: React.Key;
  alertRuleName: string;
  expression: string;
  message: string;
}

export interface Item {
  key?: React.Key;
  value?: string;
  receiverGroup?:string;
  group?: string;
  expression?: string;
  message?: string;
  time?: Moment | string;
  duration?: string;
  id?: React.Key;
  status?: number;
  appCode?: string;
  envCode?: string;
  // alertName?: string;
  level?: number;
  eventNum?: string;
  createTime?: string;
  notifyObject?: string;
  name?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  alertName?: AlertNameProps[];
  children?: Item[];
  receiver?: string | string[];
  receiverType?: string | string[];
  timeType?: string;
  silence?: number;
  silenceTime?: Moment[];
  silenceStart?: string;
  silenceEnd?: string;
  bizMonitorId?: string;
  bizMonitorType?: string;
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
