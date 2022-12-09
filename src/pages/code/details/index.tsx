import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Select, DatePicker, Card, Button, Radio } from 'antd';
import moment from 'moment';
import PageContainer from '@/components/page-container';
import VcHulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import { queryTimeDataApi, ITimeItem, queryDetailTableDataApi } from '../service';
import { getUrlParams } from '@/utils/index';
import '../rank/index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type IModuleType = 'commitNo' | 'filePath' | 'app';

type IModule = {
  /** 类型 */
  type: IModuleType;
  /** title */
  title: string;
  /** 数据源 */
  dataSource?: any[];
};

// 表格类型统计
const tableTypeEnumMap: { [key: string]: string } = {
  commitNo: '人员提交次数',
  filePath: '文件修改次数',
};

// 统计类型枚举
const countTypeOptions = [
  { label: '人员提交次数', value: 'commitNo' },
  { label: '文件修改次数', value: 'filePath' },
];

/**
 * Details
 * @description 代码详情页面
 * @create 2021-04-15 15:57:08
 */
const Coms = (props: IProps) => {
  const { type, timeType } = getUrlParams();
  // 统计类型
  const [countType, setCountType] = useState<'commitNo' | 'filePath'>(type);
  // 时间类型
  const [activeType, setActiveType] = useState<'month' | 'day'>(timeType || 'month');
  // 当前年月时间
  const [currentDate, setCurrentDate] = useState<string>();
  // 时间选择列表
  const [timeLists, setTimeLists] = useState<IOption[]>([]);
  // 当前选择的具体时间
  const [currentTime, setCurrentTime] = useState<string | undefined>();
  // 模糊查询条件
  const [statisticsKey, setStatisticsKey] = useState<string>();

  // 查询表格数据
  const { run: queryTableData, tableProps } = usePaginated({
    requestUrl: queryDetailTableDataApi,
    requestMethod: 'GET',
    showRequestError: true,
    initPageInfo: {
      pageSize: 20,
    },
    pagination: {
      showTotal: (total) => `共 ${total} 条数据`,
    },
  });

  useEffect(() => {
    if (!currentDate) {
      return;
    }

    setCurrentTime(undefined);
    queryTimeData();
  }, [currentDate]);

  useEffect(() => {
    queryTableData({
      statisticsType: countType,
      statisticsCycle: currentTime,
      statisticsKey,
    });
  }, [currentTime, countType]);

  // 查询统计时间数据
  const queryTimeData = async () => {
    const resp = await getRequest(queryTimeDataApi, {
      data: {
        cycleType: activeType,
        cyclePrefix: currentDate,
      },
    });

    const { dataSource = [] } = resp.data || {};

    setTimeLists(
      dataSource.map((el: ITimeItem) => ({
        label: el.cycleDate,
        value: el.cycleDate,
      })),
    );
    setCurrentTime(dataSource.length > 0 ? dataSource[0].cycleDate : undefined);
  };

  // 模块
  const renderModule = () => {
    const tableColumns = [
      { dataIndex: 'appCode', width: 50, title: '应用CODE' },
      {
        dataIndex: 'statisticsType',
        width: 50,
        title: '统计类型',
        render: (val: string) => tableTypeEnumMap[val],
      },
      { dataIndex: 'statisticsCycle', width: 50, title: '统计周期' },
      {
        dataIndex: 'statisticsKey',
        width: countType === 'commitNo' ? 50 : 150,
        title: (countType === 'commitNo' && '提交人') || (countType === 'filePath' && '文件') || '提交人/文件',
        copyable: true,
        showTooltip: true,
        ellipsis: true,
      },
      { dataIndex: 'statisticsValue', width: 30, title: '计数' },
    ];

    return (
      <div className="code-module-item-row">
        <div className="code-module-header">
          <h3>统计详情</h3>
        </div>
        <VcHulkTable {...tableProps} columns={tableColumns} />
      </div>
    );
  };

  useEffect(() => {
    setCurrentDate(activeType === 'month' ? moment().format('YYYY') : moment().format('YYYY-MM'));
    setCurrentTime(undefined);
  }, [activeType]);

  return (
    <PageContainer>
      <Card className="code-page">
        <div className="code-filter">
          <Select
            className="code-filter-type"
            value={countType}
            options={countTypeOptions}
            onChange={setCountType}
            placeholder="统计类型"
            showSearch
            allowClear
          />
          <Radio.Group
            className="code-radio"
            onChange={(e) => {
              setActiveType(e.target.value);
            }}
            defaultValue={activeType}
          >
            <Radio.Button value="month">月</Radio.Button>
            <Radio.Button value="day">日</Radio.Button>
          </Radio.Group>
          <DatePicker
            className="code-filter-picker"
            value={currentDate ? moment(currentDate) : undefined}
            format={activeType === 'day' ? 'YYYY-MM' : 'YYYY'}
            picker={activeType === 'day' ? 'month' : 'year'}
            onChange={(_, dateStr) => setCurrentDate(dateStr)}
          />
          <Select
            className="code-filter-time"
            value={currentTime}
            options={timeLists}
            onChange={setCurrentTime}
            placeholder="时间周期"
            showSearch
            allowClear
          />
        </div>

        <div className="code-module-content">{renderModule()}</div>
      </Card>
    </PageContainer>
  );
};

export default Coms;
