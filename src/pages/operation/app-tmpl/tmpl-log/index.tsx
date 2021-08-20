// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useState, useEffect } from 'react';
import { Table, Modal } from 'antd';
import moment from 'moment';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
import { recordFieldMap } from '@/pages/application/application-detail/components/second-party-pkg/deploy-content/components/publish-record/schema';

export default function Operation() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<any>();
  const [pageTotal, setPageTotal] = useState<number>();
  const [logList, setLogList] = useState<any>([]); //查看日志列表信息
  //进入页面架加载信息
  useEffect(() => {
    setLoading(true);
    getRequest(APIS.logList, { data: { pageIndex, pageSize } })
      .then((res: any) => {
        if (res.success) {
          const logList = (res.data.dataSource || []).map((n: any) => ({
            id: n.id,
            operator: n.operator,
            operateType: n.operateType,
            operateTime: n.operateTime,
          }));
          setLogList(logList);
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          setPageTotal(pageTotal);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const showLogModal = (record: any) => {
    getRequest(APIS.logList, { data: { id: record.id } }).then((res: any) => {
      if (res.success) {
        const logDetail = res.data.dataSource[0].content || '';
        // console.log('日志详细内容：', logDetail);
        setDetailItem(logDetail);
      }
    });
  };
  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <Table
          bordered
          dataSource={logList}
          loading={loading}
          pagination={{
            current: pageIndex,
            pageSize,
            total: pageTotal,
            showTotal: () => `总共 ${pageTotal} 条数据`,
            onChange: (next) => setPageIndex(next),
            showSizeChanger: true,
            onShowSizeChange: (_, next) => {
              setPageIndex(1);
              setPageSize(next);
            },
          }}
        >
          <Table.Column title="id" dataIndex="id" />
          <Table.Column title="操作人" dataIndex="operator" />
          <Table.Column title="操作类型" dataIndex="operateType" width="38%" />
          <Table.Column
            title="操作时间"
            dataIndex="operateTime"
            render={(v: string) => (v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '--')}
          />
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <div className="action-cell">
                <a onClick={() => showLogModal(record)}>查看日志</a>
              </div>
            )}
            width={180}
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
            {/* {detailItem?.log} */}
            {detailItem}
          </pre>
        </Modal>
      </ContentCard>
    </MatrixPageContent>
  );
}
