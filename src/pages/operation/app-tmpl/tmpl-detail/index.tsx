// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
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
    <MatrixPageContent>
      <ContentCard>
        <div>
          <Form layout="inline">
            <Form.Item label=" 模版类型：" name="templType">
              <Select showSearch style={{ width: 220 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Form.Item>
            <Form.Item label=" 模版名称：" name="templName">
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
              <div style={{ height: '50', textAlign: 'center', fontSize: 18 }}>可配置项：</div>
              <Button
                type="primary"
                onClick={handleAdd}
                // style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                新增
              </Button>
              <Table>
                <Table.Column title="Key" dataIndex="key" width="40%" />
                <Table.Column title="Value" dataIndex="value" width="60%" />
              </Table>
            </div>
            <div className="form">
              <Form layout="horizontal">
                <Form.Item label=" 选择默认应用大类：" name="templType">
                  <Select showSearch style={{ width: 220 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                </Form.Item>
                <Form.Item label=" 选择默认环境：" name="templName">
                  <>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={['a10', 'c12']}
                      onChange={clickChange}
                    >
                      {children}
                    </Select>
                  </>
                  ,
                </Form.Item>
              </Form>
            </div>
            <Space size="middle" style={{ marginTop: '310px', float: 'right' }}>
              <Button type="ghost" htmlType="reset">
                取消
              </Button>
              <Button type="primary">提交</Button>
            </Space>
          </div>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
