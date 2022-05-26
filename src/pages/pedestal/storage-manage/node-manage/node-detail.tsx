/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 10:43}
 */

import React, { useState } from 'react';
import { Form, Select, Button, Table, Tag, Divider, Modal, Checkbox } from '@cffe/h2o-design';
import { useDeviceNameList, useAddDevice } from './hook';
import './index.less';
export interface nodeListProps {
  hostName: string;
  clusterCode: string;
  nodeId: string;
  loading?: boolean;
  devicesData: any;
  bricksData: any;
  queryNodeDetail: (clusterCode: any, nodeId: any) => void;
}
export default function NodeDetail(props: nodeListProps) {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [addDevice] = useAddDevice();
  const [deviceName, queryDeviceName] = useDeviceNameList();
  const { hostName, clusterCode, nodeId, loading, devicesData, bricksData, queryNodeDetail } = props;
  const [addEquipmentVisiable, setAddEquipmentVisiable] = useState<boolean>(false);
  const [isWipe, setIsWipe] = useState<boolean>(false);
  const [deviceOption, setDeviceOption] = useState<string>();

  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`);
    setIsWipe(e.target.checked);
  };
  const selectDevice = (value: string) => {
    setDeviceOption(value);
  };

  return (
    <div>
      <div className="node-info">
        <div>{hostName}</div>
      </div>
      <div>
        <div style={{ fontWeight: 'bold' }}>设备详情</div>
        <div style={{ marginTop: 10 }}>
          <Table rowKey="ID" bordered loading={loading} dataSource={devicesData}>
            <Table.Column title="ID" dataIndex="deviceId" width="38%" />
            <Table.Column title="DEVICE" dataIndex="deviceName" width="10%" />
            <Table.Column title="总空间" dataIndex="spaceTotal" width="10%" ellipsis />
            <Table.Column title="可用空间" dataIndex="spaceFree" width="10%" ellipsis />
            <Table.Column title="已用空间" dataIndex="spaceUsed" width="12%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="status"
              width="8%"
              render={(current, record) => {
                return current === 'online' ? (
                  <Tag color="success">在线</Tag>
                ) : current === 'offline' ? (
                  <Tag color="red">离线</Tag>
                ) : (
                  <Tag>{current}</Tag>
                );
              }}
            />
          </Table>
        </div>
        <div className="add-equipment">
          <Button
            type="primary"
            onClick={() => {
              queryDeviceName();
              setAddEquipmentVisiable(true);
              form.resetFields();
            }}
          >
            新增设备
          </Button>
        </div>
      </div>
      <Divider style={{ height: 4, marginTop: 8, marginBottom: 0 }} />
      <div style={{ paddingBottom: 18 }}>
        <div style={{ fontWeight: 'bold' }}>brick列表</div>
        <div style={{ marginTop: 10 }}>
          <Table rowKey="ID" bordered loading={loading} dataSource={bricksData}>
            <Table.Column title="BRICK" dataIndex="brickName" width="80%" />
            <Table.Column title="PID" dataIndex="pid" width="10%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="status"
              width="10%"
              render={(current, record) => {
                return current === 'Online' ? (
                  <Tag color="success">在线</Tag>
                ) : current === 'Offline' ? (
                  <Tag color="red">离线</Tag>
                ) : (
                  <Tag>{current}</Tag>
                );
              }}
            />
          </Table>
        </div>
      </div>
      <div>
        <Modal
          title="新增设备"
          visible={addEquipmentVisiable}
          width="30%"
          onOk={() => {
            setAddEquipmentVisiable(false);
            addDevice(clusterCode, hostName, deviceOption, isWipe).then(() => {
              queryNodeDetail(clusterCode, nodeId);
            });
          }}
          onCancel={() => {
            setAddEquipmentVisiable(false);
          }}
        >
          <Form labelCol={{ flex: '120px' }} form={form}>
            <Form.Item label="选择磁盘" name="device">
              <Select style={{ width: 160 }} options={deviceName} onChange={selectDevice}></Select>
            </Form.Item>
            <Form.Item label="擦除格式" name="isWipe">
              <Checkbox onChange={onChange}></Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
