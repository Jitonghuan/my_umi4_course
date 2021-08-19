// 服务状态、重启
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/09 20:13

import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Descriptions, Modal, Button, Table, Radio, message } from 'antd';
import { GroupedStatusInfoProps } from '../../types';
import DetailContext from '../../../../../context';
import { postRequest } from '@/utils/request';
import { IStatusInfoProps } from '@/pages/application/application-detail/types';
import * as APIS from '../../services';
import './index.less';

export interface ServerStatusProps {
  appStatusInfo: IStatusInfoProps[];
  onOperate: (name: any) => any;
}

export default function ServerStatus(props: ServerStatusProps) {
  const { appStatusInfo, onOperate } = props;
  const { appData } = useContext(DetailContext);
  const [restartVisible, setRestartVisible] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<any>(null);

  const handleOk = useCallback(async () => {
    if (!selectedRowKey) {
      return message.warning('请选择服务器!');
    }

    console.log('>> handleOk: ', selectedRowKey);
    const item = appStatusInfo.find((n) => n.eccid === selectedRowKey);
    await postRequest(APIS.restartApplication, {
      data: {
        deploymentName: appData?.deploymentName,
        envCode: item?.envCode,
        eccid: item?.eccid,
        owner: appData?.owner,
      },
    });
    setRestartVisible(false);
    message.success('操作成功！');
    onOperate('restartApp');
  }, [selectedRowKey, appStatusInfo]);

  // 按环境分组
  const groupedStatusInfo = useMemo(() => {
    const nextStatusInfo = (appStatusInfo || []).reduce((prev, curr: any) => {
      let group = prev.find((n) => n.envCode === curr.envCode);
      if (!group) {
        group = { envCode: curr.envCode, envName: curr.envName, list: [] };
        prev.push(group);
      }

      group.list.push(curr);
      return prev;
    }, [] as GroupedStatusInfoProps[]);

    return nextStatusInfo;
  }, [appStatusInfo]);

  return (
    <>
      <Descriptions
        title="服务器状态"
        bordered
        size="small"
        style={{ marginTop: 16 }}
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        extra={
          <Button type="primary" onClick={() => setRestartVisible(true)}>
            重启服务
          </Button>
        }
      >
        {groupedStatusInfo.map((group) => (
          <Descriptions.Item label={group.envName || group.envCode} span={3} className="app-status-detail">
            {group.list.map((item, index) => (
              <p key={index}>
                <span>
                  IP：<b>{item.ip}</b>
                </span>
                <span>
                  运行状态：<b>{item.appStateName}</b>
                </span>
                <span>
                  变更状态：<b>{item.taskStateName}</b>
                </span>
              </p>
            ))}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Modal
        title="重启服务"
        visible={restartVisible}
        maskClosable={false}
        onCancel={() => setRestartVisible(false)}
        okText="确定重启"
        onOk={handleOk}
        width={800}
      >
        <Table
          dataSource={appStatusInfo}
          pagination={false}
          rowKey="eccid"
          rowSelection={{
            selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
            onChange: (next) => setSelectedRowKey(next[0]),
            type: 'radio',
          }}
        >
          <Table.Column title="环境Code" dataIndex="envCode" />
          <Table.Column title="ip" dataIndex="ip" />
          <Table.Column title="eccid" dataIndex="eccid" />
        </Table>
      </Modal>
    </>
  );
}
