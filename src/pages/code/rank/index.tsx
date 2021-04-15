import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Card, Button, Radio, Table } from 'antd';

import MatrisPageContent from '@/components/matris-page-content';
import VcHulkTable, { ColumnProps } from '@cffe/vc-hulk-table';
import ds from '@config/defaultSettings';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type IModule = {
  /** 类型 */
  type: string;
  /** title */
  title: string;
  /** 数据源 */
  dataSource: any[];
  /** 表格 columns */
  columns: ColumnProps[];
};

/**
 * Rank
 * @description 代码排行榜页面
 * @create 2021-04-15 15:57:08
 */
const Coms = (props: IProps) => {
  const [activeType, setActiveType] = useState<'month' | 'dayj'>('month');

  // 模块数据集合
  const [moduleData, setModuleData] = useState<IModule[]>([]);

  const commonColumns = [
    {
      dataIndex: 'rank',
      title: '排名',
      render: (_: any, __: any, idx: number) => <span>TOP{idx + 1}</span>,
    },
    { dataIndex: 'name', title: '姓名' },
    { dataIndex: 'num', title: '数量' },
  ];

  // 查询表格数据
  const queryTableData = async () => {
    setModuleData([
      {
        title: '测试1',
        type: 'code1',
        dataSource: [],
        columns: commonColumns,
      },
      {
        title: '测试2',
        type: 'code2',
        dataSource: [],
        columns: commonColumns,
      },
      {
        title: '测试3',
        type: 'code3',
        dataSource: [],
        columns: commonColumns,
      },
    ]);
  };

  useEffect(() => {
    queryTableData();
  }, []);

  // 模块
  const renderModule = ({
    title,
    type,
    dataSource = [],
    columns = [],
  }: IModule) => {
    return (
      <div className="code-module-item">
        <div className="code-module-header">
          <h3>{title}</h3>
          <Button
            onClick={() => {
              // 跳转 detail 页面
              history.push(`${ds.pagePrefix}/code/details?type=${type}`);
            }}
          >
            更多
          </Button>
        </div>
        <VcHulkTable dataSource={dataSource} columns={columns} />
      </div>
    );
  };

  return (
    <MatrisPageContent>
      <Card className="code-page">
        <Radio.Group
          className="code-radio"
          onChange={(e) => setActiveType(e.target.value)}
          defaultValue={activeType}
        >
          <Radio.Button value="month">月</Radio.Button>
          <Radio.Button value="day">日</Radio.Button>
        </Radio.Group>

        <div className="code-module-content">
          {moduleData.map((el) => renderModule({ ...el }))}
        </div>
      </Card>
    </MatrisPageContent>
  );
};

export default Coms;
