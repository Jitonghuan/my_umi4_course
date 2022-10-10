import { useState,useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';


//查询版本详情
export function useVersionDescriptionInfo(): [boolean, any, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const getVersionDescriptionInfo = async (id: number) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductVersionInfo, { data: { id } })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
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
  return [loading, dataSource, getVersionDescriptionInfo];
}
//编辑产品版本描述
export function useEditProductVersionDescription(): [
  boolean,
  (id: number, versionDescription: string) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const editProductVersionDescription = async (id: number, versionDescription: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editVersionDescription, { data: { id, versionDescription } })
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
  return [loading, editProductVersionDescription];
}

//paramtypeListApi

//组件查询
export function useQueryParamtypeList(): [ any, () => Promise<void>] {
  // const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryParamtypeList =  useCallback(async () => {
    // setLoading(true);
    try {
      await getRequest(APIS.paramtypeListApi)
        .then((res) => {
          if (res.success) {
            let dataSource = res.data
            let options: any = [];
            dataSource?.map((item: any) => {
              options.push({
                label: item,
                value: item,
                
              });
            });
            setDataSource(options);
           
          } else {
            return [];
          }
        })
        .finally(() => {
          // setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  },[] );
  return [dataSource, queryParamtypeList];
}



//组件查询
export function useQueryComponentOptions(): [ any, (componentType: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryComponentOptions = async (componentType: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentList, {
        data: { componentType, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            // let options: any = {};
            let options: any = [];
            dataSource?.map((item: any) => {
              // options[item.componentName] = {
              //   text: item.componentName,
              // };
              options.push({
                label: item.componentName,
                value: item.id,
                componentId: item.id,
                componentDescription: item.componentDescription,
                componentDependency:item?.componentDependency
              });
            });
            setDataSource(options);
            // dataSource?.map((item: any, index: number) => {
            //     options[item.componentName] = {
            //       text: item.componentName,
            //     };
            //   });
            // console.log('options11111', options);
            // setDataSource(options);
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
  return [dataSource, queryComponentOptions];
}

//组件版本查询
export function useQueryComponentVersionOptions(): [
  any,
  (componentId: number, componentType: string, componentName?: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryProductVersionOptions = async (componentId: number, componentType: string, componentName?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentId, componentType, componentName, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data;
         
            let options: any = [];
            dataSource?.map((item: any) => {
              
              options.push({
                label: item.componentVersion,
                value: item.componentVersion,
                componentDescription: item.componentDescription,
              });
            });
            setDataSource(options);
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
  return [ dataSource, queryProductVersionOptions];
}
export interface addCompontentItems{
  versionId: number;
  componentType: string;
  componentName: string;
  componentVersion: string;
  componentDescription?: string;
  componentReleaseName?:string	
  componentConfiguration?:string	
  componentNamespace?:string	
  productLine?:string		
  componentPriority?:string

}
//产品版本添加组件
export function useAddCompontent(): [
  boolean,
  (paramsObj: addCompontentItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addComponent = async (paramsObj:addCompontentItems) => {
    setLoading(true);
    try {
      await postRequest(APIS.addComponent, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('添加成功！');
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
  return [loading, addComponent];
}

// 产品版本组件查询
export function useQueryVersionComponentList(): [
  boolean,
  any,
  any,
  (
    versionId: number,
    componentType: string,
    componentName?: string,
    pageIndex?: number,
    pageInfo?: number,
  ) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const queryVersionComponentList = async (versionId: number, componentType: string, componentName?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryVersionComponentList, {
        data: { versionId, componentType, componentName, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
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
  return [loading, dataSource, setDataSource, queryVersionComponentList];
}

//产品版本删除组件
export function useDeleteVersionComponent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteVersionComponent = async (id: number) => {
    setLoading(true);
    try {
      await delRequest(`${APIS.deleteVersionComponent}/${id}`)
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
  return [loading, deleteVersionComponent];
}

//编辑组件配置

export function useEditComponent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const editComponent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(APIS.editComponent, {
        data: {
          id,
        },
      })
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
  return [loading, editComponent];
}
// ----------------------------------------------------------------------------

// 获取参数来源组件
export function useQueryOriginList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>({});
  const queryOriginList = async (versionId: number) => {
    setLoading(true);
    await getRequest(APIS.queryOriginList, { data: { versionId } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res.data.dataSource;
          let options: any = [];
          dataSource?.map((item: any) => {
            
            options.push({
              label: item.componentName,
              value: item.componentName,
            });
          });
          setDataSource(options);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, dataSource, queryOriginList];
}

//获取组件参数及参数值
export function useQueryParamList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const queryParamList = async (versionId: number, componentName: string) => {
    setLoading(true);
    await getRequest(APIS.queryParamList, { data: { versionId, componentName } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res.data;
       
          let options: any = [];
          for (const key in dataSource) {
          
            options.push({
              label: key,
              value: key,
              paramValue: JSON.stringify(dataSource[key]),
            });
          }

          setDataSource(options);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, dataSource, queryParamList];
}
//查询交付配置参数
export function useQueryDeliveryParamList(): [
  boolean,
  any,
  any,
  (versionId: number, configParamComponent?: string, pageIndex?: number, pageInfo?: number) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryDeliveryParamList = async (versionId: number, configParamComponent?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryDeliveryParamList, {
        data: { versionId, configParamComponent, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;

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
  return [loading, dataSource, setDataSource, queryDeliveryParamList];
}
//查询交付配置参数
export function useQueryDeliveryGloableParamList(): [
  boolean,
  any,
  any,

  (versionId: number, paramComponent?: string, paramName?: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryDeliveryParamList = async (versionId: number, paramComponent?: string, paramName?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryDeliveryParamList, {
        data: { versionId, paramComponent, paramName, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
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
  return [loading, dataSource, setDataSource, queryDeliveryParamList];
}

//查询交付配置参数
export function useQueryServerParamList(): [
  boolean,
  any,
  any,

  (versionId: number, paramComponent?: string, paramName?: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryDeliveryParamList = async (versionId: number, paramComponent?: string, paramName?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryDeliveryParamList, {
        data: { versionId, paramComponent, paramName, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
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
  return [loading, dataSource, setDataSource, queryDeliveryParamList];
}
export interface saveParamItem{
    versionId: number;
    paramComponent?: string;
    paramName: string;
    paramValue?: string;
    paramDescription?: string;
    paramComponentReleaseName?:string;
    paramComponentNamespace?:string;
    paramType?:string;
}

//保存交付配置参数
export function useSaveParam(): [
  boolean,
  (paramsObj: saveParamItem) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const saveParam = async (paramsObj:saveParamItem) => {
    setLoading(true);
    try {
      await postRequest(APIS.saveParam, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('保存成功！');
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
  return [loading, saveParam];
}

//编辑交付配置参数
export function useEditVersionParam(): [
  boolean,
  (paramsObj: { id: number; paramValue: string; paramDescription: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const editVersionParam = async (paramsObj: { id: number; paramValue: string; paramDescription: string }) => {
    setLoading(true);
    try {
      await postRequest(APIS.editVersionParam, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('修改成功！');
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
  return [loading, editVersionParam];
}

//删除交付配置参数

export function useDeleteDeliveryParam(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteDeliveryParam = async (id: number) => {
    setLoading(true);
    try {
      await delRequest(`${APIS.deleteDeliveryParam}/${id}`)
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
  return [loading, deleteDeliveryParam];
}

// 获取应用版本
export function useGetProductlineVersion() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const getProductlineVersion = async (productLine: string) => {
    setLoading(true);
    await getRequest(APIS.getProductlineVersion, { data: { productLine } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res.data || [];
          let options: any = [];
          dataSource?.map((item: any) => {
            options.push({
              label: item,
              value: item,
            });
          });

          setDataSource(options);
        } else {
          setDataSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, dataSource, getProductlineVersion];
}
// 获取应用
export function useGetAppList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const queryAppList = async (param: { productLine: string; componentVersion: string }) => {
    setLoading(true);
    await getRequest(APIS.applist, { data: param })
      .then((res) => {
        if (res?.success) {
          let dataSource = res.data || [];
          let options: any = [];
          dataSource?.map((item: any, index: number) => {
            options.push({
              title: item,
              key: index,
            });
          });
          setDataSource(options);
        } else {
          setDataSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, dataSource, setDataSource, queryAppList];
}
//批量添加中间件
//bulkaddApi
export function useBulkaddMiddleware(): [
  boolean,
  (paramsObj: {
    versionId: number;
    componentName: any;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const saveBulkadd = async (paramsObj: {
    versionId: number;
    componentName: any;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.bulkaddApi, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('保存成功！');
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
  return [loading, saveBulkadd];
}

//批量添加应用
export function useBulkadd(): [
  boolean,
  (paramsObj: {
    versionId: number;
    componentName: string;
    componentVersion: string;
    productLine: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const saveBulkadd = async (paramsObj: {
    versionId: number;
    componentName: string;
    componentVersion: string;
    productLine: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.bulkadd, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('保存成功！');
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
  return [loading, saveBulkadd];
}
