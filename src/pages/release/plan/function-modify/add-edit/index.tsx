import React, { useState, useEffect } from 'react';
import { Form, Card, AutoComplete, Table, Button, Row, Col, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Moment } from 'moment';
import { history } from 'umi';
import BaseForm from '../../components/base-form';
import { InitValue, BaseFormProps } from '../../../typing';
import './index.less';

interface Item {
  id?: string;
  function?: string;
  status?: string;
  owner?: string;
  line?: string;
  model?: string;
  org?: string;
  range?: string;
  needs?: string;
  planTime?: Moment;
  needsID?: string;
  actualTime?: Moment;
  person?: string;
  createTime?: Moment;
}

interface ModifyProps extends InitValue {}

interface IProps extends BaseFormProps {
  initValueObj?: ModifyProps;
}

const Coms: React.FC<IProps> = ({ initValueObj }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [tableData, setTableDate] = useState([]);

  const columns: ColumnsType<Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '发布功能',
      dataIndex: 'function',
      key: 'function',
    },
    {
      title: '业务线',
      dataIndex: 'line',
      key: 'line',
    },
    {
      title: '业务模块',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '机构',
      dataIndex: 'org',
      key: 'org',
    },
    {
      title: '涉及业务范围',
      dataIndex: 'range',
      key: 'range',
    },
    {
      title: '预计发布时间',
      dataIndex: 'planTime',
      key: 'planTime',
    },
    {
      title: '需求ID',
      dataIndex: 'needsID',
      key: 'needsID',
    },
    {
      title: '创建人',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: () => (
        <Button type="ghost" danger>
          删除
        </Button>
      ),
    },
  ];

  const handleChange = () => {};

  const handleSelect = () => {};

  return (
    <div className="add-content">
      <Card bordered={false} title="基本信息" className="base-info">
        <Form form={form} className="form-list">
          {<BaseForm initValueObj={initValueObj} />}
        </Form>
      </Card>
      <Card bordered={false} title="关联相关功能">
        <Row>
          <Col span={18} offset={2}>
            <AutoComplete
              placeholder="请输入关键词搜索功能"
              options={options}
              onChange={handleChange}
              onSelect={handleSelect}
              style={{ width: '60%', marginBottom: 10 }}
            />
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
            />
            <Space style={{ marginTop: 10 }}>
              <Button type="primary">确定</Button>
              <Button onClick={() => history.goBack()}>取消</Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Coms;
