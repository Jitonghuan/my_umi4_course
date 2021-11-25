// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 16:49

import { useEffect, useState } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//选择环境
export function useEnvOptions() {
  const [source, setSource] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getRequest(APIS.getEnvList, {
      data: { pageIndex: 1, pageSize: 100 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.envCode,
        value: item.envCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

//选择日志库
export function useLogStoreOptions(envCode?: string) {
  const [source, setSource] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    setSource([]);
    if (!envCode) return;
    getRequest(APIS.ruleIndexOptions, {
      data: { envCode },
    }).then((result) => {
      let indexdata = result.data;
      // const { Index } = result.data || [];
      const next = (indexdata || []).map((n: string) => ({
        label: n,
        value: n,
      }));

      setSource(next);
    });
  }, [envCode]);

  return [source];
}

//获取渲染页面的URL
export function useFrameUrl(envCode?: string, logStore?: string): [string, boolean, string] {
  const [url, setUrl] = useState<string>('');
  const [logType, setLogType] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!envCode || !logStore) {
      setLoading(false);
      setUrl('');
      return;
    }
    setLoading(true);
    getRequest(APIS.getSearchUrl, {
      data: { envCode, logStore },
    })
      .then((result) => {
        if (result.success) {
          if (result.data.logType === '1') {
            setUrl(result.data || '');
            setLogType('1');
          } else {
            setLogType('0');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [envCode, logStore]);

  return [url, loading, logType];
}

//获取字段列表  indexModeList
export function useIndexModeList() {
  const [indexModeData, setIndexModeData] = useState<any>();
  const queryIndexModeList = async (envCode: any, indexMode: any) => {
    await getRequest(APIS.indexModeList, {
      data: { envCode, indexMode },
    }).then((resp) => {
      if (resp.success) {
        let data = resp?.data;
        const next = (data || []).map((n: string) => ({
          label: n,
          value: n,
        }));
        setIndexModeData(next);
      }
    });
  };
  return [queryIndexModeList, indexModeData, setIndexModeData];
}

//新增索引
export function useCreateIndexMode() {
  const createIndexMode = async (envCode: any, fields: any, indexMode: any) => {
    await postRequest(APIS.createIndexMode, {
      data: { envCode, fields, indexMode },
    }).then((resp) => {
      if (resp.success) {
        message.info('新增索引成功！');
      }
    });
  };
  return [createIndexMode];
}

//查询表格数据  queryIndexMode
export function useQueryIndexMode() {
  const [queryIndexModeData, setQueryIndexModeData] = useState<any[]>([]);
  useEffect(() => {}, []);
  const queryIndexTable = () => {
    postRequest(APIS.queryIndexMode).then((resp) => {
      if (resp.success) {
        setQueryIndexModeData(resp?.data);
      }
    });
  };
  return [queryIndexTable, queryIndexModeData];
}

//删除数据

export function useDeleteIndexMode() {
  const deleteIndexTable = (id: number) => {
    postRequest(APIS.deleteIndexMode, {
      data: { id },
    }).then((resp) => {
      if (resp.success) {
        message.info('删除索引成功！');
      }
    });
  };
  return [deleteIndexTable];
}

//编辑数据
export function useEditIndexMode() {
  const editIndexTable = (id: number, envCode: string, indexMode: string, fields: string) => {
    postRequest(APIS.editIndexMode, {
      data: { id, envCode, indexMode, fields },
    }).then((resp) => {
      if (resp.success) {
        message.info('编辑索引成功！');
      }
    });
  };
  return [editIndexTable];
}
