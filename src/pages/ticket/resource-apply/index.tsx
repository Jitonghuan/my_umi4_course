//资源申请页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/31 17:00

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { Input, Upload, Button, Form, Radio, Row, Col, Select, Space } from 'antd';
import './index.less';

export default function addTicket() {
  const [value, setValue] = React.useState(1);
  const { Option } = Select;
  const [appTypeOptions, setAppTypeOptions] = useState<any[]>([]); //申请项选择
  const [envCode, setEnvCode] = useState<any[]>([]); //归属选择项
  const [businessLine, setBusinessLine] = useState<any[]>([]); //业务线选择
  const [specifications, setSpecifications] = useState<any[]>([]); //规格选项
  const [diskSize, setDiskSize] = useState<any[]>([]); //磁盘选项
  const [applyResourceForm] = Form.useForm();

  const handleChange = () => {
    applyResourceForm.setFieldsValue({ sights: [] });
  };
  return (
    <PageContainer>
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
                <Form.Item name="appType" label="应用分类：" labelAlign="right">
                  <Select showSearch allowClear options={appTypeOptions} style={{ width: '180px' }} />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item name="envCode" label="环境" labelAlign="right">
                  <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="businessLine" label="业务线：" labelAlign="right">
                  <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="appType" label="资源类型" labelAlign="right">
                  <Select showSearch allowClear options={appTypeOptions} style={{ width: '180px' }} />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item name="envCode" label="环境" labelAlign="right">
                  <Select showSearch allowClear options={envCode} style={{ width: '180px' }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="businessLine" label="业务线：" labelAlign="right">
                  <Select showSearch allowClear options={businessLine} style={{ width: '180px' }}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.List name="sights">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Space key={field.key} align="baseline">
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                          }
                        >
                          {() => (
                            <Form.Item
                              {...field}
                              label="Sight"
                              name={[field.name, 'sight']}
                              fieldKey={[field.fieldKey, 'sight']}
                              rules={[{ required: true, message: 'Missing sight' }]}
                            >
                              {/* <Select disabled={!applyResourceForm.getFieldValue('area')} style={{ width: 130 }}>
                                {(sights[applyResourceForm.getFieldValue('area')] || []).map((item) => (
                                  <Option key={item} value={item}>
                                    {item}
                                  </Option>
                                ))}
                              </Select> */}
                            </Form.Item>
                          )}
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Price"
                          name={[field.name, 'price']}
                          fieldKey={[field.fieldKey, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <Input />
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        添加资源类型
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              {/* <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加一项
                </Button>
              </Form.Item> */}
            </Row>
            <Row>
              <Form.Item name="remarks" label="备注：" style={{ marginLeft: '3%' }}>
                <Input.TextArea style={{ width: '440px' }}></Input.TextArea>
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
