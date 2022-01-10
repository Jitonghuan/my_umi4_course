export interface IAppInfo {
  id: string;
  name: string;
  chartData: {
    requests: IAppChartData;
    averageResponseTime: IAppChartData;
    responseCodes: IAppChartData;
    errors?: IAppChartData;
  };
}
export interface IAppChartData {
  data: IChartData[];
  xAxis: string[];
}
export interface IChartData {
  data: string[];
  name: string;
  type: string;
}
export interface IColor {
  [propName: string]: any;
}

/**1-重要 2-中等 3-普通 */
type LevelType = 1 | 2 | 3;

/**
 * 域信息
 */
export interface IRegionInfo {
  envCode: string;
  regionName: string;
  regionCode: string;
  relApps: [];
  remark?: string;
}
/**
 * 域应用
 */
export interface IRelApp {
  appCode: string;
  level: LevelType;
  appName: string;
}
/**
 * 查看域应用
 */
export interface IAppListSearch {
  envCode: string;
  regionCode: string;
  appCode?: string;
  //TODO:appCode似乎没有用
  isRelation: number;
}
