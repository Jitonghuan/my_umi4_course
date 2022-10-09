import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
//组件版本查询
export function useQueryComponentVersionList(): [boolean, any, (componentId: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const queryComponentVersionList = async (componentId: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentId, pageIndex: -1, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data;
            const option = dataSource?.map((item: any) => ({
              label: item.componentVersion,
              value: item.componentVersion,
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

export interface UpdateComponentItems{
  filePath: string;
  componentName: string;
  componentVersion: string;
  componentType: string;
  componentDescription: string;
  componentUrl: string;
  componentSource_env: string;
  componentExplanation: string;
  componentConfiguration: string;
  productLine: string;
}
// updateComponent
//基础数据接入
export function useUpdateComponent(): [
  boolean,
  (paramsObj: UpdateComponentItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateComponent = async (paramsObj: UpdateComponentItems) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.updateComponent}?componentDescription=${paramsObj.componentDescription}`, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            message.success('更新描述成功！');
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
  return [loading, updateComponent];
}

//组件描述更新

export function useUpdateDescription(): [
  boolean,
  (componentInfo: {
    id: number;
    componentDescription: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateDescription = async (componentInfo: {
    id: number;
    componentDescription: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.updateDescription, { data: componentInfo })
        .then((res) => {
          if (res.success) {
            message.success('编辑成功！');
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
  return [loading, updateDescription];
}

//组件配置更新

export function useUpdateConfiguration(): [boolean, (id: number, componentConfiguration: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateConfiguration = async (id: number, componentConfiguration: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.updateConfiguration, { data: { id, componentConfiguration } })
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
  return [loading, updateConfiguration];
}

//删除依赖组件

export function useDeleteRely(): [boolean, (id: number, componentDependency: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteRely = async (id: number, componentDependency: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.deleteRelyApi, { data: { id, componentDependency } })
        .then((res) => {
          if (res.success) {
            message.success("删除依赖成功！");
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
  return [loading, deleteRely];
}

//新增依赖组件


export function useAddRely(): [boolean, (id: number, componentDependency: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const addRely = async (id: number, componentDependency: string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.addRelyApi}?id=${id}&componentDependency=${componentDependency}`  )
        .then((res) => {
          if (res.success) {
            message.success("新增依赖成功！");
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
  return [loading, addRely];
}
