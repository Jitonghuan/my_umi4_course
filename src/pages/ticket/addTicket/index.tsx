//新建工单页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { UploadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import { Input, Upload, Button, Form, Radio, Row, Col, Select, Space } from 'antd';
import './index.less';

export default function addTicket() {
  const [value, setValue] = React.useState(1);
  const { Option } = Select;
  const [applyOptions, setApplyOptions] = useState<any[]>([]); //申请项选择
  const [ascription, setAscription] = useState<any[]>([]); //归属选择项
  const [businessLine, setBusinessLine] = useState<any[]>([]); //业务线选择
  const [specifications, setSpecifications] = useState<any[]>([]); //规格选项
  const [diskSize, setDiskSize] = useState<any[]>([]); //磁盘选项
  return (
    <PageContainer>
      <FilterCard>
        <span>创建工单</span>
      </FilterCard>
      <ContentCard className="addTicket">
        <div className="ticketApply">
          <Form style={{ marginTop: '6%', marginBottom: '8%', marginRight: '2%' }}>
            <Form.Item name="applyType" label="类型：" labelCol={{ span: 8 }}>
              <Radio.Group value={value}>
                <Radio value={1}>资源申请</Radio>
                <Radio value={2}>运维权限申请</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="applyItem" label="申请项：" labelCol={{ span: 8 }}>
              <Select showSearch allowClear options={applyOptions} style={{ width: '240px' }}></Select>
            </Form.Item>
            <Form.Item name="ascription" label="归属：" labelCol={{ span: 8 }}>
              <Select showSearch allowClear options={ascription} style={{ width: '240px' }}></Select>
            </Form.Item>
            <Form.Item name="businessLine" label="业务线：" labelCol={{ span: 8 }}>
              <Select showSearch allowClear options={businessLine} style={{ width: '240px' }}></Select>
            </Form.Item>
            <Form.Item name="instanceName" label="实例名：" labelCol={{ span: 8 }}>
              <Input placeholder="格式：应用名+序列号，如：sso-001" style={{ width: '240px' }}></Input>
            </Form.Item>
            <Form.Item name="number" label="数量：" labelCol={{ span: 8 }}>
              <Input placeholder="请输入数量" style={{ width: '240px' }}></Input>
            </Form.Item>
            <Form.Item name="specifications" label="规格：" labelCol={{ span: 8 }}>
              <Select showSearch allowClear options={businessLine} style={{ width: '240px' }} />
            </Form.Item>
            <Form.Item name="diskSize" label="磁盘：" labelCol={{ span: 8 }}>
              <Select showSearch allowClear options={diskSize} style={{ width: '240px' }}></Select>
            </Form.Item>
            <Form.Item name="remarks" label="备注：" labelCol={{ span: 8 }}>
              <Input.TextArea style={{ width: '240px' }}></Input.TextArea>
            </Form.Item>
            <Form.Item name="application" label="申请表" labelCol={{ span: 8 }}>
              <Upload>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
              <span>支持扩展名：.doc .pdf</span>
            </Form.Item>
            <Form.Item>
              <Space size="small" style={{ marginTop: '50px', float: 'right', marginRight: '3%' }}>
                <Button type="ghost" htmlType="reset" danger>
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  提交申请
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
