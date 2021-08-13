import React, { useState, useEffect } from 'react';
import { Form, Drawer, Input, Switch, Select, Tabs, Button } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { getCasePageList } from '../../service';
import EditorTable from '@cffe/pc-editor-table';
import RichText from '@/components/rich-text';
import './index.less';

const { TabPane } = Tabs;

export default function RightDetail(props: any) {
  const { visible, setVisible, updateCaseTable, isAdd } = props;

  return (
    <Drawer visible={visible} width="650" title={isAdd ? '添加用例' : '编辑用例'} onClose={() => setVisible(false)}>
      <Form>
        <Form.Item label="标题:" name="title">
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="所属:" name="categoryId">
          <Select>
            <Select.Option value="1">模块1</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="优先级:" name="priority">
          <Select>
            <Select.Option value="2">P0</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="是否自动化:" name="isAuto" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="前置条件:" name="precondition">
          <Input.TextArea placeholder="请输入前置条件"></Input.TextArea>
        </Form.Item>
        <Form.Item label="用例描述:" name="？">
          <Tabs>
            <TabPane tab="卡片式" key="1">
              <div className="cardtype-case-desc-wrapper">
                <div className="step-desc">
                  <Input.TextArea placeholder="输入步骤描述"></Input.TextArea>
                </div>
                <div className="step-expected-results">
                  <Input.TextArea placeholder="预期结果"></Input.TextArea>
                </div>
              </div>
            </TabPane>
            <TabPane tab="步骤式" key="2">
              <EditorTable
                value={props.value}
                onChange={props.onChange}
                columns={[
                  { title: '编号', dataIndex: 'key', required: true },
                  { title: '步骤描述', dataIndex: 'value' },
                  { title: '预期结果', dataIndex: 'desc' },
                  { title: '操作', dataIndex: '-', component: () => <Button type="link">删除</Button> },
                ]}
                creator={{ record: { value: '', desc: '' } }}
              />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item label="前置条件:" name="precondition">
          <Input.TextArea placeholder="请输入前置条件"></Input.TextArea>
        </Form.Item>
        <Form.Item label="备注">
          <RichText width="568px" height="200px" />
        </Form.Item>
        <Form.Item>
          <div className="drawer-btn-group">
            <Button type="primary">保存</Button>
            <Button type="primary" className="mgl-short">
              保存并继续
            </Button>
            <Button type="primary" className="mgl-short">
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
