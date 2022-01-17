/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 10:43}
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Tag,
  Divider,
  Switch,
  Modal,
  Checkbox,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import './index.less';

export default function NodeDetail() {
  const { Option } = Select;
  const [addEquipmentVisiable, setAddEquipmentVisiable] = useState<boolean>(false);
  //启用配置管理选择
  let useNacosData: number;
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
  };
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div>
      <div className="node-info">
        <div>master-001</div>
      </div>
      <div>
        <div style={{ fontWeight: 'bold' }}>设备详情</div>
        <div style={{ marginTop: 10 }}>
          <Table rowKey="ID" bordered>
            <Table.Column title="ID" dataIndex="id" width="38%" />
            <Table.Column title="DEVICE" dataIndex="id" width="10%" />
            <Table.Column title="总空间" dataIndex="templateName" width="10%" ellipsis />
            <Table.Column title="可用空间" dataIndex="languageCode" width="10%" ellipsis />
            <Table.Column title="已用空间" dataIndex="templateType" width="12%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="tagName"
              width="8%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
          </Table>
        </div>
        <div className="add-equipment">
          <Button
            type="primary"
            onClick={() => {
              setAddEquipmentVisiable(true);
            }}
          >
            新增设备
          </Button>
        </div>
      </div>
      <Divider />
      <div style={{ paddingBottom: 18 }}>
        <div style={{ fontWeight: 'bold' }}>brick列表</div>
        <div style={{ marginTop: 10 }}>
          <Table rowKey="ID" bordered>
            <Table.Column title="BRICK" dataIndex="id" width="60%" />
            <Table.Column title="ENTITY数" dataIndex="templateName" width="10%" ellipsis />
            <Table.Column title="PID" dataIndex="languageCode" width="15%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="tagName"
              width="15%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
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
          }}
          onCancel={() => {
            setAddEquipmentVisiable(false);
          }}
        >
          <Form labelCol={{ flex: '120px' }}>
            <Form.Item label="选择磁盘">
              <Select style={{ width: 160 }}></Select>
            </Form.Item>
            <Form.Item label="擦除格式">
              <Checkbox onChange={onChange}></Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
