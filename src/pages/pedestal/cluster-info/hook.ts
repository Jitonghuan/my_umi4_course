import { useState, useEffect, useCallback } from 'react';
import { getCluster } from './service'

interface propsInterface {
    pageSize: number,
    pageIndex: number
}

// 获取集群列表
export function useClusterListData(props: propsInterface) {
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
                setTotal(0);
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