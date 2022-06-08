import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//任务列表查询
export function useTaskList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const getTaskList = async (paramObj: { jobCode?: string; pageIndex?: number; pageSize?: number }) => {
    setLoading(true);
    await getRequest(
      APIS.getJobList,
      { data: paramObj },
      // `${APIS.getJobList}?jobCode=${paramObj?.jobCode||''}&pageIndex=${paramObj?.pageIndex || 1}&pageSize=${paramObj?.pageSize || 20}`,
    )
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data.dataSource || [];
          // let dataArry:any=[];
          // dataSource?.map((item:any)=>{
          //   dataArry.push(
          //     Object.assign(item.job,item.lastExecStatus)
          //   )
          // })
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

  return [loading, pageInfo, source, setSource, setPageInfo, getTaskList];
}

//任务执行情况列表查询
export function useTaskImplementList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const getTaskImplementList = async (paramObj: { jobCode?: string; pageIndex?: number; pageSize?: number }) => {
    setLoading(true);
    await getRequest(
      `${APIS.getTaskList}?jobCode=${paramObj.jobCode}&pageIndex=${paramObj?.pageIndex || 1}&pageSize=${
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

  return [loading, pageInfo, source, setSource, setPageInfo, getTaskImplementList];
}

//新增任务
export function useAddTask(): [
  boolean,
  (paramsObj: {
    jobCode: string;
    jobName: string;
    enable: number;
    noticeType: number;
    timeExpression: string;
    jobType: number;
    desc?: string;
    jobContent: string;
    editPwd?: boolean;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createJob = async (paramsObj: {
    jobCode: string;
    jobName: string;
    enable: number;
    noticeType: number;
    timeExpression: string;
    jobType: number;
    desc?: string;
    jobContent: string;
    editPwd?: boolean;
  }) => {
    setLoading(true);
    await postRequest(APIS.createJob, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增任务成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createJob];
}

//任务修改
export function useUpdateTask(): [
  boolean,
  (paramsObj: {
    createUser: any;

    gmtCreate: any;
    gmtModify: any;
    id: any;
    jobCode: any;
    lastExecStatus: any;
    modifyUser: any;
    jobName: string;
    enable: number;
    noticeType: number;
    timeExpression: string;
    jobType: number;
    desc?: string;
    jobContent: string;
    editPwd: boolean;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateTask = async (paramsObj: {
    createUser?: any;

    gmtCreate?: any;
    gmtModify?: any;
    id: number;
    jobCode: any;
    lastExecStatus?: any;
    modifyUser?: any;

    jobName: string;
    enable: number;
    noticeType: number;
    timeExpression: string;
    jobType: number;
    desc?: string;
    jobContent: string;
    editPwd: boolean;
  }) => {
    setLoading(true);
    await putRequest(APIS.updateJob, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('修改成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateTask];
}

//删除任务
export function useDeleteTask(): [boolean, (paramsObj: { jobCode: string }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteTask = async (paramsObj: { jobCode: string }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteJob}/${paramsObj.jobCode}`)
      .then((result) => {
        if (result.success) {
          message.success('删除成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteTask];
}

/** 查询应用列表 */
export const queryAppList = () => {
  return getRequest(APIS.queryAppListApi, {
    data: {
      pageIndex: 1,
      pageSize: 1000,
    },
  }).then((res: any) => {
    if (res.success) {
      const { dataSource = [] } = res.data || {};
      return dataSource.map((app: any) => {
        return {
          ...app,
          value: app.appCode,
          label: app.appCode,
        };
      });
    }
    return [];
  });
};

// 查询应用环境数据

export function useQueryAppEnvData(): [boolean, any, (paramsObj: { appCode: string }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [appEnvDataSource, setAppEnvDataSource] = useState<Record<string, any>[]>([]);
  const queryAppEnvData = async (paramsObj: { appCode: string }) => {
    setLoading(true);
    await getRequest(APIS.listAppEnv, {
      data: {
        appCode: paramsObj?.appCode,
      },
    })
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data;
          const envOption = dataSource?.map((item: any) => ({
            label: item?.envCode || '',
            value: item?.envCode || '',
          }));

          setAppEnvDataSource(envOption);
        } else {
          setAppEnvDataSource([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, appEnvDataSource, queryAppEnvData];
}

//getListContainer

export function useQueryListContainer(): [
  boolean,
  any,
  (paramsObj: { appCode: string; envCode: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [containerNameOption, setContainerNameOption] = useState<Record<string, any>[]>([]);
  const getListContainer = async (paramsObj: { appCode: string; envCode: string }) => {
    setLoading(true);
    await getRequest(APIS.getListContainer, {
      data: {
        appCode: paramsObj?.appCode,
        envCode: paramsObj?.envCode,
      },
    })
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data;
          const option = dataSource?.map((item: any) => ({
            label: item?.containerName || '',
            value: item?.containerName || '',
          }));

          setContainerNameOption(option);
        } else {
          setContainerNameOption([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, containerNameOption, getListContainer];
}

//getNodeList
export function useQueryNodeList(): [boolean, any, (clusterName: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [nodeNameOption, setNodeNameOption] = useState<Record<string, any>[]>([]);
  const getNodeNameList = async (clusterName: string) => {
    setLoading(true);
    await getRequest(APIS.getNodeList, {
      data: {
        clusterName,
      },
    })
      .then((result) => {
        if (result?.success) {
          let dataSource = result.data;
          const option = dataSource?.map((item: any) => ({
            label: item || '',
            value: item || '',
          }));

          setNodeNameOption(option);
        } else {
          setNodeNameOption([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, nodeNameOption, getNodeNameList];
}
