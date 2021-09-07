// 报告列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/09 17:19

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { datetimeCellRender } from '@/utils';
import { Drawer, Table, DatePicker, Switch, Tag } from 'antd';
import FELayout from '@cffe/vc-layout';
import { TemplateItemProps, RecordVo } from '../interfaces';
import { useRecordList } from './hooks';
import ExecResult from '@/components/exec-result';

type statusTypeItem = {
  color: string;
  text: string;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { text: '失败', color: 'error' },
  1: { text: '成功', color: 'success' },
};

const { RangePicker } = DatePicker;

export interface ReordListProps {
  templ?: TemplateItemProps;
  onClose?: () => any;
}

export default function RecordList(props: ReordListProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isMine, setIsMine] = useState(false);
  const [createUser, setCreateUser] = useState<string>();
  const [filterRange, setFilterRange] = useState<moment.Moment[]>();
  const [tableData, total, loading] = useRecordList(props.templ?.id!, createUser, pageIndex, pageSize, filterRange);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logData, setLogData] = useState<string>();

  const checkLog = useCallback((record: RecordVo) => {
    setIsModalVisible(true);
    setLogData(record.logInfo);
  }, []);

  const handleChangeisMine = (next: boolean) => {
    setIsMine(next);
    setCreateUser(next ? userInfo.userName : undefined);
  };

  useEffect(() => {
    if (!props.templ) setPageIndex(1);

    setCreateUser(isMine ? userInfo.userName : undefined);
  }, [props.templ]);

  return (
    <>
      <Drawer width={900} visible={!!props.templ} title="执行记录" onClose={props.onClose} maskClosable={false}>
        <div className="table-caption">
          <h3>模板名称: {props.templ?.name}</h3>
          <div className="caption-right">
            <span>只看我的：</span>
            <Switch checked={isMine} onChange={handleChangeisMine} />
            <RangePicker
              value={filterRange as any}
              style={{ marginLeft: 20 }}
              showTime
              onChange={(v: any) => setFilterRange(v)}
            />
          </div>
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
          <Table.Column title="环境" dataIndex="env" />
          <Table.Column title="条数" dataIndex="num" />
          <Table.Column
            dataIndex="status"
            title="状态"
            render={(text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>}
          />
          <Table.Column dataIndex="gmtCreate" title="创建时间" render={datetimeCellRender} />
          <Table.Column title="创建人" dataIndex="createUser" />

          <Table.Column
            title="操作"
            render={(_, record: RecordVo) => <a onClick={() => checkLog(record)}>查看日志</a>}
            width={100}
          />
        </Table>
      </Drawer>
      <ExecResult visible={isModalVisible} onClose={() => setIsModalVisible(false)} data={logData} />
    </>
  );
}
