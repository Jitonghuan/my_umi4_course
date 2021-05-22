import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Space, Popconfirm, Button, Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import useRequest from '@/utils/useRequest';
import { queryRulesList } from '../../../service';
import TemplateDrawer from '../../../component/templateDrawer';
import { Item } from '../../../typing';
import './index.less';

interface StepTwoProps {
  getTableData: (value: Record<string, Item[]>) => void;
  serviceId: string;
  form?: FormInstance;
}

const StepOne: React.FC<StepTwoProps> = ({ form, getTableData, serviceId }) => {
  const [dataSource, setDataSource] = useState<Item[]>([]);
  console.log(serviceId, 'idiiiii');

  const { run: queryRulesListFun, data: rulesList } = useRequest<{
    dataSource: Item[];
    pageInfo: Record<string, React.Key>;
  }>({
    api: queryRulesList,
    method: 'POST',
    successText: '提交成功',
    isSuccessModal: true,
    formatData: (data) => {
      return {
        ...data?.dataSource,
        pageInfo: {
          ...data.pageInfo,
          current: data.pageInfo.pageIndex,
        },
      };
    },
  });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则');

  useEffect(() => {
    //根据模板列表展示信息 setDataSource
    queryRulesListFun({ serviceId });
  }, []);

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
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
      dataIndex: 'message',
      key: 'message',
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
        dataSource={rulesList?.dataSource}
        pagination={rulesList?.pageInfo}
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
