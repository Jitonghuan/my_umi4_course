import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { stringify } from 'qs';
import { Select, DatePicker, Card, Button, Radio } from 'antd';
import moment from 'moment';

import MatrixPageContent from '@/components/matrix-page-content';
import VcHulkTable from '@cffe/vc-hulk-table';
import ds from '@config/defaultSettings';
import { getRequest } from '@/utils/request';
import { queryTimeDataApi, ITimeItem, queryTableDataApi } from '../service';
import { getTableColumns } from '../dic';

import './index.less';

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
  /** 展示更多 */
  isShowMore?: boolean;
};

// 表格类型统计
const tableTypeEnum: IModule[] = [
  {
    title: '人员提交次数统计',
    type: 'commitNo',
  },
  {
    title: '文件修改次数统计',
    type: 'filePath',
  },
  {
    title: '应用提交次数统计',
    type: 'app',
    isShowMore: false,
  },
];

/**
 * Rank
 * @description 代码排行榜页面
 * @create 2021-04-15 15:57:08
 */
const Coms = (props: IProps) => {
  const [activeType, setActiveType] = useState<'month' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<string>(
    moment().format('YYYY'),
  );
  // 时间选择列表
  const [timeLists, setTimeLists] = useState<IOption[]>([]);
  // 当前选择的具体时间
  const [currentTime, setCurrentTime] = useState<string>();

  // 表数据 map
  const [commitNoData, setCommitNoData] = useState<any[]>([]);
  const [filePathData, setFilePathData] = useState<any[]>([]);
  const [appData, setAppData] = useState<any[]>([]);

  // 查询表格数据
  const queryTableData = async (rankingType: IModuleType) => {
    const resp = await getRequest(queryTableDataApi, {
      data: {
        rankingType,
        rankingCycle: currentTime,
      },
    });

    const { data = [] } = resp;

    rankingType === 'commitNo' && setCommitNoData(data);
    rankingType === 'filePath' && setFilePathData(data);
    rankingType === 'app' && setAppData(data);
  };

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

  useEffect(() => {
    queryTimeData();
  }, [currentDate]);

  useEffect(() => {
    if (!currentTime) {
      setCommitNoData([]);
      setFilePathData([]);
      setAppData([]);
      return;
    }

    tableTypeEnum.forEach((el) => {
      queryTableData(el.type);
    });
  }, [currentTime]);

  useEffect(() => {
    setCurrentDate(
      activeType === 'month'
        ? moment().format('YYYY')
        : moment().format('YYYY-MM'),
    );
    setCurrentTime(undefined);
  }, [activeType]);

  // 模块
  const renderModule = ({
    title,
    type,
    dataSource,
    isShowMore = true,
  }: IModule) => {
    return (
      <div className="code-module-item">
        <div className="code-module-header">
          <h3>{title}</h3>
          {isShowMore && (
            <Button
              ghost
              type="primary"
              onClick={() => {
                const query = {
                  type,
                  timeType: activeType,
                };
                // 跳转 detail 页面
                history.push(
                  `${ds.pagePrefix}/code/details?${stringify(query)}`,
                );
              }}
            >
              详情
            </Button>
          )}
        </div>
        <VcHulkTable
          dataSource={dataSource}
          columns={getTableColumns(type)}
          pagination={false}
        />
      </div>
    );
  };

  return (
    <MatrixPageContent>
      <Card className="code-page">
        <div className="code-filter">
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

        <div className="code-module-content">
          {tableTypeEnum.map((el) =>
            renderModule({
              ...el,
              dataSource:
                (el.type === 'commitNo' && commitNoData) ||
                (el.type === 'filePath' && filePathData) ||
                appData,
            }),
          )}
        </div>
      </Card>
    </MatrixPageContent>
  );
};

export default Coms;
