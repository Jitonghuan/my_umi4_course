export interface IGraphTable {
  graphUuid: string;
  graphName: string;
  dsUuid: string;
  graphType: string;
  clusterCode?: string;
  grafanaId?: string;
  templateName?: string;
  graphJson?: string;
}

export interface IGraphDataSource {
  clusterCode: string;
  dsName: string;
  dsType: string;
  dsUrl: string;
  dsId?: string;
}

export interface IGraphTemplate {
  dsType: string;
  graphTemplateName: string;
  graphTemplateJson: string;
  graphTemplateDescribe: string;
}

export type TMode = 'edit' | 'add';
