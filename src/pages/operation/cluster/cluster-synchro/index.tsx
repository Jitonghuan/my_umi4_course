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
export default function ClusterPage(props: any) {
  //const [keyword, setKeyword] = useState<string>('');
  //const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // const [loading,setLoading] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  const beginClust = async () => {};

  // useEffect(()=>{
  //   // loadingData

  //   // return ()=>{
  //   //   只在销毁之后调用
  //   // }
  // },[])

  //   const handleCancel =

  //     useCallback((value)=>{
  // //慎用
  //     },[props.name])
  //     getRequest

  // const beginClust= async () => {
  //   const values = await (console.log(dataSource));}
  // const res =  postRequest("https://release.zy91.com:4443/futuredog/v1/opsManage/diffApp?Appname=integrated-platform",{
  //   data: values,
  // });
  // console.log(res);
  // setLogVisiable(true);

  const [total, setTotal] = useState<number>(0);
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
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => {
              setPageSize(next), setPageIndex(1);
            },
          }}
          // render有三个参数 value ， index ，
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
