import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { Form, Button, Table, Input, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { phaTableSchema } from '../schema';
import clusterContext from '../context';
import { getHpaList, hpaUpdate } from '../service';
import { parse, stringify } from 'query-string';
import CreateEditRule from './create-edit-rule';
import { delRequest } from '@/utils/request';
import appConfig from '@/app.config';
import './index.less';

export default function Hpa(props: any) {
    let location: any = useLocation();
    const { clusterCode } = useContext(clusterContext);
    const query = parse(location.search);
    const [pageSize, setPageSize] = useState<number>(20);
    const [form] = Form.useForm();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [mode, setMode] = useState<EditorMode>('HIDE');
    const [initData, setInitData] = useState<any>({});
    // 表格列配置
    const tableColumns: any = useMemo(() => {
        return phaTableSchema({
            handleEdit: (record: any) => {
                setInitData(record)
                setMode('EDIT');
            },
            handleDelete: async (record: any) => {
                const res = await delRequest(`${appConfig.apiPrefix}/infraManage/hpa/deleteRule/${record.id}`);
                if (res?.success) {
                    message.success('删除成功');
                    initSearch();
                }
            },
            handleSwitch: async (checked: boolean, record: any) => {
                const res = await hpaUpdate({ hpaSwitch: checked ? 1 : 0, id: record.id });
                if (res?.success) {
                    message.success('操作成功');
                    initSearch();
                }
            }
        })
    }, [dataSource]);

    useEffect(() => {
        setPageIndex(1);
        form.resetFields();
        queryList({ pageIndex: 1, pageSize });
    }, [clusterCode])

    const queryList = (params: any) => {
        setLoading(true);
        const value = form.getFieldsValue();
        getHpaList({ ...value, ...params, clusterCode }).then((res) => {
            if (res?.success) {
                setDataSource(res?.data?.dataSource || []);
                setTotal(res?.data?.pageInfo?.total)
            }
        }).finally(() => { setLoading(false) })
    };

    const initSearch = () => {
        setPageIndex(1);
        queryList({ pageSize, pageIndex: 1 })
    }

    // 分页
    const pageSizeClick = (pagination: any) => {
        setPageIndex(pagination.current);
        let obj = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
        };
        queryList(obj);
    }

    return (
        <div className="cluster-resource-detail">
            <CreateEditRule
                mode={mode}
                onClose={() => { setMode('HIDE') }}
                onSave={initSearch}
                clusterCode={clusterCode}
                initData={initData}
            />

            <div className="table-caption">
                <div className="caption-left">
                    <h3>弹性规则</h3>
                </div>
                <div className="caption-right">
                    <Form form={form} onFinish={() => { queryList({ pageIndex, pageSize }) }} layout="inline">
                        <Form.Item label="规则名称：" name="ruleName">
                            <Input placeholder='请输入规则名称' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                    <Button
                        type="primary"
                        onClick={() => {
                            setMode('ADD')
                        }}
                        size="small"
                    >
                        新增规则
          </Button>
                </div>
            </div>
            <div className="table-wrapper">
                <Table
                    dataSource={dataSource}
                    // dataSource={mockData}
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
                    bordered
                    rowKey="id"
                    columns={tableColumns}
                ></Table>

            </div>
        </div>
    );
}
