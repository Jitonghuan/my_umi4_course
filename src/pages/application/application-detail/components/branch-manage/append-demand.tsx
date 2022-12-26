// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Input, Form, message, Select, Radio } from 'antd';
import { usePortalList, useRegulesPortal, useDemands, useRegulusOnlineBugs } from './hook';
import { debounce } from 'lodash';
import { mock } from '@/pages/trafficmap/app-traffic/traffic-detail/components/list-detail/call-info/schema';

export interface IProps {
    visible?: boolean;
    appCode: string;
    appCategoryCode: string;
    masterBranchOptions: any;
    selectMaster: any;
    onClose: () => void;
    onSubmit: () => void;
    initData: any
}

const mockData = {
    project: { name: '测试项目2', id: 10012002 },
    type: 'demand',
    data: [
        {
            "projectId": "10012002",
            "projectCode": "PROJECT-20221027135942",
            "projectName": "测试项目2",
            "id": "10018001",
            "type": null,
            "codes": "REQUIREMENT-20221102102218",
            "title": "test",
            "state": "开发中",
            "dutyUserName": "何珍珍",
            "planStartTime": null,
            "planEndTime": null
        },
        {
            "projectId": "10012002",
            "projectCode": "PROJECT-20221027135942",
            "projectName": "测试项目2",
            "id": "10018002",
            "type": null,
            "codes": "REQUIREMENT-20221102102234",
            "title": "test1",
            "state": "开发中",
            "dutyUserName": "何珍珍",
            "planStartTime": null,
            "planEndTime": null
        }
    ]
}

export default function AppendDemand(props: IProps) {
    const { visible, appCode, masterBranchOptions, onClose, onSubmit, appCategoryCode, selectMaster, initData } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [platformValue, setPlatformValue] = useState<string>('');
    const [portalList, listLoading, loadPortalList] = usePortalList({});
    const [regulusPortal, regulusLoading, loadRegulusPortal] = useRegulesPortal({});
    const [demands, demandsLoading, loadDemands] = useDemands({});
    const [regulusBugs, bugsLoading, loadBugs] = useRegulusOnlineBugs({});

    const projectList = useMemo(() => platformValue === 'demand' ? portalList : regulusPortal, [platformValue, portalList, regulusPortal]);
    const demandList = useMemo(() => platformValue === 'demand' ? demands : regulusBugs, [platformValue, demands, regulusBugs])

    useEffect(() => {
        if (visible) {
            form.setFieldsValue(initData);
            form.setFieldsValue({ relatedPlat: mockData?.type })
            setPlatformValue(mockData?.type);
            loadPortalList();
        }
    }, [visible])

    const handleSubmit = async () => {
        const values = await form.validateFields();

    }

    return (
        <Modal
            destroyOnClose
            width={600}
            title='追加需求'
            visible={visible}
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={loading}
            maskClosable={false}
        >
            <Form form={form} labelCol={{ flex: '100px' }}>
                <Form.Item label="主干分支" name="masterBranch" rules={[{ required: true, message: '请选择主干分支' }]}>
                    <Select options={masterBranchOptions} disabled></Select>
                </Form.Item>
                <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="分支类型"
                    name="relatedPlat"
                    rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择需要关联的平台' }]}
                >
                    <Radio.Group value={platformValue} disabled={['demand', 'regulus'].includes(mockData?.type)} onChange={(e) => { setPlatformValue(e.target.value) }}>
                        <Radio value="demand">需求</Radio>
                        <Radio value="regulus">bug</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="项目列表"
                    name="projectId"
                    rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择项目' }]}
                >
                    <Select
                        options={projectList || []}
                        onChange={(value) => {
                            platformValue === 'demand' ? loadDemands({ projectId: value }) : loadBugs({ projectId: value })
                        }}
                        showSearch
                        allowClear
                        optionFilterProp="label"
                        defaultValue={mockData?.data?.map((e) => ({ ...e, disabled: true }))}
                        loading={listLoading || regulusLoading}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="需求列表"
                    name="demandId"
                    tooltip="关联regulus bug需要将bug设置为线上bug"
                    rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择需求' }]}

                >
                    <Select
                        mode="multiple"
                        options={demandList || []}
                        onChange={() => { }}
                        showSearch
                        allowClear
                        labelInValue
                        optionFilterProp="label"
                        loading={bugsLoading || demandsLoading}
                    ></Select>
                </Form.Item>
                <Form.Item label="描述" name="desc">
                    <Input.TextArea placeholder="请输入描述" rows={3} />
                </Form.Item>
            </Form>
        </Modal >
    );
}
