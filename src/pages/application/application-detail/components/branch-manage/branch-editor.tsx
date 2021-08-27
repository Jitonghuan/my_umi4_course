/**
 * EditBranch
 * @description (新建)分支
 * @author moting.na
 * @create 2021-04-21 10:12
 */

import React, { useState } from 'react';
import { Modal, Input, Spin, message } from 'antd';
import { BasicForm } from '@/components/schema-form';
import { createFeatureBranch } from '@/pages/application/service';

export interface IProps {
  appCode: string;
  visible: boolean;
  onClose: () => void;
  /** 提交成功后回调 */
  onSubmit: () => void;
}

const formSchema = {
  isShowReset: false,
  labelColSpan: 6,
  theme: 'basic',
  schema: [
    {
      type: 'Input',
      props: {
        label: '分支名称',
        name: 'branchName',
        required: true,
        placeholder: '请输入',
        addonBefore: 'feature_',
        onKeyDown: (e: any) => {
          if (e.keyCode === 13) {
            // 回车键
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        },
      },
    },
    {
      type: 'Custom',
      props: {
        custom: 'Textarea',
        label: '描述',
        name: 'desc',
        placeholder: '请输入描述',
      },
    },
  ],
};

export default function BranchEditor(props: IProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      destroyOnClose
      width={600}
      title="新建分支"
      visible={props.visible}
      onCancel={props.onClose}
      footer={null}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <BasicForm
          {...(formSchema as any)}
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
}
