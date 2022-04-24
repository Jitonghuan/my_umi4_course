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
