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

// 这个数据格式很有问题，每个 Record 里面只有一组键值对
export type EnvVarConfItemVO = Record<string, Record<string, string>[]>;

export interface EnvVarEditProps {
  name: string;
  value: string;
}
