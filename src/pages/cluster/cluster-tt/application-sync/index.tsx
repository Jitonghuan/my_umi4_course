// 应用同步
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:32

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Select, Button, message, Table } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useAppOptions } from './hooks';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../service';

export default function Application() {
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <ContentCard>
      <div className="table-caption">
        <div className="caption-left">
          <span>需同步的应用：</span>
          <Select
            value={appCode}
            // onChange={handleAppCodeChange}
            options={appOptions}
            placeholder="请选择应用"
            showSearch
            style={{ width: 320 }}
          />
        </div>
        <div className="caption-right">
          <Button type="primary" ghost disabled={!appCode || loading || pending}>
            开始应用比对
          </Button>
          <Button
            type="primary"
            disabled={!(appCode && clusterData.length) || loading || pending}
            // onClick={handleSyncClick}
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
              {loading ? '加载中...' : completed ? '暂无数据' : <a>点击开始进行应用比对</a>}
            </div>
          ),
        }}
      >
        <Table.Column dataIndex="cluster" title="集群" />
        <Table.Column dataIndex="PackageVersion" title="版本号" />
        <Table.Column dataIndex="PackageMd5" title="版本MD5值" />
      </Table>
    </ContentCard>
  );
}
