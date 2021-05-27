import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Space, Popconfirm, Button, Tag } from 'antd';
import { FormInstance } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import useRequest from '@/utils/useRequest';
import useTable from '@/utils/useTable';
import {
  queryRulesList,
  createRules,
  updateRules,
  ruleSwitch,
  deleteRules,
} from '../../service';
import TemplateDrawer from '../template-drawer';
import { Item } from '../../typing';
import './index.less';

interface StepTwoProps {
  serviceId: string;
  form?: FormInstance;
  isShowAddButton?: boolean;
}

type statusTypeItem = {
  color: string;
  tagText: string;
  buttonText: string;
  status: number;
};

const STATUS_TYPE: Record<number, statusTypeItem> = {
  0: { tagText: '已启用', buttonText: '禁用', color: 'green', status: 1 },
  1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
};

const RulesTable: React.FC<StepTwoProps> = ({
  serviceId,
  isShowAddButton = true,
}) => {
  const [dataSources, setDataSources] = useState<{
    dataSource: Item[];
    pageInfo: Record<string, React.Key>;
  }>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则');
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [editRecord, setEditRecord] = useState<Item>({});

  //列表
  const {
    tableProps,
    search: { submit: queryList },
  } = useTable({
    url: queryRulesList,
    method: 'GET',
    formatter: () => {
      return {
        serviceId,
        pageIndex: -1,
      };
    },
  });

  //新增
  const { run: createRulesFun } = useRequest({
    api: createRules,
    method: 'POST',
    successText: '新增成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
      queryList();
    },
  });

  //编辑
  const { run: updateRulesFun } = useRequest({
    api: updateRules,
    method: 'PUT',
    successText: '编辑成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
      queryList();
    },
  });

  //启用/禁用
  const { run: ruleTemplatesSwitchFun } = useRequest({
    api: ruleSwitch,
    method: 'POST',
    successText: '操作成功',
    isSuccessModal: true,
    onSuccess: () => {
      queryList();
      // queryRulesListFun({ serviceId,pageIndex: -1 });
    },
  });

  //删除
  const { run: deleteRuleTemplatesFun } = useRequest({
    method: 'DELETE',
    successText: '删除成功',
    isSuccessModal: true,
    onSuccess: () => {
      queryList();
    },
  });

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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // width: '4%',
      render: (text: number) => (
        <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'news',
      width: 150,
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              setDrawerVisible(true);
              setDrawerTitle('编辑报警规则');
              setEditRecord(record);
              setType('edit');
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteRuleTemplatesFun(
                { id: record.id },
                `${deleteRules}/${record.id}`,
              );
            }}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
          <Popconfirm
            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
            onConfirm={() => {
              ruleTemplatesSwitchFun({
                id: record.id,
                status: STATUS_TYPE[record.status as number].status,
              });
            }}
            okText="是"
            cancelText="否"
          >
            <a>{STATUS_TYPE[record.status as number].buttonText}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSubmit = (value: any) => {
    if (type === 'add') {
      createRulesFun({ ...value, serviceId });
    } else {
      updateRulesFun({ ...value, serviceId });
    }
  };

  // useEffect(() => {
  //   getTableData({ templates: dataSource });
  // }, [dataSource]);

  return (
    <>
      <Table
        columns={columns}
        // dataSource={dataSources?.dataSource}
        // pagination={dataSources?.pageInfo}
        {...tableProps}
        pagination={false}
        className="step-two"
        rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
      />
      {isShowAddButton && (
        <Button
          block
          icon={<PlusOutlined />}
          id="button-add"
          onClick={() => {
            setDrawerVisible(true);
            setType('add');
            setDrawerTitle('新增报警规则');
          }}
        >
          新增
        </Button>
      )}
      <TemplateDrawer
        visible={drawerVisible}
        onClose={onClose}
        drawerTitle={drawerTitle}
        onSubmit={onSubmit}
        drawerType="rules"
        type={type}
        record={editRecord}
      />
    </>
  );
};

export default RulesTable;
