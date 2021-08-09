export interface IStatusInfoProps {
  envCode?: string;
  envName?: string;
  appState: number;
  appStateName: string;
  eccid: string;
  ip: string;
  packageMd5: string;
  taskState: number;
  taskStateName: string;
}

export interface GroupedStatusInfoProps {
  envCode: string;
  envName: string;
  list: IStatusInfoProps[];
}
