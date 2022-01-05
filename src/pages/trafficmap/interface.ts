/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 17:47:46
 * @Description:
 */
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
