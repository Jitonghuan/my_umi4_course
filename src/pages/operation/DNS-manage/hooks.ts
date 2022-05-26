import { useEffect, useState, useLayoutEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from '@cffe/h2o-design';

//dns信息查询
export function useDnsManageList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const getDnsManageList = async (paramObj: {
    currentEnvCode: any;
    // hostRecord?: string;
    // recordType?: string;
    // recordValue?: string;
    // status?: string;
    keyWord?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
    await getRequest(
      `${APIS.getDnsManageList}?envCode=${paramObj.currentEnvCode.envCode}&keyWord=${
        paramObj?.keyWord || ''
      }&pageIndex=${paramObj?.pageIndex || 1}&pageSize=${paramObj?.pageSize || 20}`,
    )
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
    await postRequest(`${APIS.addDnsManage}?envCode=${paramsObj.envCode}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增记录成功！');
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
    await putRequest(`${APIS.updateDnsManage}?envCode=${paramsObj.envCode}&id=${paramsObj.id}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
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
    await delRequest(`${APIS.deleteDnsManage}?envCode=${paramsObj.envCode}&id=${paramsObj.id}`)
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
    await postRequest(`${APIS.updateDnsManageStatus}?envCode=${paramsObj.envCode}&id=${paramsObj.id}`, {
      data: paramsObj,
    })
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
        if (result?.success) {
          const dataSource = result.data || [];
          setSource(dataSource);
        } else {
          return;
        }
        if (!result?.success) {
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
