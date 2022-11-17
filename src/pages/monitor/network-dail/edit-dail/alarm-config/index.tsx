import React, { useState, useEffect } from 'react';
import {
  Form, Select, Input, Button, Divider,
  message, Space, Collapse, Table, Tag, Tooltip, Popconfirm
} from 'antd';
import RulesEdit from '../../../business/rules-edit';

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
    0: { tagText: '已启用', buttonText: '禁用', color: 'green', status: 1 },
    1: { tagText: '未启用', buttonText: '启用', color: 'default', status: 0 },
  };



export default function AlarmConfig(){
    const [rulesData, setRulesData] = useState<any[]>([]);
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);
  const [rulesType, setRulesType] = useState('add');
  const [rulesRecord, setRulesRecord] = useState({});
  const [rulesTotal, setRulesTotal] = useState(0);

    return(<div>
         <RulesEdit
          visible={rulesVisible}
          record={rulesRecord}
         // bizMonitorId={recordData?.id}
          //bizMonitorType={bizMonitorType}
          //envCode={currentEnvCode}
          onCancel={() => setRulesVisible(false)}
          onConfirm={() => {
            setRulesVisible(false);
            // void getRuleList({
            //   pageIndex: 1,
            //   pageSize: 20
            // })
          }}
          type={rulesType}
        />
         <Table
                  columns={[
                    {
                      title: '报警名称',
                      dataIndex: 'name',
                      key: 'name',
                      width: 140,
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
                      title: '报警级别',
                      dataIndex: 'level',
                      key: 'level',
                      render: (text: number) => <Tag color={ALERT_LEVEL[text]?.color}>{ALERT_LEVEL[text]?.text}</Tag>,
                      width: 120,
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
                      render: (_: string, record) => (
                        <Space>
                          <a
                            onClick={() => {
                            //   setRulesType('edit');
                            //   setRulesRecord(record);
                            //   setRulesVisible(true);
                            }}
                          >
                            编辑
                          </a>
                          <Popconfirm
                            title="确认删除？"
                            onConfirm={() => {
                            //   onDelRule(record)
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
                          </Popconfirm>
                          <Popconfirm
                            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
                            onConfirm={() => {
                            //   onEnableRule({
                            //     id: record.id,
                            //     status: STATUS_TYPE[record.status as number].status,
                            //   });
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <a>{STATUS_TYPE[record.status as number].buttonText}</a>
                          </Popconfirm>
                        </Space>
                      ),
                    }
                  ]}
                  pagination={{
                    total: rulesTotal,
                    pageSize: 20,
                    current: 1,
                    onChange: (page, pageSize) => {
                    //   void getRuleList({
                    //     pageIndex: page,
                    //     pageSize
                    //   })
                    }
                  }}
                  rowKey="id"
                  scroll={{ x: '100%' }}
                  dataSource={rulesData}
                  rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
                />
        </div>)
}