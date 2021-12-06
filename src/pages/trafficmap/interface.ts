/*
 * @Author: shixia.ds
 * @Date: 2021-11-29 17:47:46
 * @Description:
 */
export interface IAppInfo {
  id: string;
  name: string;
  chartData: {
    requests: {
      data: IChartData[];
      xAxis: string[];
    };
    averageResponseTime: {
      data: IChartData[];
      xAxis: string[];
    };
    responseCodes: {
      data: IChartData[];
      xAxis: string[];
    };
    errors?: {
      data: IChartData[];
      xAxis: string[];
    };
  };
}
export interface IChartData {
  data: string[];
  name: string;
  type: string;
}
