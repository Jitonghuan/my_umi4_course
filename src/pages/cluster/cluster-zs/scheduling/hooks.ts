// scheduling hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/2 09:29

import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../service';
import appConfig from '@/app.config';
import { getCommonEnvCode } from '../../hook';
export function useInitClusterData() {
  const [data, setData] = useState<Record<string, any>>();

  // 初始化数据
  useEffect(() => {
    setData({
      // 'qingchun': 'cluster_a',
      // 'yuhang': 'cluster_b',
      // 'zhijiang': 'cluster_a',
      // 'chengzhan': 'cluster_b',
    });
  }, []);

  return [data];
}

export function useClusterSource() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let commonEnvCode = '';
    let dataArry: any = [];
    if (appConfig.IS_Matrix !== 'public') {
      getRequest(getCommonEnvCode)
        .then((result) => {
          if (result?.success) {
            commonEnvCode = result.data;
          }
        })
        .then(() => {
          getRequest(APIS.getHospitalDistrictInfo, { data: { envCode: commonEnvCode } }).then((resp) => {
            if (resp?.success) {
              resp.data?.map((ele: any) => {
                dataArry.push({
                  title: ele.hospitalDistrictName,
                  name: ele.hospitalDistrictCode,
                  nowDisPatchCluster: ele?.nowDisPatchCluster,
                  options: [
                    { label: 'A集群', value: 'cluster_a', ip: ele.hospitalDistrictIp },
                    { label: 'B集群', value: 'cluster_b', ip: ele.hospitalDistrictIp },
                  ],
                });
              });
              setData(dataArry);
            } else {
              return;
            }
          });
        });
    }
  }, []);

  return [data];
}
