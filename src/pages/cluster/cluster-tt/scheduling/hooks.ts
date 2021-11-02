// scheduling hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/2 09:29

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
        title: '天台县医院',
        name: 'xyy',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '县卫生院',
        name: 'xwsy',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '赤城街道',
        name: 'ccjd',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '平桥镇',
        name: 'pqz',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
    ]);
  }, []);

  return [data];
}
