// 分支编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 10:58

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Input, Form, message, Select, Radio } from 'antd';
import {
  createFeatureBranch,
  queryPortalList,
  getDemandByProjectList,
  getRegulusProjects,
  getRegulusOnlineBugs,
} from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';
import { debounce } from 'lodash';

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
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [demandLoading, setDemandLoading] = useState(false);
  const [form] = Form.useForm();
  const [queryPortalOptions, setQueryPortalOptions] = useState<any>([]);
  const [queryDemandOptions, setQueryDemandOptions] = useState<any>([]);
  const [platformValue, setPlatformValue] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [demandId, setDemandId] = useState<any>([]);

  // const handleSubmit = useCallback(async () => {
  const handleSubmit = async () => {
    const values = await form.validateFields();
    let demandArry: any = [];
    values.demandId?.map((item: any) => {
      demandArry.push(item.value + '');
    });
    setLoading(true);
    try {
      const res = await createFeatureBranch({
        appCode,
        relatedPlat: values?.relatedPlat,
        demandId: demandArry,
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
  }
  // }, [form, appCode]);
  const selectplatform = (e: any) => {
    setPlatformValue(e.target.value);
    setQueryPortalOptions([]);
    form.setFieldsValue({
      projectId: undefined,
      demandId: undefined,
      desc: '',
    });
    if (e.target.value === 'demandPlat') {
      queryPortal();
    } else {
      queryRegulus();
    }
  };

  const queryPortal = () => {
    setProjectLoading(true);
    try {
      postRequest(queryPortalList)
        .then((result) => {
          if (result.success) {
            let dataSource = result.data;
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({ label: item?.projectName, value: item?.projectId });
            });
            setQueryPortalOptions(dataArry);
          }
        })
        .finally(() => {
          setProjectLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  const queryRegulus = () => {
    setProjectLoading(true);
    try {
      getRequest(getRegulusProjects)
        .then((result) => {
          if (result.success) {
            let dataSource = result.data.projects;
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({ label: item?.name, value: item?.id });
            });
            setQueryPortalOptions(dataArry);
          }
        })
        .finally(() => {
          setProjectLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onChangeProtal = (value: any) => {
    setProjectId(value);
    setQueryDemandOptions([]);
    form.setFieldsValue({
      demandId: undefined,
      desc: '',
    });
    if (platformValue === 'demandPlat') {
      queryDemand(value);
    } else {
      queryRegulusOnlineBugs(value);
    }
  };
  const queryDemand = async (param: string, searchTextParams?: string) => {
    setDemandLoading(true);
    try {
      await postRequest(getDemandByProjectList, {
        data: { projectId: param, searchText: searchTextParams },
      })
        .then((result) => {
          if (result.success) {
            let dataSource = result.data;
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({ label: item?.title, value: item?.id });
            });
            setQueryDemandOptions(dataArry);
          }
        })
        .finally(() => {
          setDemandLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  const queryRegulusOnlineBugs = async (param: string, searchTextParams?: string) => {
    setDemandLoading(true);
    try {
      await getRequest(getRegulusOnlineBugs, {
        data: { projectId: param, keyword: searchTextParams, pageSize: -1 },
      })
        .then((result) => {
          if (result.success) {
            let dataSource = result.data.dataSource;
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({ label: item?.name, value: item?.id });
            });
            setQueryDemandOptions(dataArry);
          }
        })
        .finally(() => {
          setDemandLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onChangeDemand = (data: any) => {
    setDemandId(data);
    let demandInfo: any = [];
    data?.map((item: any) => {
      demandInfo.push(item.label);
    });

    let info = demandInfo.toString();
    form.setFieldsValue({
      desc: info,
    });
  };

  const onSearch = debounce((val: any) => {
    queryDemand(projectId, val);
  }, 300);

  useEffect(() => {
    if (mode === 'HIDE') return;
    form.resetFields();
    form.setFieldsValue({
      masterBranch: selectMaster,
      // relatedPlat:"demandPlat"
    });
    // queryPortal();
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
          label="分支类型"
          name="relatedPlat"
          rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择需要关联的平台' }]}
        >
          <Radio.Group onChange={selectplatform} value={platformValue}>
            <Radio value="demandPlat">需求</Radio>
            <Radio value="regulus">bug</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="项目列表"
          name="projectId"
          rules={[{ required: appCategoryCode === 'hbos' ? true : false, message: '请选择项目' }]}
        >
          <Select
            options={queryPortalOptions}
            onChange={onChangeProtal}
            showSearch
            allowClear
            optionFilterProp="label"
            loading={projectLoading}
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
            options={queryDemandOptions}
            onChange={onChangeDemand}
            showSearch
            allowClear
            labelInValue
            // onSearch={onSearch}
            optionFilterProp="label"
            loading={demandLoading}
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
