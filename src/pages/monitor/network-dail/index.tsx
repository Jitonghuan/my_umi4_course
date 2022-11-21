import React, { useMemo, useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { createTableColumns} from './schema';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { Button, Space, Form, Table, Select, Input } from 'antd';
import EditDail from './edit-dail';
import {history} from 'umi'
import './index.less'
import useTable from '@/utils/useTable';
import * as APIS from './service';
import { getNetworkProbeList, tableItems } from './edit-dail/hook'
import { useGetNetworkProbeType, useGetCluster, useDelNetworkProbe } from './edit-dail/hook'
export default function NetworkDail() {
    const [listForm] = Form.useForm();
    const [curRecord, setcurRecord] = useState<any>({});
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [dailTypesLoading, dailTypes, getNetworkProbeProbeType] = useGetNetworkProbeType()
    const [clusterLoading, clusterData, getCluster] = useGetCluster()
    const [delLoading, deleteNetworkProbe] = useDelNetworkProbe()
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [tableLoading, setTableLoading] = useState<any>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    useEffect(() => {
        getNetworkProbeProbeType()
        getCluster()


    }, [])
    const columns = useMemo(() => {

        return createTableColumns({
            delLoading,
            onEdit: (record, index) => {
                setcurRecord(record);
                setMode('EDIT');
            },
            onView: (record, index) => {
                history.push({
                    pathname: '/matrix/monitor/detail',
                    search: `?url=${encodeURIComponent(record.graphUrl)}&clusterName=${record?.clusterName}&fromPage=network-dail`,
                  });
            },
            onDelete: async (id) => {
                deleteNetworkProbe(id).then(() => {
                    // submit()
                })

            },

        }) as any;
    }, []);

    //触发分页
    const pageSizeClick = (pagination: any) => {
        let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        };
        setPageSize(pagination.pageSize);

        loadListData(obj);
    };

    const loadListData = (params: any) => {
        let value = listForm.getFieldsValue();
        getList({ ...params, ...value, });
    };

    const getList = (paramsObj?: tableItems) => {
        setTableLoading(true);
        getNetworkProbeList(paramsObj)
            .then((res) => {
                setDataSource(res?.dataSource);
                setTotal(res?.total);
            })
            .finally(() => {
                setTableLoading(false);
            });
    };
    return (<PageContainer className="network-dail">
         <EditDail mode={mode} onSave={()=>{setMode("HIDE");}} onClose={()=>{setMode("HIDE")}}/>
        <FilterCard>
            <Form
                layout="inline"
                form={listForm}
                onFinish={(values: any) => {
                    getList({
                        ...values,

                    });
                }}
                onReset={() => {
                    listForm.resetFields();
                    //getReleaseList({ clusterName: curClusterName });
                }}
            >
                <Form.Item label="选择集群" name="clusterName">

                    <Select
                        options={clusterData}
                        style={{ width: 190 }}

                        showSearch
                    />
                </Form.Item>
                <Form.Item label="拨测名称" name="probeName">
                    <Input placeholder="请输入名称" style={{ width: 230 }} />
                </Form.Item>
                <Form.Item label="拨测地址" name="probeUrl">
                    <Input placeholder="请输入地址" style={{ width: 230 }} />
                </Form.Item>
                <Form.Item label="拨测类型" name="probeType">

                    <Select
                        options={dailTypes}
                        style={{ width: 190 }}

                        showSearch
                        allowClear
                    />
                </Form.Item>
                <Form.Item label="状态" name="status">
                    <Input placeholder="请输入名称" style={{ width: 240 }} />
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
        </FilterCard>
        <ContentCard>
            <div className="table-caption">
                <div className="caption-left">
                    <h3>网络拨测列表</h3>
                </div>
                <div className="caption-right">
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                setMode('ADD');
                            }}
                        >
                            + 新增拨测
              </Button>
                    </Space>
                </div>
            </div>

            <div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={tableLoading}
                    bordered
                    pagination={{
                        // current: taskTablePageInfo.pageIndex,
                        total: total,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        showTotal: () => `总共 ${total} 条数据`,
                    }}
                    onChange={pageSizeClick}
                ></Table>
            </div>
        </ContentCard>


    </PageContainer>)
}