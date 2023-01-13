// fork from business/component/rules-table

import React, { useState } from 'react';
import { Table, Tooltip, Space, Popconfirm, Button, Tag } from 'antd';
import useRequest from '@/utils/useRequest';

import { queryRulesList, createRules, updateRules, ruleSwitch, deleteRules } from '../../../basic/services';
import TemplateDrawer from '../template-drawer';
import { Item } from '../../../basic/typing';
import './index.less';

interface RulesTableProps {
  dataSource?: any;
  onQuery: (param?: any) => void;
  serviceId?: string;
  pageInfo?:any;
  setPageInfo?:any;
}
const ALERT_LEVEL: Record<number, { text: string; value: number; color: string }> = {
  2: { text: '警告', value: 2, color: 'yellow' },
  3: { text: '严重', value: 3, color: 'orange' },
  4: { text: '灾难', value: 4, color: 'red' },
};

type StatusTypeItem = {
  color: string;
  tagText: string;
  buttonText: string;
  status: number;
  
};

const STATUS_TYPE: Record<number, StatusTypeItem> = {
  0: { tagText: '已启用', buttonText: '停用', color: 'green', status: 1 },
  1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
};

export default function RulesTable(props: RulesTableProps) {
  const { dataSource, onQuery, serviceId ,pageInfo,setPageInfo} = props;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新增报警规则');
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [editRecord, setEditRecord] = useState<Item>({});
  // const [pageSize, setPageSize] = useState<number>(20);
  // const [pageIndex, setPageIndex] = useState<number>(1);
  // const [total, setTotal] = useState<number>(0);

  //新增
  const { run: createRulesFun } = useRequest({
    api: createRules,
    method: 'POST',
    successText: '新增成功',
    isSuccessModal: true,
    onSuccess: () => {
      setDrawerVisible(false);
      onQuery({page:{ pageIndex:1, pageSize:20 }});
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
      onQuery({page:{ pageIndex:1, pageSize:20 }});
    },
  });

  //启用/禁用
  const { run: ruleTemplatesSwitchFun } = useRequest({
    api: ruleSwitch,
    method: 'POST',
    successText: '操作成功',
    isSuccessModal: true,
    onSuccess: () => {
      onQuery({page:{ pageIndex:1, pageSize:20 }});
    },
  });

  //删除
  const { run: deleteRuleTemplatesFun } = useRequest({
    method: 'DELETE',
    successText: '删除成功',
    isSuccessModal: true,
    onSuccess: () => {
      onQuery({page:{ pageIndex:1, pageSize:20 }});
    },
  });

  const columns = [
    {
      title: '报警名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
      title: '集群',
      dataIndex: 'clusterName',
      key: 'clusterName',
      width: 120,
    },
    {
      title: '命名空间',
      dataIndex: 'nameSpace',
      key: 'nameSpace',
      width: 120,
    },
   
  
    {
      title: '关联应用',
      dataIndex: 'appCode',
      key: 'appCode',
      width: 120,
    },
   
    {
      title: '报警级别',
      dataIndex: 'level',
      key: 'level',
      render: (text: number) => <Tag color={ALERT_LEVEL[text]?.color}>{ALERT_LEVEL[text]?.text}</Tag>,
      width: 120,
    },
    {
      title: '告警表达式',
      dataIndex: 'expression',
      key: 'expression',
      width: 220,
      render: (text: string) => (
        <Tooltip title={text}>
          <span
            style={{
              display: 'inline-block',
              width: 220,
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
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: number) => <Tag color={STATUS_TYPE[text].color}>{STATUS_TYPE[text].tagText}</Tag>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'news',
      width: 150,
      fixed: 'right',
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
              deleteRuleTemplatesFun({ id: record.id }, `${deleteRules}/${record.id}`);
            }}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
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
  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo({
      pageIndex:pagination.current,
      pageSize: pagination.pageSize,
    })
    let obj = {
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
    };
    onQuery({page:{...obj, }});
   
};


  return (
    <>
      <div className="table-caption">
        <div className="caption-left">
          <h3>报警列表</h3>
        </div>
        <div className="caption-right">
          <Button
            type="primary"
            onClick={() => {
              setDrawerVisible(true);
              setType('add');
              setDrawerTitle('新增报警规则');
            }}
          >
            + 新增报警规则
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        {...dataSource}
        // pagination={{
        //   ...dataSource.pageInfo,
        //   showTotal: (total) => `共 ${total} 条`,
        //   showSizeChanger: true,
        //   onChange: (page, pageSize) => onQuery({page:{ pageIndex: page, pageSize }}),
        // }}
        pagination={{
          onShowSizeChange: (_, size) => {
            setPageInfo({
              pageIndex:1,
              pageSize:size
            })
            
            },
          current: pageInfo?.pageIndex,
          total:pageInfo?.total,
          pageSize:pageInfo?.pageSize,
          showSizeChanger: true,
          showTotal: () => `总共 ${pageInfo?.total} 条数据`,
      }}
      onChange={pageSizeClick}
      />
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
}
