// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, message, Select, Cascader } from 'antd';
import { createFeatureBranch, queryPortalList, getDemandByProjectList } from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';
import { debounce } from 'lodash';
import { copyScene } from '@/pages/test/autotest/service';

export interface IProps {
  mode?: EditorMode;
  appCode: string;
  appCategoryCode: string;
  masterBranchOptions: any;
  selectMaster: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function BranchEditor(props: IProps) {
  const { mode, appCode, onClose, onSubmit, appCategoryCode, masterBranchOptions, selectMaster } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [queryPortalOptions, setQueryPortalOptions] = useState<any>([]);
  const [queryDemandOptions, setQueryDemandOptions] = useState<any>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [demandId, setDemandId] = useState<any>([]);

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const res = await createFeatureBranch({
        appCode,
        demandId: values?.demandId,
        branchName: values?.branchName,
        desc: values?.desc,
        masterBranch: values?.masterBranch,
      });
      if (res.success) {
        message.success('操作成功！');
        onSubmit?.();
      }
    } finally {
      setLoading(false);
    }
  }, [form, appCode]);

  const queryPortal = () => {
    try {
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
    } catch (error) {
      console.log('error', error);
    }
  };
  const onChangeProtal = (value: any) => {
    setProjectId(value);
    queryDemand(value);
  };
  const queryDemand = async (param: string, searchTextParams?: string) => {
    try {
      await postRequest(getDemandByProjectList, {
        data: { projectId: param, searchText: searchTextParams },
      }).then((result) => {
        if (result.success) {
          let dataSource = result.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({ label: item?.title, value: item?.id });
          });
          setQueryDemandOptions(dataArry);
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onChangeDemand = (data: any) => {
    setDemandId(data);
    // handleSubmit(data);
  };

  const onSearch = debounce((val: any) => {
    queryDemand(projectId, val);
  }, 300);

  useEffect(() => {
    if (mode === 'HIDE') return;
    form.resetFields();
    form.setFieldsValue({ masterBranch: selectMaster });
    queryPortal();
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
        <Form.Item label="主干分支" name="masterBranch" rules={[{ required: true, message: '请选择主干分支' }]}>
          <Select options={masterBranchOptions}></Select>
        </Form.Item>
        <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
          <Input addonBefore="feature_" autoFocus />
        </Form.Item>
        <Form.Item
          label="项目列表"
          name="projectId"
          rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择项目' }]}
        >
          <Select options={queryPortalOptions} onChange={onChangeProtal}></Select>
        </Form.Item>
        <Form.Item
          label="需求列表"
          name="demandId"
          rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择需求' }]}
        >
          <Select
            mode="multiple"
            options={queryDemandOptions}
            onChange={onChangeDemand}
            showSearch
            allowClear
            onSearch={onSearch}
            optionFilterProp="label"
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
          ></Select>
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
