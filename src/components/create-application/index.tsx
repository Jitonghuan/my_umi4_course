/**
 * CreateApplication
 * @description 创建/编辑 应用
 * @author moting.nq
 * @create 2021-04-09 15:38
 */

import React, { useState, useContext } from 'react';
import { Drawer, Input, Spin, message } from 'antd';
import FEContext from '@/layouts/basic-layout/FeContext';
import { BasicForm } from '@cffe/fe-backend-component';
import createSchema from './create-schema';
import { createApp, updateApp } from './service';
import { IProps, FormValue, AppType } from './types';
// import './index.less';

const CreateApplication = (props: IProps) => {
  const { formValue } = props;
  const isEdit = !!formValue?.id;

  const [loading, setLoading] = useState(false);
  // 应用类型
  const [appType, setAppType] = useState<AppType>();
  const { belongData, businessData, envData } = useContext(FEContext);

  return (
    <Drawer
      destroyOnClose
      width={600}
      title={isEdit ? '编辑应用' : '新增应用'}
      placement="right"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Spin spinning={loading}>
        <BasicForm
          {...(createSchema({
            isEdit,
            appType,
            belongData,
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
            setAppType(allValues?.appType);
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
