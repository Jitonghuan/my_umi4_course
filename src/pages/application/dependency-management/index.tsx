
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, Input, Button, Popconfirm, Switch, message, Tag } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { getRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';
import { addRule, getRuleList, updateRule } from './service';
import RuleDrawer from './component/rule-drawer';
import WhiteListModal from './component/white-list-modal'

export default function RelyMangement() {
    const [form] = Form.useForm();
    const [ruleList, setRuleList] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [drawer, setDrawer] = useState<EditorMode>('HIDE');
    const [whiteListDrawer, setWhiteListDrawer] = useState<EditorMode>('HIDE');
    const [initData, setInitData] = useState<any>({});
    const [visible, setVisible] = useState<boolean>(false)
    // 获取列表数据
    const queryRuleList = (params: any) => {
        const value = form.getFieldsValue();
        setLoading(true)
        try {
            getRuleList({ ...params, ...value }).then((res) => {
                if (res) {
                    setRuleList(res?.data?.dataSource)
                    setTotal(res?.data?.pageInfo?.total)
                }
            })
        } catch (error) {
            setRuleList([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        };
        queryRuleList(obj);
    }

    const handleUpdateRule = async (record: any) => {
        const params = Object.assign(record, { isEnable: !record.isEnable })
        const res = await updateRule({ ...params });
        if (res && res.success) {
            queryRuleList({ pageIndex: 1, pageSize })
        }
    }

    const handleDeleteNoise = async (id: number) => {
        const res = await delRequest(`${appConfig.apiPrefix}/appManage/dependencyManage/deleteRule/${id}`);
        if (res?.success) {
            queryRuleList({ pageIndex: 1, pageSize })
        }
    };
    // 切换校验开关
    const switchChange = async (record: any) => {
        const res = await updateRule({ isEnable: record.isEnable ? 0 : 1, id: record.id })
        if (res.success) {
            message.success('操作成功！');
            queryRuleList({ pageIndex: 1, pageSize })
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '校验规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
        },
        {
            title: 'groupId',
            dataIndex: 'groupId',
            key: 'groupId',
        },
        {
            title: 'artifactId',
            dataIndex: 'artifactId',
            key: 'artifactId',
        },
        {
            title: '版本范围',
            dataIndex: 'versionRange',
            key: 'versionRange',
        },
        {
            title: '校验环境',
            dataIndex: 'envCode',
            key: 'envCode',
            render: (value: any, record: any) => {
                return (
                    <>
                        {value.split(',').map((item: any) => <Tag color="blue">{item}</Tag>)}
                    </>
                )
            }
        },
        {
            title: '升级截止日期',
            dataIndex: 'blockTime',
            key: 'blockTime',
        },
        {
            title: '校验级别',
            dataIndex: 'checkLevel',
            key: 'checkLevel',
        },
        {
            title: '校验开关',
            dataIndex: 'dependencyCheck',
            key: 'dependencyCheck',
            render: (value: any, record: any) => {
                return (
                    <Switch
                        checked={value}
                        onChange={() => {
                            switchChange(record);
                        }}
                    />
                )
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            render: (text: string, record: any) => {
                return (
                    <>
                        <Button onClick={() => { }}>详情</Button>
                        <Button type="link" onClick={() => { setInitData(record); setDrawer('EDIT') }}>
                            编辑
                   </Button>
                        <Popconfirm
                            title="确认删除"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => {
                                handleDeleteNoise(record.id);
                            }}
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </>
                );
            },
        },
    ]
    return (
        <PageContainer className="tmpl-detail">
            <FilterCard>
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={(values: any) => {
                            queryRuleList({
                                ...values,
                                pageIndex: 1,
                                pageSize: 20,
                            });
                        }}
                        onReset={() => {
                            form.resetFields();
                            queryRuleList({
                                pageIndex: 1,
                                pageSize: 20,
                            });
                        }}
                    >
                        <Form.Item label="规则名称：" name="ruleName">
                            <Input placeholder="请输入规则名称" style={{ width: 240 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                查询
                </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="ghost" htmlType="reset">
                                重置
                </Button>
                        </Form.Item>
                    </Form>
                </div>
            </FilterCard>
            <ContentCard>
                <div className="table-caption">
                    <div className="caption-left">
                        <h3>依赖规则列表</h3>
                    </div>
                    <div className="caption-right">
                        <Button
                            type="primary"
                            onClick={() => {
                                setVisible(true)
                            }}
                        >
                            全局白名单
                       </Button>

                        <Button
                            type="primary"
                            onClick={() => {
                                setDrawer('ADD')
                            }}
                        >
                            <PlusOutlined />
                         新增规则
                      </Button>
                    </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <Table
                        columns={columns}
                        dataSource={ruleList}
                        loading={loading}
                        pagination={{
                            current: pageIndex,
                            total,
                            pageSize,
                            showSizeChanger: true,
                            onShowSizeChange: (_, size) => {
                                setPageSize(size);
                                setPageIndex(1); //
                            },
                            showTotal: () => `总共 ${total} 条数据`,
                        }}
                        onChange={pageSizeClick}
                    />
                </div>
            </ContentCard>
            <RuleDrawer
                mode={drawer}
                onSave={() => {
                    setDrawer('HIDE');
                    queryRuleList({ pageIndex, pageSize })
                }}
                onClose={() => {
                    setDrawer('HIDE');
                }}
                initData={initData}>
            </RuleDrawer>
            <WhiteListModal
                mode={whiteListDrawer}
                onSave={() => {
                    setVisible(false)
                }}
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
                initData={initData}>
            </WhiteListModal>
        </PageContainer>
    )
}