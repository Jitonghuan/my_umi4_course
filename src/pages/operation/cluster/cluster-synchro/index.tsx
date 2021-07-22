// 集群同步
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/12 17:00

import React, { useCallback, useEffect, useState } from 'react';
import { Input, Button, Table } from 'antd';
import { history } from 'umi';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { datetimeCellRender } from '@/utils';
import HeaderTabs from '../components/header-tabs';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { result, values } from '_@types_lodash@4.14.171@@types/lodash';
export default function ClusterPage(props: any) {
  //const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  const beginClust = async () => {
    // await setDataSource();
  };
  useEffect(() => {
    total;
    getRequest(APIS.diffClusterApp).then((result) => {
      var result = JSON.parse(result);

      let { tableSource, pageInfo } = result || {};
      setDataSource(tableSource);
      setTotal(pageInfo?.total);
    });
  }, []);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="cluster-synchro" history={props.history} />
      <ContentCard>
        <div className="test-page-header" style={{ float: 'right' }}>
          <Button type="primary" size={'large'} onClick={beginClust}>
            开始集群同步
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          bordered
          // loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            defaultPageSize: 20,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column title="应用名" dataIndex="Appname" width="10%" />
          <Table.Column title="A集群版本" dataIndex="createUser" width="15%" />
          <Table.Column title="B集群版本" dataIndex="gmtModify" render={datetimeCellRender} width="15%" />
          <Table.Column title="A集群版本MD5" dataIndex="colonyA" width="30%" ellipsis />
          <Table.Column title="B集群版本MD5" dataIndex="colonyB" width="30%" ellipsis />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
