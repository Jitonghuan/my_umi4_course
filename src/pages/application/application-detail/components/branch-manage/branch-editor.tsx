// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, message, Select, Cascader } from 'antd';
import {
  createFeatureBranch,
  queryPortalList,
  getDemandByProjectList,
  getMasterBranch,
  getOriginBranch,
} from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';

export interface IProps {
  mode?: EditorMode;
  appCode: string;
  type: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function BranchEditor(props: IProps) {
  const { mode, appCode, onClose, onSubmit, type } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [queryPortalOptions, setQueryPortalOptions] = useState<any>([]);
  const [queryDemandOptions, setQueryDemandOptions] = useState<any>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [demandId, setDemandId] = useState<any>([]);
  const [masterBranchOptions, setMasterBranchOptions] = useState<any>([]);
  const [originBranchOptions, setOriginBranchOptions] = useState<any>([]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    form.resetFields();
  }, [mode]);

  useEffect(() => {
    if (type === 'master') {
      getOriginBranchOption();
    } else {
      getMasterBranchOption();
      queryPortal();
    }
  }, [type]);

  // 提交
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
  };

  const onSearch = (val: any) => {
    queryDemand(projectId, val);
  };

  // 获取主干分支下拉框数据
  const getMasterBranchOption = () => {
    try {
      postRequest(getMasterBranch).then((result) => {
        if (result.success) {
          let dataSource = result.data;
          let dataArry: any = [];
          // dataSource?.map((item: any) => {
          //   dataArry.push({ label: item?.projectName, value: item?.projectId });
          // });
          setMasterBranchOptions(dataArry);
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  // 主干分支弹窗-获取来源分支下拉框数据
  const getOriginBranchOption = () => {
    try {
      postRequest(getOriginBranch).then((result) => {
        if (result.success) {
          let dataSource = result.data;
          let dataArry: any = [];
          // dataSource?.map((item: any) => {
          //   dataArry.push({ label: item?.projectName, value: item?.projectId });
          // });
          setOriginBranchOptions(dataArry);
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

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
      <Form form={form} labelCol={{ flex: '110px' }}>
        <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
          <Input addonBefore={type === 'master' ? 'master_part_' : 'feature_'} autoFocus />
        </Form.Item>
        {type !== 'master' && (
          <div>
            <Form.Item label="选择主干分支" name="masterBranch" rules={[{ required: true, message: '请选择主干分支' }]}>
              <Select options={masterBranchOptions}></Select>
            </Form.Item>
            <Form.Item label="项目列表" rules={[{ required: true, message: '请输入分支名' }]}>
              <Select options={queryPortalOptions} onChange={onChangeProtal}></Select>
            </Form.Item>
            <Form.Item label="需求列表" name="demandId">
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
          </div>
        )}
        {type === 'master' && (
          <Form.Item label="来源分支" name="fromBranch" rules={[{ required: true, message: '请选择来源分支' }]}>
            <Select options={originBranchOptions}></Select>
          </Form.Item>
        )}
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
