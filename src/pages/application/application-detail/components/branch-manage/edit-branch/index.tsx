/**
 * EditBranch
 * @description (新建)分支
 * @author moting.na
 * @create 2021-04-21 10:12
 */

import React, { useState } from 'react';
import { Modal, Input, Spin, message } from 'antd';
import { BasicForm } from '@cffe/fe-backend-component';
import createSchema from './create-schema';
import { createFeatureBranch } from '../../../../service';
import { IProps } from './types';
// import './index.less';

export type EditConfigIProps = IProps;

const EditConfig = (props: IProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      destroyOnClose
      width={600}
      title="新建分支"
      visible={props.visible}
      onCancel={props.onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <BasicForm
          {...(createSchema() as any)}
          customMap={{
            Textarea: Input.TextArea,
          }}
          isShowReset
          resetText="取消"
          onReset={props.onClose}
          onFinish={(val) => {
            setLoading(true);

            createFeatureBranch({
              appCode: props.appCode,
              ...val,
            })
              .then((res: any) => {
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
