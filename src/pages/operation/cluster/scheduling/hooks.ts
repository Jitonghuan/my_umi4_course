// scheduling hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 09:29

import { useState, useEffect } from 'react';

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
        title: '庆春院区',
        name: 'qingchun',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '余杭院区',
        name: 'yuhang',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '之江院区',
        name: 'zhijiang',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
      {
        title: '城站院区',
        name: 'chengzhan',
        options: [
          { label: 'A集群', value: 'cluster_a' },
          { label: 'B集群', value: 'cluster_b' },
        ],
      },
    ]);
  }, []);

  return [data];
}
