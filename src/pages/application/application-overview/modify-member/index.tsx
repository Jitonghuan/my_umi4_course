/**
 * ModifyMember
 * @description 创建/修改 成员
 * @author moting.nq
 * @create 2021-04-14 10:54
 */

import React from 'react';
import { Drawer, Button } from 'antd';
import { BasicForm } from '@cffe/fe-backend-component';
import SearchUserSelect from '@/components/search-user-select';
import createSchema from './create-schema';
import { IProps, FormValue } from './types';
// import './index.less';

const ModifyMember = (props: IProps) => {
  const { formValue } = props;
  const isEdit = !!formValue?.id;

  // TODO 样式，待参考工单页面完善

  return (
    <Drawer
      destroyOnClose
      width={600}
      title={isEdit ? '编辑成员' : '新增成员'}
      placement="right"
      visible={props.visible}
      onClose={props.onClose}
    >
      {/* TODO 回显 */}
      <BasicForm
        {...(createSchema(isEdit) as any)}
        dataSource={formValue}
        customMap={{
          SearchUserSelect,
        }}
        isShowReset
        resetText="取消"
        onReset={props.onClose}
        onFinish={(val: FormValue) => {
          // TODO 调用保存接口，成功后调用回调
          props?.onSubmit();
        }}
      />
    </Drawer>
  );
};

ModifyMember.defaultProps = {};

export default ModifyMember;
