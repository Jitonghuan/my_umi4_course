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
  const [source, setSource] = useState<any>([]);

  const queryTableFields = async (params:{dbCode:string,tableCode:string}) => {
    setLoading(true);
    await getRequest(APIS.queryTableFieldsApi, { data: params})
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data?.fields;
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

  return [loading, source, queryTableFields];
}