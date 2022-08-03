import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Form, Button, Table, Select, Input } from 'antd';
import { taskTableSchema } from '../schema';
import AddDrawer from './add-drawer';

export default function TaskManage() {
  const [visible, setVisble] = useState(false);
  const [dataSource, setDataSource] = useState([{ name: 'name1' }]);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);
  // 表格列配置
  const tableColumns = useMemo(() => {
    return taskTableSchema({
      handleDetail: (record: any, index: any) => {
        // history.push({
        //     pathname: '/matrix/pedestal/cluster-detail/load-detail',
        //     query: { key: 'resource-detail', ...location.query },
        // })
      },
      edit: (record: any, index: any) => {},
      stop: (record: any, index: any) => {},
      handleDelete: (record: any, index: any) => {},
    }) as any;
  }, [dataSource]);
  return (
    <div>
      <AddDrawer
        visible={visible}
        onClose={() => {
          setVisble(false);
        }}
      />
      <div className="flex-space-between" style={{ marginBottom: '5px' }}>
        <h3>任务列表</h3>
        <Button
          type="primary"
          onClick={() => {
            setVisble(true);
          }}
        >
          新增任务
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        // loading={loading}
        bordered
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          total: 50,
          current: pageIndex,
          showSizeChanger: true,
          onShowSizeChange: (_, next) => {
            setPageSize(next);
          },
          onChange: (next) => setPageIndex(next),
        }}
        columns={tableColumns}
      ></Table>
    </div>
  );
}
