//显示Madol
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { UploadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Input, Upload, Button, Form, Radio, Row, Col, Select, Space, Modal } from 'antd';
import './index.less';

export default function showResourceModal(props: any) {
  const [value, setValue] = React.useState(1);
  const { Option } = Select;
  const [applyOptions, setApplyOptions] = useState<any[]>([]); //申请项选择
  const [ascription, setAscription] = useState<any[]>([]); //归属选择项
  const [businessLine, setBusinessLine] = useState<any[]>([]); //业务线选择
  const [specifications, setSpecifications] = useState<any[]>([]); //规格选项
  const [diskSize, setDiskSize] = useState<any[]>([]); //磁盘选项
  return (
    <Modal>
      <div className="ticketApply">
        <Form style={{ marginTop: '6%', marginBottom: '8%', marginRight: '2%' }} size="large">
          <Form.Item name="applyItem" label="应用部署" labelCol={{ span: 8 }}>
            <Select showSearch allowClear options={applyOptions} style={{ width: '240px' }}></Select>
          </Form.Item>
          <Form.Item name="ascription" label="资源规格：" labelCol={{ span: 8 }}>
            <Select showSearch allowClear options={ascription} style={{ width: '240px' }}></Select>
          </Form.Item>
          <Form.Item name="businessLine" label="资源数量" labelCol={{ span: 8 }}>
            <Select showSearch allowClear options={businessLine} style={{ width: '240px' }}></Select>
          </Form.Item>
          <Form.Item name="instanceName" label="数据库类型" labelCol={{ span: 8 }}>
            <Input placeholder="格式：应用名+序列号，如：sso-001" style={{ width: '240px' }}></Input>
          </Form.Item>
          <Form.Item name="number" label="数据库实例" labelCol={{ span: 8 }}>
            <Input placeholder="请输入数量" style={{ width: '240px' }}></Input>
          </Form.Item>
          <Form.Item name="specifications" label="中间件" labelCol={{ span: 8 }}>
            <Select showSearch allowClear options={businessLine} style={{ width: '240px' }} />
          </Form.Item>
          <Form.Item name="diskSize" label="资源规格" labelCol={{ span: 8 }}>
            <Select showSearch allowClear options={diskSize} style={{ width: '240px' }}></Select>
          </Form.Item>
          <Form.Item name="application" label="资源数量" labelCol={{ span: 8 }}>
            <Input placeholder="请输入数量" style={{ width: '240px' }}></Input>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
