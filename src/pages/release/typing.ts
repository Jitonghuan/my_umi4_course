import { Moment } from 'moment';

export interface Item {
  key: string;
  function?: string;
  org?: string[];
  range?: string;
  needs?: string;
  planTime?: Moment;
  needsID?: string;
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
}
