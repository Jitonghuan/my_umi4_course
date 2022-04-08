import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
//组件查询
export function useQueryComponentList(): [boolean, any, (componentName: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const queryComponentVersionList = async (componentName: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentName, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data;
            const option = dataSource?.map((item: any) => ({
              label: item,
              value: item,
            }));
            setDataSource(option);
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
  return [loading, dataSource, queryComponentVersionList];
}

//组件详情
export function useQueryComponentInfo(): [boolean, any, (id: any) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const queryComponentInfo = async (id: any) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentInfo, {
        data: { id },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data;

            setDataSource(dataSource);
          } else {
            return {};
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, dataSource, queryComponentInfo];
}
