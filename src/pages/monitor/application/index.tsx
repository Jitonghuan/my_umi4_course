import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { Card, Button, Select } from 'antd';

import FEContext from '@/layouts/basic-layout/FeContext';
import HulkForm, { IProps as IFormProps } from '@cffe/vc-hulk-form';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import MatrixPageContent from '@/components/matrix-page-content';
import AppCard from './app-card';
import {
  tableSchema,
  ITableSchema,
  getGCTimeChartOption,
  getGCNumChartOption,
  getMemoryChartOption,
  getGCDataChartOption,
} from './schema';
import {
  queryAppList,
  queryPodInfoApi,
  queryGcCountApi,
  queryGcTimeApi,
  queryJvmHeapApi,
  queryJvmMetaspaceApi,
} from './service';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type IFilter = {
  envCode: string;
  appCode: string;
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
const START_TIME_ENUMS = [
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
const RATE_ENUMS = [
  {
    label: '无',
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
  const { envData } = useContext(FEContext);
  const [appData, setAppData] = useState([]);
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  // 刷新频率
  const [timeRate, setTimeRate] = useState<number>(0);

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
            name: 'envCode',
            label: '环境',
            allowClear: false,
            showSearch: false,
            options: envData?.map((env: any) => {
              return {
                label: env.sysName,
                value: env.id,
              };
            }),
          },
        },
        {
          type: 'Select',
          props: {
            name: 'appCode',
            label: '应用名',
            options: appData,
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
      api: queryGcCountApi,
    },
    {
      title: 'GC瞬时耗时/每分钟',
      getOption: getGCTimeChartOption,
      hasRadio: true,
      api: queryGcTimeApi,
    },
    {
      title: '堆内存详情/每分钟',
      getOption: getMemoryChartOption,
      api: queryJvmHeapApi,
    },
    {
      title: '元空间详情/每分钟',
      getOption: getGCDataChartOption,
      api: queryJvmMetaspaceApi,
    },
  ];

  // 查询应用列表
  const queryApps = () => {
    queryAppList({
      envCode: filter.envCode,
    }).then((resp) => {
      setAppData(resp);
      if (resp.length) {
        setFilter({
          ...filter,
          appCode: resp[0].value,
        });
      }
    });
  };

  // 查询节点使用率
  const { run: queryNodeList, reset, tableProps } = usePaginated({
    requestUrl: queryPodInfoApi,
    requestMethod: 'POST',
    didMounted: false,
    formatRequestParams: (params) => {
      return {
        ...params,
        ...filter,
      };
    },
    pagination: {
      showSizeChanger: true,
      showTotal: (total) => `总共 ${total} 条数据`,
    },
  });

  useEffect(() => {
    if (filter.envCode) {
      queryApps();
    }
  }, [filter.envCode]);

  useEffect(() => {
    if (filter?.envCode && filter?.appCode) {
      reset();
      queryNodeList();
    }
  }, [filter]);

  // 过滤操作
  const handleFilter = useCallback(
    (vals) => {
      setFilter({
        ...filter,
        ...vals,
      });
    },
    [filter],
  );

  return (
    <MatrixPageContent className="monitor-app-list">
      <Card
        className="monitor-app-filter"
        style={{ marginBottom: 12, backgroundColor: '#fff' }}
      >
        <HulkForm
          layout="inline"
          initialValues={{
            envCode: envData && envData[0] ? envData[0].lineCode : undefined,
          }}
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
          <Select value={timeRate} onChange={(value) => setTimeRate(value)}>
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
          <Button
            size="small"
            style={{ float: 'right' }}
            onClick={() => {
              reset();
              queryNodeList();
            }}
          >
            刷新
          </Button>
        </h3>

        <HulkTable
          rowKey="id"
          size="small"
          columns={tableSchema as ColumnProps[]}
          {...tableProps}
        />

        <h3 className="monitor-tabs-content-title">监控图表</h3>
        <VCCardLayout grid={layoutGrid} className="monitor-app-content">
          {appConfig.map((el) => (
            <AppCard {...el} requestParams={filter} />
          ))}
        </VCCardLayout>
      </Card>
    </MatrixPageContent>
  );
};

export default Coms;
