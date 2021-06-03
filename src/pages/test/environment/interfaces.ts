// 数据接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/27 09:55

export interface EnvItemVO extends Record<string, any> {
  id: number;
  name: string;
  code?: number;
  createUser?: string;
  modifyUser?: string;
  httpConf?: string;
  rpcConf?: EnvRpcConfVO;
  dbConf?: EnvDbConfItemVO[];
  varConf?: EnvVarConfItemVO[];
}

export interface EnvRpcConfVO extends Record<string, any> {
  registCenter?: string;
  nameSpace?: string;
}

export interface EnvDbConfItemVO extends Record<string, any> {
  host?: string;
  user?: string;
  pwd?: string;
}

export interface EnvVarConfItemVO {
  groupName: string;
  variables: EnvVarEditProps[];
}

export interface EnvVarEditProps {
  key: string;
  value: string;
}
