import { Moment } from 'moment';
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
  level?: string;
  eventNum?: string;
  createTime?: string;
  notifyObject?: string;
  name?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  alertName?: AlertNameProps[];
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
