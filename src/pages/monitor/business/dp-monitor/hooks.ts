import { useState, useEffect } from 'react';
import {getRequest, putRequest, delRequest, postRequest} from '@/utils/request';
import { message } from 'antd';
import * as APIS from '../service';
import {deleteDbMonitor, disableDbMonitor, enableDbMonitor} from "../service";

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

export function useGetListMonitor() {
  const [listSource, setListSource] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageCurrentIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    getListMonitor(1, 10);
  }, []);

  const getListMonitor = async (
    pageIndex: number,
    pageSize: number,
    monitorName?: string,
    metricName?: string,
    appCode?: string,
    envCode?: string,
  ) => {
    await getRequest(APIS.getDbListMonitor, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 10, monitorName, metricName, appCode, envCode },
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
      data: { id }
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
      data: { id }
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
      data: { id }
    }).then((result) => {
      if (result?.success) {
        message.success('删除业务监控成功！');
        callBack();
      }
    });
  };
  return [delMonitor];
}