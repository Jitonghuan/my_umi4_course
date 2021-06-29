// 函数管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useEffect } from 'react';
import { Input, Table, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { datetimeCellRender } from '@/utils';
import './index.less';

export default function DemoPageList() {
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);

  const handleSearch = () => {
    pageIndex === 1 ? queryData() : setPageIndex(1);
  };

  const queryData = () => {
    setLoading(true);
    getRequest(APIS.funcList, {
      data: { keyword, pageIndex, pageSize },
    })
      .then((result) => {
        const { dataSource, pageInfo } = result.data || {};

        setDataSource(dataSource || []);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryData();
  }, [pageIndex, pageSize]);

  return (
    <MatrixPageContent>
      <ContentCard>
        <div className="test-page-header">
          <Input.Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => handleSearch()}
            onSearch={() => handleSearch()}
            style={{ width: 320 }}
          />
        </div>
        <Table
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column title="序号" dataIndex="id" width={60} />
          <Table.Column title="函数名" dataIndex="name" ellipsis />
          <Table.Column title="描述" dataIndex="desc" ellipsis />
          <Table.Column title="创建人" dataIndex="createUser" width={140} />
          <Table.Column title="操作时间" dataIndex="gmtModify" width={180} render={datetimeCellRender} />
          <Table.Column
            title="操作"
            width={120}
            render={(_, record: Record<string, any>, index) => (
              <div className="action-cell">
                <a>修改</a>
                <Popconfirm title="确定要删除该函数吗？" onConfirm={() => console.log(record, index)}>
                  <a>删除</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
