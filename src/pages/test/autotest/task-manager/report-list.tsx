// 报告列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/09 17:19

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Drawer, Table } from 'antd';
import { TaskItemVO, TaskReportItemVO } from '../interfaces';
import { useReportList } from './hooks';
import ReportDetail from '../components/report-detail';

export interface ReportListProps {
  task?: TaskItemVO;
  onClose?: () => any;
}

export default function ReportList(props: ReportListProps) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableData, total, loading] = useReportList(props.task?.id!, pageIndex, pageSize);
  const [detailItem, setDetailItem] = useState<TaskReportItemVO>();

  useEffect(() => {
    if (!props.task) setPageIndex(1);
  }, [props.task]);

  return (
    <>
      <Drawer width={900} visible={!!props.task} title="报告管理" onClose={props.onClose} maskClosable={false}>
        <h3 style={{ marginBottom: 16 }}>任务名称: {props.task?.name}</h3>
        <Table
          dataSource={tableData}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onShowSizeChange: (_, next) => setPageSize(next),
            onChange: (next) => setPageIndex(next),
          }}
        >
          <Table.Column title="序号" dataIndex="id" />
          <Table.Column title="总用例数" dataIndex="casesNum" />
          <Table.Column title="成功" dataIndex="success" />
          <Table.Column title="失败" dataIndex="failure" />
          <Table.Column title="错误" dataIndex="error" />
          <Table.Column
            title="执行通过率"
            dataIndex="passRate"
            render={(value: number) => {
              if (typeof value !== 'number') return '--';
              return `${value * 100}%`;
            }}
          />
          <Table.Column
            title="执行完成时间"
            dataIndex="endTime"
            render={(v: string) => {
              return v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '';
            }}
          />
          <Table.Column
            title="操作"
            render={(_, record: TaskReportItemVO) => <a onClick={() => setDetailItem(record)}>查看报告</a>}
            width={100}
          />
        </Table>
      </Drawer>
      <ReportDetail task={props.task} report={detailItem} onClose={() => setDetailItem(undefined)} />
    </>
  );
}
