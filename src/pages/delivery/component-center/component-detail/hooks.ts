import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
//组件版本查询
export function useQueryComponentVersionList(): [
  boolean,
  any,
  (componentName: string, componentType: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const queryComponentVersionList = async (componentName: string, componentType: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentName, componentType, pageIndex: -1, pageSize: -1 },
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

// //组件详情
// export function useQueryComponentInfo(): [
//   boolean,
//   any,
//   (componentName: string, componentVersion: string, componentType: string) => Promise<void>,
// ] {
//   const [loading, setLoading] = useState(false);
//   const [dataSource, setDataSource] = useState({});
//   const queryComponentInfo = async (componentName: string, componentVersion: string, componentType: string) => {
//     setLoading(true);
//     try {
//       await getRequest(APIS.queryComponentInfo, {
//         data: { componentName, componentVersion, componentType },
//       })
//         .then((res) => {
//           if (res.success) {
//             let dataSource = res.data;
//             setDataSource(dataSource);
//             return dataSource;
//           } else {
//             return {};
//           }
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return [loading, dataSource, queryComponentInfo];
// }

// updateComponent
//基础数据接入
export function useUpdateComponent(): [
  boolean,
  (paramsObj: {
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
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateComponent = async (paramsObj: {
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
  }) => {
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
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSourceEnv: string;
    componentExplanation: string;
    componentConfiguration: string;
    createUser: string;
    modifyUser: string;
    gmtCreate: string;
    gmtModify: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateDescription = async (componentInfo: {
    id: number;
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSourceEnv: string;
    componentExplanation: string;
    componentConfiguration: string;
    createUser: string;
    modifyUser: string;
    gmtCreate: string;
    gmtModify: string;
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

export function useUpdateConfiguration(): [boolean, (componentConfiguration: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateConfiguration = async (componentConfiguration: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.updateConfiguration, { data: { componentConfiguration } })
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
