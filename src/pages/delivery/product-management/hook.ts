import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
// 查询产品列表
export function useQueryIndentList(): [
  boolean,
  any[],
  any,
  any,
  (paramsObj: { pageIndex?: any; pageSize?: any; productName?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  useEffect(() => {
    queryIndentList({ pageIndex: 1, pageSize: 20 });
  }, []);
  const queryIndentList = async (paramsObj: { pageIndex?: any; pageSize?: any; indentName?: string }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentList, {
        data: {
          pageIndex: paramsObj.pageIndex || 1,
          pageSize: paramsObj.pageSize || 20,
          indentName: paramsObj.indentName,
        },
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data.dataSource);
            let pageInfoData = res.data.pageInfo;
            setPageInfo({
              pageIndex: pageInfoData.pageIndex,
              pageSize: pageInfoData.pageSize,
              total: pageInfoData.total,
            });
          } else {
            return [];
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, dataSource, pageInfo, setPageInfo, queryIndentList];
}

// 删除制品
export function useDeleteIndent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const deleteIndent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteIndent}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('删除失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, deleteIndent];
}

// 制品详情
export function useQueryIndentInfo(): [boolean, any, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const queryIndentInfo = async (id: number) => {
    setLoading(true);
    try {
      await getRequest(`${APIS.queryIndentInfo}?id=${id}`)
        .then((res) => {
          if (res.success) {
            setInfo(
              res.data || {
                indentName: '',
                indentDescription: '',
                productName: '',
                productVersion: '',
                deliveryProject: '',
                indentPackageStatus: '',
                indentPackageUrl: '',
                gmtCreate: '',
              },
            );
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, info, queryIndentInfo];
}

// 制品描述编辑
export function useEditDescription(): [boolean, (id: number, indentDescription: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const editDescription = async (id: number, indentDescription: string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.editDescription}?id=${id}&indentDescription=${indentDescription}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            // message.error('编辑失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, editDescription];
}

// 获取制品交付配置列表
export function useQueryIndentParamList(): [
  boolean,
  any[],
  (paramsObj: { id: number; isGlobal?: boolean }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryIndentParamList = async (paramsObj: { id: number; isGlobal?: boolean }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentParamList, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
          } else {
            return [];
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, dataSource, queryIndentParamList];
}

// 编辑交付配置参数值
export function useSaveIndentParam(): [boolean, (id: number, configParamValue: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const saveIndentParam = async (id: number, configParamValue: string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.saveIndentParam}?id=${id}&configParamValue=${configParamValue}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('编辑失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, saveIndentParam];
}

// 出部署包
export function useCreatePackageInde(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const createPackageInde = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.createPackageInde}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('编辑失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, createPackageInde];
}
