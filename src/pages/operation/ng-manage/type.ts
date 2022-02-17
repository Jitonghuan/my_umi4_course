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
}

export interface ConfigProp {
  id: number;
  visible: boolean;
  templateContext: string;
  handleCancel: any;
  code: string;
  onSave: any;
}
