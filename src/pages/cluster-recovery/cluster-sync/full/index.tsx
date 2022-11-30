// 集群同步
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/9 10:05

import React, { useState, useRef, useEffect } from 'react';
import { Button, Table, Alert, Modal } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useTableData } from './hooks';
import { history } from 'umi';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';

export default function ClusterPage() {
  const [tableData, fromCache, loading, completed, reloadData] = useTableData();
  const [jvmConfigInfo, setJvmConfigInfo] = useState<any>('');
  const [jvmVisiable, setJvmVisiable] = useState<boolean>(false);
  const [envCode,setEnvCode]=useState<string>("")
  const getEnvCode=()=>{
    queryCommonEnvCode().then((res:any)=>{
      if(res?.success){
        setEnvCode(res?.data)
        let curEnvCode=res?.data
        if(curEnvCode){
            reloadData(true,curEnvCode)

        }
        
      }else{
        setEnvCode("")
      }

    })
  }
  const showModal = (current: any) => {
    setJvmConfigInfo(current);
    setJvmVisiable(true);
  };

  useEffect(() => {
    getEnvCode()
  }, []);

  return (
    <ContentCard>
      <Modal
        title="查看JVM"
        visible={jvmVisiable}
        footer={false}
        onCancel={() => {
          setJvmVisiable(false);
        }}
      >
        <span>{jvmConfigInfo}</span>
      </Modal>
      <div className="table-caption">
        <h3>集群列表</h3>
        <div className="caption-right">
          <Button type="primary" ghost disabled={loading} onClick={() => reloadData(false,envCode)}>
            开始比对
          </Button>
          <Button
            type="primary"
            disabled={loading || !tableData?.length}
            onClick={() =>
              history.push({
                pathname: './cluster-sync-detail'
              },

                { commonEnvCode:envCode,
              })
            }
          >
            开始集群同步
          </Button>
        </div>
      </div>
      {fromCache && !loading ? (
        <Alert
          type="info"
          style={{ marginBottom: 16 }}
          showIcon
          message={
            <span>
              当前数据更新时间 {fromCache}，<a onClick={() => reloadData(false,envCode)}>重新比对</a>
            </span>
          }
        />
      ) : null}
      <Table
        rowKey="appName"
        dataSource={tableData}
        bordered
        loading={{ spinning: loading, tip: '正在进行数据比对中，请耐心等待' }}
        pagination={false}
        scroll={{
          y: window.innerHeight - 330,
          x: '100%',
        }}
        locale={{
          emptyText: (
            <div className="custom-table-holder">
              {loading ? (
                '加载中……'
              ) : completed ? (
                '当前双集群版本一致，无需同步'
              ) : (
                <a onClick={() => reloadData(false,envCode)}>当前无缓存数据，点击开始进行比对</a>
              )}
            </div>
          ),
        }}
      >
        <Table.Column title="应用名" dataIndex="appName" width={140} />
        <Table.ColumnGroup title="应用镜像Tag">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'appImageTag']} width={140} />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'appImageTag']}
            width={140}
            render={(current, record: any) => (
              <span style={{ color: current !== record?.ClusterA?.appImageTag ? 'red' : 'black' }}>{current}</span>
            )}
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="基础镜像Tag">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'baseImageTag']} width={140} />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'baseImageTag']}
            width={140}
            render={(current, record: any) => (
              <span style={{ color: current !== record?.ClusterA?.baseImageTag ? 'red' : 'black' }}>{current}</span>
            )}
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="CPU限制值">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'cpuLimits']} width={120} />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'cpuLimits']}
            width={120}
            render={(current, record: any) => (
              <span style={{ color: current !== record?.ClusterA?.cpuLimits ? 'red' : 'black' }}>{current}</span>
            )}
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="JVM参数">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'jvmConfig']} width={340} ellipsis />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'jvmConfig']}
            width={340}
            ellipsis
            render={(current, record: any) => (
              <a
                onClick={() => showModal(current)}
                style={{
                  textDecoration: 'underline',
                  color: current !== record?.ClusterA?.jvmConfig ? 'red' : 'black',
                }}
              >
                {current}
              </a>
            )}
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="内存限制值">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'memoryLimits']} width={120} />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'memoryLimits']}
            width={120}
            render={(current, record: any) => (
              <span style={{ color: current !== record?.ClusterA?.memoryLimits ? 'red' : 'black' }}>{current}</span>
            )}
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="副本数">
          <Table.Column title="A集群" dataIndex={['ClusterA', 'replicas']} width={120} />
          <Table.Column
            title="B集群"
            dataIndex={['ClusterB', 'replicas']}
            width={120}
            render={(current, record: any) => (
              <span style={{ color: current !== record?.ClusterA?.replicas ? 'red' : 'black' }}>{current}</span>
            )}
          />
        </Table.ColumnGroup>
      </Table>
    </ContentCard>
  );
}
