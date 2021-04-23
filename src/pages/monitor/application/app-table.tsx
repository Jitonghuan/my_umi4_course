import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { Card, Select, Form } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

import HulkForm, { IProps as IFormProps } from '@cffe/vc-hulk-form';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import AppCard from './app-card';
import {
  tableSchema,
  getGCTimeChartOption,
  getGCNumChartOption,
  getMemoryChartOption,
  getGCDataChartOption,
} from './schema';
import {
  queryAppList,
  queryPodInfoApi,
  queryGcCount,
  queryGcTime,
  queryJvmHeap,
  queryJvmMetaspace,
  queryEnvList,
} from './service';

import './index.less';
import { useEffectOnce } from 'white-react-use';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type IFilter = {
  envCode?: string;
  appCode?: string;
};

const layoutGrid = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 2,
  xxl: 2,
  xxxl: 2,
};

// 开始时间枚举
export const START_TIME_ENUMS = [
  {
    label: '30min',
    value: 30 * 60 * 1000,
  },
  {
    label: '1h',
    value: 60 * 60 * 1000,
  },
  {
    label: '6h',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: '12h',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: '24h',
    value: 24 * 60 * 60 * 1000,
  },
];

// 请求频次枚举
export const RATE_ENUMS = [
  {
    label: '刷新频率',
    value: 0,
  },
  {
    label: '10s',
    value: 10,
  },
  {
    label: '20s',
    value: 20,
  },
  {
    label: '30s',
    value: 30,
  },
];

/**
 * Application
 * @description 应用监控页面
 * @create 2021-04-12 19:15:42
 */
const Coms = (props: IProps) => {
  const [filter, setFilter] = useState<IFilter>({} as IFilter);
  const prevFilter = useRef<IFilter>({} as IFilter);
  const [appData, setAppData] = useState([]);
  const [envData, setEnvData] = useState([]);
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  // 刷新频率
  const [timeRate, setTimeRate] = useState<number>(0);
  // 定时器累计数，初始为0，每次定时器执行时加1，触发图的数据刷新，清除定时器后不再增长
  const [rateNum, setRateNum] = useState<number>(0);
  const prevRateNum = useRef<number>(0);
  const [formInstance] = Form.useForm();

  const timeRateInterval = useRef<NodeJS.Timeout>();

  const filterColumns: IFormProps = useMemo(() => {
    return {
      theme: 'basic',
      layout: 'inline',
      isShowReset: false,
      isShowSubmit: false,
      schema: [
        {
          type: 'Select',
          props: {
            name: 'appCode',
            label: '应用名',
            allowClear: false,
            showSearch: false,
            options: appData,
            disabled: props.appCode ? true : false,
          },
        },
        {
          type: 'Select',
          props: {
            name: 'envCode',
            label: '环境',
            allowClear: false,
            showSearch: false,
            options: envData,
          },
        },
      ],
    };
  }, [envData, appData]);

  const appConfig = [
    {
      title: 'GC瞬时次数/每分钟',
      getOption: getGCNumChartOption,
      hasRadio: true,
      queryFn: queryGcCount,
    },
    {
      title: 'GC瞬时耗时/每分钟',
      getOption: getGCTimeChartOption,
      hasRadio: true,
      queryFn: queryGcTime,
    },
    {
      title: '堆内存详情/每分钟',
      getOption: getMemoryChartOption,
      queryFn: queryJvmHeap,
    },
    {
      title: '元空间详情/每分钟',
      getOption: getGCDataChartOption,
      queryFn: queryJvmMetaspace,
    },
  ];

  // 查询应用列表
  const queryApps = () => {
    queryAppList().then((resp) => {
      setAppData(resp);
      prevFilter.current = {
        appCode: props.appCode || (resp.length ? resp[0].value : undefined),
      };
      setFilter(prevFilter.current);
      formInstance.setFieldsValue(prevFilter.current);
    });
  };

  // 查询环境列表
  const queryEnvs = () => {
    queryEnvList({
      appCode: prevFilter.current?.appCode as string,
    }).then((resp) => {
      setEnvData(resp);
      prevFilter.current = {
        ...prevFilter.current,
        envCode: resp.length ? resp[0].value : undefined,
      };
      setFilter(prevFilter.current);
      formInstance.setFieldsValue(prevFilter.current);
    });
  };

  // 查询节点使用率
  const { run: queryNodeList, reset, tableProps } = usePaginated({
    requestUrl: queryPodInfoApi,
    requestMethod: 'GET',
    didMounted: false,
    formatRequestParams: (params) => {
      return {
        ...params,
        pageSize: 1000,
        ...filter,
      };
    },
    formatResult: (resp) => {
      if (resp.data && resp.data[0]) {
        setCurtIp(resp.data[0].hostIP);
      }
      return {
        dataSource: resp.data || [],
        pageInfo: {
          pageIndex: 1,
          pageSize: 1000,
        },
      };
    },
    pagination: false,
  });

  useEffectOnce(() => {
    queryApps();
  });

  useEffect(() => {
    if (filter.appCode) {
      setEnvData([]);
      queryEnvs();
    }
  }, [filter.appCode]);

  useEffect(() => {
    if (filter?.appCode && filter?.envCode) {
      reset();
      queryNodeList();
    }
  }, [filter]);

  // 过滤操作
  const handleFilter = useCallback(
    (vals) => {
      setCurtIp('');
      if (vals.appCode) {
        prevFilter.current = {
          ...vals,
        };
      } else {
        prevFilter.current = {
          ...filter,
          ...vals,
        };
      }
      setFilter(prevFilter.current);
    },
    [filter],
  );

  // 刷新频率改变事件
  const handleTimeRateChange = (value: number) => {
    setTimeRate(value);
    if (timeRateInterval.current) {
      clearInterval(timeRateInterval.current);
    }
    if (value) {
      timeRateInterval.current = setInterval(() => {
        reset();
        queryNodeList();
        prevRateNum.current += 1;
        setRateNum(prevRateNum.current);
      }, value * 1000);
    }
  };

  return (
    <div className="monitor-app-table">
      <Card
        className="monitor-app-filter"
        style={{ marginBottom: 12, backgroundColor: '#fff' }}
      >
        <HulkForm
          form={formInstance}
          layout="inline"
          {...filterColumns}
          className="monitor-filter-form"
          onValuesChange={handleFilter}
        />
        <div className="monitor-time-select">
          <Select value={startTime} onChange={(value) => setStartTime(value)}>
            {START_TIME_ENUMS.map((time) => (
              <Select.Option key={time.value} value={time.value}>
                {time.label}
              </Select.Option>
            ))}
          </Select>
          <Select value={timeRate} onChange={handleTimeRateChange}>
            {RATE_ENUMS.map((time) => (
              <Select.Option key={time.value} value={time.value}>
                {time.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="monitor-app-body">
        <h3 className="monitor-tabs-content-title">
          资源使用情况
          <RedoOutlined
            style={{ float: 'right' }}
            onClick={() => {
              reset();
              queryNodeList();
            }}
          />
        </h3>

        <HulkTable
          rowKey="ip"
          size="small"
          columns={tableSchema as ColumnProps[]}
          // scroll={{ y: 300 }}
          {...tableProps}
          customColumnMap={{
            hostIP: (value: string) => {
              return (
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurtIp(value)}
                >
                  {value}
                </span>
              );
            },
          }}
        />

        <h3 className="monitor-tabs-content-title">
          监控图表&nbsp;&nbsp;{curtIP ? `当前POD：${curtIP}` : ''}
        </h3>
        <VCCardLayout grid={layoutGrid} className="monitor-app-content">
          {appConfig.map((el) => (
            <AppCard
              {...el}
              requestParams={{ ...filter, ip: curtIP, startTime, rateNum }}
            />
          ))}
        </VCCardLayout>
      </Card>
    </div>
  );
};

export default Coms;
