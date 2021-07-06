/**
 * ModifyMember
 * @description 创建/修改 成员
 * @author moting.nq
 * @create 2021-04-14 10:54
 */

import React, { useState } from 'react';
import { Drawer, message, Spin } from 'antd';
import { BasicForm } from '@/components/schema-form';
import SearchUserSelect from '@/components/search-user-select';
import createSchema from './create-schema';
import { updateAppMember } from '../../../../service';
import { IProps, FormValue } from './types';
// import './index.less';

export type MemberTypes = FormValue;

const ModifyMember = (props: IProps) => {
  const { formValue } = props;
  const isEdit = !!formValue?.id;

  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      destroyOnClose
      width={600}
      title={isEdit ? '编辑成员' : '新增成员'}
      placement="right"
      visible={props.visible}
      onClose={props.onClose}
      maskClosable={false}
    >
      <Spin spinning={loading}>
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
            setLoading(true);
            if (!props.appCode) {
              return;
            }
            updateAppMember({
              appCode: props.appCode,
              ...val,
            })
              .then((res) => {
                if (res.success) {
                  message.success('更新成功');
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

ModifyMember.defaultProps = {};

export default ModifyMember;
