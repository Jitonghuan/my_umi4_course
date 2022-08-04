// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 20:38

import { useEffect, useState } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';

export function useAppOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppList, {
      data: { pageSize: -1 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useEnvOptions(appCode?: string) {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([]);

    if (!appCode) {
      return;
    }

    getRequest(APIS.getEnvListByAppCode, {
      data: { pageIndex: 1, pageSize: 100, appCode, origin: true },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        // label: item.envName,
        label: item.envCode,
        value: item.envCode,
      }));

      setSource(next);
    });
  }, [appCode]);

  return [source];
}

export function useUserOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getUserList).then((result) => {
      const { usernames } = result?.data || {};
      const next = (usernames || []).map((item: string) => ({
        label: item,
        value: item,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useRuleGroupOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.ruleGroupOptions).then((result) => {
      const { Group } = result.data || {};

      setSource((Group || []).map((n: string) => ({ label: n, value: n })));
    });
  }, []);

  return [source];
}

export function useRuleIndexOptions(envCode?: string) {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([]);

    if (!envCode) {
      return;
    }

    getRequest(APIS.ruleIndexOptions, {
      data: { envCode },
    }).then((result) => {
      // const { Index } = result.data || {};
      let indexArry: any = [];
      if (result.success) {
        let data = result.data;
        data?.map((item: any) => {
          indexArry.push({
            label: item,
            value: item,
          });
        });
      }
      setSource(indexArry);
      // setSource((Index || []).map((n: string) => ({ label: n, value: n })));
    });
  }, [envCode]);

  return [source];
}

export function useStatusOptions() {
  const [source, setSource] = useState<IOption<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '已启用', value: 0 },
      { label: '已关闭', value: 1 },
    ]);
  }, []);

  return [source];
}

// 比较符
export function useOperatorOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([
      { label: '=', value: '=' },
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      // { label: '>=', value: '>=' },
      // { label: '<=', value: '<=' },
    ]);
  }, []);

  return [source];
}

export function useLevelOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([
      { label: '警告', value: '2' },
      { label: '严重', value: '3' },
      { label: '灾难', value: '4' },
    ]);
  }, []);

  return [source];
}

export function useNotifyTypeOptions() {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([
      { label: '钉钉', value: '钉钉' },
      { label: '电话', value: '电话' },
    ]);
  }, []);

  return [source];
}

//集群环境 下拉选择数据
export function useEnvListOptions() {
  const [envCodeOption, setEnvCodeOption] = useState<any>([]);
  let envOptions: any = [];
  const getEnvCodeList = async (envTypeCode: string) => {
    await getRequest(APIS.getEnvCodeList, {
      data: { envTypeCode },
    }).then((resp) => {
      if (resp?.success) {
        let data = resp?.data;
        data?.map((item: any) => {
          envOptions.push({
            label: item.envCode,
            value: item.envCode,
          });
        });
        setEnvCodeOption(envOptions);
      }
    });
  };

  return [envCodeOption, getEnvCodeList];
}
