import { useState, useEffect, useCallback } from 'react';
import { getNode, getResourceList, getResourceType } from './service';
const mockdata = [
  {
    nodeName: '11',
    memoryInfo: { total: '100' },
    labels: {
      key1: 'key1',
      key2: 'key2',
      key3: 'jldafldjfldjfldf',
      key4: 'jsdkjfkdjflfdfdfdfdnvnjdhfdkhfkdsdsj',
      key5: 'jsdkjfasjfldjfldfhdfdfdjfdjfdjfkdjfldjfldjfjdfkdjfldsj',
    },
    tags: ['111', '222', '2333'],
    taints: [
      {
        key: 'key',
        value: 'value',
        effect: 'NoSchedule',
      },
    ],
    unschedulable: true,
  },
  {
    nodeName: '11',
    memoryInfo: { total: '100' },
    labels: {
      key1: 'key1',
      key2: 'key2',
      key3: 'jldafldjfldjfldf',
      key4: 'jsdkjfkdjflfdfdfdfdnvnjdhfdkhfkdsdsj',
      key5: 'jsdkjfasjfldjfldfhdfdfdjfdjfdjfkdjfldjfldjfjdfkdjfldsj',
    },
    tags: ['111', '222', '2333'],
    taints: [
      {
        key: 'key',
        value: 'value',
        effect: 'NoSchedule',
      },
    ],
    unschedulable: true,
  },
];

// 获取节点列表
export function useNodeListData(props: any) {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async (extra?: any) => {
    try {
      setLoading(true);
      const result = await getNode({ ...props, ...extra });
      if (result?.success) {
        const { items } = result?.data || {};
        setData(items || []);
        setTotal(items?.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (ex) {
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, Object.values(props));

  useEffect(() => {
    loadData({});
  }, Object.values(props));
  return [data, total, loading, loadData];
}

// 获取资源详情列表
export function useResourceListData(props: any) {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async (extra?: any) => {
    try {
      if (!props.clusterCode) {
        return;
      }
      setLoading(true);
      const result = await getResourceList({ ...props, ...extra });
      const { dataSource, pageInfo } = result?.data || {};
      // setData(dataSource || []);
      setTotal(dataSource?.length);
    } catch (ex) {
      // setData([]);
    } finally {
      setLoading(false);
    }
  }, Object.values(props));

  useEffect(() => {
    loadData({});
  }, Object.values(props));

  return [data, total, loading, loadData];
}

// 资源详情-资源类型下拉框数据
export function useResourceType(props: any) {
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(
    async (extra?: any) => {
      try {
        setData([])
        const result = await getResourceType({ ...props });
        if (result?.success) {
          const res = result?.data?.map((item: string) => ({ label: item, value: item }));
          setData(res);
        } else {
          setData([]);
        }
      } catch (ex) {
        setData([]);
      } finally {
      }
    },
    [props],
  );

  useEffect(() => {
    loadData({});
  }, Object.values(props));
  return [data];
}

// 资源详情-命名空间下拉框数据
export function useNameSpace(props: any) {
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(
    async (extra?: any) => {
      try {
        setData([])
        const result = await getResourceList({ ...props });
        if (result?.success) {

          const res = result?.data?.items?.map((item: any) => ({ label: item.name || 'AllNamespaces', value: item.name }));
          // res.unshift({ label: 'AllNamespaces', value: '' });
          setData(res);
        } else {
          setData([]);
        }
      } catch (ex) {
        setData([]);
      } finally {
      }
    },
    [props],
  );

  useEffect(() => {
    loadData({});
  }, Object.values(props));

  return [data];
}
