// 应用模版编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';

import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message, Divider } from 'antd';

export interface TmplListProps {
  mode?: EditorMode;
  // initData?: TmplEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TmplListProps) {
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  // const { mode, initData, onClose, onSave } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();
  // const templateCode = initData?.templateCode;
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const clickChange = () => {};

  // useEffect(() => {
  //   // if (mode === 'HIDE') return;
  //   createTmplForm.resetFields();

  return (
    <Drawer
      // visible={mode !== 'HIDE'}
      // title={mode === 'EDIT' ? '编辑模版' : ''}
      // maskClosable={false}
      // onClose={onClose}
      width={'70%'}
    >
      <ContentCard className="tmpl-edits">
        {/* <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <div>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  options={templateTypes}
                  disabled={isDisabled}
                  onChange={changeTmplType}
                />
              </Form.Item>
            </div>

            <div style={{ marginLeft: 10 }}>
              <Form.Item label="模版语言：" name="languageCode" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={true} />
              </Form.Item>
            </div>
            <div style={{ marginLeft: 10 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </div>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={12}>
              <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                <AceEditor mode="yaml" height={700} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  value={source}
                  onChange={handleChange}
                  columns={[
                    { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                    {
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                  ]}
                />
              </Form.Item>
              {isDeployment == 'deployment' && initData?.languageCode === 'java' ? <span>JVM参数:</span> : null}
              {isDeployment == 'deployment' && initData?.languageCode === 'java' ? (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              ) : null}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '30px' }}
              >
                <Select
                  showSearch
                  style={{ width: 220 }}
                  options={categoryData}
                  onChange={changeAppCategory}
                  disabled={isDisabled}
                />
              </Form.Item>

              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes" style={{ marginTop: '20px' }}>
                <Select
                  allowClear
                  mode="multiple"
                  showSearch
                  style={{ width: 220 }}
                  placeholder="支持通过envCode搜索环境"
                  onChange={clickChange}
                  options={envDatas}
                  disabled={isDisabled}
                >
                  {children}
                </Select>
              </Form.Item>

              <div style={{ fontSize: 15, color: '#696969', marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 520, height: 220 }}></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ float: 'right' }}>
              <Button type="ghost" htmlType="reset" onClick={onClose}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={isDisabled}>
                保存编辑
              </Button>
            </Space>
          </Form.Item>
        </Form> */}
      </ContentCard>
    </Drawer>
  );
}
