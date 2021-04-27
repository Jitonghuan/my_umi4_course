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
