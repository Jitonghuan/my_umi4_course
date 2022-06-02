import React, { useEffect, useMemo ,useState} from 'react';
import { Tag, Table, Empty, Descriptions, Divider, Button } from 'antd';
import { columns, creatContainerColumns } from '../components/deployment-list/columns';
import { ContentCard } from '@/components/vc-page-content';
import useInterval from '@/pages/application/application-detail/components/application-deploy/deploy-content/useInterval';
import { LIST_STATUS_TYPE } from '../deployInfo-content/schema';
import { useGetPodEventList, useListContainer,queryContainerMethods,getListPodEventMethods } from './hook';
import { history } from 'umi';
import './index.less';

export default function ContainerInfo(props: any) {
  const { infoRecord, appCode, envCode, viewLogEnvType, id } = props.location.state;
  // const [podLoading, podListSource, setPodListSource, getPodEventList] = useGetPodEventList();
  // const [queryContainer, queryContainerData, loading] = useListContainer();
  const [queryContainerData,setQueryContainerData]=useState<any>([]);
  const [podListSource,setPodListSource]=useState<any>([]);
  // let infoRecord:any=JSON.parse(initRecord)||{}
  const containerIntervalFunc=()=>{
  
   
    queryContainer({ instName: infoRecord?.instName, envCode: envCode, appCode });
  }
  const podIntervalFunc=()=>{
  
    getPodEventList({ instName: infoRecord?.instName, envCode: envCode });
    
  }


  const getPodEventList=(paramObj: { instName: string; envCode: string })=>{
    getListPodEventMethods(paramObj).then((res)=>{
      setPodListSource(res);
      if(res.length==0){
        getPodTimerHandler('stop')
      }


    })
  
  }

  const queryContainer=(paramsObj: { appCode: string; envCode: string; instName: string })=>{
    queryContainerMethods(paramsObj).then((res)=>{
      setQueryContainerData(res);
      if(res.length==0){
        getContainerTimerHandler('stop')
      }

    })

  }
  //引用定时器
  const { getStatus: getContainerStatus, handle: getContainerTimerHandler } = useInterval(containerIntervalFunc, 30000, {
    immediate: false,
  });
  //引用定时器
  const { getStatus: getPodStatus, handle: getPodTimerHandler } = useInterval(podIntervalFunc, 30000, {
    immediate: false,
  });
  useEffect(() => {
    if (!infoRecord?.instName || !envCode || !appCode) {
      return;
    }

    getPodEventList({ instName: infoRecord?.instName, envCode: envCode });
    queryContainer({ instName: infoRecord?.instName, envCode: envCode, appCode });
  }, [infoRecord?.instName]);
  // useEffect(() => {
  //   let intervalId = setInterval(() => {
  //     if (infoRecord?.instName && envCode && appCode) {
  //       getPodEventList({ instName: infoRecord?.instName, envCode: envCode });
  //       queryContainer({ instName: infoRecord?.instName, envCode: envCode, appCode });
  //     }
  //   }, 30000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [infoRecord?.instName]);

  // 表格列配置
  const containerColumns = useMemo(() => {
    return creatContainerColumns({
      onViewLogClick: (record, index) => {
        // history.push(
        //   `/matrix/application/detail/viewLog?appCode=${appCode}&envCode=${envCode}&instName=${infoRecord?.instName}&viewLogEnvType=${viewLogEnvType}`,
        // );
        history.push({
          pathname: `/matrix/application/detail/viewLog`,
          query: {
            appCode: appCode,
            envCode: envCode,
            instName: infoRecord?.instName,
            viewLogEnvType: viewLogEnvType,
            optType: 'containerInfo',
            containerName: record?.containerName,
          },
          state: {
            infoRecord: infoRecord,
          },
        });
      },
      onLoginShellClick: (record, index) => {
        history.push(
          `/matrix/application/detail/loginShell?appCode=${appCode}&envCode=${envCode}&instName=${infoRecord?.instName}&containerName=${record?.containerName}&optType=containerInfo`,
        );
      },
    }) as any;
  }, []);
  return (
    <ContentCard className="container-info">
      <Descriptions
        title="实例信息："
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={3}
        bordered
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.replace({
                pathname: `deployInfo`,
                query: {
                  viewLogEnv: envCode || '',
                  viewLogEnvType: viewLogEnvType,
                  type: 'viewLog_goBack',
                  id: id,
                  appCode: appCode,
                },
              });
            }}
          >
            返回
          </Button>
        }
      >
        <Descriptions.Item label="实例名称" contentStyle={{ whiteSpace: 'nowrap' }}>
          {infoRecord?.instName || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="运行状态">
          {
            <Tag color={LIST_STATUS_TYPE[infoRecord.instStatus]?.color || 'default'}>
              {LIST_STATUS_TYPE[infoRecord.instStatus]?.text || infoRecord.instStatus}
            </Tag>
          }
        </Descriptions.Item>
        <Descriptions.Item label="运行镜像">{infoRecord?.image || '--'}</Descriptions.Item>
        <Descriptions.Item label="运行环境">{envCode || '--'}</Descriptions.Item>
        <Descriptions.Item label="实例IP">{infoRecord?.instIP || '--'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{infoRecord?.createTime || '--'}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <h3 className="container-info-title">容器列表：</h3>
      <Table
        scroll={{ y: window.innerHeight - 564 }}
        pagination={false}
        bordered
        columns={containerColumns}
        // loading={loading}
        dataSource={queryContainerData}
        locale={{ emptyText: <Empty description="没有容器信息" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />

      <Divider />

      <h3 className="deployment-info-title">实例（Pod）事件：</h3>
      <Table
        columns={columns}
        pagination={false}
        bordered
        scroll={{ y: window.innerHeight - 564 }}
        dataSource={podListSource}
        // loading={podLoading}
        locale={{ emptyText: <Empty description="没有事件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </ContentCard>
  );
}
