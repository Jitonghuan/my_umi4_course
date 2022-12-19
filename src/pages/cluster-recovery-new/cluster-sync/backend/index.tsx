// 后端单应用同步
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/09 16:09

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Table } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useAppOptions } from './hooks';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../../service';
import {history} from 'umi'
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';

export default function Application() {
  const [appOptions,getAppOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [jvmConfigInfo, setJvmConfigInfo] = useState();
  const [jvmVisiable, setJvmVisiable] = useState<boolean>(false);
  const [envCode,setEnvCode]=useState<string>("")
  const getEnvCode=()=>{
    queryCommonEnvCode().then((res:any)=>{
      if(res?.success){
        setEnvCode(res?.data)
        let curEnvCode=res?.data
        if(curEnvCode){
            getAppOptions(curEnvCode)

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

  const loadAppList = useCallback(async () => {
    setLoading(true);
    setClusterData([]);
    try {
            getRequest(APIS.singleDiffApp, {
              data: { appCode, envCode:envCode},
            }).then((result) => {
              if (result.success) {
                const source = result.data || {};
                if (typeof source === 'object') {
                  //"isConfDiff": true,
                  if(source?.isConfDiff===true){
                    setClusterData([]);
                    Modal.confirm({
                      title: '该应用A,B集群配置不一致，需要跳转至配置同步页面进行配置同步后再进行应用同步！',
                      onOk: () => {
                        history.push({
                          pathname:"/matrix/cluster-recovery/cluster-sync/nacos",
                        },{
                          type:"isConfDiff",
                          diffInfo:{
                          
                              type:source?.type,
                              namespace:source?.namespace,
                              dataId:source?.dataId
    
    
                            
                          }
                        })

                      }

                    })
                  

                  }else{
                    const next = Object.keys(source).map((appName) => {
                      return { appName, ...source[appName] };
                    });
                    setClusterData(next);

                  }
                 
                  setCompleted(true);
                } else if (typeof source === 'string') {
                  message.info(source);
                }
              }
            });
   
    } finally {
      setLoading(false);
    }
  }, [appCode,envCode]);
  useEffect(()=>{
    getEnvCode()
  },[])

  useEffect(() => {
    if (!appOptions?.length) return;

    if (!appCode) {
      setAppCode(appOptions[0].value);
    }
  }, [appOptions]);

  const handleAppCodeChange = useCallback((next: string) => {
    setAppCode(next);
    setClusterData([]);
    setCompleted(false);
  }, []);

  const handleSyncClick = useCallback(
    (envCode: string) => {
      Modal.confirm({
        title: '确认同步？',
        content: '请确认同步应用配置已是最新',
        onOk: async () => {
          try {
            setPending(true);
          
                  postRequest(APIS.syncSingleApp, {
                    data: { appCode, envCode },
                  }).then((res) => {
                    if (res.success) {
                      const sourceInfo = res?.data || '';
                      message.info(sourceInfo);
                    }
                  });
               
          } finally {
            setPending(false);
          }
        },
      });
    },
    [appCode],
  );

  return (
    <ContentCard>
      <div className="table-caption">
        <div className="caption-left">
          <span>需同步的应用：</span>
          <Select
            value={appCode}
            onChange={handleAppCodeChange}
            options={appOptions}
            placeholder="请选择应用"
            showSearch
            allowClear
            style={{ width: 320 }}
          />
        </div>
        <div className="caption-right">
          <Button type="primary" ghost disabled={!appCode || loading || pending} onClick={loadAppList}>
            开始应用比对
          </Button>
          <Button
            type="primary"
            disabled={!(appCode && clusterData.length) || loading || pending}
            onClick={() => handleSyncClick(envCode)}
          >
            开始同步
          </Button>
        </div>
      </div>
      <Table
        dataSource={clusterData}
        loading={loading}
        bordered
        pagination={false}
        scroll={{ y: window.innerHeight - 330, x: '100%' }}
        locale={{
          emptyText: (
            <div className="custom-table-holder">
              {loading ? '加载中...' : completed ? '暂无数据' : <a onClick={loadAppList}>点击开始进行应用比对</a>}
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
            // render={(text: number) => <Tag color={STATUS_TYPE[text]?.color}>{STATUS_TYPE[text]?.text}</Tag>}
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
      <Modal
        title="查看JVM"
        visible={jvmVisiable}
        footer={false}
        onCancel={() => {
          setJvmVisiable(false);
        }}
      >
        <div>{jvmConfigInfo}</div>
      </Modal>
    </ContentCard>
  );
}
