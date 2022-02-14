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
import { Drawer, Input, Button, Form, Transfer, Col, Select, Space, message, Divider } from 'antd';
import './index.less';

export interface EnvironmentListProps {
  mode?: EditorMode;
  //   initData?: TmplEdit;
  onClose?: () => any;
  //   onSave?: () => any;
}

export default function EnvironmentEditor(props: EnvironmentListProps) {
  const [addEnvironmentForm] = Form.useForm();
  const children: any = [];
  const { mode, onClose } = props;
  const mockData = [];
  for (let i = 0; i < 20; i++) {
    mockData.push({
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
    });
  }

  const initialTargetKeys = mockData.filter((item) => +item.key > 10).map((item) => item.key);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  const handleOk = () => {
    onClose;
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑项目环境' : '新增项目环境'}
      maskClosable={false}
      onClose={onClose}
      width={'40%'}
      footer={
        <div className="drawer-environ-footer">
          <Space>
            <Button type="primary" onClick={handleOk}>
              确认
            </Button>
            <Button type="default" onClick={onClose}>
              取消
            </Button>
          </Space>
        </div>
      }
    >
      <ContentCard className="tmpl-edits">
        <Form labelCol={{ flex: '120px' }} form={addEnvironmentForm}>
          <Form.Item label="项目环境名" name="envname">
            <Input style={{ width: 200 }} placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item label="项目环境CODE" name="envCode">
            <Input style={{ width: 200 }} placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item label="选择基准环境" name="nodename">
            <Select style={{ width: 200 }}></Select>
          </Form.Item>
          <Form.Item label="备注：" name="remarks">
            <Input.TextArea style={{ width: '240px' }} placeholder="多行输入"></Input.TextArea>
          </Form.Item>
          <Form.Item label="选择应用" name="isWipe">
            <Transfer
              dataSource={mockData}
              titles={['可添加应用', '已添加应用']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              render={(item) => item.title}
            />
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
