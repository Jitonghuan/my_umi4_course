// 应用编辑/新增
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:23

import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Drawer, Button, Select, Radio, Input, Divider, message, Form } from 'antd';
import FELayout from '@cffe/vc-layout';
import FEContext from '@/layouts/basic-layout/fe-context';
import DebounceSelect from '@/components/debounce-select';
import UserSelector, { stringToList } from '@/components/user-selector';
import EditorTable from '@cffe/pc-editor-table';
import { createApp, updateApp, searchGitAddress } from './service';
import { useAppGroupOptions } from '../../hooks';
import {
  appTypeOptions,
  appDevelopLanguageOptions,
  isClientOptions,
  appFeProjectTypeOptions,
  appMicroFeTypeOptions,
  relationMainAppCodeOptions,
} from './common';
import { AppItemVO } from '../../interfaces';

const { Item: FormItem } = Form;

// 生成一个方法: shouldUpdate={(prev, curr) => prev.xxx !== curr.xxx}
const shouldUpdate = (keys: string[]) => {
  return (prev: any, curr: any) => {
    return keys.some((key) => prev[key] !== curr[key]);
  };
};

export interface IProps {
  initData?: AppItemVO;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApplicationEditor(props: IProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { categoryData } = useContext(FEContext);
  const { initData, visible } = props;
  const isEdit = !!initData?.id;
  const [loading, setLoading] = useState(false);

  const [categoryCode, setCategoryCode] = useState<string>();
  const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode);
  const [form] = Form.useForm<AppItemVO>();

  // 数据回填
  useEffect(() => {
    if (isEdit) {
      setCategoryCode(initData?.appCategoryCode);
      form.setFieldsValue({
        ...initData,
        ownerList: stringToList(initData?.owner),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        ownerList: [userInfo.fullName!],
      });
    }
  }, [isEdit, visible]);

  // 应用分类 - 应用组 联动
  const handleCategoryCodeChange = useCallback((next: string) => {
    setCategoryCode(next);
    form.resetFields(['appGroupCode']);
  }, []);

  // 提交数据
  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    console.log('>> handleSubmit', values);
    const { ownerList, ...others } = values;

    const submitData = {
      ...others,
      owner: ownerList?.join(',') || '',
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateApp({ id: initData?.id!, ...submitData });
      } else {
        await createApp(submitData);
      }

      message.success('保存成功!');
      props?.onSubmit();
    } finally {
      setLoading(false);
    }
  }, [isEdit, form]);

  return (
    <Drawer
      width={660}
      title={isEdit ? '编辑应用' : '新增应用'}
      visible={props.visible}
      onClose={props.onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <FormItem
          label="应用类型"
          name="appType"
          initialValue={appTypeOptions[0].value}
          rules={[{ required: true, message: '请选择应用类型' }]}
        >
          <Radio.Group options={appTypeOptions} disabled={isEdit} />
        </FormItem>
        <FormItem label="APPCODE" name="appCode" rules={[{ required: true, message: '请输入应用 Code' }]}>
          <Input placeholder="请输入应用Code" disabled={isEdit} style={{ width: 320 }} />
        </FormItem>
        <FormItem label="应用名" name="appName" rules={[{ required: true, message: '请输入应用名称' }]}>
          <Input placeholder="请输入" style={{ width: 320 }} />
        </FormItem>
        <FormItem label="应用部署名" name="deploymentName" rules={[{ required: true, message: '请输入应用部署名' }]}>
          <Input placeholder="请输入" style={{ width: 320 }} />
        </FormItem>
        <FormItem label="应用分类" name="appCategoryCode" rules={[{ required: true, message: '请选择应用分类' }]}>
          <Select
            options={categoryData}
            placeholder="请选择"
            onChange={handleCategoryCodeChange}
            style={{ width: 320 }}
          />
        </FormItem>
        <FormItem label="应用组" name="appGroupCode">
          <Select
            options={appGroupOptions}
            loading={appGroupLoading}
            placeholder="请选择"
            style={{ width: 320 }}
            allowClear
          />
        </FormItem>
        <FormItem label="应用负责人" name="ownerList" rules={[{ required: true, message: '请输入应用负责人' }]}>
          <UserSelector />
        </FormItem>
        <FormItem label="应用描述" name="desc">
          <Input.TextArea placeholder="请输入应用描述" />
        </FormItem>
        <FormItem label="Git 地址" name="gitAddress" rules={[{ required: true, message: '请输入 gitlab 地址' }]}>
          <DebounceSelect fetchOptions={searchGitAddress} labelInValue={false} placeholder="输入仓库名搜索" />
        </FormItem>
        {/* <FormItem label="Git 分组" name="gitGroup">
          <Input placeholder="请输入应用 gitlab 分组信息" style={{ width: 320 }} />
        </FormItem> */}

        <Divider />

        <FormItem noStyle shouldUpdate={shouldUpdate(['appType'])}>
          {({ getFieldValue }) =>
            getFieldValue('appType') === 'backend' ? (
              // 后端相关字段
              <>
                <FormItem
                  label="开发语言"
                  name="appDevelopLanguage"
                  rules={[{ required: true, message: '请选择开发语言' }]}
                >
                  <Radio.Group options={appDevelopLanguageOptions} />
                </FormItem>
                <FormItem noStyle shouldUpdate={shouldUpdate(['appDevelopLanguage'])}>
                  {({ getFieldValue }) =>
                    getFieldValue('appDevelopLanguage') === 'java' && (
                      <>
                        <FormItem label="是否为二方包" name="isClient" initialValue={0}>
                          <Radio.Group options={isClientOptions} />
                        </FormItem>
                        <FormItem label="是否包含二方包" name="isContainClient" initialValue={0}>
                          <Radio.Group options={isClientOptions} />
                        </FormItem>
                        <FormItem
                          label="pom文件路径"
                          name="deployPomPath"
                          rules={[{ required: true, message: '请输入应用的 pom 文件的相对路径' }]}
                        >
                          <Input placeholder="请输入应用的 pom 文件的相对路径" />
                        </FormItem>
                      </>
                    )
                  }
                </FormItem>
              </>
            ) : (
              // 前端相关字段
              <>
                <FormItem
                  label="工程类型"
                  name="projectType"
                  rules={[{ required: true, message: '请选择工程类型' }]}
                  initialValue={appFeProjectTypeOptions[1].value}
                >
                  <Radio.Group options={appFeProjectTypeOptions} />
                </FormItem>
                <FormItem noStyle shouldUpdate={shouldUpdate(['projectType', 'microFeType'])}>
                  {({ getFieldValue }) =>
                    getFieldValue('projectType') === 'micro' && (
                      <>
                        <FormItem
                          label="微前端类型"
                          name="microFeType"
                          rules={[{ required: true, message: '请选择微前端类型' }]}
                          initialValue={appMicroFeTypeOptions[1].value}
                        >
                          <Radio.Group options={appMicroFeTypeOptions} />
                        </FormItem>
                        {getFieldValue('microFeType') === appMicroFeTypeOptions[0].value ? (
                          // 主应用
                          <FormItem
                            label="路由文件"
                            name="routeFile"
                            rules={[{ required: true, message: '请输入路由文件名' }]}
                          >
                            <Input placeholder="app.json" style={{ width: 320 }} />
                          </FormItem>
                        ) : (
                          // 子应用
                          <FormItem label="关联信息" name="relationMainApp">
                            <EditorTable
                              columns={[
                                {
                                  dataIndex: 'appCode',
                                  title: '主应用Code',
                                  fieldType: 'select',
                                  valueOptions: relationMainAppCodeOptions,
                                  colProps: { width: 200 },
                                },
                                { dataIndex: 'routePath', title: '路由' },
                              ]}
                            />
                          </FormItem>
                        )}
                      </>
                    )
                  }
                </FormItem>
              </>
            )
          }
        </FormItem>
      </Form>
    </Drawer>
  );
}
