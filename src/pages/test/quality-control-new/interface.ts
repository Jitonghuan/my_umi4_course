export interface IConfig {
  id: number;
  categoryCode: string;
  appCode: string;
  gmtCreate: string;
  gmtModify: string;
}

export interface IRanking {
  [x: string]: any[];
}

interface ITrendInfo {
  data: any[];
  xAxis: string[];
}
export interface ITrend {
  qualityPoints: ITrendInfo;
  codeLines: ITrendInfo;
  codeBugs: ITrendInfo;
  utPassRate: ITrendInfo;
  codeDuplicationsRate: ITrendInfo;
  utCovRate: ITrendInfo;
}
