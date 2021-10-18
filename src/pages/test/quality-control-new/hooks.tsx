import { useState, useEffect, useContext, useRef } from 'react';
import { getRequest } from '@/utils/request';
import { Form } from 'antd';
import FELayout from '@cffe/vc-layout';
import * as APIS from './service';
import type * as INTERFACES from './interface';

export function useAppCateEnum() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppCateList_new).then((result) => {
      const source = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.id,
      }));

      setData(source);
    });
  }, []);

  return [data];
}

export function useAppCodeEnum() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppCodeList_old).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.categoryCode,
        value: n.id,
      }));

      setData(source);
    });
  }, []);

  return [data];
}

export function useAllAppCodeQualityConf(keyword: string): [any[], () => void] {
  const [data, setData] = useState<INTERFACES.IConfig[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getRequest(APIS.getAllAppCodeQualityConf).then((res) => {
      setData(res.data || []);
    });
  };

  if (keyword?.length) {
    return [data.filter((item) => item.appCode.includes(keyword) || item.categoryCode.includes(keyword)), loadData];
  }

  return [data, loadData];
}

export function useAllRanking() {
  const [data, setData] = useState<INTERFACES.IRanking>({});

  useEffect(() => {
    getRequest(APIS.getRanking).then((res) => {
      setData(res.data);
    });
  }, []);

  return [data];
}

export function useAllAppServices() {
  const [data, setData] = useState<IOption[]>([{ label: '测试1', value: 'test1' }]);

  useEffect(() => {
    getRequest(APIS.getAppList, { data: { appType: 'backend', appDevelopLanguage: 'java', pageSize: -1 } }).then(
      (res) => {
        let source = res.data.dataSource.map((item: any) => {
          return {
            // value: `${item.appCategoryCode}/${item.appCode}`,
            value: `${item.appCode}`,
            label: `${item.appCategoryCode}/${item.appCode}`,
            ...item,
          };
        });
        setData(source);
      },
    );
  }, []);

  return [data];
}

export function useAppTrendMap() {
  const [data, setData] = useState<INTERFACES.ITrend>({
    qualityPoints: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    codeLines: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    codeBugs: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    utPassRate: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    codeDuplicationsRate: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    utCovRate: {
      data: [
        {
          name: '邮件营销',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
  });
  return [data];
}

export function useTaskList(): [
  any[],
  [number, React.Dispatch<React.SetStateAction<number>>],
  [number, React.Dispatch<React.SetStateAction<number>>],
  number,
  any,
  () => void,
] {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [form] = Form.useForm();

  const loadData = () => {
    getRequest(APIS.getTaskList, {
      data: { pageIndex, pageSize, currentUser: userInfo.userName, ...form.getFieldsValue() },
    }).then((res) => {
      setData(res.data?.dataSource);
      setTotal(res.data?.pageInfo.total);
    });
  };

  return [data, [pageIndex, setPageIndex], [pageSize, setPageSize], total, form, loadData];
}

export function useAppCategoryOptions() {
  const [data, setData] = useState<IOption[]>();
  useEffect(() => {
    getRequest(APIS.getAppCateList_new).then((res) => {
      const source = res.data.dataSource.map((item: any) => ({
        label: item.categoryName,
        value: item.categoryCode,
        data: item,
      }));
      setData(source);
    });
  }, []);
  return [data];
}

export function useGradeInfo() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    getRequest(APIS.getGradeInfo).then((res) => {
      setData({ ...res.data, codeCoverageGrade: res.data.codeDuplicationsGrade });
    });
  }, []);

  return [data, setData];
}

export function useGlobalConf() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    getRequest(APIS.getGlobalConf).then((res: any) => {
      setData(res.data);
    });
  }, []);

  return [data];
}
