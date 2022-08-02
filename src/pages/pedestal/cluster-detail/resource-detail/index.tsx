import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { Form, Button, Input, Tag, Table, Select, message, Pagination } from "antd";
import type { PaginationProps } from 'antd';
import { history } from 'umi';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { resourceDetailTableSchema } from './schema';
import clusterContext from '../context'
import CreateYaml from './create-yaml';
import YamlDetail from './yaml-detail';
import Page from '../component/page';
import { useNodeListData } from '../hook'
import { getResourceList, resourceDel, resourceUpdate, searchYaml } from '../service';
import { useResourceType, useNameSpace } from '../hook';
import './index.less';
import { json } from "_@types_d3-fetch@3.0.1@@types/d3-fetch";
const mockData = [{ type: 'deployments', kind: 'deployments' }]
export default function ResourceDetail(props: any) {
    const { location, children } = props;
    const { clusterCode } = useContext(clusterContext);
    const [visible, setVisble] = useState(false);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [yamlDetailVisible, setYamlDetailVisible] = useState(false);
    const [createYamlVisible, setCreateYamlVisbile] = useState(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [storeParams, setStoreParams] = useState<any>(
        sessionStorage.getItem('cluster_resource_params') ? JSON.parse(sessionStorage.getItem('cluster_resource_params') || '{}') : {}
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [continueList, setContinueList] = useState<string[]>(['']);
    const [total, setTotal] = useState<number>(0);
    const [typeData] = useResourceType({});
    const [typeOptions, setTypeOptions] = useState<any>([]);
    const [nameSpaceData] = useNameSpace({ clusterCode, resourceType: 'namespaces' });
    const [currentRecord, setCurrentRecord] = useState<any>({});
    const [originData, setOriginData] = useState<any>([]);
    const [nodeList, setNodeList] = useState<any>([]);
    const [selectType, setSelectType] = useState<string>('');
    const [data] = useNodeListData({ pageSize, pageIndex, clusterCode: clusterCode || '' });
    const [updateLoading, setUpdateLoading] = useState(false);
    const showTotal: PaginationProps['showTotal'] = total => `总共 ${total}条`;

    useEffect(() => {
        const dataList = data.map((item: any) => ({ label: item.nodeName, value: item.nodeName }))
        setNodeList(dataList)
    }, [data])

    // 表格列配置
    const tableColumns = useMemo(() => {
        return resourceDetailTableSchema({
            handleDetail: (record: any, index: any) => {
                if (record.type === 'pods') {
                    history.push({
                        pathname: '/matrix/pedestal/cluster-detail/pods',
                        query: { ...location.query, name: record.name, namespace: record.namespace, kind: record.kind, type: '' }
                    })
                } else {
                    history.push({
                        pathname: '/matrix/pedestal/cluster-detail/load-detail',
                        query: { key: 'resource-detail', ...location.query, kind: record?.kind, type: record?.type, namespace: record?.namespace, name: record?.name },
                    })
                }

            },
            rePublic: async (record: any, index: any, updateColumn: string) => {
                updateResource(record, updateColumn)
            },
            stop: async (record: any, index: any, updateColumn: string) => {
                updateResource(record, updateColumn)
            },
            handleYaml: (record: any, index: any) => {
                setUpdateLoading(true)
                searchYaml({ clusterCode, resourceType: record?.type, namespace: record?.namespace, resourceName: record?.name }).then((res: any) => {
                    if (res?.success) {
                        setCurrentRecord({ yaml: res?.data || '' });
                        setYamlDetailVisible(true);
                    }
                }).finally(() => { setUpdateLoading(false) })
            },
            handleDelete: (record: any, index: any) => {
                const { type, name, namespace } = record;
                setUpdateLoading(true)
                resourceDel({ resourceType: type, resourceName: name, namespace, clusterCode }).then((res) => {
                    if (res?.success) {
                        message.success('删除成功！');
                        initialSearch()
                    }
                }).finally(() => { setUpdateLoading(false) })
            },
        }) as any;
    }, [dataSource]);

    useEffect(() => {
        if (pageIndex === 1) {
            setContinueList([''])
        }
        queryList();
    }, [pageIndex]);


    useEffect(() => {
        if (typeData && typeData.length !== 0) {
            setTypeOptions(typeData);
        }
    }, [typeData])

    useEffect(() => {
        if (nameSpaceData?.length !== 0 && clusterCode && typeData?.length !== 0) {
            form.setFieldsValue({
                namespace: storeParams?.namespace || nameSpaceData[0].value,
                resourceType: storeParams?.resourceType || 'deployments',
                node: storeParams?.node || ''
            });
            setSelectType(storeParams?.resourceType || 'deployments');
            queryList();
        }
    }, [nameSpaceData, clusterCode, typeData])


    const queryList = (index = pageIndex) => {
        const values = form.getFieldsValue();
        if (!values.resourceType) {
            return;
        };
        setLoading(true);
        let a = index === 1 ? '' : continueList[index - 2]
        getResourceList({ ...values, index, nodeName: values.node, limit: pageSize, continue: a, clusterCode }).then((res: any) => {
            if (res?.success) {
                setDataSource(res?.data?.items || []);
                setOriginData(res?.data?.items || []);
                if (index === 1) {
                    setTotal(res?.data?.total || 0)
                }
                continueList[index - 1] = res?.data?.continue || '';
                setContinueList([...continueList])
            } else {
                setDataSource([]);
                setOriginData([]);
                setTotal(0)
                setPageIndex(1)
            }
        }).finally(() => { setLoading(false) })
    }

    const updateResource = (record: any, updateColumn: string) => {
        const { type, namespace, name, info } = record || {};
        const infoData = JSON.parse(JSON.stringify(info || {}))
        infoData[updateColumn] = !infoData[updateColumn];
        setUpdateLoading(true)
        resourceUpdate({ resourceType: type, namespace, clusterCode, resourceName: name, updateBody: JSON.stringify(infoData) }).then((res) => {
            if (res?.success) {
                message.success('操作成功！');
                initialSearch()
            }
        }).finally(() => {
            setUpdateLoading(false)
        });

    }


    const clickLeft = () => {
        setPageIndex(pageIndex - 1);
    }

    const clickRright = () => {
        setPageIndex(pageIndex + 1);
    }

    const filterData = (value: string) => {
        const data = JSON.parse(JSON.stringify(originData))
        const afterFilter: any = []
        data.forEach((item: any) => {
            if (item.name?.indexOf(value) !== -1) {
                afterFilter.push(item)
            }
        })
        setDataSource(afterFilter)
    }

    const onSave = () => {
        setCreateYamlVisbile(false);
        initialSearch()
    }

    const initialSearch = () => {
        setPageIndex(1);
        setContinueList(['']);
        queryList(1)
    }


    return (
        <div className='cluster-resource-detail'>
            <CreateYaml visible={createYamlVisible} onClose={() => { setCreateYamlVisbile(false) }} onSave={onSave} ></CreateYaml>
            <YamlDetail visible={yamlDetailVisible} onClose={() => { setYamlDetailVisible(false) }} initData={currentRecord}></YamlDetail>
            <div className='search-form'>
                <Form
                    layout="inline"
                    onFinish={(value) => {
                        sessionStorage.setItem('cluster_resource_params', JSON.stringify(value || {}));
                        setStoreParams(value);
                        initialSearch()
                    }}
                    form={form}
                    onReset={() => {
                        form.setFieldsValue({ resourceType: 'deployments', namespace: '' });
                        sessionStorage.setItem('cluster_resource_params', JSON.stringify(form.getFieldsValue() || {}));
                        setSelectType('deployments');
                        initialSearch()
                    }}
                >
                    <Form.Item label="资源类型" name="resourceType" rules={[{ required: true, message: '请选择查询关键词' }]}>
                        <Select
                            style={{ width: 200 }}
                            options={typeOptions}
                            showSearch
                            value={selectType}
                            onChange={(value: any) => { setSelectType(value) }}
                            optionFilterProp="label"
                            filterOption={(input, option) => {
                                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                        </Select>
                    </Form.Item>
                    {selectType !== 'namespaces' &&
                        <Form.Item label="命名空间" name="namespace" >
                            <Select
                                style={{ width: 200 }}
                                options={nameSpaceData}
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) => {
                                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}>
                            </Select>
                        </Form.Item>}
                    {selectType === 'pods' &&
                        <Form.Item label="节点名称" name="node" >
                            <Select
                                style={{ width: 200 }}
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) => {
                                    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}
                                options={nodeList}
                            >
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button danger htmlType="reset">重置</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="table-caption" >
                <div className="caption-left">
                    <h3>资源列表</h3>
                </div>
                <div className="caption-right">
                    搜索：<Input style={{ width: 200 }} size='small' onChange={(e) => { filterData(e.target.value) }}></Input>
                    <Button type="primary" onClick={() => { setCreateYamlVisbile(true) }} size='small' style={{ marginLeft: '10px' }}>创建资源</Button>
                </div>
            </div>
            <div className='table-wrapper'>
                <Table
                    dataSource={dataSource}
                    // dataSource={mockData}
                    loading={loading || updateLoading}
                    bordered
                    rowKey="id"
                    pagination={false}
                    columns={tableColumns}
                // scroll={dataSource.length > 0 ? { x: 18000 } : undefined}
                ></Table>
                <div className='flex-end' style={{ marginTop: '10px' }}>
                    <Page continueList={continueList} clickLeft={clickLeft} total={total} pageIndex={pageIndex} totalPage={Math.ceil(total / pageSize)} clickRright={clickRright} />
                </div>
            </div>
        </div >
    );
}
