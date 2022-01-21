import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
// 获取卷数据
export function useVolumeList() {
  const [volumeTableData, setVolumeTableData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryVolumeList = (
    clusterCode: string,
    volumeName?: string,
    volumeType?: string,
    pvName?: string,
    pvcName?: string,
  ) => {
    setLoading(true);
    getRequest(APIS.getGlusterfsVolumeList, { data: { clusterCode, volumeName, volumeType, pvName, pvcName } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setVolumeTableData(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [volumeTableData, loading, queryVolumeList];
}

//获取卷类型
export function useVolumeTypeList() {
  const [volumeTypeOption, setVolumeTypeOption] = useState<any>([]);
  const queryDeviceName = async () => {
    await getRequest(APIS.getVolumeTypeList).then((res) => {
      if (res?.success) {
        let dataSource = res?.data;
        let volumeTypeArry: any = [];
        (dataSource || []).map((item: any) => {
          volumeTypeArry.push({
            label: item,
            value: item,
          });
        });

        setVolumeTypeOption(volumeTypeArry);
      }
    });
  };
  return [volumeTypeOption, queryDeviceName];
}

//是否开启卷的NFS功能
export function useEnableNfs() {
  const enableNfs = async (clusterCode: string, volumeName: string, enableNfs?: string) => {
    await postRequest(APIS.enableNfs, { data: { clusterCode, volumeName, enableNfs } }).then((res) => {
      if (res?.success) {
        message.success(res?.data);
      }
    });
  };
  return [enableNfs];
}
