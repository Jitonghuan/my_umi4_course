import React, { useEffect, useMemo } from 'react';
import { Tag, Table, Empty, Descriptions, Divider, Button } from 'antd';
import { columns, creatContainerColumns } from '../components/deployment-list/columns';
import { ContentCard } from '@/components/vc-page-content';
import { LIST_STATUS_TYPE } from '../deployInfo-content/schema';
import { useGetPodEventList, useListContainer } from './hook';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';
import './index.less';

export default function ContainerInfo(props: any) {
  let location: any = useLocation();
  const query = parse(location.search);
  const { infoRecord, appCode, projectEnvCode, viewLogEnvType, id, projectEnvName, benchmarkEnvCode } = location.state?.infoRecord || {};
  const [podLoading, podListSource, setPodListSource, getPodEventList] = useGetPodEventList();
  const [queryContainer, queryContainerData, loading] = useListContainer();
  useEffect(() => {
    if (!infoRecord?.instName || !projectEnvCode || !appCode) {
      return;
    }

    getPodEventList({ instName: infoRecord?.instName, envCode: projectEnvCode });
    queryContainer({ instName: infoRecord?.instName, envCode: projectEnvCode, appCode });
  }, [infoRecord?.instName]);
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (infoRecord?.instName && projectEnvCode && appCode) {
        getPodEventList({ instName: infoRecord?.instName, envCode: projectEnvCode });
        queryContainer({ instName: infoRecord?.instName, envCode: projectEnvCode, appCode });
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [infoRecord?.instName]);

  // 表格列配置
  const containerColumns = useMemo(() => {
    return creatContainerColumns({
      onViewLogClick: (record, index) => {
        // history.push(
        //   `/matrix/application/detail/viewLog?appCode=${appCode}&envCode=${envCode}&instName=${infoRecord?.instName}&viewLogEnvType=${viewLogEnvType}`,
        // );
        history.push({
          pathname: `/matrix/application/environment-deploy/viewLog`,
          search: `appCode=${appCode}&projectEnvCode=${projectEnvCode}&instName=${infoRecord?.instName}&projectEnvName=${projectEnvName}&optType=containerInfo&containerName=${record?.containerName}&benchmarkEnvCode=${benchmarkEnvCode}`
          // query: {
          //   appCode: appCode,
          //   projectEnvCode: projectEnvCode,
          //   instName: infoRecord?.instName,
          //   // viewLogEnvType: viewLogEnvType,
          //   projectEnvName: projectEnvName,
          //   optType: 'containerInfo',
          //   containerName: record?.containerName,
          // },
        },
          {
            infoRecord: infoRecord,

          });
      },
      onLoginShellClick: (record, index) => {
        history.push(
          `/matrix/application/environment-deploy/loginShell?appCode=${appCode}&projectEnvCode=${projectEnvCode}&instName=${infoRecord?.instName}&containerName=${record?.containerName}&projectEnvName=${projectEnvName}&optType=containerInfo&benchmarkEnvCode=${benchmarkEnvCode}`,
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
                search: `viewLogEnv=${projectEnvCode || ''}&projectEnvCode=${projectEnvCode}&projectEnvName=${projectEnvName}&type=viewLog_goBack&id=${id}&appCode=${appCode}&benchmarkEnvCode=${benchmarkEnvCode}`,
                // query: {
                //   viewLogEnv: projectEnvCode || '',
                //   projectEnvCode: projectEnvCode,
                //   projectEnvName: projectEnvName,
                //   // viewLogEnvType: viewLogEnvType,
                //   type: 'viewLog_goBack',
                //   id: id,
                //   appCode: appCode,
                // },
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
            <Tag color={LIST_STATUS_TYPE[infoRecord?.instStatus]?.color || 'default'}>
              {LIST_STATUS_TYPE[infoRecord?.instStatus]?.text || infoRecord?.instStatus}
            </Tag>
          }
        </Descriptions.Item>
        <Descriptions.Item label="运行镜像">{infoRecord?.image || '--'}</Descriptions.Item>
        <Descriptions.Item label="运行环境">{projectEnvCode || '--'}</Descriptions.Item>
        <Descriptions.Item label="实例IP">{infoRecord?.instIP || '--'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{infoRecord?.createTime || '--'}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <h3 className="container-info-title">容器列表：</h3>
      <Table
        scroll={{ y: window.innerHeight - 564 }}
        pagination={false}
        columns={containerColumns}
        bordered
        // loading={loading}
        dataSource={queryContainerData}
        locale={{ emptyText: <Empty description="没有容器信息" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />

      <Divider />

      <h3 className="deployment-info-title">实例（Pod）事件：</h3>
      <Table
        columns={columns}
        pagination={false}
        scroll={{ y: window.innerHeight - 564 }}
        dataSource={podListSource}
        bordered
        // loading={podLoading}
        locale={{ emptyText: <Empty description="没有事件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </ContentCard>
  );
}
