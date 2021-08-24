/**
 * CreateApplication
 * @description 创建/编辑 应用
 * @author moting.nq
 * @create 2021-04-09 15:38
 */

import React, { useState, useContext, useEffect } from 'react';
import { Drawer, Input, Spin, message, Form } from 'antd';
import FEContext from '@/layouts/basic-layout/fe-context';
import { BasicForm } from '@/components/schema-form';
import createSchema from './create-schema';
import { createApp, updateApp, queryBizData, queryCategoryData } from './service';
import { IProps, FormValue, AppType, AppDevelopLanguage } from './types';
// import './index.less';

export type AppDataTypes = FormValue;

const CreateApplication = (props: IProps) => {
  const { formValue, visible } = props;
  const isEdit = !!formValue?.id;

  const [loading, setLoading] = useState(false);
  // 应用类型
  const [appType, setAppType] = useState<AppType>();
  // 应用开发语言
  const [appDevelopLanguage, setAppDevelopLanguage] = useState<AppDevelopLanguage>();
  // const { categoryData, businessData } = useContext(FEContext);
  const [categoryData, setcategoryData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  // const [baseImage, setBaseImage] = useState([]);
  const [categoryCode, setcategoryCode] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    setAppType(formValue?.appType);
  }, [formValue?.appType]);

  useEffect(() => {
    setAppDevelopLanguage(formValue?.appDevelopLanguage);
  }, [formValue?.appDevelopLanguage]);

  //应用分类
  useEffect(() => {
    queryCategoryData().then((data) => {
      setcategoryData(data.list);
    });
  }, []);

  //应用组
  useEffect(() => {
    if (!categoryCode) {
      form.setFieldsValue({
        appGroupCode: undefined,
      });
      setBusinessData([]);
      return;
    }
    queryBizData({ categoryCode }).then((data) => {
      setBusinessData(data.list);
    });
  }, [categoryCode]);

  // //基础镜像
  // useEffect(() => {
  //   queryBaseImage().then((data) => {
  //     setBaseImage(data.list);
  //   });
  // }, []);

  //编辑
  useEffect(() => {
    if (isEdit) {
      queryBizData({
        categoryCode: form.getFieldValue('appCategoryCode'),
      }).then((data) => {
        setBusinessData(data.list);
      });
      form.setFieldsValue({
        ...formValue,
        appGroupCode: formValue?.appGroupCode,
      });
    } else {
      form.resetFields();
    }
  }, [isEdit, visible]);

  return (
    <Drawer
      destroyOnClose
      width={600}
      title={isEdit ? '编辑应用' : '新增应用'}
      placement="right"
      visible={props.visible}
      onClose={props.onClose}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <BasicForm
          form={form}
          {...(createSchema({
            isEdit,
            appType,
            appDevelopLanguage,
            categoryData,
            businessData,
          }) as any)}
          dataSource={formValue}
          customMap={{
            Textarea: Input.TextArea,
          }}
          isShowReset
          resetText="取消"
          onReset={props.onClose}
          onValuesChange={(changedValues, allValues) => {
            setcategoryCode(allValues?.appCategoryCode);
            setAppType(allValues?.appType);
            setAppDevelopLanguage(allValues?.appDevelopLanguage);
          }}
          onFinish={(val: Omit<FormValue, 'id'>) => {
            let promise = null;

            setLoading(true);

            if (isEdit) {
              promise = updateApp({
                id: formValue?.id!,
                ...val,
              });
            } else {
              promise = createApp(val);
            }

            promise
              .then((res) => {
                if (res.success) {
                  props?.onSubmit();
                  return;
                }
                message.error(res.errorMsg);
              })
              .finally(() => setLoading(false));
          }}
        />
      </Spin>
    </Drawer>
  );
};

CreateApplication.defaultProps = {};

export default CreateApplication;
