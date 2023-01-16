import { useState, useEffect } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { message } from 'antd';
import * as APIS from '../service';

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

export function useAppOptions() {
  const [source, setSource] = useState<IOption[]>([]);
  useEffect(() => {
    getRequest(APIS.getAppList, {
      data: { pageSize: -1 },
    }).then((result) => {
      const { dataSource } = result?.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useGetListMonitor(queryMonitorName: string, tab: string) {
  const [listSource, setListSource] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageCurrentIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    if (!queryMonitorName) {
      getListMonitor(1, 10);
    }
  }, [queryMonitorName]);

  const getListMonitor = async (
    page?: number,
    size?: number,
    monitorName?: string,
    metricName?: string,
    appCode?: string,
    envCode?: string,
  ) => {
    if (page) {
      setPageCurrentIndex(page);
    }
    if (size) {
      setPageSize(size);
    }
    await getRequest(APIS.getDbListMonitor, {
      data: { pageIndex: page || pageIndex, pageSize: size || pageSize, monitorName, metricName, appCode, envCode },
    }).then((result) => {
      if (result?.success) {
        let ListSource = result?.data?.dataSource || [];
        setListSource(ListSource);
        setTotal(result?.data?.pageInfo.total);
      }
    });
  };

  return [listSource, total, getListMonitor];
}

export function useEnableMonitor() {
  const enableMonitor = async (id: string, callBack: () => void) => {
    await postRequest(`${APIS.enableDbMonitor}/${id}`, {
      data: { id },
    }).then((result) => {
      if (result.success) {
        message.success('启动业务监控成功！');
        callBack();
      }
    });
  };
  return [enableMonitor];
}

export function useDisableMonitor() {
  const disableMonitor = async (id: string, callBack: () => void) => {
    await postRequest(`${APIS.disableDbMonitor}/${id}`, {
      data: { id },
    }).then((result) => {
      if (result.success) {
        message.success('停止业务监控成功！');
        callBack();
      }
    });
  };
  return [disableMonitor];
}

export function useDelMonitor() {
  const delMonitor = async (id: string, callBack: () => void) => {
    await postRequest(`${APIS.deleteDbMonitor}/${id}`, {
      data: { id },
    }).then((result) => {
      if (result?.success) {
        message.success('删除业务监控成功！');
        callBack();
      }
    });
  };
  return [delMonitor];
}
