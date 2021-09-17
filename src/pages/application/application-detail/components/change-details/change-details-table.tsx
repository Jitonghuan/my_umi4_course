// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import { getRequest } from '@/utils/request';

export interface appChangeTableProps {
  loading?: boolean;
}
export default function appChangeTable(props: appChangeTableProps) {
  const { loading } = props;
  const { Option } = Select;
  const [appChangeData, setAppChangeData] = useState<any>([]); //表格数据
  useEffect(() => {}, []);

  const columns = [
    {
      title: '排名',
      dataIndex: 'sorter',
      key: 'sorter',
    },
    {
      title: '统计周期',
      dataIndex: 'statisticalCycle',
    },
    {
      title: '环境',
      dataIndex: 'envCode',
    },
    {
      title: '文件',
      dataIndex: 'file',
    },
    {
      title: '修改次数',
      dataIndex: 'modificationTimes',
      sorter: {
        compare: (a: any, b: any) => a.modificationTimes - b.modificationTimes,
        // multiple: 1,
      },
    },
  ];
  const countList = [
    {
      key: '1',
      sorter: '1',
      statisticalCycle: 'yyy',
      envCode: 'HBos-dev',
      file: 'xxxx',
      modificationTimes: '777',
      description: '',
    },
    {
      key: '2',
      sorter: '2',
      statisticalCycle: 'yyy',
      envCode: 'HBos-dev',
      file: 'xxxx',
      modificationTimes: '887',
      description: '',
    },
  ];
  const onExpand = () => {
    debugger;
    let arr = [];
    arr.push({
      title: '排名列',
      dataIndex: 'sorter',
      key: 'sorter',
    });
    columns.concat(arr);

    //需要考虑当clumns长度大于多少的时候 把数组的最后一个下标删除
  };
  const expandedRowRender = () => {
    const columns = [
      { title: '日期', dataIndex: 'date', key: 'date' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },

      // render: () => (
      //   <Space size="middle">
      //     <a>Pause</a>
      //     <a>Stop</a>
      //     <Dropdown overlay={menu}>
      //       <a>
      //         More <DownOutlined />
      //       </a>
      //     </Dropdown>
      //   </Space>
      // ),
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
  };

  return (
    <section data-loading={loading}>
      <div style={{ marginBottom: '2%', display: 'flex' }}>
        <span>查询周期：</span>
        <Select style={{ width: 120 }} onChange={handleChange}>
          <Option value="jack">最近7天</Option>
          <Option value="lucy">最近15天</Option>
          <Option value="Yiminghe">最近30天</Option>
        </Select>
        <div style={{ marginLeft: '2%' }}>
          <span>查询环境：</span>
          <Select style={{ width: 120 }} onChange={handleChange}>
            <Option value="jack">HBOS开发</Option>
            <Option value="lucy">HBOS本地</Option>
            <Option value="Yiminghe">HBOS生产</Option>
          </Select>
        </div>
      </div>
      <div>
        <header>
          <h3>应用模块变更详情</h3>
        </header>
        <div className="clusterTable" style={{ width: '90%', marginLeft: '4%', marginTop: '2%' }}>
          <Table
            rowKey="sorter"
            bordered
            columns={columns}
            dataSource={countList}
            pagination={false}
            //   expandable={{
            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            //     rowExpandable: record => record.sorter !== 'Not Expandable',
            //   }}
            expandable={{ expandedRowRender }}
            onExpand={onExpand}
          />
        </div>
      </div>
    </section>
  );
}
