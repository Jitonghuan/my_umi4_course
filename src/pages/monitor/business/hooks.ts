import { useState, useEffect, useCallback, useRef } from 'react';
import { getRequest, putRequest, delRequest } from '@/utils/request';
import { message } from '@cffe/h2o-design';
import * as APIS from './service';
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
  const [tablesource, setTableSource] = useState<any>([]);
  const [listSource, setListSource] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageCurrentIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    getListMonitor(1, 5);
  }, []);

  let itemString: string;
  let tableData: any = [];
  const getListMonitor = async (
    pageIndex: number,
    pageSize: number,
    monitorName?: string,
    metricName?: string,
    appCode?: string,
    envCode?: string,
  ) => {
    await getRequest(APIS.getListMonitor, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 5, monitorName, metricName, appCode, envCode },
    }).then((result) => {
      if (result?.success) {
        let ListSource = result?.data?.dataSource || [];
        setListSource(ListSource);
        setTotal(result?.data?.pageInfo.total);
        ListSource?.map((item: any) => {
          item?.MonitorBizMetric.map((filters: any) => {
            itemString = JSON.stringify(filters.filters || {});
            filters['filtersData'] = itemString;
            tableData.push(filters);
          });
        });
        setTableSource(tableData);
      }
    });
  };

  return [listSource, tablesource, total, getListMonitor];
}

export function useEnableMonitor() {
  const enableMonitor = async (monitorName: string) => {
    await putRequest(`${APIS.enableMonitor}?monitorName=${monitorName}`).then((result) => {
      if (result.success) {
        message.success('启动业务监控成功！');
      }
    });
  };
  return [enableMonitor];
}

export function useDisableMonitor() {
  const disableMonitor = async (monitorName: string) => {
    await putRequest(`${APIS.disableMonitor}?monitorName=${monitorName}`).then((result) => {
      if (result.success) {
        message.success('停止业务监控成功！');
      }
    });
  };
  return [disableMonitor];
}

export function useDelMonitor() {
  const delMonitor = async (monitorName: string) => {
    await delRequest(`${APIS.delMonitor}?monitorName=${monitorName}`).then((result) => {
      if (result?.success) {
        message.success('删除业务监控成功！');
      }
    });
  };
  return [delMonitor];
}
