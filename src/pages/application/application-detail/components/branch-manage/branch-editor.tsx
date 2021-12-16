// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, message, Select, Cascader } from 'antd';
import { createFeatureBranch, queryPortalList, getDemandByProjectList } from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';

export interface IProps {
  mode?: EditorMode;
  appCode: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function BranchEditor(props: IProps) {
  const { mode, appCode, onClose, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();

    setLoading(true);

    try {
      await createFeatureBranch({
        appCode,
        demandId: demandId,
        ...values,
      });
      message.success('操作成功！');
      onSubmit?.();
    } finally {
      setLoading(false);
    }
  }, [form, appCode]);
  const [queryPortalOptions, setQueryPortalOptions] = useState<any>([]);
  const [queryDemandOptions, setQueryDemandOptions] = useState<any>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [demandId, setDemandId] = useState<string>('');

  const queryPortal = () => {
    postRequest(queryPortalList).then((result) => {
      if (result.success) {
        let dataSource = result.data;
        let dataArry: any = [];
        dataSource?.map((item: any) => {
          dataArry.push({ label: item?.projectName, value: item?.projectId });
        });
        setQueryPortalOptions(dataArry);
      }
    });
  };
  const onChangeProtal = (data: any) => {
    setProjectId(data.value);
  };
  const queryDemand = () => {
    postRequest(getDemandByProjectList, { data: { projectId: projectId } }).then((result) => {
      if (result.success) {
        let dataSource = result.data.records;
        let dataArry: any = [];
        dataSource?.map((item: any) => {
          dataArry.push({ label: item?.title, value: item?.id });
        });
        setQueryDemandOptions(dataArry);
      }
    });
  };

  const onChangeDemand = (data: any) => {
    setDemandId(data?.value);
  };

  useEffect(() => {
    if (mode === 'HIDE') return;

    form.resetFields();
    queryPortal();
    queryDemand();
  }, [mode]);

  return (
    <Modal
      destroyOnClose
      width={600}
      title={mode === 'ADD' ? '新建分支' : '编辑分支'}
      visible={props.mode !== 'HIDE'}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
          <Input addonBefore="feature_" autoFocus />
        </Form.Item>
        <Form.Item label="项目列表">
          <Select options={queryPortalOptions} onChange={onChangeProtal}></Select>
        </Form.Item>
        <Form.Item label="需求列表">
          <Select options={queryDemandOptions} onChange={onChangeDemand}></Select>
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
