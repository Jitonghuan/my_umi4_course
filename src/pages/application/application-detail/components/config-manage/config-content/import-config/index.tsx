/**
 * ImportConfig
 * @description 导入配置
 * @author moting.nq
 * @create 2021-04-20 10:33
 */

import React, { useState } from 'react';
import { Modal, Input, Spin, message } from 'antd';
import { BasicForm } from '@cffe/fe-backend-component';
import createSchema from './create-schema';
import { createApp, updateApp } from '../../service';
import { IProps } from './types';
// import './index.less';

const ImportConfig = (props: IProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      destroyOnClose
      width={600}
      title="导入配置"
      visible={props.visible}
      onCancel={props.onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <BasicForm
          {...(createSchema() as any)}
          isShowReset
          resetText="取消"
          onReset={props.onClose}
          onFinish={(val) => {
            setLoading(true);

            // TODO
            createApp(val)
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

ImportConfig.defaultProps = {};

export default ImportConfig;
