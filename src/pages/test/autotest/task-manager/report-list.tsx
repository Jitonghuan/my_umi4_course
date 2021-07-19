// 报告列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/09 17:19

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Drawer, Table, DatePicker } from 'antd';
import { TaskItemVO, TaskReportItemVO } from '../interfaces';
import { useReportList } from './hooks';
import ReportDetail from '../components/report-detail';

const { RangePicker } = DatePicker;

export interface ReportListProps {
  task?: TaskItemVO;
  onClose?: () => any;
}

export default function ReportList(props: ReportListProps) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterRange, setFilterRange] = useState<moment.Moment[]>();
  const [tableData, total, loading] = useReportList(props.task?.id!, pageIndex, pageSize, filterRange);
  const [detailItem, setDetailItem] = useState<TaskReportItemVO>();

  useEffect(() => {
    if (!props.task) setPageIndex(1);
  }, [props.task]);

  return (
    <>
      <Drawer width={900} visible={!!props.task} title="报告管理" onClose={props.onClose} maskClosable={false}>
        <div className="table-caption">
          <h3>任务名称: {props.task?.name}</h3>
          <RangePicker value={filterRange as any} onChange={(v: any) => setFilterRange(v)} />
        </div>
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
