/**
 * EditConfig
 * @description （查看、编辑、新增）配置
 * @author moting.nq
 * @create 2021-04-19 19:32
 */

import React, { useState } from 'react';
import { Modal, Input, Spin, message } from 'antd';
import { BasicForm } from '@cffe/fe-backend-component';
import createSchema from './create-schema';
import { configAdd, configUpdate } from '../../../../../service';
import { IProps } from './types';
import { ConfigData } from '../../types';
// import './index.less';

export type EditConfigIProps = IProps;

const titleMap: { [P in IProps['type']]: string } = {
  add: '新增配置',
  look: '配置详情',
  edit: '编辑配置',
};

const EditConfig = (props: IProps) => {
  const { formValue, type, env } = props;

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      destroyOnClose
      width={600}
      title={titleMap[type]}
      visible={props.visible}
      onCancel={props.onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <BasicForm
          {...(createSchema() as any)}
          dataSource={formValue}
          customMap={{
            Textarea: Input.TextArea,
          }}
          // TODO 查看时需要去掉提交按钮
          isShowReset
          resetText="取消"
          onReset={props.onClose}
          onFinish={(val: Omit<ConfigData, 'id'>) => {
            if (type === 'look') return;

            let promise = null;

            setLoading(true);

            if (type === 'edit') {
              // TODO type、appCode
              promise = configUpdate({
                id: formValue?.id!,
                ...val,
              });
            } else if (type === 'add') {
              // TODO type、appCode
              promise = configAdd({ ...val, env });
            }

            promise
              ?.then((res: any) => {
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
    </Modal>
  );
};

EditConfig.defaultProps = {};

export default EditConfig;
