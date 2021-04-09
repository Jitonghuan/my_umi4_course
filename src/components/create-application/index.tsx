/**
 * CreateApplication
 * @description 创建/编辑 应用
 * @author moting.nq
 * @create 2021-04-09 15:38
 */

import React from 'react';
import { Drawer, Button } from 'antd';
import { BasicForm } from '@cffe/fe-backend-component';
import createSchema from './create-schema';
import { IProps, FormValue } from './types';
// import './index.less';

const CreateApplication = (props: IProps) => {
  const { formValue } = props;
  const isEdit = !!formValue?.id;

  // TODO 样式，待参考工单页面完善

  return (
    <Drawer
      destroyOnClose
      width={600}
      title={isEdit ? '编辑应用' : '新增应用'}
      placement="right"
      visible={props.visible}
      onClose={props.onClose}
    >
      {/* TODO 回显 */}
      <BasicForm
        {...(createSchema() as any)}
        dataSource={formValue}
        onFinish={(val: FormValue) => {
          // TODO 调用保存接口，成功后调用回调
          props?.onSubmit();
        }}
      />
    </Drawer>
  );
};

CreateApplication.defaultProps = {};

export default CreateApplication;
