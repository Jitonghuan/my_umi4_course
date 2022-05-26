//资源申请页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import ShowResourceModal from './resource-show';
import { Input, Upload, Button, Form, Row, Col, Select, Space } from '@cffe/h2o-design';
import './index.less';
/** Modal页回显数据 */
export interface showResource extends Record<string, any> {
  remark: string;
  visible: boolean;
  setVisible: any;
}
export default function applyResource() {
  const [value, setValue] = React.useState(1);
  const { Option } = Select;
  const [appTypeOptions, setAppTypeOptions] = useState<any[]>([]); //申请项选择
  const [envCode, setEnvCode] = useState<any[]>([]); //归属选择项
  const [businessLine, setBusinessLine] = useState<any[]>([]); //业务线选择
  const [specifications, setSpecifications] = useState<any[]>([]); //规格选项
  const [diskSize, setDiskSize] = useState<any[]>([]); //磁盘选项
  const [applyResourceForm] = Form.useForm();
  const [selectAppTypes, setSelectAppTypes] = useState<any>('application'); //资源类型所选择到的值
  const [isModalVisible, setIsModalVisible] = useState(false); //是否显示弹窗
  const [tmplEditMode, setTmplEditMode] = useState<EditorMode>('HIDE');
  const [applyResourceData, setApplyResourceData] = useState<showResource>();
  const handleChange = () => {
    applyResourceForm.setFieldsValue({ sights: [] });
  };
  const selectAppType = (value: any) => {
    setSelectAppTypes(value);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <PageContainer>
      <ShowResourceModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleOk={handleOk}
      ></ShowResourceModal>
      <FilterCard>
        <span>资源申请</span>
      </FilterCard>
      <ContentCard className="addTicket">
        <div className="resourceApply">
          <Form
            form={applyResourceForm}
            style={{ marginTop: '6%', marginBottom: '8%', marginLeft: '5%' }}
            size="middle"
          >
            <Row>
              <Col span={8}>
                <Form.Item name="appType" label="应用分类：">
                  <Select showSearch allowClear options={appTypeOptions} style={{ width: '180px' }} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="envCode" label="环境" labelCol={{ span: 4 }}>
                  <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="businessLine" label="业务线：">
                  <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="recourceType" label="资源类型">
                  <Select showSearch allowClear onChange={selectAppType} style={{ width: '180px' }}>
                    <Option value="application">应用</Option>
                    <Option value="mysql">数据库</Option>
                    <Option value="middleWare">中间件</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                {selectAppTypes === 'application' && (
                  <Form.Item name="nodeNumber" label="节点数">
                    <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                  </Form.Item>
                )}
                {selectAppTypes === 'mysql' && (
                  <Form.Item name="envCode" label="存量总量">
                    <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                  </Form.Item>
                )}
                {selectAppTypes === 'middleWare' && (
                  <Form.Item name="envCode" label="中间件名">
                    <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                {selectAppTypes === 'application' && (
                  <Form.Item name="appcatecoryName" label="应用名">
                    <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                  </Form.Item>
                )}

                {selectAppTypes === 'mysql' && (
                  <Form.Item name="appcatecoryName" label="数据库名">
                    <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              {selectAppTypes === 'mysql' && (
                <Form.Item name="appcatecoryName" label="数据库类型">
                  <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                </Form.Item>
              )}
            </Row>

            <Row>
              <Form.Item name="remarks" label="备注：" labelCol={{ span: 2 }}>
                <Input.TextArea style={{ width: '750px' }}></Input.TextArea>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item name="application" label="申请表" style={{ marginLeft: '1%', width: '50%' }}>
                <Upload>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
                <span>支持扩展名：.doc .pdf</span>
              </Form.Item>
            </Row>

            <Form.Item>
              <Space size="small" style={{ marginTop: '50px', float: 'right', marginRight: '3%' }}>
                <Button type="ghost" htmlType="reset">
                  重置
                </Button>
                <Button type="primary" htmlType="submit" onClick={showModal}>
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
