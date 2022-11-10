import { useState, useEffect, useCallback } from 'react';
import { getAppType, getVersion } from './service';

// 获取应用分类
export function useAppGroupData(props: any) {
    const [data, setData] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback(async (extra?: any) => {
        // try {
        //     setLoading(true);
        //     const result = await getAppType({ ...props, ...extra });
        //     if (result?.success) {
        //         const { items } = result?.data || {};
        //         setData(items || []);
        //         setTotal(items?.length);
        //     } else {
        //         setData([]);
        //         setTotal(0);
        //     }
        // } catch (ex) {
        //     setData([]);
        //     setTotal(0);
        // } finally {
        //     setLoading(false);
        setData([{ label: '应用组1', value: 'code1' }, { label: '应用组2', value: 'code2' }])
        // }
    }, Object.values(props));

    useEffect(() => {
        loadData({});
    }, Object.values(props));
    return [data, total, loading, loadData];
}

// 获取版本号
export function useVersion(props: any) {
    const [data, setData] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback(async (extra?: any) => {
        // try {
        //     setLoading(true);
        //     const result = await getVersion({ ...props, ...extra });
        //     if (result?.success) {
        //         const { items } = result?.data || {};
        //         setData(items || []);
        //         setTotal(items?.length);
        //     } else {
        //         setData([]);
        //         setTotal(0);
        //     }
        // } catch (ex) {
        //     setData([]);
        //     setTotal(0);
        // } finally {
        //     setLoading(false);
        setData([{ label: '1.2.1', value: '1.2.1' }, { label: '1.2.2', value: '1.2.2' }])
        // }
    }, Object.values(props));

    useEffect(() => {
        loadData({});
    }, Object.values(props));
    return [data, total, loading, loadData]
}