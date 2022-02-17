import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import appConfig from '@/app.config';

export function useCreateProjectEnv() {
  const [ensureLoading, setEnsureLoading] = useState<boolean>(false);
  const createProjectEnv = async (creatParamsObj: any) => {
    setEnsureLoading(true);
    await postRequest(APIS.createProjectEnv, { data: creatParamsObj })
      .then((res) => {
        if (res.success) {
          message.success('新增项目环境成功！');
        }
      })
      .finally(() => {
        setEnsureLoading(false);
      });
  };
  return [ensureLoading, createProjectEnv];
}

export function useUpdateProjectEnv() {
  const updateProjectEnv = async (updateParamsObj: any) => {
    await putRequest(APIS.updateProjectEnv, { data: updateParamsObj }).then((res) => {
      if (res.success) {
        message.success('编辑项目环境成功！');
      }
    });
  };
  return [updateProjectEnv];
}

export function useDeleteProjectEnv() {
  const deleteProjectEnv = async (envCode: string) => {
    await delRequest(`${appConfig.apiPrefix}/appManage/projectEnv/delete/${envCode}`).then((res) => {
      if (res?.success) {
        message.success('删除成功！');
      }
    });
  };
  return [deleteProjectEnv];
}

export function useQueryAppsList() {
  const [dataSource, setDataSource] = useState<any>({});
  const queryAppsList = async (envCode: string) => {
    await getRequest(APIS.queryAppsList, { data: { envCode } }).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        setDataSource(data);
      }
    });
  };
  return [queryAppsList, dataSource];
}

export function useQueryCategory() {
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  useEffect(() => {
    selectCategory();
  }, []);
  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };
  return [categoryData];
}

export function useEnvList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [envDataSource, setEnvDataSource] = useState<any>([]);
  useEffect(() => {
    queryEnvData();
  }, []);
  const queryEnvData = () => {
    setLoading(true);
    getRequest(APIS.queryEnvList, {
      data: {
        pageIndex: -1,
      },
    })
      .then((result) => {
        if (result?.success) {
          let data = result?.data?.dataSource;
          let dataArry: any = [];
          data?.map((item: any) => {
            dataArry.push({
              label: item?.envName,
              value: item?.envCode,
            });
          });
          setEnvDataSource(dataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, envDataSource];
}
