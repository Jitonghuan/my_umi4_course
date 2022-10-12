import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './common-service';
import { message } from 'antd';
//queryEnvList

//环境列表查询
export function useEnvList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [source, setSource] = useState<any>([]);
   
    const queryEnvList = async () => {
      setLoading(true);
      await getRequest(APIS.queryEnvList, { data:{pageIndex:-1,pageSize:-1} })
        .then((result) => {
          if (result?.success) {
            const dataSource = result.data.dataSource || [];
            let option= dataSource?.map((ele:any)=>({
                label:ele?.envName,
                value:ele?.envCode
            }))
           
            setSource(option);
          
          }
         
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading,  source, queryEnvList];
  }
  //实例列表查询
export function useInstanceList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);

  const getInstanceList = async () => {
    setLoading(true);
    await getRequest(APIS.getInstanceList, { data: {pageIndex:-1,pageSize:-1} })
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.dataSource;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
             label:item?.instance?.name,
             value:item?.instance?.id
            });
          });
         
          setSource(dataArry);
         
        }
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, getInstanceList];
}

export function useSearchUser(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const searchUser = async () => {
    setLoading(true);
    await getRequest(APIS.searchUserUrl, { data: { pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data?.dataSource;
          let data = dataSource?.map((item: any) => item.username);

          const dataOptions = [...new Set(data)].map((item) => ({ label: item, value: item }));
          setData(dataOptions);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, searchUser];
}

export function useQueryTablesOptions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);

  const queryTables = async (params:{dbCode:string}) => {
    setLoading(true);
    await getRequest(APIS.queryTablesApi, { data: params})
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.tables;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
             label:item,
             value:item,
             title: item,
            });
          });
         
          setSource(dataArry);
         
        }
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, queryTables,setSource];
}


export function useQueryDatabasesOptions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);

  const queryDatabases = async (params:{instanceId:number,}) => {
    setLoading(true);
    await getRequest(APIS.queryDatabasesApi, { data: params})
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.dbCodes;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
             label:item,
             value:item,
             title: item,
            });
          });
         
          setSource(dataArry);
         
        }
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, queryDatabases, setSource];
}

export function useQueryTableFieldsOptions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>({});
  const [options, setOptions] = useState<any>([]);

  const queryTableFields = async (params:{dbCode:string,tableCode:string}) => {
    setLoading(true);
    await getRequest(APIS.queryTableFieldsApi, { data: params})
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.fields||[];
          let dataObject: any = {};
          setOptions(dataSource)
        //  dimi: ['ads_adid', 'ads_spec_adid_category'],
          dataSource?.map((item: any) => {
            // dataArry.push({
            //  label:item,
            //  value:item,
            //  title: item,
            // });
            dataObject[item]=item
          });
       
          setSource(dataObject);
         
        }
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source,options, queryTableFields];
}
//querySqlApi
interface querySqlItems{
  sqlContent:string;
  dbCode:string;
  tableCode:string;
  sqlType:string;
}
//queryLogsApi

//任务执行情况列表查询
export function useQueryLogsList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const queryLogsList = async (paramObj: {  pageIndex?: number; pageSize?: number }) => {
    setLoading(true);
    await getRequest(
      `${APIS.queryLogsApi}?pageIndex=${paramObj?.pageIndex || 1}&pageSize=${
        paramObj?.pageSize || 20
      }`,
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

  return [loading, pageInfo, source, setSource, setPageInfo, queryLogsList];
}
// export function useQuerySql(): [boolean, any, (params:querySqlItems) => Promise<void>] {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [data, setData] = useState<any>("");
//   const querySql = async (params:querySqlItems) => {
//     setLoading(true);
//     await postRequest(APIS.querySqlApi, { data:params })
//       .then((result) => {
//         if (result.success) {
//           let dataSource = result?.data?.result;
         
//           setData(dataSource);
//         } else {
//           return;
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return [loading, data, querySql];
// }
// export const querySqlResultInfo = async(params:querySqlItems) =>
// await postRequest(APIS.querySqlApi,{data:{...params}}).then((res: any) => {
//   if (res?.success) {
//     const dataSource =   res?.data?.result|| "";
//     return dataSource;
//   }
//   return "";
// });
export const querySqlResultInfo = (params: querySqlItems) =>
  postRequest(APIS.querySqlApi, {
    data: params,
  });
