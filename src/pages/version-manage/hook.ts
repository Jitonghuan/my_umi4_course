import { useState, useEffect, useCallback } from 'react';
import { getReleaseList } from './service';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';
import {
    queryPortalList,
    getDemandByProjectList,
    getRegulusProjects,
    getRegulusOnlineBugs,
} from '@/pages/application/service';

// 获取版本号下拉框数据
export function useReleaseOption(props: any) {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback(async (extra?: any) => {
        try {
            setLoading(true);
            const res = await getReleaseList({ ...props, ...extra });
            if (res?.success) {
                const { items } = res?.data || {};
                const options = items.map((e: any) => ({ value: e.releaseNumber, label: e.releaseNumber }))
                setData(options || []);
            }
        } catch (ex) {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [props]);

    useEffect(() => {
        loadData({});
    }, []);
    return [data, loading, loadData]
}

// 获取项目列表
export function usePortalList(props: any) {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback((extra?: any) => {
        setLoading(true);
        postRequest(queryPortalList)
            .then((res: any) => {
                if (res.success) {
                    let dataSource = res.data;
                    let dataArry: any = [];
                    dataSource?.map((item: any) => {
                        dataArry.push({ label: item?.projectName, value: item?.projectId });
                    });
                    setData(dataArry);
                }
            }).finally(() => { setLoading(false) })
    }, [Object.values(props)])
    return [data, loading, loadData]
}

// 获取regules项目列表
export function useRegulesPortal(props: any) {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback((extra: any) => {
        setLoading(true)
        getRequest(getRegulusProjects)
            .then((result) => {
                if (result.success) {
                    let dataSource = result.data.projects;
                    let dataArry: any = [];
                    dataSource?.map((item: any) => {
                        dataArry.push({ label: item?.name, value: item?.id });
                    });
                    setData(dataArry);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [Object.values(props)])
    return [data, loading, loadData]
}

// 获取需求下面的需求列表
export function useDemands(props: any) {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback((extra?: any) => {
        postRequest(getDemandByProjectList, {
            data: { ...props, ...extra },
        })
            .then((result) => {
                if (result.success) {
                    let dataSource = result.data;
                    let dataArry: any = [];
                    dataSource?.map((item: any) => {
                        dataArry.push({ label: item?.title, value: item?.id });
                    });
                    setData(dataArry);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [Object.values(props)])
    return [data, loading, loadData]
}

// 获取线上bug
export function useRegulusOnlineBugs(props: any) {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadData = useCallback((extra?: any) => {
        getRequest(getRegulusOnlineBugs, {
            data: { ...props, ...extra, pageSize: -1 },
        })
            .then((res) => {
                if (res?.success) {
                    let dataArry: any = [];
                    (res?.data?.dataSource || [])?.map((item: any) => {
                        dataArry.push({ label: item?.name, value: item?.id });
                    });
                    setData(dataArry);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [Object.values(props)])
    return [data, loading, loadData]
}