import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;

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

//组件查询
export function useQueryComponentOptions(): [boolean, any, (componentType: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});

  const queryComponentOptions = async (componentType: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentList, {
        data: { componentType, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let options: any = {};
            dataSource ||
              [].map((item: any, index: number) => {
                options[item.id] = {
                  text: item.componentName,
                };
              });
            setDataSource(options);
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
  return [loading, dataSource, queryComponentOptions];
}

//组件版本查询
export function useQueryComponentVersionOptions(): [boolean, any, (componentName: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});

  const queryProductVersionOptions = async (componentName: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentName, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let options: any = {};
            dataSource ||
              [].map((item: any) => {
                options[item.component_version] = {
                  text: item.component_version,
                };
              });
            setDataSource(options);
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
  return [loading, dataSource, queryProductVersionOptions];
}

//产品版本添加组件
export function useAddCompontent(): [
  boolean,
  (
    versionId: number,
    componentType: string,
    componentName: string,
    componentVersion: string,
    componentDescription: string,
    versionDescription: string,
  ) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addComponent = async (
    versionId: number,
    componentType: string,
    componentName: string,
    componentVersion: string,
    componentDescription: string,
    versionDescription: string,
  ) => {
    setLoading(true);
    try {
      await postRequest(APIS.addComponent, {
        data: { versionId, componentType, componentName, componentVersion, componentDescription, versionDescription },
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
  return [loading, addComponent];
}

// 产品版本组件查询
export function useQueryVersionComponentList(): [
  boolean,
  any,
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
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const queryVersionComponentList = async (
    versionId: number,
    componentType: string,
    componentName?: string,
    pageIndex?: number,
    pageSize?: number,
  ) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryVersionComponentList, {
        data: { versionId, componentType, componentName, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
            setDataSource(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            });
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
  return [loading, dataSource, pageInfo, setPageInfo, queryVersionComponentList];
}

//产品版本删除组件
export function useDeleteVersionComponent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteVersionComponent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteVersionComponent}/${id}`)
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
          let options: any = {};
          let optionsNew: any = {};
          dataSource ||
            [].map((item: any, index) => {
              options[item.componentName] = {
                text: item.componentName,
              };

              optionsNew = Object.assign(options, { text: item.componentName });
              console.log('item', item, optionsNew);
            });

          setDataSource(options);
          console.log('options', options, dataSource, optionsNew);
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
          setDataSource(res?.data || []);
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
  any,
  any,
  (versionId: number, configParamComponent?: string, pageIndex?: number, pageInfo?: number) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const queryDeliveryParamList = async (
    versionId: number,
    configParamComponent?: string,
    pageIndex?: number,
    pageSize?: number,
  ) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryDeliveryParamList, {
        data: { versionId, configParamComponent, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
            setDataSource(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            });
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
  return [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList];
}
//查询交付配置参数
export function useQueryDeliveryGloableParamList(): [
  boolean,
  any,
  any,
  any,
  any,
  (versionId: number, configParamComponent?: string, pageIndex?: number, pageInfo?: number) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const queryDeliveryParamList = async (
    versionId: number,
    configParamComponent?: string,
    pageIndex?: number,
    pageSize?: number,
  ) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryDeliveryParamList, {
        data: { versionId, configParamComponent, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
            setDataSource(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            });
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
  return [loading, dataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList];
}

//保存交付配置参数
export function useSaveParam(): [
  boolean,
  (
    versionId: number,
    configParamComponent: string,
    configParamName: string,
    configParamValue: string,
    configParamDescription: string,
  ) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const saveParam = async (
    versionId: number,
    configParamComponent: string,
    configParamName: string,
    configParamValue: string,
    configParamDescription: string,
  ) => {
    setLoading(true);
    try {
      await postRequest(APIS.saveParam, {
        data: { versionId, configParamComponent, configParamName, configParamValue, configParamDescription },
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
  return [loading, saveParam];
}

//删除交付配置参数

export function useDeleteDeliveryParam(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteDeliveryParam = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteDeliveryParam}/${id}`)
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
