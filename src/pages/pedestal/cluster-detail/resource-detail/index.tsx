import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { Form, Button, Input, Tag, Table, Select, message, Pagination } from "antd";
import type { PaginationProps } from 'antd';
import { history } from 'umi';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { resourceDetailTableSchema } from './schema';
import { keyOptions } from './schema'
import clusterContext from '../context'
import CreateYaml from './create-yaml';
import YamlDetail from './yaml-detail';
import Page from '../component/page';
import { getResourceList, resourceDel, resourceCreate } from '../service';
import { useResourceType, useNameSpace } from '../hook';
import './index.less'
const mockdata = [{ disk: '11', ip: '12.12.12', id: 1 }]
export default function ResourceDetail(props: any) {
    const { location, children } = props;
    const { clusterCode, cluseterName } = useContext(clusterContext);
    const [visible, setVisble] = useState(false);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [yamlDetailVisible, setYamlDetailVisible] = useState(false);
    const [createYamlVisible, setCreateYamlVisbile] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const storeParams = JSON.parse(localStorage.getItem('resource_params_list') || '[]');
    const [selectParams, setSelectParams] = useState<any>(storeParams || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [continueList, setContinueList] = useState<string[]>(['']);
    const [total, setTotal] = useState<number>(0);
    const [typeData] = useResourceType({});
    const [typeOptions, setTypeOptions] = useState<any>([]);
    const [nameSpaceData] = useNameSpace({ clusterCode, resourceType: 'namespaces' });
    const [currentRecord, setCurrentRecord] = useState<any>({})
    const showTotal: PaginationProps['showTotal'] = total => `总共 ${total}条`;

    // 表格列配置
    const tableColumns = useMemo(() => {
        return resourceDetailTableSchema({
            handleDetail: (record: any, index: any) => {
                history.push({
                    pathname: '/matrix/pedestal/cluster-detail/load-detail',
                    query: { key: 'resource-detail', ...location.query },
                })
            },
            rePublic: (record: any, index: any) => {

            },
            stop: (record: any, index: any) => {

            },
            handleYaml: (record: any, index: any) => {
                setCurrentRecord(record);
                setYamlDetailVisible(true);
            },
            handleDelete: async (record: any, index: any) => {
                const value = form.getFieldsValue();
                const res = await resourceDel({ ...value, clusterCode })
                if (res?.success) {
                    message.success('删除成功！');
                    queryList();
                }
            },
        }) as any;
    }, [dataSource]);

    useEffect(() => {
        queryList();
    }, [pageIndex])

    useEffect(() => {
        if (typeData.length !== 0) {
            setTypeOptions(typeData);
            form.setFieldsValue({ resourceType: typeData[0].value })
        }
    }, [typeData])

    useEffect(() => {
        if (nameSpaceData.length !== 0) {
            form.setFieldsValue({ namespace: nameSpaceData[0].value });
            queryList();
        }
    }, [nameSpaceData])

    const queryList = () => {
        setLoading(true);
        const values = form.getFieldsValue();
        if (!values.resourceType) {
            return;
        };
        console.log(pageIndex, continueList, 11)
        let a = pageIndex === 1 ? '' : continueList[pageIndex - 2]
        getResourceList({ ...values, pageIndex, limit: pageSize, continue: a, clusterCode }).then((res: any) => {
            if (res?.success) {
                setDataSource(res?.data?.items || []);
                if (pageIndex === 1) {
                    setTotal(res?.data?.total || 0)
                }
                continueList[pageIndex - 1] = res?.data?.continue || '';
                setContinueList([...continueList])
            }
        }).finally(() => { setLoading(false) })
    }

    const addParams = (values: any) => {
        const { resourceType, namespace } = values;
        const res = `${resourceType}：${namespace}`
        if (selectParams.includes(res)) {
            message.info('此参数和参数值已存在！');
        } else {
            const newArray = selectParams.concat(res)
            setSelectParams(newArray)
            localStorage.setItem('resource_params_list', JSON.stringify(newArray));
        }
    }

    const deleteParams = (e: any, item: any) => {
        if (selectParams.includes(item)) {
            const res = selectParams.filter((e: string) => e !== item);
            setSelectParams(res)
            localStorage.setItem('resource_params_list', JSON.stringify(res));
        }
    }

    const clickLeft = () => {
        setPageIndex(pageIndex - 1);
    }

    const clickRright = () => {
        setPageIndex(pageIndex + 1);
    }

    const batchDelete = () => {
        console.log(selectedRowKeys, 'selectRowKeys')
    }

    const pageChange = (page: number, pageSize: number) => {
        setPageIndex(page);
    }

    return (
        <div className='cluster-resource-detail'>
            <CreateYaml visible={createYamlVisible} onClose={() => { setCreateYamlVisbile(false) }} ></CreateYaml>
            <YamlDetail visible={yamlDetailVisible} onClose={() => { setYamlDetailVisible(false) }} initData={currentRecord}></YamlDetail>
            <div className='search-form'>
                <Form
                    layout="inline"
                    onFinish={() => {
                        setContinueList(['']);
                        queryList();
                    }}
                    form={form}
                    onReset={() => {
                        form.setFieldsValue({ resourceType: typeData[0].value, namespace: '' });
                        setContinueList(['']);
                        setPageIndex(1)
                        queryList();
                    }}
                >
                    <Form.Item label="资源类型" name="resourceType" rules={[{ required: true, message: '请选择查询关键词' }]}>
                        <Select
                            style={{ width: 200 }}
                            options={typeOptions}
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) => {
                                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                        </Select>
                    </Form.Item>
                    <Form.Item label="命名空间" name="namespace" >
                        <Select
                            style={{ width: 200 }}
                            allowClear options={nameSpaceData}
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) => {
                                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                        </Select>
                    </Form.Item>
                    <Form.Item label="节点名称" name="nodeNames" >
                        <Select style={{ width: 200 }} allowClear options={[{ label: 'test1', value: 'test1s' }]}>  </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button danger htmlType="reset">重置</Button>
                    </Form.Item>
                </Form>
                {/* <div style={{ marginTop: '10px' }}>
                    {selectParams.length > 0 ? selectParams.map((item: any) => {
                        return (
                            <Tag
                                closable
                                color='blue'
                                onClose={(e: any) => {
                                    deleteParams(e, item);
                                }}
                            >
                                {item}
                            </Tag>
                        )
                    }) : null}
                </div> */}
            </div>
            <div className="table-caption" >
                <div className="caption-left">
                    <h3>资源列表</h3>
                </div>
                <div className="caption-right">
                    搜索：<Input style={{ width: 200 }} size='small'></Input>
                    <Button type="primary" onClick={() => { setCreateYamlVisbile(true) }} size='small' style={{ marginLeft: '10px' }}>创建资源</Button>
                </div>
            </div>
            <div className='table-wrapper'>
                <Table
                    dataSource={dataSource}
                    loading={loading}
                    bordered
                    rowKey="id"
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (selectedRowKeys: React.Key[]) => {
                            setSelectedRowKeys(selectedRowKeys as string[]);
                        },
                    }}
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
