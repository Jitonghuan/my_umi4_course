// 应用同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:32

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Table } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import { useAppOptions, useAppClusterData } from './hooks';
import { postRequest } from '@/utils/request';
import * as APIS from '../service';

export default function Application(props: any) {
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [clusterData, loading] = useAppClusterData(appCode);

  useEffect(() => {
    if (!appOptions?.length) return;

    if (!appCode) {
      setAppCode(appOptions[0].value);
    }
  }, [appOptions]);

  const handleSyncClick = useCallback(() => {
    Modal.confirm({
      title: '确认同步？',
      content: '请确认同步应用配置已是最新',
      onOk: async () => {
        await postRequest(APIS.singleAppDeploy, {
          data: { appCode },
        });

        message.success('应用同步成功！');
      },
    });
  }, [appCode]);

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="application-sync" history={props.history} />
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <span>需同步的应用：</span>
            <Select
              value={appCode}
              onChange={(next) => setAppCode(next)}
              options={appOptions}
              placeholder="请选择应用"
              showSearch
              style={{ width: 320 }}
            />
          </div>
          <Button type="primary" disabled={!(appCode && clusterData.length)} onClick={handleSyncClick}>
            开始同步
          </Button>
        </div>
        <Table dataSource={clusterData} loading={loading} pagination={false}>
          <Table.Column dataIndex="cluster" title="集群" />
          <Table.Column dataIndex="PackageVersion" title="版本号" />
          <Table.Column dataIndex="PackageMd5" title="版本MD5值" />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
