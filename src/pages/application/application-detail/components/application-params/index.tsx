// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import DetailContext, { ContextTypes } from '../../context';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import './index.less';
// import * as APIS from './service';

export default function DemoPageTb() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const { Option } = Select;
  const children: any = [];
  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};
  return (
    <ContentCard>
      <div>
        <Form layout="inline">
          <Form.Item label=" 应用环境：" name="appEnv">
            <Select showSearch style={{ width: 220 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          </Form.Item>
          <Form.Item label=" 参数类型" name="paramsType">
            <Select showSearch style={{ width: 220 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="content">
        <div className="left">
          <div>模版详情：</div>
          <div className="tmpl"></div>
        </div>
        <div className="right">
          <div className="table">
            <div style={{ height: '50', marginBottom: '14px', float: 'left', fontSize: 18 }}>可配置项：</div>
            <Table>
              <Table.Column title="Key" dataIndex="key" width="40%" />
              <Table.Column title="Value" dataIndex="value" width="60%" />
            </Table>
          </div>

          <Space size="large" style={{ marginTop: '560px', float: 'right' }}>
            <Button type="ghost" htmlType="reset">
              取消
            </Button>
            <Button type="primary">提交</Button>
          </Space>
        </div>
      </div>
    </ContentCard>
  );
}
