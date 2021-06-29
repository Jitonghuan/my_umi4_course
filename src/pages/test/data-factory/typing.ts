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

  gmtCreate?: string;
  categoryName?: string;
  name?: string;
  appName?: string;
  branchName?: string;
  lastCheckTime?: Moment | string;
  checkNum?: React.Key;
  checkSuccessNum?: React.Key;

  taskId?: React.Key;
  testTime?: Moment | string;
  createUser?: string;
  times?: Moment | string;
  reliabilityLevel?: string;
  securityLevel?: string;
  maintainabilityLevel?: string;
  newDuplicatedLinesCov?: string;

  instructionsCov?: string;
  branchesCov?: string;
  linesCov?: string;
  methodsCov?: string;
  classesCov?: string;
  startTime?: Moment | string;
  endTime?: Moment | string;
  reportUrl?: string;
}
