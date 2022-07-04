import React, { useEffect, useRef, useState, useMemo } from "react";
import { Form, Button, Input, Tag, Table, Select, message } from "antd";
import type { PaginationProps } from 'antd';
import { history } from 'umi';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { resourceDetailTableSchema } from '../schema';
import CreateYaml from './create-yaml';
import YamlDetail from './yaml-detail';
import './index.less'
const mockdata = [{ disk: '11', ip: '12.12.12' }]
export default function ResourceDetail() {
    const [visible, setVisble] = useState(false);
    const [tagVisible, setTagVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(mockdata);
    const [yamlDetailVisible, setYamlDetailVisible] = useState(false);
    const [createYamlVisible, setCreateYamlVisbile] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [pageInfo, setPageInfo] = useState<any>({ pageSize: 10, pageIndex: 1, total: 0 });
    const storeParams = JSON.parse(localStorage.getItem('resource_params_list') || '[]');
    const [selectParams, setSelectParams] = useState<any>(storeParams || []);

    // 表格列配置
    const tableColumns = useMemo(() => {
        return resourceDetailTableSchema({
            handleDetail: (record: any, index: any) => {
                history.push({
                    pathname: '/matrix/pedestal/cluster-detail/load-detail',
                    query: { key: 'resource-detail' },
                })
            },
            rePublic: (record: any, index: any) => {

            },
            stop: (record: any, index: any) => {

            },
            handleYaml: (record: any, index: any) => {
                setYamlDetailVisible(true)
            },
            handleDelete: (record: any, index: any) => {

            },
        }) as any;
    }, [dataSource]);

    const addParams = (values: any) => {
        const { mainWord, content } = values;
        const res = `${mainWord}：${content}`
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



    return (
        <div className='cluster-resource-detail'>
            <CreateYaml visible={createYamlVisible} onClose={() => { setCreateYamlVisbile(false) }}></CreateYaml>
            <YamlDetail visible={yamlDetailVisible} onClose={() => { setYamlDetailVisible(false) }}></YamlDetail>
            <div className='search-form'>
                <Form
                    layout="inline"
                    onFinish={addParams}
                    form={form}
                    onReset={() => {
                        form.resetFields();
                    }}
                >
                    <Form.Item label="查询关键词" name="mainWord">
                        <Select style={{ width: 240 }} allowClear options={[{ label: 'key1', value: 'key1' }]}></Select>
                    </Form.Item>
                    <Form.Item label="查询内容" name="content" >
                        <Select style={{ width: 240 }} allowClear options={[{ label: 'test1', value: 'test1s' }]}>  </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">添加查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="ghost" htmlType="reset">清空查询</Button>
                    </Form.Item>
                </Form>
                <div style={{ marginTop: '10px' }}>
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
                </div>
            </div>
            <div className="table-caption" >
                <div className="caption-left">
                    <h3>资源列表</h3>
                </div>
                <div className="caption-right">
                    搜索：<Input style={{ width: 200 }}></Input>
                    <Button type="primary" onClick={() => { setCreateYamlVisbile(true) }} size='small' style={{ marginLeft: '10px' }}>创建资源</Button>
                </div>
            </div>
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
                pagination={{
                    pageSize: pageInfo.pageSize,
                    total: pageInfo.total,
                    current: pageInfo.pageIndex,
                    showSizeChanger: true,
                    onShowSizeChange: (_, next) => {
                        setPageInfo({
                            pageIndex: 1,
                            pageSize: next,
                        });
                    },
                    onChange: (next) =>
                        setPageInfo({
                            pageIndex: next,
                        }),
                }}
                columns={tableColumns}
                scroll={dataSource.length > 0 ? { x: 1800 } : undefined}
            ></Table>
            {/* <Button onClick={() => { }}>批量删除</Button> */}

        </div >
    );
}
