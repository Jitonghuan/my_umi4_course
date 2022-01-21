import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

// 获取卷brick信息
export function useGetBrickInfo() {
  const [brickTableData, setBrickTableData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getBrickInfo = async (clusterCode: string, volumeName: string) => {
    setLoading(true);
    await getRequest(APIS.getVolumeBrickInfo, { data: { clusterCode, volumeName } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setBrickTableData(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [brickTableData, loading, getBrickInfo];
}

// 获取快照信息
export function useGetSnapshotList() {
  const [snapshotData, setBrickTableData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getSnapshotList = async (clusterCode: string, volumeName: string) => {
    setLoading(true);
    await getRequest(APIS.getVolumeSnapshotList, { data: { clusterCode, volumeName } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setBrickTableData(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [snapshotData, loading, getSnapshotList];
}

//停止卷
export function useStopVolume() {
  const stopVolume = async (clusterCode: string, volumeName: string) => {
    await postRequest(`${APIS.stopVolume}?clusterCode=${clusterCode}&volumeName=${volumeName}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [stopVolume];
}

//删除卷
export function useDeleteVolume() {
  const deleteVolume = async (clusterCode: string, volumeId: string) => {
    await postRequest(`${APIS.deleteVolume}?clusterCode=${clusterCode}&volumeId=${volumeId}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [deleteVolume];
}

//治愈卷
export function useCureVolume() {
  const cureVolume = async (clusterCode: string, volumeName: string, healMethod: string, object: string) => {
    await postRequest(
      `${APIS.healVolume}?clusterCode=${clusterCode}&volumeName=${volumeName}&healMethod=${healMethod}&object=${object}`,
    ).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [cureVolume];
}

//驱逐brick
export function useEvictBrick() {
  const evictBrick = async (clusterCode: string, brickId: string) => {
    await postRequest(`${APIS.evictBrick}?clusterCode=${clusterCode}&brickId=${brickId}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [evictBrick];
}

//创建快照
export function useCreateSnapshot() {
  const createSnapshot = async (
    clusterCode: string,
    volumeName: string,
    snapshotName: string,
    useTimestamp: boolean,
  ) => {
    await postRequest(
      `${APIS.creatSnapshot}?clusterCode=${clusterCode}&volumeName=${volumeName}&snapshotName=${snapshotName}&useTimestamp=${useTimestamp}`,
    ).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [createSnapshot];
}

//恢复快照
export function usereStoreSnapshot() {
  const storeSnapshot = async (clusterCode: string, snapshotName: string) => {
    await postRequest(`${APIS.restoreSnapshot}?clusterCode=${clusterCode}&snapshotName=${snapshotName}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [storeSnapshot];
}

//激活快照
export function useActivateSnapshot() {
  const activateSnapshot = async (clusterCode: string, snapshotName: string) => {
    await postRequest(`${APIS.activateSnapshot}?clusterCode=${clusterCode}&snapshotName=${snapshotName}`).then(
      (res) => {
        if (res?.success) {
          message.success(res?.data);
        }
      },
    );
  };
  return [activateSnapshot];
}

//停用快照
export function useDeactivateSnapshot() {
  const deactivateSnapshot = async (clusterCode: string, snapshotName: string) => {
    await postRequest(`${APIS.deactivateSnapshot}?clusterCode=${clusterCode}&snapshotName=${snapshotName}`).then(
      (res) => {
        if (res?.success) {
          message.success(res?.data);
        }
      },
    );
  };
  return [deactivateSnapshot];
}

//克隆快照
export function useCloneSnapshot() {
  const cloneSnapshot = async (clusterCode: string, snapshotName: string) => {
    await postRequest(`${APIS.cloneSnapshot}?clusterCode=${clusterCode}&snapshotName=${snapshotName}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [cloneSnapshot];
}

//删除快照
export function useDeleteSnapshot() {
  const deleteSnapshot = async (clusterCode: string, snapshotName: string) => {
    await postRequest(`${APIS.deleteSnapshot}?clusterCode=${clusterCode}&snapshotName=${snapshotName}`).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [deleteSnapshot];
}

//获取卷治愈方式
export function useDeviceNameList() {
  const [healMethodOption, setHealMethodOption] = useState<any>([]);
  const queryHealMethod = async () => {
    await getRequest(APIS.getHealMethodList).then((res) => {
      if (res?.success) {
        let dataSource = res?.data;
        let healMethodArry: any = [];
        (dataSource || []).map((item: any) => {
          healMethodArry.push({
            label: item,
            value: item,
          });
        });
        setHealMethodOption(healMethodArry);
      }
    });
  };
  return [healMethodOption, queryHealMethod];
}
