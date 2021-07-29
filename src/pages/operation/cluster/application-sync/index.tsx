// 应用同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:32

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Table } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';
import usePublicData from '@/utils/usePublicData';
import { useAppClusterData } from './hooks';

export default function Application(props: any) {
  const { appManageListData } = usePublicData({
    isUseAppType: false,
    isUseAppEnv: false,
    isUseAppBranch: false,
  });
  const [appCode, setAppCode] = useState<string>();
  const [clusterData, loading] = useAppClusterData(appCode);

  useEffect(() => {
    if (!appManageListData?.length) return;
    // const currApp = searchField.getFieldValue('appCode');
    // if (!currApp) {
    //   searchField.setFieldsValue({ appCode: appManageListData[0].value });
    // }
  }, [appManageListData]);

  const handleSyncClick = useCallback(() => {
    Modal.confirm({
      title: '确认同步？',
      content: '请确认同步应用配置已是最新',
      onOk: () => {
        message.success('同步成功！');
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
              options={appManageListData}
              placeholder="请选择应用"
              showSearch
              style={{ width: 320 }}
            />
          </div>
          <Button type="primary" onClick={handleSyncClick}>
            开始同步
          </Button>
        </div>
        <Table dataSource={clusterData} loading={loading} pagination={false}>
          <Table.Column dataIndex="cluster" title="集群" />
          <Table.Column dataIndex="version" title="版本号" />
          <Table.Column dataIndex="md5" title="版本MD5值" />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
