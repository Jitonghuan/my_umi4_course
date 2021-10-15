// scheduling hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 09:29

import { useState, useEffect } from 'react';
// import { getRequest } from '@/utils/request';
// import * as APIS from '../service';

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
    setData([
      {
        title: '天台人民医院',
        name: '天台',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '乡镇卫生院',
        name: 'yuhang',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      // {
      //   title: '城站院区',
      //   name: 'chengzhan',
      //   options: [
      //     { label: 'A集群', value: 'cluster_a' },
      //     { label: 'B集群', value: 'cluster_b' },
      //   ],
      // },
    ]);
  }, []);

  return [data];
}
