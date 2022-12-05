// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Input, Form, message, Select, Radio } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { usePortalList, useRegulesPortal, useDemands, useRegulusOnlineBugs } from '../../../hook';
import { debounce } from 'lodash';
import { demandRel } from '../../../service';

export interface IProps {
    type?: string;
    releaseId: any;
    onClose: () => void;
    onSave: () => void;
}

export default function RealteDemandBug(props: IProps) {
    const { type, onClose, onSave, releaseId } = props;
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

    const projectList = useMemo(() => type === 'demand' ? portalList : regulusPortal, [type, portalList, regulusPortal]);
    const demandList = useMemo(() => type === 'demand' ? demands : regulusBugs, [type, demands, regulusBugs])

    const handleSubmit = async () => {
        const values = await form.validateFields();
        setLoading(true);
        const res = await demandRel({ ...values, releaseId: Number(releaseId) || "", relatedPlat: type === 'demand' ? 'demandPlat' : 'regulus' })
        if (res?.success) {
            message.success('操作成功！');
            onClose();
            onSave();
        }
        setLoading(false);
    }

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
                    name="demandIds"
                    rules={[{ required: true, message: '请选择需求' }]}
                >
                    <Select
                        mode="multiple"
                        options={demandList || []}
                        onChange={() => { }}
                        showSearch
                        allowClear
                        // labelInValue
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
