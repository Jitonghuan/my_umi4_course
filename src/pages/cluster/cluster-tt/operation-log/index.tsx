// 操作记录
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2021/11/2 10:35

import React, { useState } from 'react';
import { Table, Modal } from '@cffe/h2o-design';
import { datetimeCellRender } from '@/utils';
import { ContentCard } from '@/components/vc-page-content';
import { useLogSource } from './hooks';
import ExecResult from '@/components/exec-result';

export default function Operation() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableSouce, total, loading] = useLogSource(pageIndex, pageSize);
  const [detailItem, setDetailItem] = useState<any>();

  return (
    <ContentCard>
      <Table
        dataSource={tableSouce}
        loading={loading}
        pagination={{
          current: pageIndex,
          pageSize,
          total,
          onChange: (next) => setPageIndex(next),
          showSizeChanger: true,
          onShowSizeChange: (_, next) => {
            setPageIndex(1);
            setPageSize(next);
          },
        }}
      >
        <Table.Column title="操作人" dataIndex="createUser" />
        <Table.Column title="操作类别" dataIndex="category" />
        <Table.Column title="创建时间" dataIndex="gmtCreate" render={datetimeCellRender} />
        <Table.Column title="结束时间" dataIndex="gmtModify" render={datetimeCellRender} />
        <Table.Column
          title="操作"
          render={(_, record: any) => (
            <div className="action-cell">
              <a onClick={() => setDetailItem(record)}>查看记录</a>
            </div>
          )}
          width={90}
        />
      </Table>
      <ExecResult visible={!!detailItem} data={detailItem?.log} onClose={() => setDetailItem(undefined)} />
    </ContentCard>
  );
}
