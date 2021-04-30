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
import VCDescription from '@/components/vc-description';
// import './index.less';

export type EditConfigIProps = IProps;

const titleMap: { [P in IProps['type']]: string } = {
  add: '新增配置',
  look: '配置详情',
  edit: '编辑配置',
};
const showFields = ['key', 'value'];

const EditConfig = (props: IProps) => {
  const { formValue = {}, type, env, appCode, configType } = props;

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
        {['add', 'edit'].includes(type) ? (
          <BasicForm
            {...(createSchema() as any)}
            dataSource={formValue}
            customMap={{
              Textarea: Input.TextArea,
            }}
            isShowReset
            resetText="取消"
            onReset={props.onClose}
            onFinish={(val: Omit<ConfigData, 'id'>) => {
              if (type === 'look') return;

              let promise = null;

              setLoading(true);

              if (type === 'edit') {
                promise = configUpdate({
                  id: formValue?.id!,
                  type: configType,
                  appCode,
                  ...val,
                });
              } else if (type === 'add') {
                promise = configAdd({
                  env,
                  type: configType,
                  appCode,
                  ...val,
                });
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
        ) : (
          <VCDescription
            column={1}
            dataSource={showFields.map((el) => ({
              label: el,
              value: (formValue as any)[el],
            }))}
          />
        )}
      </Spin>
    </Modal>
  );
};

EditConfig.defaultProps = {};

export default EditConfig;
