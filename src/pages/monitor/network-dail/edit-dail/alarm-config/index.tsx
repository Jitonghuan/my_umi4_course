import React, { useState, useEffect } from 'react';
import { Button,message, Space,Table, Tag, Tooltip, Popconfirm} from 'antd';
import {ALERT_LEVEL,STATUS_TYPE} from './type';
import { deleteRules, rulesList, ruleSwitch } from '../../../service';
import {postRequest, getRequest, delRequest} from '@/utils/request';
import RulesEdit from '../../../business/rules-edit';
interface Iprops{
    curRecord:any;
    curId:number
}
export default function AlarmConfig (props:Iprops){
  const {curRecord,curId} =props
  const [rulesData, setRulesData] = useState<any[]>([]);
  const [rulesVisible, setRulesVisible] = useState<boolean>(false);
  const [rulesType, setRulesType] = useState('add');
  const [rulesRecord, setRulesRecord] = useState<any>({});
  const [rulesTotal, setRulesTotal] = useState(0);

  // 删除告警
  async function onDelRule (record: any) {
    const res = await delRequest(`${deleteRules}/${record.id}`);
    if (res?.success) {
      message.success('删除成功');
      void getRuleList({
        pageIndex: 1,
        pageSize: 20
      })
    }
  }

  // 启用， 禁用告警
  async function onEnableRule (data: any) {
    const res = await postRequest(ruleSwitch, {
      data
    })
    if (res?.success) {
      message.success('操作成功');
      void getRuleList({
        pageIndex: 1,
        pageSize: 20
      })
    }
  }

  // 告警列表
  async function getRuleList (page?: any) {
    const res = await getRequest(rulesList, {
      data: {
        bizMonitorId: curRecord?.id,
        bizMonitorType:"netProbe",
        pageIndex: page?.pageIndex || 1,
        pageSize: page?.pageSize || 20
      }
    })
    const { dataSource, pageInfo } = res?.data || {};
    setRulesData(dataSource || []);
    setRulesTotal(pageInfo?.total || 0);
  }
  //编辑回显数据
  useEffect(() => {
  
    void getRuleList();
  }, []);


    return(<div style={{height:'100%'}}>
         <RulesEdit
          visible={rulesVisible}
          record={rulesRecord}
          bizMonitorId={curId}
          probeName={curRecord?.probeName}
          bizMonitorType={"netProbe"}
          envCode={rulesRecord?.envCode||""}
          onCancel={() => setRulesVisible(false)}
          onConfirm={() => {
            setRulesVisible(false);
            void getRuleList({
              pageIndex: 1,
              pageSize: 20
            })
          }}
          type={rulesType}
        />
        <div style={{display:"flex",justifyContent:"flex-end"}}> <Button
                      type="primary"
                      ghost
                      disabled={!curId}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRulesType('add');
                        setRulesVisible(true);
                      }}
                     // icon={<PlusOutlined />}
                    >
                      新增报警
                    </Button></div>
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
                              setRulesType('edit');
                              setRulesRecord(record);
                              setRulesVisible(true);
                            }}
                          >
                            编辑
                          </a>
                          <Popconfirm
                            title="确认删除？"
                            onConfirm={() => {
                              onDelRule(record)
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
                          </Popconfirm>
                          <Popconfirm
                            title={`确认${STATUS_TYPE[record.status as number].buttonText}`}
                            onConfirm={() => {
                              onEnableRule({
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
                    }
                  ]}
                  pagination={{
                    total: rulesTotal,
                    pageSize: 20,
                    current: 1,
                    onChange: (page, pageSize) => {
                      void getRuleList({
                        pageIndex: page,
                        pageSize
                      })
                    }
                  }}
                  rowKey="id"
                  scroll={{ x: '100%' }}
                  dataSource={rulesData}
                  rowClassName={(record) => (record?.status === 1 ? 'rowClassName' : '')}
                />


    </div>)
}