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
      const { Index } = result.data || {};
      const next = (Index || []).map((n: string) => ({
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

/** 日志检索 */
// type AnyObject = Record<string, any>;
// export function useLoggerData(){
//   const [logHistormDataIs, setLogHistormDataIs] = useState<any>();
//   const [logHistormDataNot, setLogHistormDataNot] = useState<any>();
//   const [logSearchTableInfoIs,setLogSearchTableInfoIS]=useState<any>();
//   const [logSearchTableInfoNot,setLogSearchTableInfoNot]=useState<any>();
//   const [loading, setLoading] = useState(false);
//    const queryLogInfo = async(queryParams:any)=>{
//     setLoading(true);
//     await  postRequest(APIS.logSearch, {
//       data: {
//         envCode: queryParams?.envCode,
//         indexMode: queryParams?.indexMode,
//         startTime: queryParams?.startTime,
//         endTime:  queryParams?.endTime,
//         querySql: queryParams?.querySql,
//         filterIs: queryParams?.filterIs,
//         fllterNot: queryParams?.fllterNot },
//     })
//       .then((result) => {
//         if (result.success) {
//           if(queryParams?.filterIs){
//               //柱状图数据
//             let logSearchTableInfodata=result?.data?.aggregations?.aggs_over_time?.buckets
//             setLogHistormDataIs(logSearchTableInfodata);
//             //手风琴下拉框数据
//             let logHistorm=result.data.hits.hits
//             setLogSearchTableInfoIS(logHistorm);

//           }else if(queryParams?.fllterNot){
//                  //柱状图数据
//                  let logSearchTableInfodata=result?.data?.aggregations?.aggs_over_time?.buckets
//                  setLogHistormDataNot(logSearchTableInfodata);
//                  //手风琴下拉框数据
//                  let logHistorm=result.data.hits.hits
//                  setLogSearchTableInfoNot(logHistorm);

//           }

//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//     }
//   return [logHistormData, logSearchTableInfo,loading,queryLogInfo];
// }

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
  const [createIndexModeData, setCreateIndexModeData] = useState<any>();
  postRequest(APIS.queryIndexMode, {
    data: {},
  }).then((resp) => {
    if (resp.success) {
      message.info('新增索引成功！');
      setCreateIndexModeData(resp?.data);
    }
  });
  return [createIndexModeData];
}
