// test cases interfaces
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:09

export interface KVProps {
  key: string;
  value?: string;
}

export interface PromitheusItemProps extends Record<string, any> {
  id?: number;
  name: string;
  appCode: string;
  envCode: string;
  interval: string;
  metricsUrl: string;
  labels: Record<string, any>;

  /** 仅编辑时使用 */
  labelList?: KVProps[];
}

export interface AlarmRuleProps extends Record<string, any> {
  id?: number;
  RuleId: string;
  name: string;
  serviceId?: number;
  group?: string;
  expression: string;
  duration: string;
  message?: string;
  level: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  receiver: string[];
  receiverType: string[];
  silence: number;
  silenceStart?: string;
  silenceEnd?: string;
  status: number;
}
