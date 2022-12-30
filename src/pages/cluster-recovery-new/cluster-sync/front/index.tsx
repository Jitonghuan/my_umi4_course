// 应用同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:32

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Table } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useAppOptions } from './hooks';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../../service';

export default function FrontApplication() {
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startDiffApp = useCallback(async () => {
    setLoading(true);
    setClusterData([]);
    const appIndex = appOptions.findIndex((item) => item.value == appCode);
    if (appIndex == -1) {
      return;
    }
    const { feType } = appOptions[appIndex].info;
    try {
      const res = await getRequest(APIS.getCommonEnvCode);
      const envCode = res?.data || undefined;
      if (envCode) {
        const result = await getRequest(APIS.diffFeSingleApp, {
          data: { appCode, envCode, feType },
        });
        if (result.success && !result?.data) {
          message.info('该应用前端版本一致，无需同步');
          return;
        }
        const source = result?.data;
        if (typeof source ==='string' && source !=='') {
          const next = [
            { cluster: 'A', difference: source },
            { cluster: 'B', difference: '-' },
          ];
          setClusterData(next);
          setCompleted(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [appCode]);

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

  const handleSyncClick = useCallback(async () => {
    const appIndex = appOptions.findIndex((item) => item.value == appCode);
    if (appIndex == -1) {
      return;
    }
    const { feType } = appOptions[appIndex].info;
    Modal.confirm({
      title: '确认同步？',
      content: '请确认同步应用配置已是最新',
      onOk: async () => {
        try {
          setPending(true);
          const res = await getRequest(APIS.getCommonEnvCode);
          const envCode = res.data || undefined;
          if (envCode) {
            const syncResult = await postRequest(APIS.syncSingleFeApp, {
              data: { appCode, envCode, feType },
            });
            if (syncResult?.success) {
              message.success('应用同步成功！');
              setClusterData([]);
            }
          }
        } finally {
          setPending(false);
        }
      },
    });
  }, [appCode]);

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
            style={{ width: 320 }}
          />
        </div>
        <div className="caption-right">
          <Button type="primary" ghost disabled={!appCode || loading || pending} onClick={startDiffApp}>
            开始应用比对
          </Button>
          <Button
            type="primary"
            disabled={!(appCode && clusterData.length) || loading || pending}
            onClick={handleSyncClick}
          >
            开始同步
          </Button>
        </div>
      </div>
      <Table
        dataSource={clusterData}
        loading={loading}
        pagination={false}
        locale={{
          emptyText: (
            <div className="custom-table-holder">
              {loading ? '加载中...' : completed ? '暂无数据' : <a onClick={startDiffApp}>点击开始进行应用比对</a>}
            </div>
          ),
        }}
      >
        <Table.Column dataIndex="cluster" title="集群" />
        <Table.Column dataIndex="difference" title="差异版本号" />
      </Table>
    </ContentCard>
  );
}
