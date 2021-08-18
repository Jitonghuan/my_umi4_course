// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useState } from 'react';
import { Table, Modal } from 'antd';
import moment from 'moment';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';

export default function Operation() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();

  const [detailItem, setDetailItem] = useState<any>();

  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <Table
          // dataSource={tableSouce}
          // loading={loading}
          pagination={{
            current: pageIndex,
            pageSize,
            //   total,
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
          <Table.Column
            title="操作时间"
            dataIndex="gmtCreate"
            render={(v: string) => (v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '--')}
          />

          {/* <Table.Column title="描述" dataIndex="" /> */}
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <div className="action-cell">
                <a onClick={() => setDetailItem(record)}>查看日志</a>
              </div>
            )}
            width={90}
          />
        </Table>
        <Modal
          visible={!!detailItem}
          title="查看日志"
          width={1000}
          maskClosable={false}
          footer={false}
          onCancel={() => setDetailItem(undefined)}
        >
          <pre className="pre-block" style={{ height: window.innerHeight - 300 }}>
            {detailItem?.log}
          </pre>
        </Modal>
      </ContentCard>
    </MatrixPageContent>
  );
}
