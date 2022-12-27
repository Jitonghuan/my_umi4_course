// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Input, Form, message, Select, Radio } from 'antd';
import { usePortalList, useRegulesPortal, useDemands, useRegulusOnlineBugs } from './hook';
import { createDemand } from '@/pages/application/service';
import { debounce } from 'lodash';

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

export default function AppendDemand(props: IProps) {
    const { visible, appCode, masterBranchOptions, onClose, onSubmit, appCategoryCode, selectMaster, initData } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [platformValue, setPlatformValue] = useState<string>('demandPlat');
    const [portalList, listLoading, loadPortalList] = usePortalList({});
    const [regulusPortal, regulusLoading, loadRegulusPortal] = useRegulesPortal({});
    const [demands, demandsLoading, loadDemands] = useDemands({});
    const [regulusBugs, bugsLoading, loadBugs] = useRegulusOnlineBugs({});

    const projectList = useMemo(() => platformValue === 'demandPlat' ? portalList : regulusPortal, [platformValue, portalList, regulusPortal]);
    const demandList = useMemo(() => platformValue === 'demandPlat' ? demands : regulusBugs, [platformValue, demands, regulusBugs])

    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue({ relatedPlat: 'demandPlat' });
            loadPortalList();
            form.setFieldsValue({ ...initData, projectId: '' });
        }
    }, [visible])

    const handleSubmit = async () => {
        const values = await form.validateFields();
        let demandIdList = values.demandId?.map((item: any) => item.value + '');
        setLoading(true);
        try {
            const res = await createDemand({
                relatedPlat: values?.relatedPlat,
                demandIds: demandIdList,
                branchId: initData?.id,
            });
            if (res.success) {
                message.success('关联成功！');
                onSubmit?.();
            }
        } finally {
            setLoading(false);
        }
    }

    const selectplatform = (e: any) => {
        setPlatformValue(e.target.value);
        form.setFieldsValue({
            projectId: undefined,
            demandId: undefined,
            desc: '',
        });
        e.target.value === 'demandPlat' ? loadPortalList() : loadRegulusPortal();
    };

    const onChangeDemand = (data: any) => {
        // let demandInfo: any = [];
        // data?.map((item: any) => {
        //     demandInfo.push(item.label);
        // });

        // let info = demandInfo.toString();
        // form.setFieldsValue({
        //     desc: info,
        // });
    };

    return (
        <Modal
            destroyOnClose
            width={600}
            title='关联需求'
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
                    rules={[{ required: true, message: '请选择' }]}
                >
                    <Radio.Group value={platformValue} onChange={selectplatform}>
                        <Radio value="demandPlat">需求</Radio>
                        <Radio value="regulus">bug</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="项目列表"
                    name="projectId"
                    rules={[{ required: true, message: '请选择项目' }]}
                >
                    <Select
                        options={projectList || []}
                        onChange={(value) => {
                            form.setFieldsValue({
                                demandId: undefined,
                                desc: '',
                            });
                            platformValue === 'demandPlat' ? loadDemands({ projectId: value }) : loadBugs({ projectId: value })
                        }}
                        showSearch
                        allowClear
                        optionFilterProp="label"
                        loading={listLoading || regulusLoading}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="需求列表"
                    name="demandId"
                    tooltip="关联regulus bug需要将bug设置为线上bug"
                    rules={[{ required: true, message: '请选择需求' }]}
                >
                    <Select
                        mode="multiple"
                        options={demandList || []}
                        onChange={onChangeDemand}
                        showSearch
                        allowClear
                        labelInValue
                        optionFilterProp="label"
                        loading={bugsLoading || demandsLoading}
                    ></Select>
                </Form.Item>
                {/* <Form.Item label="描述" name="desc">
                    <Input.TextArea placeholder="请输入描述" rows={3} />
                </Form.Item> */}
            </Form>
        </Modal >
    );
}
