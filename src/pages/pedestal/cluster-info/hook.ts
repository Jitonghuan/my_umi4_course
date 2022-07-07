import { useState, useEffect, useCallback } from 'react';
import { getCluster, getNode } from './service'

// 获取集群列表
export function useClusterListData(props: any) {
    const [data, setData] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback(
        async (extra?: any) => {
            try {
                setLoading(true);
                const result = await getCluster({ ...props, ...extra })
                const { dataSource, pageInfo } = result?.data || {};
                setData(dataSource || []);
                setTotal(pageInfo.total)
            } catch (ex) {
                setData([]);
            } finally {
                setLoading(false);
            }
        },
        Object.values(props),
    );

    useEffect(() => {
        loadData({});
    },
        Object.values(props)

    );

    return [data, total, loading, loadData];
}

// 获取节点列表
export function useNodeListData(props: any) {
    const mockdata = [
        {
            nodeName: '11',
            memoryInfo: { total: '100' },
            labels: { key1: 'key1', key2: 'key2' },
            tags: ['111', '222', '2333'],
            taints: [{
                "key": "key",
                "value": "value",
                "effect": "NoSchedule"
            }]
        }]

    const [data, setData] = useState<any>(mockdata);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback(
        async (extra?: any) => {
            try {
                setLoading(true);
                const result = await getNode({ ...props, ...extra })
                const { dataSource, pageInfo } = result?.data || {};
                // setData(dataSource || []);
                setTotal(pageInfo.total)
            } catch (ex) {
                // setData([]);
            } finally {
                setLoading(false);
            }
        },
        Object.values(props),
    );

    useEffect(() => {
        loadData({});
    },
        Object.values(props)
    );

    return [data, total, loading, loadData];
}