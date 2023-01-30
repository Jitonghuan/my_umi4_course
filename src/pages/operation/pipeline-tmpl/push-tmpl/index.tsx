
import React, { useContext, useRef, useMemo } from 'react';
import { Button, Row, Col, Form, Select, Tag, Space, message, Spin, Modal, Radio, Popconfirm } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, putRequest, postRequest } from '@/utils/request';
import TableSearch from '@/components/table-search';

import { history, useLocation } from 'umi';
import { pushCicdTemplate } from '../service'
import { parse } from 'query-string';
import { stringify } from 'qs';
import PageContainer from '@/components/page-container';
import useTable from '@/utils/useTable';
import { useState, useEffect } from 'react';
import { appList, appTypeList } from '../../app-tmpl/service';
import { createTableColumns } from '../../app-tmpl/push/schema';
import { queryAppGroupReq } from '../../app-tmpl/push/service'
import AceEditor from '@/components/ace-editor';
import DetailContext from '@/pages/application/application-detail/context';
import EditorTable from '@cffe/pc-editor-table';



const PushPipeLineTmpl = () => {
    let location: any = useLocation();
    const query: any = parse(location.search);
    const tmplDetailData: any = location.state?.record || {};
    const [form] = Form.useForm();
    const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
    const [businessData, setBusinessData] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [currentData, setCurrentData] = useState<any[]>([]);
    const [flowType, setFlowType] = useState<string>("")
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useEffect(() => {
        selectCategory()
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
            setSelectedRowKeys(selectedRowKeys);
            setCurrentData(selectedRows);
        },
    };
    //加载应用分类
    const selectCategory = () => {
        getRequest(appTypeList).then((result) => {
            const list = (result.data.dataSource || []).map((n: any) => ({
                label: n.categoryName,
                value: n.categoryCode,
                key: n.categoryCode,
                data: n,
            }));
            setCategoryData(list);
        });
    };
    const columns = useMemo(() => {
        return createTableColumns({
            onParam: (record, index) => {
                const query = {
                    id: record.id,
                    appCode: record.appCode,
                    templateType: record.templateType,
                    envCode: record.envCode,
                };
                history.push(`/matrix/application/detail/pipeLineTmpl?${stringify(query)}`);
            },
        }) as any;
    }, []);


    const {
        tableProps,
        search: { submit, reset },
    } = useTable({
        url: appList,
        method: 'GET',
        form,
        formatter: (params) => {
            return {
                ...params,
            };
        },
        formatResult: (result) => {

            return {
                total: result.data?.pageInfo?.total,
                list: result.data?.dataSource || [],
            };
        },
    });

    const showModal = () => {
        setOpen(true);
    };

    const onPushTmpl = () => {
        //pushCicdTemplate
        setConfirmLoading(true);
        postRequest(pushCicdTemplate, { data: { id: tmplDetailData?.id, flowType, appCodes: selectedRowKeys } }).then((res) => {
            if (res?.success) {
                message.success("推送成功！")
                setOpen(false)

            }
        }).finally(() => {
            setConfirmLoading(false);
        })
    }

    return (
        <PageContainer>
            <Modal
                title="请选择发布类型"
                open={open}
                onOk={onPushTmpl}
                confirmLoading={confirmLoading}
                onCancel={() => { setOpen(false); }}
            >
                <div>
                    <span>发布类型:</span> <Select style={{ width: 260 }} value={flowType} onChange={(value) => { setFlowType(value) }} options={[
                        { label: "App", value: "app" },
                        { label: "Client", value: "client" },
                    ]} />

                </div>
            </Modal>

            <TableSearch
                form={form}
                bordered
                rowKey="appCode"
                formOptions={[

                    {
                        key: '1',
                        type: 'select',
                        label: '应用分类',
                        dataIndex: 'appCategoryCode',
                        width: '200px',
                        renderLabel: true,
                        option: categoryData,
                        showSelectSearch: true,
                        onChange: (value) => {
                            queryAppGroupReq({
                                categoryCode: value,
                            }).then((datas) => {
                                setBusinessData(datas.list);
                            });

                        }

                    },

                    {
                        key: '2',
                        type: 'select',
                        label: '应用组',
                        dataIndex: 'appGroupCode',
                        width: '180px',
                        renderLabel: true,
                        option: businessData,
                        showSelectSearch: true
                    },


                    {
                        key: '3',
                        type: 'input',
                        label: '应用Code',
                        dataIndex: 'appCode',
                        width: '220px',
                    },
                ]}
                formLayout="inline"
                columns={columns}
                {...tableProps}
                pagination={{
                    ...tableProps.pagination,
                    showTotal: (total) => `共 ${total} 条`,
                    showSizeChanger: true,
                    // size: 'small',
                    defaultPageSize: 20,
                }}
                extraNode={

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div className="left-caption">
                            <h3> 应用列表</h3>

                        </div>
                        <div className="right-caption">
                            当前模版：
            <Tag color="blue">{tmplDetailData?.templateName || ""}</Tag>

                        </div>

                    </div>



                }
                className="table-form"
                onSearch={submit}
                rowSelection={{ ...rowSelection }}
                reset={reset}
                scroll={{ x: '100%' }}
                searchText="查询"
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Space>
                    <Button ghost danger onClick={() => {
                        setSelectedRowKeys([]);
                        setCurrentData([])
                    }}>清空</Button>
                    <Button type="primary" onClick={showModal}>推送</Button>
                </Space>

            </div>

        </PageContainer>

    )
}
export default PushPipeLineTmpl;

