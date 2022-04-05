import { useEffect, useState, useLayoutEffect } from 'react';
import { getRequest, postRequest, delRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//dns信息查询
export function useDnsManageList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    getDnsManageList();
  }, []);
  const getDnsManageList = async (
    pageIndex?: number,
    pageSize?: number,
    hostRecord?: string,
    recordType?: string,
    recordValue?: string,
  ) => {
    setLoading(true);
    await getRequest(APIS.getDnsManageList, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 20, hostRecord, recordType, recordValue },
    })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data.dataSource || [];
          const pageInfo = result.data.pageInfo;
          setSource(dataSource);
          setPageInfo(pageInfo);
        }

        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, pageInfo, source, setSource, setPageInfo, getDnsManageList];
}

//dns记录添加
export function useAddDnsManage(): [
  boolean,
  (paramsObj: {
    envCode: string;
    hostRecord: string;
    recordType: string;
    recordValue: string;
    status?: string;
    remark?: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addDnsManage = async (paramsObj: {
    envCode: string;
    hostRecord: string;
    recordType: string;
    recordValue: string;
    status?: string;
    remark?: string;
  }) => {
    setLoading(true);
    await postRequest(APIS.addDnsManage, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, addDnsManage];
}

//dns记录修改
export function useUpdateDnsManage(): [
  boolean,
  (paramsObj: {
    envCode: string;
    id: number;
    hostRecord: string;
    recordType: string;
    recordValue: string;
    remark?: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateDnsManage = async (paramsObj: {
    envCode: string;
    id: number;
    hostRecord: string;
    recordType: string;
    recordValue: string;
    remark?: string;
  }) => {
    setLoading(true);
    await postRequest(APIS.updateDnsManage, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateDnsManage];
}

//dns记录删除
export function useDeleteDnsManage(): [boolean, (paramsObj: { envCode: string; id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteDnsManage = async (paramsObj: { envCode: string; id: number }) => {
    setLoading(true);
    await delRequest(APIS.deleteDnsManage, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteDnsManage];
}

//dns记录状态变更
export function useUpdateDnsManageStatus(): [
  boolean,
  (paramsObj: { envCode: string; id: number; status: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateDnsManage = async (paramsObj: { envCode: string; id: number; status: string }) => {
    setLoading(true);
    await postRequest(APIS.updateDnsManageStatus, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateDnsManage];
}

//dns服务器查询
export function useDnsManageHostList(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any[]>([]);

  const getDnsManageHostList = async () => {
    setLoading(true);
    await getRequest(APIS.getDnsManageHostList)
      .then((result) => {
        if (result.success) {
          const dataSource = result.data || [];
          setSource(dataSource);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, getDnsManageHostList];
}

//dns服务环境查询
export function useEnvCode() {
  const [source, setSource] = useState<any>({});

  const getDnsManageEnvCodeList = async () => {
    await getRequest(APIS.getDnsManageEnvCodeList).then((result) => {
      if (result) {
        const envCode = result.data || [];
        setSource({ envCode: envCode });
      } else {
        return;
      }
    });
  };
  return [source, getDnsManageEnvCodeList];
}
