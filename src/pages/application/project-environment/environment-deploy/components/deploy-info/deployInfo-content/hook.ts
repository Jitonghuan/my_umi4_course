// 部署信息 hooks
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/11/11 17:27

import { useState, useEffect } from 'react';
import * as APIS from './service';
import { getRequest, postRequest } from '@/utils/request';
import { message } from 'antd';

//查看环境集群信息
export function useDeployInfoData(envCode: any) {
  const [listEnvClusterData, setListEnvClusterData] = useState<any>();
  const [isSucess, setIsSucess] = useState<boolean>(false);
  // let isSucess: boolean = false;
  const loadInfoData = async (envCode: any, operateType: boolean) => {
    await getRequest(APIS.listEnvCluster, { data: { envCode: envCode } }).then((result) => {
      if (result.success) {
        let data = result.data;
        setListEnvClusterData(data);
        // isSucess = true;
        setIsSucess(true);
      }
    });
  };
  return [listEnvClusterData, loadInfoData, setListEnvClusterData, isSucess];
}

export function useInstanceList(appCode: any, envCode: any) {
  const [instanceListData, setInstanceListData] = useState<any>();
  const [instanceLoading, setInstanceLoading] = useState<boolean>(false);

  const queryInstanceList = async (appCode: any, envCode: any) => {
    getRequest(APIS.queryInstanceListApi, { data: { appCode, envCode } })
      .then((result) => {
        setInstanceLoading(true);
        let data = result?.data;
        setInstanceListData(data);
      })
      .finally(() => {
        setInstanceLoading(false);
      });
  };
  return [instanceListData, instanceLoading, queryInstanceList, setInstanceListData, setInstanceLoading];
}

//还有一个参数需要传过来>>instName
export function useListContainer() {
  const [queryContainerData, setQueryContainerData] = useState<any[]>([]);
  const queryContainer = async (appCode: any, envCode: any, instName: any) => {
    getRequest(APIS.listContainer, { data: { appCode, envCode, instName } }).then((result) => {
      let data = result.data;
      if (result.success) {
        const listContainer = data.map((item: any) => ({
          value: item?.containerName,
          label: item?.containerName,
        }));
        setQueryContainerData(listContainer);
      }
    });
  };
  return [queryContainer, queryContainerData];
}

//删除应用实例  还有一个参数需要传过来>>instName
export function useDeleteInstance() {
  const deleteInstance = async (appCode: any, envCode: any, instName: any) => {
    await postRequest(APIS.deleteInstance, { data: { appCode, envCode, instName } }).then((resp) => {
      if (resp.success) {
        message.success('删除应用实例成功！');
      }
    });
  };

  return [deleteInstance];
}

//下载日志
export function useDownloadLog() {
  const downloadLog = async (appCode: any, envCode: any, instName: any, containerName: any, filePath: any) => {
    await getRequest(APIS.fileDownload, { data: { appCode, envCode, instName, containerName, filePath } }).then(
      (resp) => {
        if (resp.success) {
          message.success('下载日志成功！');
        }
      },
    );
  };

  return [downloadLog];
}
