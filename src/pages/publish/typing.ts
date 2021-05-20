import { Moment } from 'moment';

export interface Item {
  key?: string;
  function?: string;
  org?: string[] | string;
  range?: string;
  needs?: string;
  planTime?: Moment | string;
  needsID?: string;
  id: string;
  status?: number;
  owner?: string;
  line?: string;
  model?: string;
  actualTime?: string;
  person?: string;
  createTime?: string;
  type?: string;
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
