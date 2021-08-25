// 部署信息
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:45

import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Tabs, Button, Table, message, Popconfirm, Spin, Empty } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '@/pages/application/application-detail/context';
import { postRequest } from '@/utils/request';
import { IStatusInfoProps } from '@/pages/application/application-detail/types';
import * as APIS from '@/pages/application/service';
import { useAppEnvList, useAppDeployInfo, useAppChangeOrder } from './hooks';
import RollbackModal from './components/rollback-modal';
import './index.less';

const getStatusClazz = (text: string) => {
  return /成功|正常/.test(text) ? 'text-success' : /失败|错误|异常/.test(text) ? 'text-error' : '';
};

export default function AppDeployInfo() {
  const { appData } = useContext(DetailContext);
  const [envList, isLoading] = useAppEnvList(appData?.appCode);
  const [currEnvCode, setCurrEnv] = useState<string>();
  const [deployData, deployDataLoading, reloadDeployData] = useAppDeployInfo(currEnvCode, appData?.deploymentName);
  const [changeOrderData, changeOrderDataLoading, reloadChangeOrderData] = useAppChangeOrder(
    currEnvCode,
    appData?.deploymentName,
  );
  const [rollbackVisible, setRollbackVisible] = useState(false);
  const intervalRef = useRef<any>();

  useEffect(() => {
    if (envList.length && !currEnvCode) {
      setCurrEnv(envList[0].envCode);
    }
  }, [envList]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      reloadDeployData(false);
      reloadChangeOrderData(false);
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currEnvCode, appData]);

  // 重启机器
  const handleRestartItem = useCallback(
    async (record: IStatusInfoProps) => {
      await postRequest(APIS.restartApplication, {
        data: {
          deploymentName: appData?.deploymentName,
          envCode: record.envCode,
          eccid: record?.eccid,
          owner: appData?.owner,
        },
      });

      message.success('操作成功！');
      reloadDeployData();
      reloadChangeOrderData();
    },
    [appData, currEnvCode],
  );

  if (isLoading) {
    return (
      <div className="block-loading">
        <Spin tip="正在获取环境信息" />
      </div>
    );
  }
  if (!envList.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="该应用没有可使用的环境" />;
  }

  return (
    <ContentCard className="page-app-deploy-info">
      <Tabs activeKey={currEnvCode} onChange={(next) => setCurrEnv(next)}>
        {envList.map((item) => (
          <Tabs.TabPane tab={item.envName} key={item.envCode} />
        ))}
      </Tabs>
      <div className="section-group">
        <section className="section-left">
          <div className="table-caption">
            <div className="caption-left"></div>
            <div className="caption-right">
              <Button type="default" danger onClick={() => setRollbackVisible(true)}>
                发布回滚
              </Button>
            </div>
          </div>
          <Table
            dataSource={deployData}
            loading={deployDataLoading}
            bordered
            pagination={false}
            scroll={{ y: window.innerHeight - 340 }}
          >
            <Table.Column title="所属环境" dataIndex="envName" />
            <Table.Column title="节点IP" dataIndex="ip" />
            <Table.Column
              title="运行状态"
              dataIndex="appStateName"
              render={(v: string) => <span className={getStatusClazz(v)}>{v}</span>}
            />
            <Table.Column
              title="变更状态"
              dataIndex="taskStateName"
              render={(v: string) => <span className={getStatusClazz(v)}>{v}</span>}
            />
            <Table.Column
              title="操作"
              render={(_, record: IStatusInfoProps) => (
                <div className="action-cell">
                  <Popconfirm title={`确定重启 ${record.ip} 吗？`} onConfirm={() => handleRestartItem(record)}>
                    <Button size="small" type="primary" ghost loading={record.taskState === 1}>
                      重启
                    </Button>
                  </Popconfirm>
                </div>
              )}
              width={100}
            />
          </Table>
        </section>
        <section className="section-right">
          <h3>变更信息</h3>
          <div className="section-inner">
            {changeOrderDataLoading ? (
              <div className="block-loading">
                <Spin />
              </div>
            ) : null}
            {changeOrderData.map((item, index) => (
              <div className="change-order-item" key={index}>
                <p>
                  <span>创建时间：</span>
                  <b>{item.createTime}</b>
                </p>
                <p>
                  <span>结束时间：</span>
                  <b>{item.finishTime}</b>
                </p>
                <p>
                  <span>变更类型：</span>
                  <b>{item.coType}</b>
                </p>
                <p>
                  <span>变更信息：</span>
                  <b>{item.changeOrderDescription}</b>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <RollbackModal
        visible={rollbackVisible}
        envCode={currEnvCode}
        onClose={() => setRollbackVisible(false)}
        onSave={() => {
          setRollbackVisible(false);
          reloadChangeOrderData();
          reloadDeployData();
        }}
      />
    </ContentCard>
  );
}
