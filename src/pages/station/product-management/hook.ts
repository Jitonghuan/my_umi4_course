import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';


// 查询产品列表
export function useQueryIndentList(): [
  boolean,
  any[],
  any,
  any,
  (paramsObj: { pageIndex?: any; pageSize?: any; productName?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  useEffect(() => {
    queryIndentList({ pageIndex: 1, pageSize: 20 });
  }, []);
  const queryIndentList = async (paramsObj: { pageIndex?: any; pageSize?: any; indentName?: string }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentList, {
        data: {
          pageIndex: paramsObj.pageIndex || 1,
          pageSize: paramsObj.pageSize || 20,
          indentName: paramsObj.indentName,
        },
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data.dataSource);
            let pageInfoData = res.data.pageInfo;
            setPageInfo({
              pageIndex: pageInfoData.pageIndex,
              pageSize: pageInfoData.pageSize,
              total: pageInfoData.total,
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
  return [loading, dataSource, pageInfo, setPageInfo, queryIndentList];
}

// 删除制品
export function useDeleteIndent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const deleteIndent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteIndent}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('删除失败！');
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
  return [loading, deleteIndent];
}

// 制品详情
// export function useQueryIndentInfo(): [boolean, any, (id: number) => Promise<void>] {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [info, setInfo] = useState<any>({});
//   const queryIndentInfo = async (id: number) => {
//     setLoading(true);
//     try {
// await getRequest(`${APIS.queryIndentInfo}?id=${id}`)
//         .then((res) => {
//           if (res.success) {
//             setInfo(
//               res.data || {
//                 indentName: '',
//                 indentDescription: '',
//                 productName: '',
//                 productVersion: '',
//                 deliveryProject: '',
//                 indentPackageStatus: '',
//                 indentPackageUrl: '',
//                 gmtCreate: '',
//               },
//             );
//           } else {
//             return;
//           }
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return [loading, info, queryIndentInfo];
// }

// 制品描述编辑
export function useEditDescription(): [boolean, (id: number, indentDescription: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const editDescription = async (id: number, indentDescription: string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.editDescription}?id=${id}&indentDescription=${indentDescription}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            // message.error('编辑失败！');
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
  return [loading, editDescription];
}

// 获取制品建站配置列表
export function useQueryIndentServerList(): [
  boolean,
  any[],
  (paramsObj: { id: number;paramComponent?: string}) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryIndentServerList = async (paramsObj: { id: number;paramComponent?: string }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentParamList, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
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
  return [loading, dataSource, queryIndentServerList];
}


// 获取制品建站配置列表
export function useQueryIndentConfigParamList(): [
  boolean,
  any[],
  (paramsObj: { id: number;paramComponent?: string}) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryIndentConfigParamList = async (paramsObj: { id: number;paramComponent?: string }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentParamList, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
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
  return [loading, dataSource, queryIndentConfigParamList];
}

// 获取制品建站配置列表
export function useQueryIndentParamList(): [
  boolean,
  any[],
  (paramsObj: { id: number;  }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryIndentParamList = async (paramsObj: { id: number;  }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryIndentParamList, {
        data: paramsObj,
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
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
  return [loading, dataSource, queryIndentParamList];
}

// 编辑建站配置参数值
export function useSaveIndentParam(): [boolean, (id: number, paramValue: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const saveIndentParam = async (id: number, paramValue: string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.saveIndentParam}?id=${id}&paramValue=${paramValue}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('编辑失败！');
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
  return [loading, saveIndentParam];
}

// 出部署包
export function useCreatePackageInde(): [boolean, (id: number,packageType?:string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const createPackageInde = async (id: number,packageType?:string) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.createPackageInde}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('出包失败！');
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
  return [loading, createPackageInde];
}

// 获取制品配置
export function useGenerateIndentConfig(): [boolean, any, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const queryIndentConfigInfo = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.generateIndentConfig}?id=${id}`)
        .then((res) => {
          if (res.success) {
            setInfo(res.data || '');
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
  return [loading, info, queryIndentConfigInfo];
}

// 编辑制品配置
export function useEditIndentConfigYaml(): [boolean, (id: number, indentConfigYaml: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const editIndentConfigYaml = async (id: number, indentConfigYaml: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editIndentConfig, {
        data: {
          id,
          indentConfigYaml,
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
  return [loading, editIndentConfigYaml];
}
//updateParamIndent
export function useUpdateParamIndent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateParamIndent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.updateParamIndent}?id=${id}`)
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
  return [loading, updateParamIndent];
}
