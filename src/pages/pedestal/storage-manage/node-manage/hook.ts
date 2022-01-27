import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

// 获取节点详情
export function useGlusterfsNodeDetail() {
  const [devicesTableData, setDevicesTableData] = useState<any>([]);
  const [brickssTableData, setBricksTableData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryNodeDetail = (clusterCode: string, nodeId: string) => {
    setLoading(true);
    getRequest(APIS.getGlusterfsNodeDetail, { data: { clusterCode, nodeId } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setDevicesTableData(dataSource?.devices);
          setBricksTableData(dataSource?.bricks);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [devicesTableData, brickssTableData, loading, queryNodeDetail];
}

//新增节点
export function useAddNode() {
  const addNode = async (
    clusterCode: string,
    nodeName: string,
    isNewDevice: boolean,
    diskName?: string,
    isWipe?: boolean,
  ) => {
    await postRequest(
      `${APIS.addGlusterfsNode}?clusterCode=${clusterCode}&nodeName=${nodeName}&isNewDevice=${isNewDevice}&diskName=${diskName}&isWipe=${isWipe}`,
    ).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [addNode];
}

//删除节点
export function useDeleteNode() {
  const deleteNode = async (clusterCode: string, nodeName: string) => {
    await postRequest(`${APIS.delGlusterfsNode}?clusterCode=${clusterCode}&nodeName=${nodeName}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [deleteNode];
}
//新增设备
export function useAddDevice() {
  const addDevice = async (clusterCode: string, nodeName: string, diskName?: string, isWipe?: boolean) => {
    await postRequest(
      `${APIS.addGlusterfsDevice}?clusterCode=${clusterCode}&nodeName=${nodeName}&diskName=${diskName}&isWipe=${isWipe}`,
    ).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [addDevice];
}

//获取未部署的主机名
export function useNonNodeList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [glusterfsNonNode, setGlusterfsNonNode] = useState<any>([]);
  const queryGlusterfsNonNodeList = async (clusterCode: string) => {
    setLoading(true);
    await getRequest(APIS.getGlusterfsNonNodeList, { data: { clusterCode } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          let nodeArry: any = [];
          (dataSource || []).map((item: any) => {
            nodeArry.push({
              label: item,
              value: item,
            });
          });
          setGlusterfsNonNode(nodeArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [glusterfsNonNode, loading, queryGlusterfsNonNodeList];
}
//获取可用设备名称
export function useDeviceNameList() {
  const [deviceName, setDeviceName] = useState<any>([]);
  const queryDeviceName = async () => {
    await getRequest(APIS.getDeviceNameList).then((res) => {
      if (res?.success) {
        let dataSource = res?.data;
        let deviceNameArry: any = [];
        (dataSource || []).map((item: any) => {
          deviceNameArry.push({
            label: item,
            value: item,
          });
        });

        setDeviceName(deviceNameArry);
      }
    });
  };
  return [deviceName, queryDeviceName];
}
