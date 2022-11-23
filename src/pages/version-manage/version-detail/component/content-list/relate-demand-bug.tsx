// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Input, Form, message, Select, Radio } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { usePortalList, useRegulesPortal, useDemands, useRegulusOnlineBugs } from '../../../hook';
import { debounce } from 'lodash';

export interface IProps {
    type?: string;
    onClose: () => void;
    onSave: () => void;
}

export default function BranchEditor(props: IProps) {
    const { type, onClose, onSave } = props;
    const [loading, setLoading] = useState(false);
    const [portalList, listLoading, loadPortalList] = usePortalList({});
    const [regulusPortal, regulusLoading, loadRegulusPortal] = useRegulesPortal({});
    const [demands, demandsLoading, loadDemands] = useDemands({});
    const [regulusBugs, bugsLoading, loadBugs] = useRegulusOnlineBugs({});
    const [form] = Form.useForm();
    useEffect(() => {
        if (type === 'hide') return;
        if (type === 'demand') {
            loadPortalList();
        }
        if (type === 'bug') {
            loadRegulusPortal();
        }
        form.resetFields();
        form.setFieldsValue({
        });
        // queryPortal();
    }, [type]);

    const projectList = useMemo(() => type === 'demand' ? portalList : regulusPortal, [type, portalList, regulusPortal])

    const handleSubmit = async () => {
        const values = await form.validateFields();
        console.log(values, 'values')
        let demandArry: any = [];
        values.demandId?.map((item: any) => {
            demandArry.push(item.value + '');
        });
        setLoading(true);
    }

    const onSearch = debounce((val: any) => {
        // queryDemand(projectId, val);
    }, 300);


    return (
        <Modal
            destroyOnClose
            width={600}
            title={type === 'demand' ? '关联需求' : '关联bug'}
            visible={type !== 'hide'}
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={loading}
            maskClosable={false}
        >
            <Form form={form} labelCol={{ flex: '100px' }}>
                <Form.Item
                    label="项目列表"
                    name="projectId"
                    rules={[{ required: true, message: '请选择项目' }]}
                >
                    <Select
                        options={projectList || []}
                        onChange={(value) => {
                            console.log(value, 'value')
                            type === 'demand' ? loadDemands({ projectId: value }) : loadBugs({ projectId: value })
                        }}
                        showSearch
                        allowClear
                        optionFilterProp="label"
                        loading={listLoading || bugsLoading}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="需求列表"
                    name="demandId"
                    rules={[{ required: true, message: '请选择需求' }]}
                >
                    <Select
                        mode="multiple"
                        options={demands}
                        onChange={() => { }}
                        showSearch
                        allowClear
                        labelInValue
                        // onSearch={onSearch}
                        optionFilterProp="label"
                        loading={regulusLoading || demandsLoading}
                    ></Select>
                </Form.Item>
                <Form.Item label="描述" name="desc">
                    <Input.TextArea placeholder="请输入描述" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
