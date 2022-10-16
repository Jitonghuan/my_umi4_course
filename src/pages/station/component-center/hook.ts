import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
// 查询应用环境数据
export function useQueryEnvList() {
  const [loading, setLoading] = useState(false);
  const [envDataSource, setEnvDataSource] = useState<any>([]);
  const queryEnvData = () => {
    setLoading(true);
    getRequest(APIS.envList, { data: { pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result?.success) {
          let dataSource = result?.data?.dataSource;
          const options = dataSource?.map((item: any) => ({
            label: item.envCode,
            value: item.envCode,
          }));
          setEnvDataSource(options);
        } else {
          return [];
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, envDataSource, queryEnvData];
}

// 应用查询
export function useGetApplicationOption(): [boolean, any, any, (componentSourceEnv: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const getApplicationOption = async (componentSourceEnv: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryApplist, { data: { componentSourceEnv } })
        .then((res) => {
          if (res.success) {
            let data = res.data.dataSource;
            const option = data?.map((item: any, index: number) => ({
              label: item,
              value: item,
              title: item,
              key: index,
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
  return [loading, dataSource, setDataSource, getApplicationOption];
}

//组件查询
export function useQueryComponentList(): [
  boolean,
  any,
  any,
  any,
  any,
  (paramsObj: {
    componentType: string;
    productLine?: string;
    componentName?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => Promise<void>,
 any
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [options, setOptions] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  let optionsArry:any=[]
  const queryComponentList = async (paramsObj: {
    componentType: string;
    productLine?: string;
    componentName?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentList, {
        data: {
          componentType: paramsObj.componentType,
          productLine: paramsObj.productLine,
          componentName: paramsObj.componentName,
          pageIndex: paramsObj.pageIndex || 1,
          pageSize: paramsObj.pageSize || 20,
        },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
           
            dataSource?.map((item:any)=>{
              optionsArry.push({
                label:item?.componentName,
                value:item?.componentName,
              })

            })
            setOptions(optionsArry)
            setDataSource(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
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
  return [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryComponentList,options];
}



//用户组件接入
export function useAddApplication(): [
  boolean,
  (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    // componentDescription: string;
    componentSourceEnv: string;
    productLine: string;
    componentUrl?: string;
    componentExplanation?: string;
    componentConfiguration?: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addApplication = async (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    // componentDescription: string;
    componentSourceEnv: string;
    productLine: string;
    componentUrl?: string;
    componentExplanation?: string;
    componentConfiguration?: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.addApplication}`, {
        data: {
          componentName: paramsObj.componentName,
          componentVersion: paramsObj.componentVersion,
          componentType: paramsObj.componentType,
          // componentDescription: paramsObj.componentDescription,
          componentSourceEnv: paramsObj.componentSourceEnv,
          productLine: paramsObj.productLine,
        },
      })
        .then((res) => {
          if (res.success) {
            message.success('新增成功！');
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
  return [loading, addApplication];
}

//中间件接入
export function useAddMiddleware(): [
  boolean,
  (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addMiddleware = async (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.addMiddleware, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success(res.data);
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
  return [loading, addMiddleware];
}
export interface AddComponentItems{
  filePath?: string;
  componentName: string;
  componentVersion: string;
  componentType: string;
  componentDescription: string;
  componentUrl: string;
  componentSourceEnv?: string;
  componentExplanation: string;
  componentConfiguration: string;
  productLine?: string;
}
//前端资源接入 addFrontComponentApi
export function useAddFrontComponent(): [
  boolean,
  (paramsObj:AddComponentItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addFrontComponent = async (paramsObj: AddComponentItems) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.addFrontComponentApi}?filePath=${paramsObj.filePath}`, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('新增成功！');
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
  return [loading, addFrontComponent];
}
//基础数据接入
export function useAddBasicdata(): [
  boolean,
  (paramsObj:AddComponentItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addBasicdata = async (paramsObj:AddComponentItems) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.addBasicdata}?filePath=${paramsObj.filePath}`, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('新增成功！');
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
  return [loading, addBasicdata];
}

//删除建站配置参数

export function useDeleteComponent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteComponent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteComponent}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
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
  return [loading, deleteComponent];
}

//产品线分类

export function useQueryProductlineList(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);

  const getProductlineList = async () => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductlineList)
        .then((res) => {
          if (res?.success) {
            let data = res.data;
            let option: any = [];
            data?.map((item: any) => {
              option.push({
                label: item || '',
                value: item || '',
              });
            });
            setDataSource(option);
          } else {
            setDataSource([]);
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
  return [loading, dataSource, getProductlineList];
}

// 检查组件版本号
export function useGetVersionCheck(): [
  boolean,
  boolean,
  (componentName: string, componentType: string, componentVersion: string, productLine: string) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const getVersionCheck = async (
    componentName: string,
    componentType: string,
    componentVersion: string,
    productLine: string,
  ) => {
    setLoading(true);
    try {
      await getRequest(
        `${APIS.getVersionCheck}?componentName=${componentName}&componentType=${componentType}&componentVersion=${componentVersion}&productLine=${productLine}`,
      )
        .then((res) => {
          if (res.success) {
            message.success(res.data);
            setRightInfo(true);
          } else {
            setRightInfo(false);
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
  return [loading, rightInfo, getVersionCheck];
}
