import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Space, Popconfirm, Button, Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import TemplateDrawer from '../../../component/templateDrawer';
import { Item } from '../../../typing';
import './index.less';

interface StepTwoProps {
  getTableData: (value: Record<string, Item[]>) => void;
  form?: FormInstance;
}

const StepOne: React.FC<StepTwoProps> = ({ form, getTableData }) => {
  const [dataSource, setDataSource] = useState<Item[]>([]);

  // const [dataSource, setDataSource] = useState<Item[]>([
  //   { ruleName: '11' },
  //   { ruleName: '22' },
  // ]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则');

  useEffect(() => {
    //根据模板列表展示信息 setDataSource
  }, []);

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      // width: '6%',
      // render: (text) => (
      //   <div style={{ width: 100, wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '告警表达式',
      dataIndex: 'expression',
      key: 'expression',
      // width: '5%',
      // ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '告警消息',
      dataIndex: 'news',
      key: 'news',
      // width: '5%',
      // render: (text) => (
      //   <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //     {text}
      //   </div>
      // ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'news',
      width: 100,
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              setDrawerVisible(true);
              setDrawerTitle('编辑报警规则模版');
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            // onConfirm={confirm}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSubmit = (value: any) => {
    console.log(value);
  };

  useEffect(() => {
    getTableData({ templates: dataSource });
  }, [dataSource]);

  return (
    <Form.Item>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        className="step-two"
      />
      <Button
        block
        icon={<PlusOutlined />}
        id="button-add"
        onClick={() => {
          setDrawerVisible(true);
        }}
      >
        新增
      </Button>
      <TemplateDrawer
        visible={drawerVisible}
        onClose={onClose}
        drawerTitle={drawerTitle}
        onSubmit={onSubmit}
      />
    </Form.Item>
  );
};

export default StepOne;
