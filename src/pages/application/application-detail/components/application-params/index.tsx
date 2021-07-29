// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import DetailContext, { ContextTypes } from '../../context';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useContext, useState, useEffect, useRef } from 'react';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Popconfirm, Row, Col, Form, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import './index.less';
import * as APIS from '../../../service';

export default function DemoPageTb() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const { Option } = Select;
  const children: any = [];
  const { TextArea } = Input;
  const [source, setSource] = useState<any[]>([]);
  const handleAdd = () => {
    setCount(count + 1);
  };
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const clickChange = () => {};
  useEffect(() => {
    selectTmplType();
    // selectCategory();
  }, []);

  //加载应用环境下拉选择

  //加载模版类型下拉选择
  const selectTmplType = () => {
    getRequest(APIS.tmplType).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n,
        value: n,
        data: n,
      }));
      setTemplateTypes(list);
    });
  };

  return (
    <ContentCard>
      <Form>
        <Row>
          <Col span={6}>
            <Form.Item label=" 应用环境：" name="appEnv">
              <Select showSearch style={{ width: 220 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label=" 模版类型" name="paramsType">
              <Select showSearch style={{ width: 220 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={10}>
            <div>模版详情：</div>
            <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
              <TextArea rows={18} />
            </Form.Item>
          </Col>
          <Col span={10} offset={2}>
            <div style={{ fontSize: 18 }}>可配置项：</div>
            <Form.Item name="tmplConfigurableItem" rules={[{ required: true, message: '这是必填项' }]}>
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
          </Col>
        </Row>
        <Form.Item>
          <Space size="small" style={{ marginTop: '270px', float: 'right' }}>
            <Button type="ghost" htmlType="reset">
              取消
            </Button>
            <Button type="primary">提交</Button>
          </Space>
        </Form.Item>
      </Form>
    </ContentCard>
  );
}
