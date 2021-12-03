// scheduling hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/2 09:29

import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../service';

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

  // 暂时写死数据
  useEffect(() => {
    getRequest(APIS.getHospitalDistrictInfo, { data: { envCode: 'hbos-test' } }).then((resp) => {
      if (resp?.success) {
        setData([
          {
            title: resp?.data[0].hospitalDistrictName,
            name: resp?.data[0].hospitalDistrictCode,

            options: [
              { label: 'A集群', value: 'cluster_a', ip: resp?.data[0].HospitalDistrictIp },
              { label: 'B集群', value: 'cluster_b', ip: resp?.data[0].HospitalDistrictIp },
            ],
          },
        ]);
      }
    });
  }, []);

  return [data];
}
