export interface record {
  id: number;
  ngInstCode: string;
  ngInstName: string;
  confFilePath: string;
  templateContext: string;
  resourceFilePath: string;
  ipAddress: string;
  reMark: string;
  createUser?: string;
  modifyUser?: string;
  gmtCreate?: string;
  gmtModify?: string;
  value?: string;
}

export interface ConfigProp {
  visible: boolean;
  value: string;
  handleCancel: any;
  code: string;
}
